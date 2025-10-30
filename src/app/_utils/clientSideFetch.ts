"use client";
import axios from "axios";

const clientSideFetch = async ({
  url,
  method = "get",
  body,
  debug = false,
  rawResponse = false,
  toast,
  handleLoading,
}: {
  url: string;
  method?: "get" | "post" | "put" | "delete" | "patch";
  body?: Record<string, any> | null;
  debug?: boolean;
  rawResponse?: boolean;
  toast?: any;
  handleLoading?: (status: boolean) => void;
}) => {
  console.log("body of request", body);
  try {
    // handleLoading && handleLoading(true);

    // Fetch the token
    const tokenResponse = await axios.post("/api/getToken");
    const token = tokenResponse.data.token;

    if (!token) {
      throw new Error("Failed to retrieve authentication token");
    }

    debug &&
      console.log(
        "Console request sent to URL:",
        `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
      );

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const requestOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: headers,
    };

    if (body) {
      debug && console.log("Submitted value", body);
      requestOptions.body = JSON.stringify(body);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
      requestOptions
    );

    // rawResponse && console.log("Raw Response: ", res);
    const data = await res.json();
    // debug && console.log("Response Data:", data);

    if (res.ok) {
      return {
        status: 200,
        data: data,
      };
    } else {
      debug && console.log("status not 200");
      if (toast && typeof toast === "function") {
        toast({
          description: data.error ? data.error : "Unexpected Error",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    debug && console.log("unexpected Data Fetching error", error);
    if (axios.isAxiosError(error)) {
      if (toast && typeof toast === "function") {
        toast({
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      }
    } else {
      if (toast && typeof toast === "function") {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
  } finally {
    handleLoading && handleLoading(false);
  }
};

export { clientSideFetch };
