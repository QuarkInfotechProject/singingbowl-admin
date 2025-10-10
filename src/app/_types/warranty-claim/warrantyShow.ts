
export interface WarrantyClaim {
    name: string;
    email: string;
    phone: string;
    product: string;
    quantity: number;
    purchasedFrom: string;
    images: string[];  
    description: string;
    submittedAt: string;  
}


export interface WarrantyClaimResponse {
    code: number;
    message: string;
    data: WarrantyClaim;
}
