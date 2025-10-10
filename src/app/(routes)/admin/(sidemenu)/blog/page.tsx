'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import RootBlog from './RootBlog';


import { ApiResponse } from '@/app/_types/blog_Types/blogType';

const BlogPage = () => {
  const [refetch, setRefetch] = useState(false);
  const [blogData, setBlogData] = useState<ApiResponse>();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchActive, setSearchActive] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  

  const getMenus = useCallback(async (title: string, isActive: string) => {
    const Name = { title, isActive };

    try {
      setLoading(true);
      const res = await fetch(`/api/Blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Name),
      });
      const data = await res.json();
      if (data) {
        setBlogData(data.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops Unable to fetch menus',
        description: `${error}`,
      });
    } finally {
      setLoading(false);
    }
  }, []);
 

  useEffect(() => {
    if (refetch) {
      getMenus(searchTerm, searchActive);
      setRefetch(false);
    }
  }, [refetch, getMenus, searchTerm, searchActive]);

  const getpagination = async () => {
    try {
      
      const url = `/api/Blog/blog-page/${currentPage}`;

      const res = await fetch(url, {
        method: 'POST',
      });
      const data = await res.json();
      setBlogData(data.data);
      setTotalPages(data.data.last_page);
    } catch (error) {}
  };

  useEffect(() => {
    getpagination();
  }, [currentPage,totalPages]);
  const handleSearchChange = (term: string, active: string) => {
    setSearchTerm(term);
    setSearchActive(active);
   
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setSearchActive('');
    getMenus('', '');
  };

  const handleSearchSubmit = () => {
    getMenus(searchTerm, searchActive);
  };
  
  if (loading) {
    return (
      <div>
        <div className="flex flex-row justify-between mb-4 mt-4">
          <Skeleton className="h-8 w-32 rounded-md" /> 
          <div className="flex">
            <Skeleton className="h-10 w-60 rounded-md mr-2" /> 
            <Skeleton className="h-10 w-44 rounded-md" /> 
          </div>
          <Skeleton className="h-10 w-24 rounded-md" /> 
        </div>

        <div className="rounded-md border">
          <Skeleton className="h-10 w-full" /> 
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-4 px-6">
              <Skeleton className="h-6 w-40" /> 
              <Skeleton className="h-6 w-20" /> 
              <div className="flex space-x-4">
                <Skeleton className="h-6 w-10" /> 
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <Skeleton className="h-8 w-24 rounded-md" /> {/* Pagination skeleton */}
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    );
  }
 
  return (
    <>
      <RootBlog
        blogData={blogData}
        setRefetch={setRefetch}
        refetch={refetch}
        setSearchTerm={setSearchTerm}
        searchTerm = {searchTerm}
        setSearchActive={setSearchActive}
        searchActive = {searchActive}
        onhandelClick = {handleSearchSubmit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        // setBlogData={setBlogData}
       
      />
    </>
  );
};

export default BlogPage;
