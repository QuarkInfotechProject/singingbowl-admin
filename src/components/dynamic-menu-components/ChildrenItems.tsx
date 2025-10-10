'use client';

import { useEffect, useState } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { Switch } from "@/components/ui/switch"
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import DraggableChild from './DraggableChild';
import { DataT, MenuT } from '@/app/_types/menu_Types/menuType';
import adminRoutes from '@/lib/adminRoutes';
import IconDynamic from '../dynamic-icon/IconDynamic';
import edit from '../../../public/icons/edit.svg';
import remove from '../../../public/icons/delete.svg';

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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

interface propType {
  title: string;
  id: number;
  menuData:MenuT[];
  setMenuData:any;
  status:number;
  nestedChild: MenuT[];
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChildrenItems = ({
  title,
  id,
  nestedChild,
  status,
  menuData,
  setMenuData,
  refetch,
  setRefetch,
  setLoading,
}: propType) => {
  console.log("status of update",  status )
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const deleteData = {
        id: id,
    }
    try {
      const response = await fetch('/api/menu/menu-del', {
        method: 'POST',
        body: JSON.stringify(deleteData),
      });
      const data = await response.json();
      if (data) {
        toast({ description: `${data.message}` });
        setIsVisible(false);
      }
    } catch (error) {
      toast({
        title: 'Oops! Unable to delete',
        variant: 'destructive',
        description: `${error}`,
      });
    }
  };


  const onToggleSwitch = async (id: number) => {
    setLoading(true);
    const updateStatusRecursive = (items: MenuT[], parentId: number | null): MenuT[] => {
     return items.map((item) => {
     
        if (item.id === id) {
          return { ...item, status: !item.status };
        }
  
      
        if (item.children) {
          const updatedChildren = updateStatusRecursive(item.children, item.id);
          return { ...item, children: updatedChildren };
        }
  
        return item;
      });
    };
  
   
    const updatedMenuData = updateStatusRecursive(menuData, null);
    setMenuData(updatedMenuData);

   
    try {
      const res = await fetch(`/api/menu/menu-status`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
  
      if (res.ok) {
        const data = await res.json();
        router.push(adminRoutes.menu);
        toast({ description: `${data.message}` });
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: `${error}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false); 
      setIsSwitchToggled(true); 
    }
  };
  
  
  useEffect(() => {
    if (isSwitchToggled) {
    
      setRefetch(prevRefetch => !prevRefetch); 
      setIsSwitchToggled(false); 
    }
  }, [isSwitchToggled, setRefetch]);
  


  return (
    <div className={`${!isVisible && 'hidden'}`}>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              menus and its children menus from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        <div className="ml-8">
          <div className="dark:bg-zinc-900 bg-zinc-200 flex mb-2 items-center justify-between rounded pl-4 p-2">
            <div className="font-medium text-sm flex items-center">
              <button onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
              </button>
              <p className="ml-4">{title}</p>
            </div>

            <div className="flex items-center justify-between">
           
                <div
                  title="Status"
                 
                >
                       <Switch  checked={Boolean(status)}
                  onCheckedChange={() => onToggleSwitch(id)}
                  className={`text-center mt-2 ${
                   status  ? 'text-red-500' : 'text-green-500'
                  }`}
                  style={{ transform: 'scale(0.6)' }}/>
                </div>
          
            
              {/* <Link href={`/admin/menu/edit/${id}`}>
                <div
                  title="Edit"
                  className="p-1 mr-2  text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                     <IconDynamic icon={edit} />
                  
                </div>
              </Link> */}
              {/* <AlertDialogTrigger
                title="Delete menu and its all sub submenus"
                className="p-1  text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <IconDynamic icon={remove} />
            
              </AlertDialogTrigger> */}
            </div>
          </div>
          <div className={`${isCollapsed && 'hidden'}`}>
            <DraggableChild
              refetch={refetch}
              setRefetch={setRefetch}
              setLoading={setLoading}
              nestedChild={nestedChild}
              menuData={menuData}
              setMenuData={setMenuData}
              droppableId={id}
            />
          </div>
        </div>
      </AlertDialog>
    </div>
  );
};

export default ChildrenItems;
