"use client";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Root } from "./page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  id: string;
};

const RootLayouts = ({ id }: Props) => {
  const { data, isLoading, isError } = useQuery<Root>({
    queryKey: ["detailsarrival", id],
    queryFn: async () => {
      const res = await clientSideFetch({
        url: `/new-arrival/show/${id}`,
        toast: "skip",
        method: "get",
      });
      if (!res || res.status !== 200) {
        throw new Error("Failed to fetch new arrivals");
      }
      return res.data as Root;
    },
  });

  const router = useRouter();
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl animate-pulse bg-gray-300" />
          </div>
        ))}
      </div>
    );
  }

  if (!data?.data || data?.data.length === 0) {
    return (
      <div className="text-center">
        <p>No new arrivals found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <Fragment>
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4"
      >
        Back
      </Button>

      {/* Table Data */}
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Special Price</TableHead>
            <TableHead>In Stock</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{item.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{item.slug}</TableCell>
              <TableCell>Rs. {item.original_price}</TableCell>
              <TableCell>Rs. {item.special_price}</TableCell>
              <TableCell>{item.in_stock ? "Yes" : "No"}</TableCell>
              <TableCell>{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
};

export default RootLayouts;
