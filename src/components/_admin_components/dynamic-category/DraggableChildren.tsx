"use client";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import { CategoryT } from "@/app/_types/category_Types/categoryType";
import { NoChildrenItems } from "./NoChildrenItems";
import ChildrenItems from "./ChildrenItems";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

const DraggableChild = ({
  nestedChild,
  setLoading,
  parentId,
  setEditFormData,
  handleAddClick,
  handleEditClick,
  refetch,
  setRefetch,
}: {
  setEditFormData: React.Dispatch<React.SetStateAction<any | undefined>>;
  nestedChild: CategoryT[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddClick: (id: number) => void;
  handleEditClick: (id: number) => void;
}) => {
  const [reorderNestedData, setReorderNestedData] =
    useState<CategoryT[]>(nestedChild);
  const { toast } = useToast();

  const reorder = (list: CategoryT[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setReorderNestedData(result);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (result.source.index === result.destination?.index) return;

    if (!result.destination) {
      toast({
        description: "Please place the category in the appropriate location.",
        variant: "destructive",
      });
      return;
    }

    reorder(reorderNestedData, result.source.index, result.destination.index);

    try {
      setLoading(true);

      // ✅ Parse the id and parentId from draggableId
      const [idStr, parentIdStr] = result.draggableId.split(":");
      const sortData = {
        id: parseInt(idStr, 10),
        sortOrder: result.destination.index,
        parentId: parseInt(parentIdStr, 10),
      };

      const res = await clientSideFetch({
        url: "/admin/categories/reorder",
        toast,
        method: "post",
        body: sortData,
      });

      if (res?.status === 200) {
        toast({ className: "bg-green-500 text-base text-white font-semibold", description: `${res.data.message}` });
        setRefetch(!refetch);
      }
    } catch (error) {
      toast({ description: `${error}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="category-droppable">
        {(provided) => {
          const { droppableProps, innerRef } = provided;
          return (
            <div {...droppableProps} ref={innerRef} className="ml-12">
              {reorderNestedData?.map((item, index) => {
                return (
                  <Draggable
                    draggableId={`${item.id}:${item.parentId ?? 0}`}
                    index={index}
                    key={item.id}
                  >
                    {(provided) => {
                      const { draggableProps, dragHandleProps, innerRef } =
                        provided;
                      return (
                        <div
                          {...draggableProps}
                          {...dragHandleProps}
                          data-parent-id={item.parentId} // ✅ custom attribute
                          ref={innerRef}
                        >
                          {item.children ? (
                            <div>
                              <ChildrenItems
                                setEditFormData={setEditFormData}
                                parentId={item.parentId}
                                setLoading={setLoading}
                                nestedChild={item.children}
                                refetch={refetch}
                                setRefetch={setRefetch}
                                name={item.name}
                                id={item.id}
                                handleAddClick={handleAddClick}
                                handleEditClick={handleEditClick}
                              />
                            </div>
                          ) : (
                            <div className="ml-14">
                              <NoChildrenItems
                                id={item.id}
                                name={item.name}
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
  );
};

export default DraggableChild;
