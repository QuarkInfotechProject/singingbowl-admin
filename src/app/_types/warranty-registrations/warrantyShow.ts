// Define the interface for the warranty registration data
export interface WarrantyRegistration {
    name: string;
    email: string;
    phone: string;
    product: string;
    quantity: number;
    dateOfPurchase: string;  
    orderId: string;
    submittedAt: string;  
    purchasedFrom:string
}


export interface WarrantyRegistrationResponse {
    code: number;
    message: string;
    data: WarrantyRegistration;
}
