export interface  Coupon{
    code: number;
    message: string;
    data: CouponData;
}
export interface CouponData{
    id:number,
    name:string,
    code:string,
    value:string,
    isPercent:boolean,
    isActive:boolean,
    freeShipping:boolean,
    minimumSpend:string,
    startDate: string,
    endDate: string,
    products: string[],
    exclude: string[],
    categories: number[],
    excludeCategories: number[],
    usageLimitPerCoupon: string,
    usageLimitPerCustomer: string,
    
    maxDiscount:string,
          isPublic:boolean,
          isBulkOffer:boolean,
          applyAutomatically:boolean,
          individualUse:boolean,
          includedCoupons: string[],
          excludedCoupons: string[],
          minQuantity:string,
          paymentMethods: string[]

}