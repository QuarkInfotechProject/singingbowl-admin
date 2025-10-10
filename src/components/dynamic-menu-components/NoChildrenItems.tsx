import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation'
import { Switch } from '../ui/switch';
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
import { useState } from 'react';
import {MenuT } from '@/app/_types/menu_Types/menuType';

interface propTypes {
  title: string;
  id: number;
  status:number;
  menuData:MenuT[];
  setMenuData:any;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const NoChildrenItems = ({ title, id, menuData,setRefetch,setLoading,
  setMenuData, status }: propTypes) => {
  const [isVisible, setIsVisible] = useState(true);
  const router =useRouter();
  const handleDelete = async (id: number) => {
    const deleteData = {
    
        id: id,

    };
    try {
      const response = await fetch('/api/menu/menu-del', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(deleteData),
      });
      const data = await response.json();
      if (data) {
        toast({ description: `${data.message}` });
        setIsVisible(false);
      }
    } catch (error) {
      toast({ description: `${error}`, variant: 'destructive' });
    }
  };
  const onToggleSwitchs = async (id: number) => {
    setLoading(true);
    const updateStatusRecursive = (items: MenuT[], parentId: number | null):MenuT[] => {
     return  items.map((item) => {
       
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

          body: JSON.stringify({
             id,
            }),
           
        });
        console.log("body of stais", res)
   
        if (res.ok) {
          const data = await res.json();
          router.push(`/admin/menu`);
         
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
      }
    
  };
  return (
    <div
      className={`${
        !isVisible && 'hidden'
      } bg-secondary mb-2 flex items-center justify-between rounded pl-4 p-2`}
    >
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
        <div className="text-sm">{title}</div>
        <div className="flex items-center justify-between">

        <div
                  title="Status"
                 
                >
                       <Switch  checked={Boolean(status)}
                  onCheckedChange={() => onToggleSwitchs(id)}
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
            title="Delete this menu"
            className="p-1  text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <IconDynamic icon={remove}/>
           
          </AlertDialogTrigger> */}
        </div>
      </AlertDialog>
    </div>
  );
};
