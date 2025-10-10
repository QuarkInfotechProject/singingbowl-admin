import { ApiResponse } from "@/app/_types/Index_Types/indexType";
import Dashboard from "@/components/dashboard-components/dashboard";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  endpoint: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

  try {
    const { data } = await axios.get<ApiResponse>(
      `${process.env.BASE_URL}/${params.endpoint.join("/")}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...searchParams,
          _: Date.now(),
        },
      }
    );
    return NextResponse.json(data);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const payload = await request.json();
    const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

    const { data } = await axios.post(
      `${process.env.BASE_URL}/${params.endpoint.join("/")}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    const axiosError: AxiosError = error;
    return NextResponse.json(axiosError.response?.data, {
      status: error?.response?.status,
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const payload = await request.json();
    const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

    const { data } = await axios.post(
      `${process.env.BASE_URL}/${params.endpoint.join("/")}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    const axiosError: AxiosError = error;
    return NextResponse.json(axiosError.response?.data, {
      status: error.response.status,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

    const { data } = await axios.delete(
      `${process.env.BASE_URL}/${params.endpoint.join("/")}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    const axiosError: AxiosError = error;
    return NextResponse.json(axiosError.response?.data, {
      status: error.response.status,
    });
  }
}

function getSearchParamsAsObject(params: URLSearchParams) {
  const paramsObject: Record<string, string> = {};

  params.forEach((value, key) => {
    paramsObject[key] = value;
  });

  return paramsObject;
}
