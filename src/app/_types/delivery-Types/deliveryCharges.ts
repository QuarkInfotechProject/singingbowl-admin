export interface DeliveryCharge {
    id:string;
    description: string;
    deliveryCharge: string;
    additionalChargePerItem: string;
    weightBasedCharge: string;
  }
  
  export interface ApiDeliveryResponse {
    code: number;
    message: string;
    data: DeliveryCharge;
  }