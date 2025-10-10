"use client";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

// import { Coupon } from '@/_types/Coupon_Types/couponIndex';
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEye } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import Link from "next/link";
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { AttributesT } from '@/_types/attributesType';

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ShowData from "./show/page";

import {
  ApiResponse,
  CorporateData,
} from "@/app/_types/corporate-types/corporateType";
import { Switch } from "@/components/ui/switch";
import { Activity, ChevronDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BsThreeDots } from "react-icons/bs";

const CorporateOrder = ({
  corporateData,
  setRefetch,
  refetch,
  getMenus,
}: {
  corporateData: ApiResponse | null;
  setRefetch: any;
  refetch: any;
  getMenus: () => Promise<void>;
}) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [position, setPosition] = useState();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [localCorporateData, setLocalCorporateData] =
    useState<ApiResponse | null>(corporateData);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  useEffect(() => {
    setLocalCorporateData(corporateData);
    setIsLoading(false);
  }, [corporateData]);

  const onToggleSwitch = async (id: number, newStatus: string) => {
    setIsLoading(true);
    console.log("new Status", newStatus);
    console.log("new Status id", id);
    setLocalCorporateData((prevData) => {
      if (!prevData) return null;
      console.log("prev ", prevData);
      // If prevData.data is not an array, it's likely a single object
      return {
        ...prevData,
        data:
          prevData.data?.id === id
            ? { ...prevData.data, status: newStatus }
            : prevData.data,
      };
    });

    try {
      const res = await fetch(`/api/corporateOrder/status`, {
        method: "POST",
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });

        setRefetch(true);
        await getMenus();
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCreateDialog = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpen(true);
  };

  const handleChangeStatus = () => {
    setIsStatusDropdownOpen(true);
  };

  const formatStatus = (status: string) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };
  const formatDate = (dateString: string): string => {
    // Split the string at '@' and take the first part
    const datePart = dateString?.split("@")[0];

    // Trim any whitespace
    return datePart?.trim();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Corporate Order</CardTitle>
        <CardDescription>Manage corporate order</CardDescription>
      </CardHeader>
      <CardContent>
        {/* {isLoading ? (
        <Loading></Loading>
      ) : ( */}
        <div className=" w-full mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Id</TableHead> */}
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center p-0">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!corporateData?.data || corporateData.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-gray-500 text-center">
                        There are currently no corporate orders to display.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                corporateData?.data?.map((data, index) => (
                  <TableRow key={corporateData?.data?.id}>
                    <TableCell className="font-medium">
                      {data.firstName} {data.lastName}
                    </TableCell>

                    <TableCell className="font-medium">{data.email}</TableCell>
                    <TableCell className="font-medium">{data.phone}</TableCell>
                    <TableCell className={`font-medium `}>
                      {data.status}
                    </TableCell>
                    <TableCell className="font-medium">
                      {/* {new Date(data.submittedAt).toLocaleDateString()} */}
                      {data.submittedAt}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toggleCreateDialog(data?.id)}
                          >
                            View{" "}
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <span className="cursor-pointer">
                                Change status
                              </span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {/* <DropdownMenuLabel>Status</DropdownMenuLabel> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                  value={corporateData?.data?.status}
                                  className="cursor-pointer"
                                  onValueChange={(newValue) =>
                                    onToggleSwitch(data?.id, newValue)
                                  }
                                >
                                  <DropdownMenuRadioItem
                                    value="cancelled"
                                    className={` transition-colors cursor-pointer duration-200`}
                                  >
                                    Cancelled
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem
                                    value="completed"
                                    className={` transition-colors cursor-pointer duration-200`}
                                  >
                                    Completed
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem
                                    value="on_hold"
                                    className={`$transition-colors cursor-pointer duration-200`}
                                  >
                                    On Hold
                                  </DropdownMenuRadioItem>

                                  <DropdownMenuRadioItem
                                    value="pending"
                                    className={`$ transition-colors cursor-pointer duration-200`}
                                  >
                                    Pending
                                  </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {/* <DropdownMenuItem onClick={handleChangeStatus}>Change status <span></span></DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <DialogTrigger asChild>
                          {/* <a onClick={toggleCreateDialog} className="justify-center">
        <Button
          variant="outline"
          className="text-white bg-[#5e72e4] hover:bg-[#465ad1] hover:text-white rounded-full"
        >
          View Details
        </Button>
      </a> */}
                          {/* <a onClick={toggleCreateDialog}
                       
                        
                      >
                    <Button variant="outline"  className='mt-auto justify-end ml-12 mx-auto hover:text-blue-500 '  > <FaEye /></Button>
                      </a> */}
                        </DialogTrigger>
                        {isSheetOpen && (
                          <DialogContent className="max-w-[400px]  h-[450px]">
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
export default CorporateOrder;
