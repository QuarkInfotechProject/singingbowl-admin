"use client";
import { useGlobalContext } from "./_context/context";
import { useCallback, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { AddGroup } from "./_components/Addgroup";
import { Edit } from "./_components/Edit";
import Loading from "../category/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoFilterOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";
// import Pagination from '@/components/ui/paginationCustom';

const AttributesSetsPage = () => {
  const context = useGlobalContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNextPage = () => {
    const currentPage = context?.state.current_page ?? 1;
    const lastPage = context?.state.last_page ?? 1;
    if (currentPage < lastPage) {
      context?.getData(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    const currentPage = context?.state.current_page ?? 1;
    if (currentPage > 1) {
      context?.getData(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div></div>
        <div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white gap-2">
                <LucidePlusCircle className="w-5 h-5" />
                Add Attribute Set
              </Button>
            </DialogTrigger>
            <AddGroup setDialogOpen={setDialogOpen} />
          </Dialog>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Attribute Set</CardTitle>
          <CardDescription>Manage attribute set</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IoMdAdd className="mr-2 h-4 w-4" /> Add Attribute Sets
                </Button>
              </DialogTrigger>
              <AddGroup setDialogOpen={setDialogOpen} />
            </Dialog> */}

          <div>
            <Table>
              <TableHeader>
                <TableRow className="w-full flex justify-between">
                  {/* <TableHead>Id</TableHead> */}
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Slug</TableHead> */}
                  <TableHead>Action</TableHead>
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
                    <TableCell colSpan={5} className="text-center py-8">
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

          {/* pagination begins */}
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
                  if (context?.state.current_page > 1) handlePrevPage();
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
                disabled={
                  context?.state.current_page === context?.state.last_page
                }
              >
                <span className="">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </nav>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttributesSetsPage;
