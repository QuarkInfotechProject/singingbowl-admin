// User Details Interface
export interface UserDetails {
  name: string;
  userId: string;
  email: string;
  totalOrders: number;
  totalRevenue: string;
  averageOrderValue: string;
}

// Address Information Interface
export interface AddressInformation {
  name: string;
  address: string;
  mobile: string;
  backupMobile: string;
  province: string;
  city: string;
  zone: string;
  countryName: string;
}

// Items Ordered Interface
export interface ItemOrdered {
  id: string;
  name: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  baseImage: string;
  optionName1: string;
  optionValue1: string;
  optionData1: string | null;
  optionName2: string;
  optionValue2: string;
  orderItemId: string;
  optionName3: string;
  optionValue3: string;
  optionData2: string | null;
  optionData3: string | null;
}

// Coupon Data Interface (Empty array, so we can define it as any[] for now)
export interface CouponData {
  // If coupon details are added in the future, this can be expanded
}

// Order Data Interface
export interface Order {
  id: number;
  subtotal: string;
  discount: string;
  total: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  transactionDetails: string | null;
  userDetails: UserDetails;
  addressInformation: AddressInformation;
  itemsOrdered: ItemOrdered[];
  couponData: CouponData[]; // Empty array at the moment
  orderInvoiceDownloadLink: string;
  paid: string;
  totalPaid: string;
  availableToRefund: number;
  refundedAmount: number;
  orderLogData: any; // Using any for now as structure is not fully defined
}

// Full API Response Interface
export interface OrderApiResponse {
  code: number;
  message: string;
  data: Order;
}
