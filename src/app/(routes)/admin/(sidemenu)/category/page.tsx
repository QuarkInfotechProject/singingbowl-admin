'use client';
import React, { useEffect, useState } from 'react';
import { CategoryT } from '@/app/_types/category_Types/categoryType';
import EditForm from '@/components/category-components/EditForm';
import RootCategory from './RootCategory';
import Loading from './Loading';
import AddForm from '@/components/category-components/AddForm';
import { CategoriesData } from '@/app/_types/category_Types/categoryShow';
import { Skeleton } from "@/components/ui/skeleton"

export default function RootLayout() {
  const [editFormData, setEditFormData] = React.useState<
    CategoriesData | undefined
  >();
  const [addFormData, setAddFormData] = React.useState<CategoryT | undefined>();
  const [categoryData, setCategoryData] = React.useState<CategoryT[] | []>([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [refetch, setRefetch] = React.useState(false);
  const [reqId, setReqId] = useState<number | null>(null);
  const [isEditVisisible, setISEditVisible] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    searchable: 0,
    status: 0,
    files: { logo: '', banner: '' },
    url: '',
    parentId: '',
    filterPriceMin:"",
    filterPriceMax:""
  });

  useEffect(() => {
    setLoading(true);
    const getMenus = async () => {
      try {
        const res = await fetch(`/api/category`, {
          method: 'GET',
        });
        const data = await res.json();
        if (data) {
          setCategoryData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    getMenus();
  }, [refetch]);


  if (loading) {
    return <section className="grid grid-rows-2 grid-flow-col">
    <div>
      <div className="absolute flex">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-10 w-52" />
        </div>
        
        <div className="ml-10">
          <div className="w-1/2 p-4">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  </section>;
  }

  const handleAddClickRoot = async () => {
    setReqId(0);
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleAddClick = async (id: number) => {
    const showData = {
      id: id,
    };
    try {
      setShowAddForm(false);
      const res = await fetch(`/api/category/category-add`, {
        method: 'POST',
        body: JSON.stringify(showData),
      });
      const responseData = await res.json();
      console.log('ajishkjsad', responseData);
      setAddFormData(responseData.data);
      
      setReqId(id);
      setShowAddForm(true);
      setISEditVisible(true);
      setShowEditForm(false);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = async (id: number) => {
   
    console.log("id",id)
    try {
      setShowEditForm(false);
      const res = await fetch(`/api/category/category-view/${id}`, {
        method: 'GET',
        // body:JSON.stringify(showData)
      });
      const responseData = await res.json();
      setEditFormData(responseData.data);
      setShowAddForm(false);
      setISEditVisible(true);
      setShowEditForm(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="grid grid-rows-2 grid-flow-col ">
        <div>
          <div className="absolute flex ">
            <RootCategory
              categoryData={categoryData}
              setCategoryData={setCategoryData}
              setLoading={setLoading}
              setEditFormData={setEditFormData}
              handleAddClick={handleAddClick}
              handleEditClick={handleEditClick}
              handleAddClickRoot={handleAddClickRoot}
              refetch={refetch}
              setRefetch={setRefetch}
            />

            <div className=" ml-10">
              {(showAddForm || showEditForm) && (
                <div className="w-1/2 p-4 ">
                  {showAddForm ? (
                    <AddForm
                      parentId={reqId}
                      formData={formData}
                      setFormData={setFormData}
                      addFormData={addFormData}
                      setRefetch={setRefetch}
                    />
                  ) : (
                    isEditVisisible && (
                      <EditForm
                        formData={formData}
                        setFormData={setFormData}
                        editFormData={editFormData}
                        refetch={refetch}
                        setIsEditVisible={setISEditVisible}
                        setRefetch={setRefetch}
                        setLoading={setLoading}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
