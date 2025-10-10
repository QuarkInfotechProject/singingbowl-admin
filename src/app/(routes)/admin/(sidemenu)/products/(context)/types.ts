export type ProductT = {
    data:{
      productName:string,
      url:string,
      originalPrice:string,
      specialPrice:string,
      specialPriceStart:string,
      specialPriceEnd:string,
      description:string,
      additionalDescription:string,
      status:boolean,
      onSale:0 | 1,
      quantity: number,
      inStock:number,
      newFrom:string,
      newTo:string,
      
    }
  }