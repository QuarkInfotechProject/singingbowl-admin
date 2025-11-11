"use client";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

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
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Coupon,
  CouponData,
  CouponResponse,
} from "@/app/_types/coupon-Types/couponType";
import { useRouter } from "next/navigation";
import { LuCircle } from "react-icons/lu";

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
import { IoFilterOutline } from "react-icons/io5";

const RootCoupon = ({
  couponData,
  setRefetch,
  refetch,
  setSearchTerm,
  searchTerm,
  setSearchActive,
  searchActive,
  onhandelClick,
  currentPage,
  setCurrentPage,
  totalPages,
  onSearchChange,
  onSearchClear,
}: {
  couponData: CouponResponse | null;
  setRefetch: any;
  refetch: any;
  setSearchTerm: any;
  searchTerm: any;
  onhandelClick: any;
  setSearchActive: any;
  searchActive: any;
  currentPage: any;
  setCurrentPage: any;
  totalPages: any;
  onSearchChange: any;
  onSearchClear: any;
}) => {
  const { toast } = useToast();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [coupon, setCoupon] = useState<CouponResponse[] | null>(null);
  const [couponPage, setCouponPage] = useState<CouponResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleSearchInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    onSearchChange(newTerm, searchActive);
  };

  const handlePageChange = (newPage: number) => {
    if (couponPage) {
      const nextPageUrl =
        sortOrder === "asc"
          ? couponPage[0].data.links.find((link) => link.label === "next")?.url
          : couponPage[0].data.links.find((link) => link.label === "prev")?.url;

      if (nextPageUrl) {
        const url = new URL(nextPageUrl);
        const pageParam = url.searchParams.get("page");
        setCurrentPage(Number(pageParam));
      }
    }
  };

  const onDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const deleteData = {
        id: id,
      };

      const res = await fetch(`/api/coupons/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        setRefetch(!refetch);
        toast({ className:"bg-green-500 text-white font-semibold", description: "Coupon deleted successfully" });
        setCoupon((prevAttributes) =>
          prevAttributes !== null
            ? prevAttributes.filter((coupon) =>
                coupon.data.data.map((items) => items.id !== id)
              )
            : []
        );
      } else {
        toast({
          description: "Failed to delete the attribute",
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
  const handleCreate = () => {
    router.push("/admin/coupons/add");
  };

  const handleView = (id: number) => {
    router.push(`/admin/coupons/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const PAGE_RANGE_DISPLAY = 3;

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div></div>
        <div className="flex flex-row gap-2">
          <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilterOutline className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-4">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search by Coupon code"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="border text-xs rounded-md p-2 mr-2 w-60 dark:text-gray-300 h-[40px]  "
                />

                <div className="flex flex-row gap-2">
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => {
                      onhandelClick();
                      setIsSearchOpen(false);
                    }}
                  >
                    {/* <AiOutlineSearch className="mr-2 h-4 w-4" /> */}
                    Search
                  </Button>
                  {searchTerm && (
                    <Button
                      className="bg-red-500 text-white"
                      onClick={() => {
                        onSearchClear();
                        setIsSearchOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <a
              className={buttonVariants()}
              onClick={handleCreate}
              style={{ textDecoration: "none", backgroundColor: "white" }}
            >
              <button className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl">
                <LuCircle className="w-5 h-5" />
                <span>Add Coupon</span>
              </button>
            </a>
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coupons </CardTitle>
          <CardDescription>Manage coupons </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" w-full  mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Id</TableHead> */}
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>

                  <TableHead>Status</TableHead>

                  <th className=" text-muted-foreground h-12 px-6 font-medium">
                    Action
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couponData?.data?.data?.map((item: Coupon) => (
                  <TableRow key={item.id}>
                    {/* <TableCell className="font-medium">{item.id}</TableCell> */}
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell> {item.description}</TableCell>
                    <TableCell>
                      {" "}
                      {item.isPercent
                        ? `${item.couponAmount}%`
                        : `$ ${item.couponAmount}`}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isActive === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.isActive === 1 ? "Active" : "Inactive"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu >
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleView(item.id)}
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

                      <AlertDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all
                            </AlertDialogDescription>
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
                          {/* <Button variant="outline" >
                  <MdDelete className="h-4 w-4  text-red-500 hover:text-red-700 transition-colors duration-150"  />
                </Button>   */}
                        </AlertDialogTrigger>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {couponPage?.map((item: CouponResponse) => (
              <div className="pagination">
                <Button
                  variant="outline"
                  size="sm"
                  className="m-2"
                  onClick={() => handlePageChange(item.data.current_page - 1)}
                  disabled={item.data.current_page === 1}
                >
                  Previous
                </Button>
                <span>{`Page ${item.data.current_page} of ${item.data.total}`}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => handlePageChange(item.data.current_page + 1)}
                  disabled={item.data.current_page === item.data.total}
                >
                  Next
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        {couponData?.data?.data?.length === 0 && (
          <div className="max-w-7xl py-8 mx-auto justify-center items-center h-20 text-center ">
            <p className="text-red-500 text-lg font-bold">No results found.</p>
          </div>
        )}
      </Card>
      <div className="flex justify-end items-center mt-6 select-none">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            className={`relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage > 1) handlePreviousClick();
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="">Prev</span>
          </div>

          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
            Page {currentPage} of {totalPages}
          </span>

          <div
            className={`relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage < totalPages) handleNextClick();
            }}
            disabled={currentPage === totalPages}
          >
            <span className="">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </nav>
      </div>

 
    </div>
  );
};
export default RootCoupon;
