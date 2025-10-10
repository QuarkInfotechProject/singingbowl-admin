
export interface WarrantyClaim {
    id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  image: string[];
}


export interface WarrantyClaimResponse {
    code: number;
    message: string;
    data: WarrantyClaim;
}
