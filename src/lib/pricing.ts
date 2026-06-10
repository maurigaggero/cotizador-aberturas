import {
  colorOptions,
  glassOptions,
  openingTypes,
  PRICING_ASSUMPTIONS,
  qualityLines,
  shippingZones,
  taxProfiles,
} from "@/data/catalog";
import type {
  ColorOption,
  GlassOption,
  OpeningType,
  QualityLine,
  QuoteResult,
  ShippingZone,
  TaxProfile,
} from "@/types/quote";

export type QuoteFormValues = {
  openingTypeId: string;
  qualityLineId: string;
  colorId: string;
  glassId: string;
  widthCm: number;
  heightCm: number;
  quantity: number;
  shippingZoneId: string;
  includeInstallation: boolean;
  taxProfileId: string;
  marginRate: number;
};

export type QuoteSelections = {
  openingType: OpeningType;
  qualityLine: QualityLine;
  color: ColorOption;
  glass: GlassOption;
  shippingZone: ShippingZone;
  taxProfile: TaxProfile;
};

function findRequired<T extends { id: string }>(items: T[], id: string, label: string): T {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`No se encontró ${label}: ${id}`);
  }

  return item;
}

export function getQuoteSelections(values: QuoteFormValues): QuoteSelections {
  return {
    openingType: findRequired(openingTypes, values.openingTypeId, "el tipo de abertura"),
    qualityLine: findRequired(qualityLines, values.qualityLineId, "la línea"),
    color: findRequired(colorOptions, values.colorId, "el color"),
    glass: findRequired(glassOptions, values.glassId, "el vidrio"),
    shippingZone: findRequired(shippingZones, values.shippingZoneId, "la zona de envío"),
    taxProfile: findRequired(taxProfiles, values.taxProfileId, "el perfil impositivo"),
  };
}

export function calculateQuote(values: QuoteFormValues): QuoteResult {
  const { openingType, qualityLine, color, glass, shippingZone, taxProfile } =
    getQuoteSelections(values);
  const unitAreaM2 = (values.widthCm / 100) * (values.heightCm / 100);
  const quotedUnitAreaM2 = Math.max(unitAreaM2, openingType.minAreaM2);
  const quotedAreaM2 = quotedUnitAreaM2 * values.quantity;
  const unitPerimeterM = 2 * (values.widthCm / 100 + values.heightCm / 100);
  const perimeterM = unitPerimeterM * values.quantity;

  const profileKg =
    quotedAreaM2 * openingType.profileKgPerM2 * qualityLine.profileMultiplier;
  const aluminumCost = profileKg * PRICING_ASSUMPTIONS.aluminumKgCost;
  const glassCost = quotedAreaM2 * glass.costPerM2;
  const hardwareCost =
    openingType.hardwareBase * qualityLine.hardwareMultiplier * values.quantity;
  const finishCost =
    (aluminumCost + hardwareCost) * (color.materialMultiplier - 1) +
    quotedAreaM2 * color.fixedCostPerM2;
  const materialSubtotal = aluminumCost + glassCost + hardwareCost + finishCost;
  const wasteCost = materialSubtotal * PRICING_ASSUMPTIONS.wasteRate;
  const laborHours =
    (openingType.baseLaborHours + unitPerimeterM * openingType.laborHoursPerPerimeterMeter) *
    values.quantity *
    qualityLine.laborMultiplier;
  const laborCost = laborHours * PRICING_ASSUMPTIONS.manufacturingHourCost;
  const shippingCost =
    shippingZone.baseCost + shippingZone.costPerUnit * Math.max(values.quantity - 1, 0);
  const installationCost = values.includeInstallation
    ? PRICING_ASSUMPTIONS.installationBaseCost +
      quotedAreaM2 * PRICING_ASSUMPTIONS.installationCostPerM2
    : 0;

  const directCost =
    materialSubtotal + wasteCost + laborCost + shippingCost + installationCost;
  const margin = directCost * values.marginRate;
  const subtotal = directCost + margin;
  const taxes = subtotal * taxProfile.rate;
  const total = subtotal + taxes;

  return {
    dimensions: {
      unitAreaM2,
      quotedAreaM2,
      perimeterM,
      quantity: values.quantity,
    },
    totals: {
      directCost,
      margin,
      subtotal,
      taxes,
      total,
    },
    laborHours,
    breakdown: [
      {
        label: "Aluminio",
        amount: aluminumCost,
        detail: `${profileKg.toFixed(1)} kg estimados x ${currency(PRICING_ASSUMPTIONS.aluminumKgCost)}/kg`,
      },
      {
        label: "Vidrio",
        amount: glassCost,
        detail: `${glass.name} sobre ${quotedAreaM2.toFixed(2)} m2 cotizados`,
      },
      {
        label: "Herrajes y accesorios",
        amount: hardwareCost,
        detail: `${openingType.name} con multiplicador ${qualityLine.hardwareMultiplier.toFixed(2)}`,
      },
      {
        label: "Color / terminación",
        amount: finishCost,
        detail: color.name,
      },
      {
        label: "Merma y consumibles",
        amount: wasteCost,
        detail: `${(PRICING_ASSUMPTIONS.wasteRate * 100).toFixed(0)}% de materiales`,
      },
      {
        label: "Fabricación",
        amount: laborCost,
        detail: `${laborHours.toFixed(1)} h x ${currency(PRICING_ASSUMPTIONS.manufacturingHourCost)}/h`,
      },
      {
        label: "Envío",
        amount: shippingCost,
        detail: shippingZone.description,
      },
      {
        label: "Colocación",
        amount: installationCost,
        detail: values.includeInstallation ? "Incluida" : "No incluida",
      },
    ],
  };
}

export function currency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: PRICING_ASSUMPTIONS.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function percentage(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}
