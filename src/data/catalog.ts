import type {
  ColorOption,
  GlassOption,
  OpeningType,
  QualityLine,
  ShippingZone,
  TaxProfile,
} from "@/types/quote";

export const PRICING_ASSUMPTIONS = {
  currency: "ARS",
  aluminumKgCost: 4800,
  manufacturingHourCost: 12500,
  wasteRate: 0.08,
  defaultMarginRate: 0.22,
  installationBaseCost: 32000,
  installationCostPerM2: 18500,
};

export const openingTypes: OpeningType[] = [
  {
    id: "ventana-corrediza",
    name: "Ventana corrediza",
    description: "Dos hojas corredizas para dormitorios, cocinas y livings.",
    baseLaborHours: 1.35,
    laborHoursPerPerimeterMeter: 0.42,
    profileKgPerM2: 5.6,
    hardwareBase: 24500,
    minAreaM2: 0.72,
  },
  {
    id: "puerta-balcon",
    name: "Puerta balcón corrediza",
    description: "Sistema corredizo de mayor porte para salida a balcón o patio.",
    baseLaborHours: 2.2,
    laborHoursPerPerimeterMeter: 0.54,
    profileKgPerM2: 7.4,
    hardwareBase: 46500,
    minAreaM2: 1.7,
  },
  {
    id: "pano-fijo",
    name: "Paño fijo",
    description: "Abertura fija para maximizar luz natural con bajo mantenimiento.",
    baseLaborHours: 0.85,
    laborHoursPerPerimeterMeter: 0.28,
    profileKgPerM2: 4.1,
    hardwareBase: 9800,
    minAreaM2: 0.55,
  },
  {
    id: "ventana-proyectante",
    name: "Ventana proyectante",
    description: "Apertura superior proyectante para baños, lavaderos u oficinas.",
    baseLaborHours: 1.55,
    laborHoursPerPerimeterMeter: 0.45,
    profileKgPerM2: 5.9,
    hardwareBase: 28600,
    minAreaM2: 0.5,
  },
  {
    id: "puerta-abrir",
    name: "Puerta de abrir",
    description: "Hoja batiente con bisagras reforzadas y cerradura.",
    baseLaborHours: 2.05,
    laborHoursPerPerimeterMeter: 0.5,
    profileKgPerM2: 6.8,
    hardwareBase: 52400,
    minAreaM2: 1.45,
  },
];

export const qualityLines: QualityLine[] = [
  {
    id: "herrero",
    name: "Línea Herrero",
    description: "Opción económica para obras de presupuesto ajustado.",
    profileMultiplier: 0.86,
    hardwareMultiplier: 0.82,
    laborMultiplier: 0.95,
  },
  {
    id: "modena",
    name: "Línea Módena",
    description: "Equilibrio costo-prestación, muy usada en vivienda argentina.",
    profileMultiplier: 1,
    hardwareMultiplier: 1,
    laborMultiplier: 1,
  },
  {
    id: "a30-new",
    name: "A30 New",
    description: "Mayor hermeticidad, prestación y presencia estética.",
    profileMultiplier: 1.34,
    hardwareMultiplier: 1.28,
    laborMultiplier: 1.14,
  },
  {
    id: "alta-prestacion",
    name: "Alta prestación / RPT",
    description: "Perfiles premium para obras con exigencia térmica y acústica.",
    profileMultiplier: 1.78,
    hardwareMultiplier: 1.55,
    laborMultiplier: 1.28,
  },
];

export const colorOptions: ColorOption[] = [
  {
    id: "natural",
    name: "Aluminio natural",
    description: "Terminación estándar pulida.",
    materialMultiplier: 1,
    fixedCostPerM2: 0,
  },
  {
    id: "blanco",
    name: "Blanco pintado",
    description: "Pintura electrostática blanca.",
    materialMultiplier: 1.08,
    fixedCostPerM2: 3200,
  },
  {
    id: "negro",
    name: "Negro microtexturado",
    description: "Terminación moderna de alta demanda.",
    materialMultiplier: 1.16,
    fixedCostPerM2: 5200,
  },
  {
    id: "bronce",
    name: "Bronce anodizado",
    description: "Acabado anodizado para mayor resistencia superficial.",
    materialMultiplier: 1.2,
    fixedCostPerM2: 6100,
  },
  {
    id: "simil-madera",
    name: "Símil madera",
    description: "Folio decorativo premium para proyectos residenciales.",
    materialMultiplier: 1.34,
    fixedCostPerM2: 9700,
  },
];

