import { Fragment } from "react";
import RootLayouts from "./RootLayouts";
type Props = {
  params: { id: string };
};
export interface Root {
  code: number;
  message: string;
  data: RootData[];
}
export interface RootData {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  original_price: string;
  special_price: string;
  in_stock: boolean;
  quantity: number;
  image: string;
}
export default async function Name({ params }: Props) {
  const { id } = params;
    return (
      <Fragment>
       <RootLayouts id={id}/>
      </Fragment>
    );
  
}
