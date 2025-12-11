export interface DeliveryCharge {
  id: number;
  description: string;
  deliveryCharge: string;
  country: string | null;
  countryCode?: string;
  chargeAbove20kg: string;
  chargeAbove45kg: string;
  chargeAbove100kg: string;
}

export interface DeliveryChargeResponse {
  code: number;
  message: string;
  data: DeliveryCharge[];
}

export interface ApiDeliveryResponse {
  code: number;
  message: string;
  data: DeliveryCharge;
}

export interface Country {
  name: string;
  code: string;
}