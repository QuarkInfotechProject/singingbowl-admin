"use client";

import React, { useState, useRef } from "react";
import { TrendingRootData } from "./page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, MoreHorizontal, Plus, GripVertical, CircleDotIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";
import AddTrendingCategorypage from "./add/page";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@/components/media/useQuery";
// Properly implemented getTrendingCategory function that returns data
const getTrendingCategory = async () => {
  const response = await clientSideFetch({
    url: "/trending-categories",
    method: "get",
    toast: "skip",
  });

  if (response?.status === 200) {
    return response.data.data;
  }

  throw new Error("Failed to fetch trending categories");
};
const RootLayout = ({
  trendingCategory,
}: {
  trendingCategory: TrendingRootData[];
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TrendingRootData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] =
    useState<TrendingRootData[]>(trendingCategory);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Use React Query for data fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trendingCategories"],
    queryFn: getTrendingCategory,
    initialData: trendingCategory, // Use server-side props as initial data
    refetchOnWindowFocus: false,
  });
  // Use data from React Query or fallback to initial data
  const UpdateTrendingCategories: TrendingRootData[] = data || trendingCategory;
  const openDeleteDialog = (item: TrendingRootData) => {
    setItemToDelete(item);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsSubmitting(true);
      const response = await clientSideFetch({
        url: `/trending-categories/destroy/${itemToDelete.id}`,
        method: "post",
        toast: "skip",
      });

      if (response?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["trendingCategories"] });
        toast({
          title: `${response.data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsSubmitting(false);
      setIsAlertOpen(false);
      setItemToDelete(null);
    }
  };

  const toggleCategoryStatus = async (
    id: number,
    currentStatus: number | boolean
  ) => {
    try {
      // Optimistic UI update
      setCategories(
        categories.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isActive: currentStatus ? 0 : 1,
              category: {
                ...item.category,
                isActive: currentStatus ? 0 : 1,
              },
            };
          }
          return item;
        })
      );

      // Send to API
      const newStatus = currentStatus ? 0 : 1;
      const response = await clientSideFetch({
        url: "/trending-categories/update",
        method: "post",
        body: { id, status: newStatus },
        toast: "skip",
      });

      if (response?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["trendingCategories"] });
        toast({
          title: `${response.data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
      }
    } catch (error) {
      // Revert on error
      setCategories(
        categories.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isActive: currentStatus ? 1 : 0,
              category: {
                ...item.category,
                isActive: currentStatus ? 1 : 0,
              },
            };
          }
          return item;
        })
      );
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Update local state with new order
    const reorderedItems = Array.from(categories);
    const [removed] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(destinationIndex, 0, removed);

    // Update sort order for each item
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    setCategories(updatedItems);

    // Prepare data for API update
    const updateData = {
      id: result.draggableId,
      sortOrder: destinationIndex,
    };

    try {
      const response = await clientSideFetch({
        url: "/trending-categories/reorder",
        method: "post",
        body: updateData,
        toast: "skip",
      });

      if (response?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["trendingCategories"] });
        toast({
          title: `${response.data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      // Could revert the order here if needed
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Back and Add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-center items-center">
          <p className="text-2xl font-semibold">Trending Category</p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsDialogOpen(true)}
          className="flex bg-blue-500 hover:bg-blue-500 text-white items-center gap-1"
        >
          <CircleDotIcon className="h-4 w-4" />
          <span>Add Trending Category</span>
        </Button>
      </div>

      {/* Table with Drag and Drop */}
      <div className="p-4 mt-2 border rounded-md bg-white">
        <DragDropContext onDragEnd={onDragEnd}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <Droppable droppableId="categories">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {UpdateTrendingCategories?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <TableCell
                            {...provided.dragHandleProps}
                            className="w-8"
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </TableCell>
                          <TableCell {...provided.dragHandleProps}>
                            <img
                              src={item.category.files.logo.url}
                              alt={item.category.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </TableCell>
                          <TableCell {...provided.dragHandleProps}>
                            {item.category.name}
                          </TableCell>
                          <TableCell {...provided.dragHandleProps}>
                            {item.category.slug}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Switch
                                checked={
                                  item.isActive === 1 || item.isActive === 1
                                }
                                onCheckedChange={() =>
                                  toggleCategoryStatus(
                                    item.id,
                                    item.isActive === 1 || item.isActive === 1
                                  )
                                }
                                id={`active-${item.id}`}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(item)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>

      {/* Alert Dialog for Delete */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete{" "}
              <span className="text-red-600 font-medium">
                {itemToDelete?.category.name}
              </span>
              ?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Modal */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Trending Category</DialogTitle>
          </DialogHeader>
          <AddTrendingCategorypage setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RootLayout;
