"use client";
import React, { useState } from "react";
import { LimitedRootDataData } from "./page";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { CircleDotIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddLimitedTimeProduct from "./add/AddLimitedTimeProduct";
import Image from "next/image";

const getLimitedDeals = async () => {
  const response = await clientSideFetch({
    url: "/limitedtimedeal",
    method: "get",
    toast: "skip",
  });

  if (response?.status === 200) {
    return response.data.data.data;
  }

  throw new Error("Failed to fetch trending categories");
};

const RootLimitedTime = ({
  limitedData,
}: {
  limitedData: LimitedRootDataData[];
}) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data } = useQuery({
    initialData: limitedData,
    queryKey: ["LimitedTimeDeal"],
    queryFn: getLimitedDeals,
    refetchOnWindowFocus: false,
  });

  const LimitedTimedeals = data || limitedData || [];
  const statusUpdatemutation = useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: boolean }) =>
      clientSideFetch({
        url: `/limitedtimedeal/change-status/${id}`,
        method: "get",
        toast: "skip",
      }),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["LimitedTimeDeal"] });
      toast({
        title: `${response.data.message}`,
        className: "bg-green-500 text-white font-semibold",
      });
    },
  });
  const isStausChangeLoadding = statusUpdatemutation.isPending;
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-center items-center">
          <p className="text-2xl font-semibold">Limited Time Deals</p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsDialogOpen(true)}
          className="flex bg-blue-500 hover:bg-blue-500 text-white items-center gap-1"
        >
          <CircleDotIcon className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </div>

      <div className="p-4 mt-6 border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LimitedTimedeals?.map(
              (item: LimitedRootDataData, index: number) => (
                <TableRow key={item.id || index}>
                  <TableCell className="w-8"></TableCell>
                  <TableCell>
                    <Image
                      src={item.image||""}
                      height={400}
                      width={400}
                      alt={item.product_name}
                      className="w-12 h-12 object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Switch
                        checked={item.status}
                        disabled={isStausChangeLoadding}
                        onCheckedChange={() =>
                          statusUpdatemutation.mutate({
                            id: item.id,
                            status: !item.status,
                          })
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
        
      >
        <DialogContent className="max-w-lg" >
          <DialogHeader>
            <DialogTitle>Add New Limited Time Deal</DialogTitle>
          </DialogHeader>
          <AddLimitedTimeProduct setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RootLimitedTime;
