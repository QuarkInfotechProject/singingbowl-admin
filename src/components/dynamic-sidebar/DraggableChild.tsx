"use client"
import {
    Draggable,
    Droppable,
    DragDropContext,
    DropResult,
  } from 'react-beautiful-dnd';
  import { DataT, MenuT } from '@/app/_types/menu_Types/menuType';
  import { NoChildrenItems } from './NoChildrenItems';
  import ChildrenItems from './ChildrenItems';
  import { useToast } from '@/components/ui/use-toast';
  import { useState } from 'react';
  import axios from 'axios';
  
  const DraggableChild = ({
    nestedChild,
    droppableId,
    menuData,
    setMenuData,
    refetch,
    setRefetch,
    setLoading,
  }: {
    nestedChild: MenuT[];
    droppableId: number;
    menuData:MenuT[];
    setMenuData:any;
  
    refetch: boolean;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [reorderNestedData, setReorderNestedData] =
      useState<MenuT[]>(nestedChild);
    const { toast } = useToast();
  
    const reorder = (list: MenuT[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      setReorderNestedData(result);
    };
    
    const handleDragEnd = async (result: DropResult) => {
      if (result.source.index === result.destination?.index) {
        return;
      } else if (result.destination === null) {
        toast({
          description: 'Please place the menu in the appropriate location.',
          variant: 'destructive',
        });
      } else if (result.destination) {
        reorder(
          reorderNestedData,
          result.source.index - 1,
          result.destination.index - 1
        );
        try {
          setLoading(true);
          const sortData = {
              id: parseInt(result.draggableId, 10),
              sortOrder: result.destination.index,
          };
          console.log("sortData", sortData)
          const { data } = await axios.post('/api/menu/menu-reorder', sortData);
          if (data) {
            toast({ description: `${data.message}` });
            setRefetch(!refetch);
          }
        } catch (error) {
          toast({ description: `${error}`, variant: 'destructive' });
        }
      }
    };
    return (<>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={droppableId?.toString()}>
          {(provided) => {
            const { droppableProps, innerRef } = provided;
            return (
              <div {...droppableProps} ref={innerRef}>
                {reorderNestedData?.map((item) => {
                  return (
                    <Draggable
                      draggableId={item?.id?.toString()}
                      key={item?.id?.toString()}
                      index={item?.sortOrder}
                    >
                      {(provided) => {
                        const { draggableProps, dragHandleProps, innerRef } =
                          provided;
                        return (
                          <div
                            
                            ref={innerRef}
                          >
                            {item.children ? (
                              <ChildrenItems
                                refetch={refetch}
                                setRefetch={setRefetch}
                                setLoading={setLoading}
                                nestedChild={item.children}
                                url={item.url}
                                icon={item.icon}
                                title={item.title}
                                id={item.id}
                                status={item.status}
                                menuData={menuData}
                                setMenuData={setMenuData}
                              />
                            ) : (
                              <div className="ml-3">
                                <NoChildrenItems id={item.id} title={item.title} icon={item.icon} status={item.status} url={item.url}  menuData={menuData}
                               setRefetch={setRefetch}
                                setLoading={setLoading}
                                  setMenuData={setMenuData} />
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
      </>
    );
  };
  
  export default DraggableChild;
  