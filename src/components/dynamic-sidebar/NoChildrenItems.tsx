import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { MenuT } from "@/app/_types/menu_Types/menuType";
interface propTypes {
  title: string;
  id: number;
  url: string | null;
  icon: string | null;
  status: number;
  menuData: MenuT[];
  setMenuData: any;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const NoChildrenItems = ({
  title,
  id,
  url,
  icon,
  menuData,
  setRefetch,
  setLoading,
  setMenuData,
  status,
}: propTypes) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const iconPath = `/icons/${icon}.svg`;
  const pathname = usePathname();
  const isActiveMenu =
    (pathname === "/admin" && url === "/") || `/admin${url}` === pathname;
  return (
    <div
      className={`${
        isVisible ? "" : "hidden"
      }  transition-all duration-300 ease-in-out `}
      onClick={() => {
        if (url) {
          router.push(`/admin${url}`);
        }
      }}
    >
      <div
        className={`dark:bg-zinc-900  
           ${isActiveMenu ? "bg-gray-500" : ""}
          flex mb-2 items-center dark:bg-transparent p-2 rounded gap-2 cursor-pointer   ${
            isHovered
              ? "hover:bg-gray-600  translate-x-[1px] translate-y-1 rotate-30 transition duration-200 relative after:absolute after:top-1.5 after:translate-x-[2px] after:-translate-y-2 after:-rotate-30 rounded-md text-black dark:hover:bg-gray-950"
              : ""
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="absolute   right-0 w-1 rounded-sm bg-gray-400 dark:bg-gray-600"></div>
        )}

        <Image
          src={iconPath}
          alt="images"
          width={20}
          height={20}
          className={`${isHovered ? "text-black" : "text-white"}`}
        />

        {url ? (
          <Link href={`/admin${url}`}>
            <div
              className="text-sm   text-gray-100 font-semibold"
              style={{ userSelect: "none" }}
            >
              {title}
            </div>
          </Link>
        ) : (
          <div
            className="text-sm  dark:font-semibold text-gray-100 font-semibold"
            style={{ userSelect: "none" }}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
};
