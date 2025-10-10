"use client";

import { useCallback, useState } from "react";

import { FaEye } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/components/ui/button";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ShowData from "./show/page";
import { AiOutlineSearch } from "react-icons/ai";

import {
  WarrantyRegistration,
  WarrantyRegistrationsResponse,
} from "@/app/_types/warranty-registrations/warranty";
import { IoFilterOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

const CorporateOrder = ({
  corporateData,
  setRefetch,
  refetch,
  searchTerm,
  setSearchTerm,
  searchEmail,
  setSearchEmail,
  searchPhone,
  setSearchPhone,
  setIsFiltering,
  onChangeClick,
  handleClear,
  onSearch,
}: {
  corporateData: WarrantyRegistrationsResponse | null;
  setRefetch: any;
  refetch: any;
  setSearchTerm: any;
  searchTerm: any;
  searchEmail: any;
  setSearchEmail: any;
  searchPhone: any;
  onChangeClick: () => Promise<void>;
  handleClear: () => void;
  setSearchPhone: any;
  onSearch: any;
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState();

  const toggleCreateDialog = (id:any) => {
    setSelectedItemId(id);
    setIsSheetOpen(true);
  };

  const isSearchFieldFilled = () => {
    return searchEmail !== "" || searchTerm !== "" || searchPhone !== "";
  };

  const formatDate = (dateString: string): string => {
    // Split the string at '@' and take the first part
    const datePart = dateString.split("@")[0];

    // Trim any whitespace
    return datePart.trim();
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
            <DropdownMenuContent className="w-60 p-4 relative right-10">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 ">
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
                      onSearch();
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

      {/* <div className='flex flex-row p-2' >
        
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
      
   
  <Button
        className="bg-blue-500 hover:bg-blue-600 py-1 px-3 mb-2 h-[35px] text-white rounded-lg border border-gray-300   hover:text-white"
        onClick={onSearch}     
      > 
        <AiOutlineSearch         className="  text-xl" />{' '}
      </Button>
      {isSearchFieldFilled() && (
      <Button
        className="bg-red-500 text-white py-1 px-3 rounded-lg ml-2 h-[35px] hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={handleClear}
      >
        <RxCross2 className="text-xl" />
      </Button>
    )}
     
    

 

      
      </div> */}

      {/* {isLoading ? (
        <Loading></Loading>
      ) : ( */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Warranty Registration</CardTitle>
          <CardDescription>Manage warranty Registration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full mx-auto">
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
                {corporateData?.data?.map((item: WarrantyRegistration) => (
                  <TableRow key={item.id}>
                    {/* <TableCell className="font-medium">{item.id}</TableCell> */}
                    <TableCell className="font-medium">{item.name}</TableCell>

                    <TableCell>{item.email}</TableCell>
                    <TableCell className=" ">
                      {formatDate(item.submittedAt)}
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            
                            onClick={() => toggleCreateDialog(item.id)}
                          >
                            view{" "}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <DialogTrigger asChild></DialogTrigger>

                        {isSheetOpen && (
                          <DialogContent className="max-w-[750px] h-[600px]">
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
            {corporateData?.data.length === 0 && (
              <>
                <div className="max-w-7xl flex justify-center items-center my-8">
                  <p className="font-semibold text-red-500">
                    {" "}
                    No results found.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* )}   */}
    </div>
  );
};
export default CorporateOrder;
