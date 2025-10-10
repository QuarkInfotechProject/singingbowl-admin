"use client";

import { useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { useRouter } from "next/navigation";
import DraggableChild from "./DraggableChild";
import { MenuT } from "@/app/_types/menu_Types/menuType";
import Image from "next/image";

interface propType {
  title: string;
  id: number;
  url: string | null;
  icon: string | null;
  menuData: MenuT[];
  setMenuData: any;
  status: number;
  nestedChild: MenuT[];
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChildrenItems = ({
  title,
  url,
  icon,
  id,
  nestedChild,
  status,
  menuData,
  setMenuData,
  refetch,
  setRefetch,
  setLoading,
}: propType) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const iconPath = `/icons/${icon}.svg`;
  return (
    <div className={`${!isVisible && "hidden"}`}>
      <div
        className={`dark:bg-zinc-900  flex mb-2  items-center dark:bg-transparent p-2  rounded cursor-pointer    ${
          isHovered
            ? "hover:bg-gray-600  translate-x-[1px]  translate-y-1 rotate-30 transition duration-200 relative after:absolute after:top-1.5 after:translate-x-[2px] after:-translate-y-2 after:-rotate-30 rounded-md dark:hover:bg-gray-950 "
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (url) {
            router.push(`/admin${url}`);
          } else {
            setIsCollapsed(!isCollapsed);
          }
        }}
      >
        <Image
          src={iconPath}
          alt="images"
          width={20}
          height={20}
          className={`hover:brightness-80  transition duration-300 ${
            isHovered ? "hovered-icon" : ""
          }`}
        />
        <div>
          <a
            className="ml-4 text-sm text-gray-100 font-semibold "
            style={{ userSelect: "none" }}
          >
            {title}
          </a>
        </div>

        <div className="ml-auto ">
          <button className=" ml-4 ">
            {isCollapsed ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
          </button>
        </div>
      </div>

      <div className={`${isCollapsed && "hidden"} ml-8`}>
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
  );
};

export default ChildrenItems;
