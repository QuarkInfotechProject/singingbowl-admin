"use client";
import axios from "axios";

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

const generateRandomHex = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

const createHmacSignature = async (
  message: string,
  secret: string
): Promise<string> => {
  if (!secret || secret.trim() === "") {
    throw new Error("API_SECRET is not configured.");
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

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
  toast: any;
  handleLoading?: (status: boolean) => void;
}) => {
  console.log("body of request", body);
  try {
    if (!API_SECRET) {
      throw new Error("API_SECRET is not configured.");
    }

    const nonce = generateRandomHex(16);
    const timestamp = Date.now();
    const signature = await createHmacSignature(
      `${nonce}${timestamp}`,
      API_SECRET
    );

    // Get token AND CSRF token from our API route
    const tokenResponse = await axios.post("/api/getToken", {
      nonce,
      timestamp,
      signature,
    });

    const token = tokenResponse.data.token;
    const csrfToken = tokenResponse.data.csrfToken;

    if (!token) {
      throw new Error("Failed to retrieve authentication token");
    }

    if (!csrfToken) {
      console.warn("No CSRF token obtained - request may fail");
    } else {
      debug && console.log("CSRF token obtained successfully");
      debug &&
        console.log("CSRF token preview:", csrfToken.substring(0, 30) + "...");
    }

    debug &&
      console.log(
        "Console request sent to URL:",
        `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
      );

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Add CSRF token to headers
    // Try both X-XSRF-TOKEN and X-CSRF-TOKEN
    if (csrfToken) {
      headers["X-XSRF-TOKEN"] = csrfToken;
      debug && console.log("CSRF token added to X-XSRF-TOKEN header");
    }

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

    const data = await res.json();
    debug && console.log("Response status:", res.status);
    debug && console.log("Response data:", data);

    if (res.ok) {
      return {
        status: 200,
        data: data,
      };
    } else {
      debug && console.log("status not 200");
      debug && console.log("Error response:", data);

      toast({
        description: data.error || data.message || "Unexpected Error",
        variant: "destructive",
      });
    }
  } catch (error) {
    debug && console.log("unexpected Data Fetching error", error);
    if (axios.isAxiosError(error)) {
      toast({
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Unexpected Error`,
        description: error instanceof Error ? error.message : `${error}`,
        variant: "destructive",
      });
    }
  } finally {
    handleLoading && handleLoading(false);
  }
};

export { clientSideFetch };
