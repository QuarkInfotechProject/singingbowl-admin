'use client';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import RootMenu from './RootMenu'
// import Loading from './Loading';
import {  MenuT } from '@/app/_types/menu_Types/menuType';
import { Skeleton } from '@/components/ui/skeleton';
interface MenuProps {
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  menuData: MenuT[];
  setMenuData: React.Dispatch<React.SetStateAction<MenuT[]>>;
  loading:boolean;
}
const  Menu: React.FC<MenuProps> =  ({
  refetch,
  setRefetch,
  menuData,
  setMenuData,
  setLoading,
  loading
}) => {
  // const [refetch, setRefetch] = useState(false);
//   const [menuData, setMenuData] = useState<MenuT[] | []>([]);
  console.log("refetch inroot menu",refetch)
  console.log("loading inroot menu",loading)
  // const [loading, setLoading] = useState(false);
//   useEffect(() => {
 
//     const getMenus = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/menu`, {
//           method: 'GET',
//         });
//         const data = await res.json();
//         console.log("dta ins her????????????????????",data)
//         if (data) {
//           setLoading(false);
//           setMenuData(data.data);
//         }

       
//       } catch (error) {
//         setLoading(false);
//         toast({
//           variant: 'destructive',
//           title: 'Oops Unable to fetch menus',
//           description: `${error}`,
//         });
//       }
//     };
//     getMenus();
//   }, [refetch]);
  console.log("menu dtaa of root menu",menuData)
  if (loading) {
    return (
      <section className="max-w-[750px]">
      <div className="flex items-center justify-between mb-4">
        {/* You can add skeletons here if there's content in the header */}
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-12 h-6" />
      </div>
      <div>
        {/* Skeleton items representing the draggable items */}
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="mb-4">
            <Skeleton className="w-full h-10" />
            <div className="ml-8">
              <Skeleton className="w-4/5 h-8" />
            </div>
          </div>
        ))}
      </div>
    </section>
    );
  }
  return (
    <>
      <h2 className="text-xl font-semibold uppercase mb-4">
        Edit Dynamic menu
      </h2>
      <RootMenu
        menuData={menuData}
        setRefetch={setRefetch}
        refetch={refetch}
        setMenuData={setMenuData}
        setLoading={setLoading}
      />
    </>
  );
};

export default Menu;
