import { cookies } from "next/headers";
interface ParamT {
 
    id: string;
  
}

const serverSideFetch = async ({
  url,
  params,
  method = "get",
  body,
  debug = false,
  rawResponse = false
}: {
    params:ParamT;
  url: string;
  method?: "get" | "post" | "put" | "delete" | "patch";
  body?: any;
  debug?: boolean;
  rawResponse?: boolean;
}) => {
 try {
    const cookieStore = cookies();
    if(cookieStore.has("token")){
        const token = cookieStore.get("token")?.value;
        debug && console.log("request sent to URL:", `${process.env.BASE_URL}${url}/show/${params.id}`);
        try {
            const res = await fetch(`${process.env.BASE_URL}${url}/show/${params.id}`, {
                method: method.toUpperCase(),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body)
            });
            rawResponse && console.log("Raw Response: " ,res)
            const data = await res.json();
            debug && console.log("Response Data:", data);
            if(res.status === 200){
                return data;
            }else{
                debug && console.log("status not 200")
                return;
            }
        } catch (error) {
            debug && console.log("unexpected Data Fetching error", error)
            return;
        }
    }else{
        debug && console.log("token not found. Relogin required")
        return;
    }
   
 } catch (error) {
    console.log("unexpected error serverside fetch", error)
    return;
 }
};

export { serverSideFetch };
