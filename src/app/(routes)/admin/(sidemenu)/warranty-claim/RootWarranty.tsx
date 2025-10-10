"use client";

import { useState } from "react";

import { RxCross2 } from "react-icons/rx";

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

import { FaEye } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { AiOutlineSearch } from "react-icons/ai";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ShowData from "./show/page";

import {
  WarrantyClaim,
  WarrantyClaimsResponse,
} from "@/app/_types/warranty-claim/warraty";
import { IoFilterOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

const CorporateOrder = ({
  corporateData,
  setRefetch,
  refetch,
  onChangeClick,
  searchTerm,
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
  setSearchProduct: any;
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState();

  const toggleCreateDialog = (id: any) => {
    setSelectedItemId(id);
    setIsSheetOpen(!isSheetOpen);
  };

  const isSearchFieldFilled = () => {
    return (
      searchEmail !== "" ||
      searchTerm !== "" ||
      searchPhone !== "" ||
      searchProduct !== ""
    );
  };
  const handleClear = async () => {
    setSearchEmail("");
    setSearchTerm("");
    setSearchPhone("");
    setSearchProduct("");
    setIsFiltering(false);
    onChangeClick();
  };

  const formatDate = (dateString: string): string => {
    // Split the string at '@' and take the first part
    const datePart = dateString.split("@")[0];

    // Trim any whitespace
    return datePart.trim();
  };
  return (
    <div className="select-none flex flex-col gap-4 ">
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
            <DropdownMenuContent className="w-60 p-4 relative right-10 ">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border text-xs rounded p-2 mr-2 w-52 dark:text-gray-300 h-[40px]  "
                />
                <input
                  type="text"
                  placeholder="Search by Email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="border text-xs rounded p-2 mr-2 w-52 dark:text-gray-300 h-[40px]  "
                />
                <div className="flex flex-row gap-2">
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => {
                      onChangeClick();
                      setIsSearchOpen(false);
                    }}
                  >
                    {/* <AiOutlineSearch className="mr-2 h-4 w-4" /> */}
                    Search
                  </Button>
                  {isSearchFieldFilled() && (
                    <Button
                      className="bg-red-500 text-white"
                      onClick={() => {
                        handleClear();
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
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Warranty Claim</CardTitle>
          <CardDescription>Manage warranty claim</CardDescription>
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
                  <TableHead className="font-semibold text-gray-800">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Date Submit
                  </TableHead>

                  <TableHead className="text-center text-muted-foreground h-12 px-6  font-semibold text-gray-800">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {corporateData?.data?.map((item: WarrantyClaim) => (
                  <TableRow key={item.id}>
                    {/* <TableCell className="font-medium">{item.id}</TableCell> */}
                    <TableCell className="font-medium">{item.name}</TableCell>

                    <TableCell>{item.email}</TableCell>
                    <TableCell className=" ">
                      {formatDate(item.submittedAt)}
                    </TableCell>

                    <TableCell className="w-20 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                              toggleCreateDialog(item.id);
                            }}
                                                      >
                            view{" "}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <DialogTrigger asChild></DialogTrigger>

                        {isSheetOpen && (
                          <DialogContent className="w-auto  p-3 max-w-[800px]   h-auto">
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
                ))}
              </TableBody>
            </Table>
            {corporateData?.data?.length === 0 && (
              <>
                <div className="max-w-7xl flex justify-center items-center my-8">
                  <p className="font-semibold text-red-500">
                    {" "}
                    No results found.
                  </p>
                </div>
              </>
            )}
            {/* {couponPage?.map((item: CouponResponse) => (
          <div className="pagination">
<Button
  variant="outline"
  size="sm"  
  className='m-2'
onClick={() => handlePageChange(item.data.current_page - 1)} disabled={item.data.current_page === 1}>
  Previous
</Button>
<span>{`Page ${item.data.current_page} of ${item.data.total}`}</span>
<Button
  variant="outline"
  size="sm"
  className='ml-2'
 onClick={() => handlePageChange(item.data.current_page + 1)} disabled={item.data.current_page === item.data.total}>
  Next
</Button>
</div>
  ))} */}
          </div>
        </CardContent>
      </Card>

      {/* )}   */}
    </div>
  );
};
export default CorporateOrder;
