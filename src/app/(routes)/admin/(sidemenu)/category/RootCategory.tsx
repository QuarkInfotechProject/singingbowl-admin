"use client";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import { NoChildrenItems } from "@/components/_admin_components/dynamic-category/NoChildrenItems";
import { CategoryT } from "@/app/_types/category_Types/categoryType";
import ChildrenItems from "@/components/_admin_components/dynamic-category/ChildrenItems";
import { Button } from "@/components/ui/button";
import { LuCircle } from "react-icons/lu";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { Toast } from "@/components/ui/toast";
import { Item } from "@radix-ui/react-dropdown-menu";

const RootCategory = ({
  categoryData,
  setCategoryData,
  setLoading,
  setEditFormData,
  handleAddClick,
  handleEditClick,
  handleAddClickRoot,
  setRefetch,
  refetch,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEditFormData: React.Dispatch<React.SetStateAction<any | undefined>>;
  categoryData: CategoryT[];
  setCategoryData: React.Dispatch<React.SetStateAction<CategoryT[]>>;
  handleAddClick: (id: number) => void;
  handleEditClick: (id: number) => Promise<void>;
  handleAddClickRoot: () => void;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}) => {
  const { toast } = useToast();

  const reorder = (list: CategoryT[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setCategoryData(result);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (result.source.index === result.destination?.index) {
      return;
    } else if (result.destination === null) {
      toast({
        description: "Please place the category in the appropriate location.",
        variant: "destructive",
      });
    } else if (result.destination) {
      reorder(
        categoryData,
        result.source.index - 1,
        result.destination.index - 1
      );
      try {
        setLoading(true);
        // ✅ Parse the id and parentId from draggableId
        const [idStr, parentIdStr] = result.draggableId.split(":");
        const sortData = {
          id: parseInt(idStr, 10),
          sortOrder: result.destination.index,
          parentId: parseInt(parentIdStr, 10) ?? 0,
        };

        const res = await clientSideFetch({
          url: "/categories/reorder",
          toast,
          method: "post",
          body: sortData,
        });
        if (res?.status === 200) {
          toast({ className: "bg-green-500 text-base font-semibold ", description: `${res.data.message}` });
          setRefetch(!refetch);
        }
      } catch (error) {
        toast({ description: `${error}`, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="min-w-[400px]">
      <div className="flex items-center justify-between gap-14 mb-6">
        <p className="font-bold text-2xl">Categories</p>
      </div>
      <Button
        className="mb-4 gap-2 text-white hover:text-white bg-[#5e72e4] hover:bg-[#465ad1]"
        variant="outline"
        onClick={handleAddClickRoot}
      >
        <LuCircle className="w-5 h-5" /> Add Root Category
      </Button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ROOT" type="group">
          {(provided) => {
            const { droppableProps, innerRef } = provided;
            return (
              <div {...droppableProps} ref={innerRef}>
                {categoryData.map((category, index) => {
                  return (
                    <Draggable
                      draggableId={`${category.id}:${category.parentId ?? 0}`}
                      index={index}
                      key={category.id}
                    >
                      {(provided) => {
                        const { draggableProps, dragHandleProps, innerRef } =
                          provided;
                        return (
                          <div
                            {...draggableProps}
                            {...dragHandleProps}
                            data-parent-id={category.parentId} // ✅ custom attribute
                            ref={innerRef}
                          >
                            {category.children ? (
                              <div className="ml-4">
                                <ChildrenItems
                                  setEditFormData={setEditFormData}
                                  parentId={category.parentId}
                                  name={category.name}
                                  id={category.id}
                                  nestedChild={category.children}
                                  refetch={refetch}
                                  setRefetch={setRefetch}
                                  setLoading={setLoading}
                                  handleAddClick={handleAddClick}
                                  handleEditClick={handleEditClick}
                                />
                              </div>
                            ) : (
                              <div className="ml-6">
                                <NoChildrenItems
                                  name={category.name}
                                  id={category.id}
                                  handleAddClick={handleAddClick}
                                  handleEditClick={handleEditClick}
                                />
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default RootCategory;
