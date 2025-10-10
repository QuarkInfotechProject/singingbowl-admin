"use client";
import { useGlobalContext } from "./_context/context";

import { Button, buttonVariants } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { AddGroup } from "./_components/Addgroup";
import { Edit } from "./_components/Edit";
import Loading from "../category/Loading";
import { ApiResponse, Permission } from "@/app/_types/module_Types/Module_Type";
import { LuCircle } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { BsThreeDots } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Roles = () => {
  const context = useGlobalContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moduleData, setModuleData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/roles/module`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        setModuleData(data.data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching menus:", error);
      }
    };
    fetchModule();
  }, []);

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
              <a
                className={buttonVariants()}
                // onClick={handleCreate}

                style={{ textDecoration: "none", backgroundColor: "white" }}
              >
                <button className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl">
                  <LuCircle className="w-5 h-5" />
                  <span>Add New Group</span>
                </button>
              </a>
            </DialogTrigger>
            <AddGroup setDialogOpen={setDialogOpen} />
          </Dialog>
        </div>
      </div>
      <Card className="w-full  ">
        <div className="flex items-center justify-between  select-none ">
          <CardHeader className="">
            <CardTitle>Group </CardTitle>
            <CardDescription>Manage your group</CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <section>
            <div className=" ">
              <Table className="w-full">
                <TableHeader className="disabled">
                  <TableRow className="">
                    <TableHead className=" text-gray-500 px-4 py-2 font-medium ">
                      Group
                    </TableHead>
                    {/* <TableHead className=" text-gray-500 px-4 py-2 text-center font-medium ">Date</TableHead> */}
                    <TableHead className=" text-gray-500 px-10 py-2 text-center font-medium ">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {context?.state.loading ? (
                    <TableRow className="h-20">
                      <TableCell className="font-medium">
                        <Skeleton className="h-5 w-24" />{" "}
                        {/* Placeholder for name */}
                      </TableCell>

                      {/* <TableCell className="font-medium">
    <Skeleton className="h-5 w-24" /> 
  </TableCell> */}

                      <TableCell className="text-start">
                        <div className="flex items-center space-x-4">
                          {/* Skeleton for Edit icon */}
                          <Skeleton className="h-5 w-5" />

                          {/* Skeleton for Delete icon */}
                          <Skeleton className="h-5 w-5" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : context?.state.data && context?.state.data.length > 0 ? (
                    context?.state.data.map((user) => (
                      <Edit
                        key={user.id}
                        editData={user}
                        moduleData={moduleData}
                      />
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
          </section>
        </CardContent>
      </Card>

      <div className="flex justify-end items-center mt-6 select-none">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            className={`relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              context?.state.current_page === 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handlePrevPage}
            disabled={context?.state.current_page === 1}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="">Prev</span>
          </div>

          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
            Page {context?.state.current_page} of {context?.state.last_page}
          </span>

          <div
            variant="outline"
            className={`relative inline-flex items-center  cursor-pointer  rounded-r-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              context?.state.current_page === context?.state.last_page
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNextPage}
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

export default Roles;
