"use client";

import { FiEdit, FiPower } from "react-icons/fi";
import { useEffect, useState, useCallback } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ApiResponse, Post } from "@/app/_types/blog_Types/blogType";
import { MdDelete } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
import { GoDotFill } from "react-icons/go";
import { AiOutlineSearch } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEdit } from "react-icons/fa";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoFilterOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";
const RootBlog = ({
  blogData,
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
  blogData: ApiResponse | undefined;
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
  const [isLoading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (blogData) {
      setLoading(false);
    }
  }, [blogData]);

  const handleSearchInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    onSearchChange(newTerm, searchActive);
  };

  const handleActiveChange = (value) => {
    setSearchActive(value);
    onSearchChange(searchTerm, value);
  };

  const onToggleSwitch = async (id: number) => {
    setLoading(true);
    const idData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/Blog/status`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const data = await res.json();

        toast({ description: `${data.message}` });
        setRefetch(true);
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSwitchToggled(true);
    }
  };

  useEffect(() => {
    if (isSwitchToggled) {
      setRefetch((prevRefetch) => !prevRefetch);
      setIsSwitchToggled(false);
    }
  }, [isSwitchToggled, setRefetch]);

  const onDelete = async (id: string) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/Blog/del`, {
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
      setRefetch(false);
    }
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

  const generatePageNumbers = (
    totalPages: number,
    currentPage: number
  ): (number | "...")[] => {
    const pageNumbers: (number | "...")[] = [];

    if (totalPages <= PAGE_RANGE_DISPLAY) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - PAGE_RANGE_DISPLAY);
      const endPage = Math.min(totalPages, currentPage + PAGE_RANGE_DISPLAY);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handleCreate = () => {
    router.push("/admin/blog/create");
  };
  const handleEdit = (id: string) => {
    router.push(`/admin/blog/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
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
                  placeholder="Search by Title"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="border text-xs rounded-md p-2 mr-2 w-60 dark:text-gray-300 h-[40px]  "
                />

                <Select onValueChange={handleActiveChange}>
                  <SelectTrigger className="w-60">
                    <SelectValue
                      className="text-xs  text-gray-300"
                      placeholder="Search by Status"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>

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
                  {(searchTerm || searchActive) && (
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
                <LucidePlusCircle className="w-5 h-5" />
                <span>Add Blog</span>
              </button>
            </a>
          </div>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Blogs</CardTitle>
          <CardDescription>Manage blogs</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className='mt-3 flex flex-row '>
      <input
        type="text"
        placeholder="Search by Title"
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="border text-xs rounded-md p-2 mr-2 w-60 dark:text-gray-300 h-[40px]  "
      />
       
         <Select onValueChange={handleActiveChange}>
  <SelectTrigger className="w-[180px]">
    <SelectValue className='text-xs  text-gray-300' placeholder="Search by Status" 
      />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Active</SelectItem>
    <SelectItem value="0">Inactive</SelectItem>
  </SelectContent>
</Select>
   
    </div>
    <div className='mt-2 flex flex-row gap-1 ml-4'>
  <button
        className="bg-blue-500 hover:bg-blue-600 hover:text-white py-1 px-3 mt-2 h-[35px] rounded border border-gray-300 dark:border-gray-100  text-white"
        onClick={ onhandelClick}     > 
        <AiOutlineSearch   className="text-lg " />{' '}
      </button>
      {(searchTerm || searchActive) && (
          <button
            className=" bg-red-500 hoverver:bg-red-600 hover:text-white  py-1 px-3 mt-2 h-[35px] rounded border border-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-100 hover:bg-gray-100 text-white"
            onClick={onSearchClear}
          >
            <RxCross2 className="text-xl" />
          </button>
        )}
     
      </div> */}

          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  {/* <TableHead className="ml-7">Status</TableHead> */}
                  <TableHead className="">Status</TableHead>
                  <th className="font-medium text-muted-foreground h-12 text-center ">
                    Action
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogData?.data?.map((item: Post) => (
                  <TableRow>
                    <TableCell className="py-4 px-6">{item.title}</TableCell>
                    {/* <TableCell className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isActive === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.isActive === 1 ? "Active" : "Inactive"}
                      </span>
                    </TableCell> */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={Boolean(item.isActive)}
                                onCheckedChange={() => onToggleSwitch(item.id)}
                                className={`text-center mt-2 ${
                                  item.isActive
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                                style={{ transform: "scale(0.6)" }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>isActive</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleEdit(item.id)}
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
                      <div className="flex items-center justify-center space-x-4">
                        {/*             
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div >
                            <Link
                              className={buttonVariants({ variant: 'outline' })}
                              href={`/admin/blog/edit/${item.id}`}
                            >
                              <FaEdit className="h-4 w-4 text-blue-500 hover:text-blue-700 transition-colors duration-150" />
                            </Link>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}

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

                          <AlertDialogTrigger></AlertDialogTrigger>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {blogData?.data?.length === 0 && (
              <>
                <div className="max-w-7xl py-8 mx-auto justify-center items-center h-20 text-center ">
                  <p className="text-red-500 text-lg font-bold">
                    No results found.
                  </p>
                </div>
              </>
            )}
          </div>

          {/*  */}
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
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
        </CardContent>
      </Card>

      {/* )} */}
    </div>
  );
};
export default RootBlog;
