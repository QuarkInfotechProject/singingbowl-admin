'use client';

import { useGlobalContext as useGroupContext } from '../roles/_context/context';
import { useEffect,useState } from 'react';



import SwitchPermission from './components/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Menu} from '@/app/_types/menu_Types/menu_mapping_Types';

type MenuData = {
  title: string;
  id: number;
  url:string | null;
  permissionName:string;
}
const AdminMenus = () => {

  const [menuData, setMenuData] = useState<MenuData []| []>([]);
  const [menuMapping, setMenuMapping] = useState<Menu[]| []>([]);
  const [loading, setLoading] = useState(false);

  const groupContext = useGroupContext();
  


  
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/menu/menu-active`);
        const data = await res.json();
        if (data) {
          setMenuData(data.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching menus:', error);
      }
    };

    
    const fetchMenuMapping = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/permissions/menu-mapping`);
        const data = await res.json();
        if (data) {
          setMenuMapping(data.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
       
      }
    };

    fetchMenus();
    fetchMenuMapping();
  }, []);
 

  return (
    <section className="border shadow-sm border-foreground/10 p-4">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-2xl font-semibold">Manage Menus Permissions</h1>
      </div>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Menu Titles</TableHead>
              {groupContext?.state.data.map((item) => {
                
                return <TableHead key={item.id}>{item.name}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
         
          <TableBody>
            {menuData?.map((item:MenuData) => {

          
           
              return (
                <TableRow key={item.id}>
                  <TableCell>
                   
                    {item.title}
                  </TableCell>
                  {groupContext?.state.data.map((group) => {

                   
                 
                     
                      const mapping = menuMapping.find(
                        (menuItem) =>
                          menuItem.groupId === group.id && menuItem.menuId === item.id
                      );
                 
                      const isChecked = !!mapping;
                    const permissionId = mapping ? mapping.permissionId : null;
                      
                      
            
                 
                    
                    return (
                      <TableCell key={group.id}>
                         <SwitchPermission
               checked={isChecked}
              
                groupId={group.id}
                menuId={item.id} 
                permission={item.permissionName}
                permissionId={permissionId}
              />
                      </TableCell>
                    );
                    
                 
                  })}
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default AdminMenus;
