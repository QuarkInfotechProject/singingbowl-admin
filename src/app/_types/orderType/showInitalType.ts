// Address Information Interface
export interface AddressInformation {
    name: string;
    address: string;
    mobile: string;
    backupMobile: string;
    province: string;
    city: string;
    zone: string;
  }
  
  // Items Ordered Interface
  export interface ItemOrdered {
    name: string;
    slug: string;
    quantity: number;
    lineTotal: string;
    optionName1: string;
    optionValue1: string;
    optionData1: string | null;
    optionName2: string;
    optionValue2: string;
    optionName3: string;
    optionValue3: string;
  }
  
  // Order Data Interface
  export interface Order {
    id: number;
    email: string;
    subtotal: string;
    discount: string;
    total: string;
    paymentMethod: string;
    transactionCode: string;
    status: string;
    addressInformation: AddressInformation;
    itemsOrdered: ItemOrdered[];
  }
  
  // Full API Response Interface
  export interface OrderApiResponse {
    code: number;
    message: string;
    data: Order;
  }
  