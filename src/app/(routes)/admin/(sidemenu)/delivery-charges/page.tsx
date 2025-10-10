"use client";

import { useEffect, useState } from "react";
import EditDelivery from "./edit/page";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import {
  DeliveryCharge,
  DeliveryChargeResponse,
} from "@/app/_types/deliver-Types/deliveryCharges";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Loading from "./loading";
import AddDelivery from "./create/page";
import { LuCircle } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    const getTags = async () => {
      setLoading(true);
      try {
        const { data }: any = await clientSideFetch({
          url: "/delivery-charges",
          method: "get",
          toast,
        });
        const flatTags: DeliveryCharge[] = data.data;
        console.log(flatTags);
        setDeliveryData(flatTags);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attributes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch attributes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    getTags();
    setRefetch(false);
  }, [refetch]);
  const onDelete = async (id: string) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

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
          description: "Failed to delete the category",
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
  const toggleCreateDialogs = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpens(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };
  return (
    <div className="flex flex-col gap-4">
      {/* {loading ? (Array(3).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="w-32 h-6" /></TableCell>
                  <TableCell><Skeleton className="w-20 h-6" /></TableCell>
                  <TableCell className="flex gap-3 justify-center">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))) :( */}

      <div className="flex flex-row justify-between  ">
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
            <DialogContent className="max-w-[600px] h-[650px]">
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
                <TableHead className="text-center">Delivery charges</TableHead>

                {/* <TableHead>Status</TableHead> */}
                <th className="font-medium text-muted-foreground h-12 text-center ">
                  Action
                </th>
              </TableRow>
            </TableHeader>
            {/* {orderData?.data.length > 0 ? ( */}
            <TableBody>
              {loading
                ? // Render Skeleton Rows
                  Array(3)
                    .fill(null)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="w-32 h-6" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="w-20 h-6 text-center" />
                        </TableCell>
                        <TableCell className="flex gap-3 text-center justify-center">
                          <Skeleton className="w-8 h-8  rounded-md" />
                          <Skeleton className="w-8 h-8 rounded-md" />
                        </TableCell>
                      </TableRow>
                    ))
                : deliveryData?.map((item: DeliveryCharge) => (
                    <TableRow>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">{item.deliveryCharge}</TableCell>

                      {/* <TableCell className={`${item.isActive === 1 ? 'text-green-600' : 'text-red-600'}`}><GoDotFill className='w-5 h-5' /></TableCell> */}

                      <TableCell className="  flex gap-3  justify-center ">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <BsThreeDots />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => toggleCreateDialogs(item.id)}
                            >
                              Edit{" "}
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
                          open={isSheetOpens}
                          onOpenChange={setIsSheetOpens}
                        >
                          {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <a onClick={toggleCreateDialogs} className={buttonVariants({ variant: 'outline' })}>
                            <FaEdit  className="text-blue-500 hover:text-blue-700 transition-colors duration-150"/>
                          </a>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}

                          {isSheetOpens && (
                            <DialogContent className="max-w-[600px] h-[650px]">
                              <EditDelivery
                                dataId={item.id}
                                setIsSheetOpens={setIsSheetOpens}
                                setRefetch={setRefetch}
                              />
                            </DialogContent>
                          )}
                        </Dialog>
                        <AlertDialog
                          open={deleteDialogOpen}
                          onOpenChange={setDeleteDialogOpen}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete the data ?
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

                          <AlertDialogTrigger>
                            {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div >
                          <a  className={buttonVariants({ variant: 'outline' })}>
                           <MdDelete className="h-4 w-4   text-red-500 hover:text-red-700 transition-colors duration-150" />
                          </a>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                          </AlertDialogTrigger>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
            {/* ) : (
        <div className="text-center py-4 text-lg mx-auto">No data available</div>
      )} */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryChargesPage;
