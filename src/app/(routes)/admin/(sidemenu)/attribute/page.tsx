"use client";
import { useGlobalContext } from "./_context/context";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Edit } from "./_components/Edit";
import Loading from "../category/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineClear } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoFilterOutline } from "react-icons/io5";
import { LuCircle } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

// import Pagination from '@/components/ui/paginationCustom';

const AttributesPage = () => {
  const context = useGlobalContext();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  

  const [searchTerm, setSearchTerm] = useState("");

  const handleNextPage = () => {
    const nextPage = (context?.state.current_page || 1) + 1;
    fetchData(nextPage);
    router.push(`/admin/attribute?page=${nextPage}`);
  };

  // Function to handle clicking the "Previous" button
  const handlePreviousPage = () => {
    const previousPage = Math.max((context?.state.current_page || 1) - 1, 1);
    fetchData(previousPage);
    router.push(`/admin/attribute?page=${previousPage}`);
  };

  const fetchData = (page: number) => {
    context?.getData(page, searchTerm);
  };

  useEffect(() => {
    console.log("First pagination ", context?.state.current_page);
    console.log("Second pagination ", context?.state.last_page);
  }, [context?.state.current_page, context?.state.last_page]);
  const handleSearch = () => {
    context?.getData(1, searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    context?.getData(1);
  };

  const handleAdd = () => {
    router.push(`/admin/attribute/create`);
  };
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div></div>
        <div className="flex flex-row gap-4">
          <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilterOutline className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4">
              <DropdownMenuLabel>Search</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <Input
                  type="text"
                  className="w-full"
                  placeholder="Search by Attribute Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-row gap-2">
                  <Button
                    className="bg-blue-500   border"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  {searchTerm && (
                    <Button className=" bg-red-500  " onClick={handleClear}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleAdd}
            className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white"
          >
            <div className="flex gap-2 items-center p-2">
              <LuCircle className="w-5 h-5" />
              Add Attribute
            </div>
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Attributes</CardTitle>
          <CardDescription>Manage attributes</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Id</TableHead> */}
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Attribute Set</TableHead>

                  {/* <TableHead>Slug</TableHead> */}
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {context?.state.loading ? (
                  <TableRow className="m-6 p-6 h-20">
                    {/* Skeleton loader for loading state */}
                    <TableCell>
                      <Skeleton className="w-full h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-8" />
                    </TableCell>
                  </TableRow>
                ) : context?.state.data && context?.state.data.length > 0 ? (
                  context?.state.data &&
                  context?.state.data.map((user) => (
                    <Edit key={user.id} editData={user} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-red-500 text-lg font-bold">
                          No results found.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end items-center mt-6 select-none">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            className={`relative inline-flex items-center rounded-l-md cursor-pointer px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              context?.state.current_page === 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => {
              if (context?.state.current_page > 1) handlePreviousPage();
            }}
            disabled={context?.state.current_page === 1}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="">Prev</span>
          </div>

          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
            Page {context?.state.current_page} of {context?.state.last_page}
          </span>

          <div
            className={`relative inline-flex cursor-pointer  items-center rounded-r-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              context?.state.current_page === context?.state.last_page
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => {
              if (context?.state.current_page < context?.state.last_page)
                handleNextPage();
            }}
            disabled={context?.state.current_page === context?.state.last_page}
          >
            <span className="">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AttributesPage;
