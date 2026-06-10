export type OpeningType = {
  id: string;
  name: string;
  description: string;
  baseLaborHours: number;
  laborHoursPerPerimeterMeter: number;
  profileKgPerM2: number;
  hardwareBase: number;
  minAreaM2: number;
};

export type QualityLine = {
  id: string;
  name: string;
  description: string;
  profileMultiplier: number;
  hardwareMultiplier: number;
  laborMultiplier: number;
};

export type ColorOption = {
  id: string;
  name: string;
  description: string;
  materialMultiplier: number;
  fixedCostPerM2: number;
};

export type GlassOption = {
  id: string;
  name: string;
  description: string;
  costPerM2: number;
};

export type ShippingZone = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costPerUnit: number;
};

export type TaxProfile = {
  id: string;
  name: string;
  description: string;
  rate: number;
};

export type QuoteBreakdownItem = {
  label: string;
  amount: number;
  detail: string;
};

export type QuoteResult = {
  dimensions: {
    unitAreaM2: number;
    quotedAreaM2: number;
    perimeterM: number;
    quantity: number;
  };
  totals: {
    directCost: number;
    margin: number;
    subtotal: number;
    taxes: number;
    total: number;
  };
  laborHours: number;
  breakdown: QuoteBreakdownItem[];
};