export const glassOptions: GlassOption[] = [
  {
    id: "float-4",
    name: "Float 4 mm",
    description: "Vidrio simple para soluciones económicas.",
    costPerM2: 14500,
  },
  {
    id: "laminado-33",
    name: "Laminado 3+3",
    description: "Mayor seguridad ante rotura.",
    costPerM2: 31500,
  },
  {
    id: "dvh",
    name: "DVH 4/9/4",
    description: "Doble vidriado hermético para confort térmico.",
    costPerM2: 54800,
  },
  {
    id: "dvh-laminado",
    name: "DVH laminado",
    description: "Mejora seguridad, aislación térmica y acústica.",
    costPerM2: 74600,
  },
];

export const shippingZones: ShippingZone[] = [
  {
    id: "retiro",
    name: "Retira en taller",
    description: "Sin costo de envío.",
    baseCost: 0,
    costPerUnit: 0,
  },
  {
    id: "caba",
    name: "CABA",
    description: "Entrega coordinada en Ciudad Autónoma de Buenos Aires.",
    baseCost: 24500,
    costPerUnit: 4200,
  },
  {
    id: "amba",
    name: "AMBA",
    description: "Gran Buenos Aires y alrededores.",
    baseCost: 38500,
    costPerUnit: 5400,
  },
  {
    id: "cordoba-capital",
    name: "Córdoba Capital",
    description: "Entrega urbana en Córdoba Capital.",
    baseCost: 28500,
    costPerUnit: 4600,
  },
  {
    id: "villa-allende",
    name: "Villa Allende",
    description: "Zona noroeste del Gran Córdoba.",
    baseCost: 34500,
    costPerUnit: 4800,
  },
  {
    id: "la-calera",
    name: "La Calera",
    description: "Entrega cercana por corredor oeste/noroeste.",
    baseCost: 36500,
    costPerUnit: 5000,
  },
  {
    id: "mendiolaza-unquillo",
    name: "Mendiolaza / Unquillo",
    description: "Sierras chicas próximas a Córdoba.",
    baseCost: 39800,
    costPerUnit: 5200,
  },
  {
    id: "rio-ceballos",
    name: "Río Ceballos",
    description: "Entrega en corredor de Sierras Chicas.",
    baseCost: 44500,
    costPerUnit: 5600,
  },
  {
    id: "villa-carlos-paz",
    name: "Villa Carlos Paz",
    description: "Entrega por autopista Córdoba-Carlos Paz.",
    baseCost: 46500,
    costPerUnit: 5800,
  },
  {
    id: "alta-gracia",
    name: "Alta Gracia",
    description: "Entrega en Valle de Paravachasca.",
    baseCost: 48500,
    costPerUnit: 5900,
  },
  {
    id: "jesus-maria-colonia-caroya",
    name: "Jesús María / Colonia Caroya",
    description: "Entrega por corredor norte de Córdoba.",
    baseCost: 54500,
    costPerUnit: 6200,
  },
  {
    id: "interior",
    name: "Interior por transporte",
    description: "Embalaje y despacho a transporte, sin flete de larga distancia.",
    baseCost: 62000,
    costPerUnit: 7600,
  },
];

export const taxProfiles: TaxProfile[] = [
  {
    id: "sin-impuestos",
    name: "Sin impuestos",
    description: "Referencia interna o demo comercial.",
    rate: 0,
  },
  {
    id: "consumidor-final",
    name: "Consumidor final",
    description: "IVA 21%.",
    rate: 0.21,
  },
  {
    id: "responsable-inscripto",
    name: "Responsable inscripto",
    description: "IVA discriminado 21%.",
    rate: 0.21,
  },
  {
    id: "obra-nueva",
    name: "Obra nueva",
    description: "Escenario con alícuota reducida de referencia.",
    rate: 0.105,
  },
];
