"use client";
import React, { Fragment, useState } from "react";
import { newArrivalRootData } from "./page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useQueryClient } from "@/components/media/useQuery";
import { toast } from "@/components/ui/use-toast";

const RootLayout = ({ newArrival }: { newArrival: newArrivalRootData[] }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleShowInNewArrivalsChange = async (status: number) => {
    const res = await clientSideFetch({
      url: `/new-arrival/status/${status}`,
      method: "get",
      toast: "skip",
    });
    if (res?.status === 200) {
      toast({
        className: "bg-green-500 text-white font-semibold",
        description: `${res.data.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["newarrival"] });
    }
  };
  const handleEdit = (id: number) => {
    router.push(`/admin/new-arrivals/edit/${id}`);
  };

  return (
    <Fragment>
      <div className="p-4">
        <Table className="min-w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Image</TableHead>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">Slug</TableHead>
              <TableHead className="text-left">Show in New Arrivals</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newArrival.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[50px] w-[50px] object-cover"
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.show_in_new_arrivals}
                    onCheckedChange={() =>
                      handleShowInNewArrivalsChange(item.id)
                    }
                  />
                </TableCell>
                <TableCell className="text-left">
                  <div
                    className="rounded-full p-0 cursor-pointer"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Eye />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
};

export default RootLayout;
