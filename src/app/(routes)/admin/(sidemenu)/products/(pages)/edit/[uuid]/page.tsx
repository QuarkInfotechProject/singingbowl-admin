// import { cookies } from "next/headers";
// import RootLayout from "./RootLayout";

// export default async function Page({ params }: { params: { uuid: string } }) {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;

//   const { uuid } = params;
//   let data = null;

//   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/show/${uuid}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     cache: "no-store", 
//    });
//   if (response.ok) {
//     const res = await response.json();
//     data = res.data?? null;
//   }

//   const getProducts= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products?per_page=1000000`,{
//      method: "post",
//         body: {
//           status: "1",
//           name: "",
//           sku: "",
//           sortBy: "created_at",
//           sortDirection: "asc",
//         },
//         headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   const defaultProduct=[]
//   if(getProducts.ok){
//     const product= await getProducts.json()
//     defaultProduct=product.data.data
//   }

//   return <RootLayout defaultData={data} uuid={uuid} />;
// }
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import RootLayout from "./RootLayout";

export default async function Page({ params }: { params: { uuid: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const { uuid } = params;

  // Check if token or uuid doesn't exist
  if (!token || !uuid) {
    return null;
  }
  let data = null;
  let defaultProduct = [];

  try {
    // First API call - Get specific product
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/show/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: "no-store", 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product`);
    }

    const res = await response.json();
    data = res.data ?? null;

    // Second API call - Get all products
    const getProducts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products?per_page=1000000`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status: "1",
        name: "",
        sku: "",
        sortBy: "created_at",
        sortDirection: "asc",
      }),
    });

    if (!getProducts.ok) {
      throw new Error(`Failed to fetch products`);
    }

    const product = await getProducts.json();
    defaultProduct = product.data?.data ?? [];

    // Only render RootLayout if both API calls were successful
    return <RootLayout defaultData={data} defaultProduct={defaultProduct} uuid={uuid} />;

  } catch (error) {
    notFound();
  }
}