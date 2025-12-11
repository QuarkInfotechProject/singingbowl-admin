"use client";

import { useEffect, useState } from "react";
import EditDelivery from "./edit/page";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import { DeliveryCharge } from "@/app/_types/delivery-Types/deliveryCharges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import AddDelivery from "./create/page";
import { LuCircle } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BsThreeDots } from "react-icons/bs";

const DeliveryChargesPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deliveryData, setDeliveryData] = useState<DeliveryCharge[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const getDeliveryCharges = async () => {
      setLoading(true);
      try {
        const { data }: any = await clientSideFetch({
          url: "/delivery-charges",
          method: "get",
          toast,
        });
        const flatData: DeliveryCharge[] = data.data;
        setDeliveryData(flatData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch delivery charges",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    getDeliveryCharges();
    setRefetch(false);
  }, [refetch]);

  const onDelete = async (id: number) => {
    setLoading(true);
    const deleteData = { id: id };

    try {
      const res = await fetch(`/api/delivery-charge`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();
        setRefetch(true);
        toast({ description: `${data.message}` });
      } else {
        toast({
          description: "Failed to delete the delivery charge",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };

  const toggleEditDialog = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpens(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div></div>
        <Dialog>
          <DialogTrigger asChild>
            <a
              className={buttonVariants()}
              style={{ textDecoration: "none", backgroundColor: "white" }}
              onClick={toggleCreateDialog}
            >
              <button className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl">
                <LuCircle className="w-5 h-5" />
                <span>Add New Delivery</span>
              </button>
            </a>
          </DialogTrigger>

          {isSheetOpen && (
            <DialogContent className="max-w-[850px] h-auto max-h-[90vh]">
              <AddDelivery
                setRefetch={setRefetch}
                setIsSheetOpen={setIsSheetOpen}
              />
            </DialogContent>
          )}
        </Dialog>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Delivery Charges</CardTitle>
          <CardDescription>Manage delivery charges</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-center">Delivery Charge</TableHead>
                <TableHead className="text-center">Above 20kg</TableHead>
                <TableHead className="text-center">Above 45kg</TableHead>
                <TableHead className="text-center">Above 100kg</TableHead>
                <th className="font-medium text-muted-foreground h-12 text-center">
                  Action
                </th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="w-32 h-6" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-6" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="w-20 h-6" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="w-20 h-6" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="w-20 h-6" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="w-20 h-6" /></TableCell>
                      <TableCell className="flex gap-3 text-center justify-center">
                        <Skeleton className="w-8 h-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                : deliveryData?.map((item: DeliveryCharge) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.country || '-'}</TableCell>
                    <TableCell className="text-center">${item.deliveryCharge}</TableCell>
                    <TableCell className="text-center">${item.chargeAbove20kg}</TableCell>
                    <TableCell className="text-center">${item.chargeAbove45kg}</TableCell>
                    <TableCell className="text-center">${item.chargeAbove100kg}</TableCell>
                    <TableCell className="flex gap-3 justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toggleEditDialog(item.id)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Dialog
                        open={isSheetOpens && selectedItemId === item.id}
                        onOpenChange={setIsSheetOpens}
                      >
                        {isSheetOpens && selectedItemId === item.id && (
                          <DialogContent className="max-w-[850px] h-auto max-h-[90vh]">
                            <EditDelivery
                              dataId={item.id}
                              setIsSheetOpens={setIsSheetOpens}
                              setRefetch={setRefetch}
                            />
                          </DialogContent>
                        )}
                      </Dialog>

                      <AlertDialog
                        open={deleteDialogOpen && selectedItemId === item.id}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this delivery charge?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                              onClick={() => setDeleteDialogOpen(false)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-[#5e72e4] hover:bg-[#465ad1]"
                              onClick={() => {
                                if (selectedItemId) {
                                  onDelete(selectedItemId);
                                  setDeleteDialogOpen(false);
                                }
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryChargesPage;
