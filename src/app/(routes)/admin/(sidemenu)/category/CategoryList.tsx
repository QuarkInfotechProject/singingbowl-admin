"use client"
import React, { useEffect, useState } from 'react'
import RootCategory from './RootCategory'
import Loading from './Loading';
import { CategoryT } from '@/app/_types/category_Types/categoryType';
import { toast } from '@/components/ui/use-toast';

interface RootCategoryProps {
  categoryData: CategoryT[]; 
  setCategoryData: React.Dispatch<React.SetStateAction<CategoryT[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEditFormData: React.Dispatch<React.SetStateAction<CategoryT | undefined>>;
  handleAddClick: () => void;
  handleAddClickRoot: () => void;
  handleEditClick: (id: number) => Promise<void>;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}
const CategoryList: React.FC<RootCategoryProps> = ({
  handleAddClick,
  handleEditClick,
  setRefetch,
  handleAddClickRoot,
  refetch
})  => {
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState<CategoryT[] | []>([]);
    useEffect(() => {
        setLoading(true);
        const getMenus = async () => {
          try {
            const res = await fetch(`/api/category`, {
              method: 'GET',
            });
            const data = await res.json();
            if (data) {
              setLoading(false);
              setCategoryData(data.data);
            }
        } catch (error) {
            setLoading(false);
            toast({
              variant: 'destructive',
              title: 'Oops Unable to fetch menus',
              description: `${error}`,
            });
          }
        };
        getMenus();
      }, []);
if (loading) {
    return <Loading />;
  }


  return (
    <RootCategory
    categoryData={categoryData}
    setCategoryData={setCategoryData}
    setLoading={setLoading}
    setEditFormData={()=>{}}
    handleAddClick={handleAddClick}
    handleEditClick={handleEditClick}
    handleAddClickRoot={handleAddClickRoot}
    refetch={refetch}   
    setRefetch={setRefetch} 
    
    />
  )
}

export default CategoryList