"use client";

import axios from "axios";
interface ParamT {
 
      id: string;
    
  }

const clientSideFetch = async ({
    params,
  url,
  method = "get",
  body,
  debug = false,
  rawResponse = false,
  toast,
}: {
    params:ParamT;
  url: string;
  method?: "get" | "post" | "put" | "delete" | "patch";
  body?: Record<string, any> | null; // Assuming body is an object or null
  debug?: boolean;
  rawResponse?: boolean;
  toast: any;
}) => {
  try {
    try {
      const { data } = await axios.get("/api/getToken");
      const token = data.token;
      debug &&
        console.log(
          "request sent to URL:",
          `${process.env.NEXT_PUBLIC_BASE_URL}${url}/show/${params.id}`
        );
      try {
        const requestOptions: RequestInit = {
          method: method.toUpperCase(),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (body) {
          debug && console.log("Submitted value", body)
          requestOptions.headers["Content-Type"] = "application/json";
          requestOptions.body = JSON.stringify(body);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}/show/${params.id}`, requestOptions);
        rawResponse && console.log("Raw Response: ", res);
        const data = await res.json();
        debug && console.log("Response Data:", data);

        if (res.status === 200) {
          return {
            status: 200,
            data: data,
          };
        } else {
          debug && console.log("status not 200");
          toast({
            description: data.error ? data.error : "Unexpected Error",
            variant: "destructive",
          });
        }
      } catch (error) {
        debug && console.log("unexpected Data Fetching error", error);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
        return "error occured";
      }
    }
  } catch (error) {
    console.log("unexpected error clientside fetch", error);
    return;
  }
};

export { clientSideFetch };