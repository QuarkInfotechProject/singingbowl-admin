export interface CorporateOrder {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
    quantity: number;
    requirement: string;
}


export interface CorporateOrderResponse {
    code: number;
    message: string;
    data: CorporateOrder;
}
