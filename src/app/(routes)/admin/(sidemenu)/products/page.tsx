"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "./(context)/context";
import { useToast } from "@/components/ui/use-toast";
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { LuCircle } from "react-icons/lu";
import { IoFilterOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clipboard, Copy } from "lucide-react";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import ShowQuickedit from "./(pages)/quickedit/page";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import axios from "axios";

const UsersAndGroups = () => {
  const context = useGlobalContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSkuQuery, setIsSkuQuery] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "name" |"date" |"">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">("desc");
  const [productsActive, setProductsActive] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quickeditId, setquickeditId] = useState();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [quickEdits, setQuickEdits] = useState(false);

  useEffect(() => {
    context?.getData({
      [isSkuQuery ? "querySku" : "queryName"]: searchTerm,
      sortBy: sortBy as "price" | "name" | undefined,
      sortDirection: sortDirection as "asc" | "desc" | undefined,
      status: productsActive,
      page: 1 
    });
    setQuickEdits(false);
  }, [quickEdits]);

  const handlePaginationChange = (page: number) => {
    context?.getData({
      [isSkuQuery ? "querySku" : "queryName"]: searchTerm,
      sortBy: sortBy as "price" | "name" | undefined,
      sortDirection: sortDirection as "asc" | "desc" | undefined,
      status: productsActive,
      page,
    });
  };

  const handleEdit = (id:any) => {
    router.push(`/admin/products/edit/${id}`);
  };
  const handleStatusChange = async (uuid, currentStatus) => {
    try {
      const res = await clientSideFetch({
        url: "/products/change-status",
        method: "post",
        body: { uuid },
        toast,
        debug: true,
      });

      if (res && res.status === 200) {
        toast({
          description: res.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        context?.getData({
          [isSkuQuery ? "querySku" : "queryName"]: searchTerm,
          sortBy,
          sortDirection,
          status: productsActive,
        });
      } else {
        throw new Error(res?.data?.error ?? "An unknown error occurred.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error?.response?.data?.error,
          variant: "destructive",
        });
      } else {
        toast({
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteClick = (id:any) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const getImageUrl = (item:any) => {
    try {
      if (!item) return "/images/empty.jpg"; // Replace with your default image path

      if (item.variantCount !== 0 && item.files) {
        return item.files;
      }

      if (Array.isArray(item.files) && item.files.length > 0) {
        return item.files[0]?.imageUrl || "/images/empty.jpg";
      }

      return "/images/empty.jpg";
    } catch (error) {
      console.error("Error getting image URL:", error);
      return "/images/empty.jpg";
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm);
    setSortBy(sortBy);
    setSortDirection(sortDirection);
    setIsSkuQuery(isSkuQuery);
    setProductsActive(productsActive);
    setIsSearchOpen(false);

    context?.getData({
      [isSkuQuery ? "querySku" : "queryName"]: searchTerm,
      sortBy: sortBy as "price" | "name" |"date"| undefined,
      sortDirection: sortDirection as "asc" | "desc" | undefined,
      status: productsActive,
      page: 1 
    });
  };

  // Function to handle clear
  const handleClear = () => {
    // Clear actual states
    setSearchTerm("");
    setSortBy("");
    setSortDirection("");
    setIsSkuQuery(false);
    setProductsActive(true);

    // Trigger search with cleared values
    context?.getData({
      queryName: "",
      sortBy: "name",
      sortDirection: "desc",
      status: true,
      page: 1 // Reset to page 1 when clearing filters
    });
  };

  const renderProductImage = (item) => {
    return (
      <div className="relative h-20 w-20">
        {/* Add error boundary for image loading */}
        <Image
          className="h-20 w-20 object-cover rounded-lg p-1 flex justify-center items-center"
          src={getImageUrl(item)}
          height={80}
          width={80}
          alt={item?.name || "Product image"}
          onError={(e) => {
            e.target.src = "/images/empty.jpg"; // Replace with your fallback image
          }}
          priority={false}
        />
      </div>
    );
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      sortBy !== "" ||
      sortDirection !== "" ||
      isSkuQuery !== false ||
      productsActive !== true
    );
  };

  const handleClone = (id) => {
    router.push(`/admin/products/copy/${id}`);
  };

  const handelShowQuickEdit = (id) => {
    setquickeditId(id);
    setIsSheetOpen(true);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnd = async (result) => {
    const { destination, source } = result;
    if (
      !destination ||
      (source.index === destination.index &&
        source.droppableId === destination.droppableId)
    )
      return;

    // Create a single copy of the items array
    const items = Array.from(context?.state?.listData);

    // Store references to the source and destination items BEFORE reordering
    const sourceItem = items[source.index];
    const destinationItem = items[destination.index];

    // Remove the source item and insert it at the destination
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);

    // Update the context with the reordered items
    // Note: Using a setter method would be better if available
    context.state.listData = items;

    try {
      setIsLoading(true);
      const newData = {
        id: sourceItem?.id,
        sortOrder: destinationItem?.sortOrder,
      };

      const res = await clientSideFetch({
        url: "/products/reorder",
        debug: true,
        method: "post",
        body: newData,
        toast: toast,
      });

      if (res && res.status === 200) {
        toast({
          description: res.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        context?.getData({
          [isSkuQuery ? "querySku" : "queryName"]: searchTerm,
          sortBy,
          sortDirection,
          status: productsActive,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (axios.isAxiosError(error)) {
        toast({
          description: error?.response?.data?.error,
          variant: "destructive",
        });
      } else {
        toast({
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Products
              </CardTitle>
              <CardDescription>Manage products</CardDescription>
            </div>
            <div className="flex space-x-4">
              <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-100"
                  >
                    <IoFilterOutline className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-4">
                  <DropdownMenuLabel>Search Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-4">
                    <Select onValueChange={setSortBy} defaultValue={sortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sort By:</SelectLabel>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={setSortDirection}
                      defaultValue={sortDirection}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Search ${isSkuQuery ? "SKU" : "name"}`}
                    />

                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sku-search"
                          checked={isSkuQuery}
                          onCheckedChange={setIsSkuQuery}
                        />
                        <label
                          htmlFor="sku-search"
                          className="text-sm text-gray-600"
                        >
                          Search by SKU
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-inactive"
                          checked={productsActive}
                          onCheckedChange={setProductsActive}
                        />
                        <label
                          htmlFor="show-inactive"
                          className="text-sm text-gray-600"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 pt-2">
                      <Button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Search
                      </Button>
                      {hasActiveFilters() && (
                        <Button
                          onClick={handleClear}
                          variant="outline"
                          className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link href="/admin/products/add">
                      <LuCircle className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="whitespace-nowrap">Sort Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
              <TableHead className="text-right">Clone</TableHead>
            </TableRow>
          </TableHeader>
          {/*  */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              mode="standard"
              direction="vertical"
              droppableId="droppable-1"
            >
              {(provided) => {
                const { droppableProps, innerRef } = provided;
                return (
                  <TableBody
                    {...droppableProps}
                    ref={innerRef}
                    className="relative"
                  >
                    {context?.state.loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell className="px-10">
                            <Skeleton className="h-8 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell className="px-9">
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-8" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-8" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-8" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : context?.state?.listData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-red-500 text-lg font-bold">
                              No results found.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      context?.state?.listData.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`hover:bg-gray-100 transition-colors ${
                                snapshot.isDragging
                                  ? "bg-slate-200 relative z-50"
                                  : ""
                              }`}
                            >
                              {snapshot.isDragging ? (
                                <div className="flex justify-start items-center mt-1">
                                  <TableCell>
                                    {renderProductImage(item)}
                                  </TableCell>
                                  <TableCell className="font-medium flex justify-center top-9 flex-col">
                                    {item.name}
                                  </TableCell>
                                </div>
                              ) : (
                                <>
                                  <TableCell>
                                    {renderProductImage(item)}
                                  </TableCell>
                                  <div className="group flex flex-col space-y-0 mt-5">
                                    <TableCell className="font-medium flex flex-col">
                                      {item.name}
                                    </TableCell>
                                    <span
                                      onClick={() =>
                                        handelShowQuickEdit(item.id)
                                      }
                                      className={`text-blue-600 px-2 font-semibold cursor-pointer transition-all ease-in-out delay-500 ml-2 underline ${
                                        item.hasVariant
                                          ? "hidden"
                                          : "hidden group-hover:block"
                                      }`}
                                    >
                                      Quick edit
                                    </span>
                                  </div>
                                  <TableCell className="px-10">
                                    {item?.sortOrder}
                                  </TableCell>
                                  <TableCell>
                                    {item.category && item.category.length > 0
                                      ? item.category.join(", ")
                                      : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {item.specialPrice ? (
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold whitespace-nowrap">
                                          Rs {item.specialPrice}
                                        </span>
                                        <span className="line-through whitespace-nowrap text-red-600 text-sm">
                                          Rs {item.originalPrice}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="font-semibold whitespace-nowrap">
                                        Rs {item.originalPrice}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="px-9">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap">
                                    {item.inStock ? "In Stock" : "Out of Stock"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={item.status}
                                        onCheckedChange={() =>
                                          handleStatusChange(
                                            item.id,
                                            item.status
                                          )
                                        }
                                        style={{ transform: "scale(0.6)" }}
                                      />
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                        >
                                          <BsThreeDots className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                          Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="cursor-pointer"
                                          onClick={() => handleEdit(item.id)}
                                        >
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleDeleteClick(item.id)
                                          }
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                  <TableCell
                                    onClick={() => handleClone(item.id)}
                                    className="cursor-pointer group text-right"
                                  >
                                    <Copy
                                      size={19}
                                      className="text-green-500 group-hover:scale-105"
                                    />
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </TableBody>
                );
              }}
            </Droppable>
          </DragDropContext>
        </Table>

        <div className="flex justify-end items-center mt-6 select-none">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              className={`relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${
                context.state.currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (context.state.currentPage === 1) return;
                const newPage = context.state.currentPage - 1;
                handlePaginationChange(newPage < 1 ? 1 : newPage); // Ensure it doesn't go below 1
              }}
              aria-disabled={context.state.currentPage === 1}
              role="button"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="">Prev</span>
            </div>

            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-gray-300 focus:outline-offset-0">
              Page {context.state.currentPage} of {context.state.totalPages}
            </span>

            <div
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${
                context?.state?.currentPage === context?.state?.totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (context?.state?.currentPage !== context?.state?.totalPages) {
                  handlePaginationChange(context?.state?.currentPage + 1);
                }
              }}
            >
              <span className="">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </nav>
        </div>

        <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <DialogTrigger asChild></DialogTrigger>

          {isSheetOpen && (
            <DialogContent className="max-w-[650px] h-[720px]">
              <ShowQuickedit
                setIsSheetOpen={setIsSheetOpen}
                IdData={quickeditId}
                setQuickEdits={setQuickEdits}
              />
            </DialogContent>
          )}
        </Dialog>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <DeleteAlert id={selectedItemId} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DeleteAlert = ({ id }) => {
  const context = useGlobalContext();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await context?.deleteData(id);

      // Show success toast
      toast({
        description: "Product has been deleted successfully",
        variant: "default",
        className: "bg-green-500 text-white",
        duration: 3000,
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Product Deletion</AlertDialogTitle>
      </AlertDialogHeader>
      <p className="py-4">Are you sure you want to delete this product?</p>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white hover:text-white">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-[#5e72e4] hover:bg-[#465ad1]"
          onClick={handleDelete}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default UsersAndGroups;
