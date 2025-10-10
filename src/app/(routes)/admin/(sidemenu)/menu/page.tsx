'use client';

import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import RootMenu from '../menu/RootMenu';
import { useMenu, fetchMenuData } from '../context/contextMenu/context';

const Menu = () => {
  const { state, dispatch } = useMenu();
  const { menuData, loading, refetch } = state;

  // Initial data fetch
  useEffect(() => {
    fetchMenuData(dispatch);
  }, [dispatch]);

  // Handle refetch requests
  useEffect(() => {
    if (refetch) {
      fetchMenuData(dispatch);
    }
  }, [refetch, dispatch]);

  if (loading) {
    return (
      <section className="max-w-[750px]">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-12 h-6" />
        </div>
        <div>
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
        Edit Dynamic Menu
      </h2>
      <RootMenu
        menuData={menuData}
        setRefetch={(value) => dispatch({ type: 'SET_REFETCH', payload: value })}
        refetch={refetch}
        setMenuData={(data) => dispatch({ type: 'SET_MENU_DATA', payload: data })}
        setLoading={(value) => dispatch({ type: 'SET_LOADING', payload: value })}
      />
    </>
  );
};

export default Menu;