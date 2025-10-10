export interface SingleProductT {
  productName: string;
  url: string;
  hasVariant: number;
  originalPrice: string;
  specialPrice: string;
  specialPriceStart: string;
  specialPriceEnd: string;
  sku: string;
  description: string;
  additionalDescription: string;
  status: boolean;
  onSale: number;
  quantity: number;
  inStock: number;
  newFrom: string;
  newTo: string;
  categories: Category[];
  files: {
    baseImage: Image;
    additionalImage: Image[];
    descriptionImage: any[];
  };
  options: any[];
  variants: any[];
  meta: {
    metaTitle: string;
    keywords: string[];
    metaDescription: string;
  };
  attributes: Attribute[];
  coupons: any[];
  activeOffers: any[];
  others: any[];
  relatedProducts: RelatedProduct[];
  upSellProducts: any[];
  crossSellProducts: RelatedProduct[];
}

interface Category {
  id: number;
  name: string;
}

interface Image {
  id: number;
  baseImageUrl?: string;
  additionalImageUrl?: string;
}

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

interface AttributeValue {
  id: number;
  name: string;
}

interface RelatedProduct {
  uuid: string;
  name: string;
  originalPrice: string | null;
  specialPrice: string | null;
  status: boolean;
  baseImage: string;
}
