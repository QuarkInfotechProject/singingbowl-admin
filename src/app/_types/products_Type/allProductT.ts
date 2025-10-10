interface Product {
  id: string;
  name: string;
  brandId: number;
  hasVariant: boolean;
  category: string[];
  sortOrder: number;
  originalPrice: string;
  specialPrice: string;
  inStock: boolean;
  quantity: number;
  variantCount: number;
  files: string | ImageFile[];
}

interface ImageFile {
  imageUrl: string;
}

export type AllProductT = Product[];
