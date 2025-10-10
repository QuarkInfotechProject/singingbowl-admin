export interface Product {
    id: string;
    name: string;
    originalPrice: string;
    specialPrice: string;
    status: boolean;
    variantCount: number;
    files: {
        imageUrl: string;
    }[];
}

export interface ApiResponse {
    code: number;
    message: string;
    data: {
        current_page: number;
        data: Product[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}


interface similarProduct {
    uuid: string;
    name: string;
    originalPrice: string | null;
    specialPrice: string | null;
    status: boolean;
    baseImage: string;
  }

  interface ImageFile {
    id: number;
    url: string;
  }
  
  interface OptionFiles {
    baseImage?: ImageFile;
    additionalImage?: ImageFile[];
  }
  
  interface OptionValue {
    id?: string;
    optionName: string;
    optionData?: string;
    files?: OptionFiles;
  }
  
  interface Option {
    id: string;
    name: string;
    values: OptionValue[];
  }
  
  interface Variant {
    id: string;
    optionName1: string;
    optionName2: string;
    optionName3: string;
    status: boolean;
    quantity: number;
    originalPrice: string;
    specialPrice: string | "";
  }
  interface AttributeValue {
    id: number;
    name: string;
  }
  
  interface Attribute {
    id:number,
    attributeId: number;
    name: string;
    values: AttributeValue[];
  }
export interface SingleProductT {
    id?:string,
    productName: string;
    bestSeller?:any
    url: string;
    brandId:string,
    keySpecs:any,
    hasVariant: 1 | 0;
    originalPrice: string;
    specialPrice: string;
    specialPriceStart: string;
    specialPriceEnd: string;
    sku: string;
    description: string;
    additionalDescription: string;
    status: 1 | 0;
    onSale: 1 | 0;
    inStock: 1 | 0;
    quantity: 1 ;
    newFrom: string;
    newTo: string;
    categories: {
      id: number;
      name: string;
    }[];
    files: {
      baseImage: {
        id: string;
        baseImageUrl: string;
      };
      additionalImage: {
        id: string;
        additionalImageUrl: string;
      }[];
    };
    options: Option[];
  variants: Variant[];
    meta: {
      metaTitle: string;
      keywords: string[];
      metaDescription: string;
    };
    attributes: Attribute[];
    relatedProducts: similarProduct[]; 
    // upSellProducts: similarProduct[];
    crossSellProducts: similarProduct[]; 
}