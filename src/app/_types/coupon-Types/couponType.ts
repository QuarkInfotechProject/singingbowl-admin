
export interface Coupon {
  id: number;
  name: string;
  code: string;
  couponAmount: string;
  expiryDate: string;
  isPercent: number;
  isActive: number | boolean;
  description: string;
}


export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}


export interface CouponData {
  current_page: number;
  data: Coupon[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}


export interface CouponResponse {
  code: number;
  message: string;
  data: CouponData;
}
