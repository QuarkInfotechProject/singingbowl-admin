import { serverSideFetch } from "@/app/_utils/serverSideFetch";

const ProdctDetail = async({ params }: { params: { uuid: string } }) => {
 
  const singleProduct = await serverSideFetch({
    url:`/products/show/${params.uuid}`
  })
   
  return (
    <div>
      <h2 className="text-2xl font-medium ">
        Product detail
      </h2>

        <div className="mt-5">
          <pre>{singleProduct && JSON.stringify(singleProduct.data, null, 2)}</pre>
        </div>
    </div>
  )
}

export default ProdctDetail