"use client";
import { useState } from 'react';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';
import { useGlobalContext } from '../context/context';
import { useToast } from '@/components/ui/use-toast';


const SwitchPermission = ({

  groupId,
  checked: initialChecked,
  permission,
  menuId,
  permissionId,
}: {

  groupId: number;
  checked: boolean;
  permission: string;
  menuId:number;
  permissionId:number | null;
  
}) => {
  const { toast } = useToast();
  const context = useGlobalContext();
  const [checked, setChecked] = useState<boolean>(initialChecked);
  
  
  const handleChangePermission = async (value: boolean) => {
    try {
      context?.handleLoading(true);

      if (value) {
       
        await axios.post('/api/permissions', {
          groupId,
          permission,
          menuId,
        });
        setChecked(true); 
        toast({
          description: 'Permission added successfully',
        });
      } else {
        
        await axios.post('/api/permissions/remove', {
          groupId,
          permissionId,
        });
        setChecked(false); 
        toast({
          description: 'Permission removed successfully',
        });
      }

      context?.getAllData(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: 'destructive',
        });
      }
    } finally {
      context?.handleLoading(false);
    }
  };

  return (
    <>
      <Switch
        checked={checked}
        onCheckedChange={handleChangePermission}
        disabled={context?.state.loading}
      />
    </>
  );
};

export default SwitchPermission;
