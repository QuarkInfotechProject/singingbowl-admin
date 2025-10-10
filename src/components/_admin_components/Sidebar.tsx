"use client";
import Link from "next/link";
import { AiOutlineArrowLeft, AiOutlineMenuUnfold } from "react-icons/ai";

import { Button } from "@/components/ui/button";

import { useState, useEffect, useCallback, useRef } from "react";
// import { usePathname } from 'next/navigation';
import adminRoutes from "@/lib/adminRoutes";
import Loading from "../mediaCenter_components/loading";

import ChildrenItems from "../dynamic-sidebar/ChildrenItems";
import { NoChildrenItems } from "../dynamic-sidebar/NoChildrenItems";
import { usePathname, useRouter } from "next/navigation";

import {
  useMenu,
  fetchMenuData,
} from "../../app/(routes)/admin/(sidemenu)/context/contextActiveMenu/context";

import { MenuT } from "@/app/_types/menu_Types/menuType";
import Image from "next/image";
import Menu from "@/app/(routes)/admin/(sidemenu)/menu/page";
interface SidebarProps {
  menuData: MenuT[] | [];
}
const Sidebar: React.FC<SidebarProps> = ({ menuData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, dispatch } = useMenu();
  const prevDataRef = useRef<string>();
  const isMountedRef = useRef(false);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuUpdate = useCallback(
    (newData: MenuT[]) => {
      const newDataString = JSON.stringify(newData);
      if (newDataString !== prevDataRef.current) {
        prevDataRef.current = newDataString;
        dispatch({ type: "SET_MENU_DATA", payload: newData });
        dispatch({ type: "SET_REFETCH", payload: false });
      }
    },
    [dispatch]
  );

  // Handle loading state
  const handleLoadingState = useCallback(
    (isLoading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: isLoading });
    },
    [dispatch]
  );

  return (
    <>
      <Button
        className={`md:hidden ${
          sidebarOpen && "hidden"
        } absolute left-4 z-10 top-2`}
        onClick={() => setSidebarOpen(true)}
        variant="secondary"
      >
        <AiOutlineMenuUnfold className="text-lg" />
      </Button>
      <aside
        className={`absolute left-0 top-0 z-50 bg-black flex h-screen w-72.5 md:min-w-[230px] flex-col overflow-y-hidden  duration-300 ease-linear transform- lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center  justify-between gap-1 px-6  ">
          <Link
            className="flex items-center justify-center"
            target="_self"
            href={adminRoutes.dashboard}
          >
            <img src="/Singing Bowl logo.png" className="w-full h-28 object-cover" alt="image" />

            <Button
              className="md:hidden"
              variant="secondary"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <AiOutlineArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div
          className="overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <nav className="py-2 text-gray-100 px-4 lg:mt-9 lg:px-6">
            <div>
              <h3 className="mb-4 text-gray-400 ml-4 text-sm font-semibold ">
                MENU
              </h3>
              <div className="relative">
                {/* {loading ? (
                  <Loading/>
                ) : ( */}

                {menuData?.map((item: MenuT) => (
                  <div key={item.id}>
                    {item.children ? (
                      <ChildrenItems
                        title={item.title}
                        url={item.url}
                        id={item.id}
                        menuData={menuData}
                        setMenuData={handleMenuUpdate}
                        status={item.status}
                        icon={item.icon}
                        nestedChild={item.children}
                        refetch={refetch}
                        setRefetch={(value) =>
                          dispatch({ type: "SET_REFETCH", payload: value })
                        }
                        setLoading={handleLoadingState}
                      />
                    ) : (
                      <div>
                        <NoChildrenItems
                          title={item.title}
                          id={item.id}
                          status={item.status}
                          url={item.url}
                          icon={item.icon}
                          menuData={menuData}
                          setMenuData={handleMenuUpdate}
                          setLoading={handleLoadingState}
                          setRefetch={(value) =>
                            dispatch({ type: "SET_REFETCH", payload: value })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
