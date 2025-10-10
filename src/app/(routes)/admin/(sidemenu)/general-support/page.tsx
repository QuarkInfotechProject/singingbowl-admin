"use client";
import React, { useState, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";

import { WarrantyClaimsResponse } from "@/app/_types/Reviews-Types/reviews";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import ShowData from "./show/page";
const Reviewspage = () => {
  const [supportData, setSupportData] = useState<WarrantyClaimsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState();

  const { toast } = useToast();
  const router = useRouter();

  const getMenus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/generalSupport`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setLoading(false);
      setSupportData(data);
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Oops Unable to fetch menus",
        description: `${error}`,
      });
    }
  };

  useEffect(() => {
    getMenus();
    setRefetch(false);
  }, []);
  const toggleCreateDialogs = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpen(true);
  };
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>General support </CardTitle>
        <CardDescription>Details of general support</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Action</TableHead>
                {/* <TableHead className="text-center">Create At</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!supportData?.data || supportData.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No General Support Found
                      </h3>
                      <p className="text-gray-500 text-center">
                        There are currently no general support to display.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                supportData?.data?.map((item) => (
                  <TableRow key={item.orderId}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toggleCreateDialogs(item.id)}
                          >
                            View
                          </DropdownMenuItem>

                          {/* <DropdownMenuItem onClick={()=>handleDeleteClick(item.id)}>Delete</DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <DialogTrigger asChild></DialogTrigger>
                        {isSheetOpen && (
                          <DialogContent className=" max-w-[700px]  h-auto">
                            <ShowData
                              setIsSheetOpen={setIsSheetOpen}
                              setRefetch={setRefetch}
                              IdData={selectedItemId}
                            />
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reviewspage;
