"use client";

import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaEye } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { MdDelete } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
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
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ShowData from "./show/page";
import {
  WarrantyClaim,
  WarrantyClaimsResponse,
} from "@/app/_types/Reviews-Types/reviews";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoFilterOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { BsThreeDots } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { StarIcon } from "lucide-react";

const CorporateOrder = ({
  corporateData,
  setRefetch,
  refetch,
  onChangeClick,
  searchTerm,
  searchType,
  setSearchType,
  setSearchTerm,
  searchEmail,
  setSearchEmail,
  searchPhone,
  setSearchPhone,
  searchProduct,
  setSearchProduct,
  setIsFiltering,
}: {
  corporateData: WarrantyClaimsResponse | null;
  setRefetch: any;
  refetch: any;
  onChangeClick: any;
  setSearchTerm: any;
  searchTerm: any;
  searchEmail: any;
  setSearchEmail: any;
  searchPhone: any;
  setSearchPhone: any;
  searchProduct: any;
  searchType: any;
  setSearchType: any;
  setSearchProduct: any;
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [replyText, setReplyText] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});

  const toggleCreateDialog = (id: string) => {
    setSelectedItemId(id);
    setIsSheetOpen(true);
  };

  const isSearchFieldFilled = () => {
    return (
      searchType !== "" ||
      searchEmail !== "" ||
      searchTerm !== "" ||
      searchPhone !== "" ||
      searchProduct !== ""
    );
  };
  const handleClear = async () => {
    setSearchType("");
    setSearchTerm("");
    setSearchPhone("");
    setSearchProduct("");
    setIsFiltering(false);
    onChangeClick(1);
  };
  const onDelete = async (id: string) => {
    setIsLoading(true);
    const deleteData = {
      uuid: id,
    };

    try {
      const res = await fetch(`/api/reviews/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();

        setRefetch(true);
        toast({ description: `${data.message}` });
      } else {
        toast({
          description: "Failed to delete the Reviews",
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
      setIsLoading(false);
    }
  };

  const handelSwitch = async (id: string) => {
    setIsLoading(true);
    const idData = {
      uuid: id,
    };

    try {
      const res = await fetch(`/api/reviews/status`, {
        method: "POST",
        body: JSON.stringify(idData),
      });

      if (res.ok) {
        const data = await res.json();
        if (corporateData && corporateData.data) {
          const updatedData = corporateData.data.map((item) =>
            item.id === id ? { ...item, isApproved: !item.isApproved } : item
          );

          setRefetch(true);
        }

        setRefetch(true);
        toast({ description: `${data.message}`, className:"bg-green-500 text-white font-semibold" });
      } else {
        toast({
          description: "Failed to update the status",
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
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const toggleReplyForm = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const submitReply = async (id) => {
    // Implement the API call to submit the reply
    console.log(`Submitting reply for ${id}: ${replyText[id]}`);
    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    const bodyData = {
      reviewId: id,
      content: replyText[id],
    };
    try {
      const res = await clientSideFetch({
        url: "/reviews/reply/create",
        debug: true,
        method: "post",
        body: { ...bodyData },
      });
      if (res && res.status === 200) {
        toast({
          className: "bg-green-500 text-white font-semibold",
          description: "Reply added successfully.",
        });
        setRefetch(true);
        toggleReplyForm(id);
        setReplyText((prev) => ({ ...prev, [id]: "" }));
      } else {
        throw new Error("Failed to submit reply");
      }
    } catch (error) {
      toast({
        description: "Failed to submit reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  // After successful submission:
  // setRefetch(true);
  // toggleReplyForm(id);
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div className="flex flex-col gap-4">
      <div className=" flex justify-between mt-2 ">
        <h1 className="text-left mb-4 text-2xl font-bold "></h1>
        <div>
          <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilterOutline className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-4 mr-8">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <Input
                  type="text"
                  className="w-full"
                  placeholder="Search by product..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />

                <select
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border text-xs rounded p-2 font-bold mr-2 w-full dark:text-gray-300 h-[40px]"
                >
                  <option value="">Search by Approval Status</option>
                  <option value="1">Approved</option>
                  <option value="0">Not Approved</option>
                </select>
                <select
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="border text-xs font-bold rounded p-2 mr-2 w-full dark:text-gray-300 h-[40px]"
                >
                  <option value="">Search by Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>

                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border text-xs rounded p-2 font-bold mr-2 w-full dark:text-gray-300 h-[40px]"
                >
                  <option value="">Search by Type</option>
                  <option value="review">Review</option>
                  <option value="question">Question</option>
                </select>
                <div className="flex flex-row gap-2">
                  <Button
                    className="bg-blue-500  border"
                    onClick={onChangeClick}
                  >
                    Search
                  </Button>
                  {isSearchFieldFilled() && (
                    <Button className=" bg-red-500  " onClick={handleClear}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Manage reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" w-full   mx-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-semibold text-gray-800">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Product
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800 text-center">
                    Review
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800 text-center">
                    Approved
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {corporateData?.data?.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={item.profilePicture}
                              alt={item.name}
                            />
                            <AvatarFallback>
                              {getInitials(item.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          className="flex"
                          href={`admin/products/edit/${item.productId}`}
                        >
                          {item.productName}
                        </a>
                        <a
                          href={`https://zolpastore.com/shop/detail/${item.url}`}
                          target="_blank"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View Product
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        {" "}
                        {item?.type.charAt(0).toUpperCase() +
                          item?.type.slice(1)}
                      </TableCell>
                      <TableCell className="w-[350px]">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.rating
                                  ? "text-gray-500 fill-gray-500"
                                  : "text-gray-400 "
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm">{item.comment}</div>
                        <div className="flex gap-1">
                          {item.isReplied ? null : (
                            <div className="flex gap-1 ">
                              <Button
                                variant="link"
                                className="text-blue-500 p-0 h-auto"
                                onClick={() => toggleReplyForm(item.id)}
                              >
                                Reply
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={item.isApproved}
                          onCheckedChange={() => handelSwitch(item.id)}
                          className={`${
                            item.isApproved ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{ transform: "scale(0.7)" }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <BsThreeDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => toggleCreateDialog(item.id)}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedRows[item.id] && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="p-4 bg-gray-50 rounded-md">
                            <Textarea
                              placeholder="Type your reply here..."
                              value={replyText[item.id] || ""}
                              onChange={(e) =>
                                handleReplyChange(item.id, e.target.value)
                              }
                              className="w-full mb-2"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                                onClick={() => toggleReplyForm(item.id)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-[#5e72e4] hover:bg-[#465ad1]"
                                onClick={() => submitReply(item.id)}
                              >
                                Submit Reply
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              {isSheetOpen && selectedItemId && (
                <DialogContent className="max-w-[700px] h-auto">
                  <ShowData
                    setIsSheetOpen={() => setIsSheetOpen(false)}
                    setRefetch={setRefetch}
                    IdData={selectedItemId}
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
                    Are you sure you want to delete this data?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setDeleteDialogOpen(false)}
                    className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (selectedItemId) {
                        onDelete(selectedItemId);
                        setDeleteDialogOpen(false);
                      }
                    }}
                    className="bg-[#5e72e4] hover:bg-[#465ad1]"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* )}   */}
    </div>
  );
};
export default CorporateOrder;
