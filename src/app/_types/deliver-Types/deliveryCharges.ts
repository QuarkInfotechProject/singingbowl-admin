export interface DeliveryCharge {
    id: number;
    description: string;
    deliveryCharge: string; 
  }
  
 export  interface DeliveryChargeResponse {
    code: number;
    message: string;
    data: DeliveryCharge[];
  }
  