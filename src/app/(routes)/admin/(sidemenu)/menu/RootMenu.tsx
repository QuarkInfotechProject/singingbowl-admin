'use client';
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from 'react-beautiful-dnd';
import { NoChildrenItems } from '@/components/dynamic-menu-components/NoChildrenItems';
import {  MenuT } from '@/app/_types/menu_Types/menuType';
import ChildrenItems from '@/components/dynamic-menu-components/ChildrenItems';

import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useMenu, fetchMenuData } from '../context/contextMenu/context';


const RootNav = ({
  setRefetch,
  refetch,
  menuData,
  setMenuData,
  setLoading,
}: {
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  menuData: MenuT[];
  setMenuData: React.Dispatch<React.SetStateAction<MenuT[]>>;
}) => {
  const { state, dispatch } = useMenu();
  const { toast } = useToast();
  const reorder = (list: MenuT[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    dispatch({ type: 'SET_MENU_DATA', payload: result });
    setMenuData(result);
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
      reorder(menuData, result.source.index - 1, result.destination.index - 1);
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        setLoading(true);
        const sortData = {
     
            id: parseInt(result.draggableId, 10),
            sortOrder: result.destination.index,
          }
        
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

  return (
    <section className="max-w-[750px]">
      <div className="flex items-center justify-between mb-4">
       
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ROOT" type="group">
          {(provided) => {
            const { droppableProps, innerRef } = provided;
            return (
              <div {...droppableProps} ref={innerRef}>
                {menuData?.map((item: MenuT) => {
                  return (
                    <Draggable
                      draggableId={item.id.toString()}
                      key={item.id.toString()}
                      index={item.sortOrder}
                    >
                      {(provided) => {
                        const { draggableProps, dragHandleProps, innerRef } =provided;
                        return (
                          <div
                            {...draggableProps}
                            {...dragHandleProps}
                            ref={innerRef}
                          >
                            {item.children ? (
                              <ChildrenItems
                                title={item.title}
                                id={item.id}
                                menuData={menuData}
                                setMenuData={setMenuData}
                                status={item.status}
                                
                                nestedChild={item.children}
                                refetch={refetch}
                                setRefetch={setRefetch}
                                setLoading={setLoading}
                              />
                            ) : (
                              <div className="ml-8">
                                <NoChildrenItems
                                  title={item.title}
                                  id={item.id}
                                  status={item.status}
                               
                                  menuData={menuData}
                                  setMenuData={setMenuData}
                                  setLoading={setLoading}
                                  setRefetch={setRefetch}
                                 
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

export default RootNav;
