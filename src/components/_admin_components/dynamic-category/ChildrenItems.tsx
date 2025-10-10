"use client";

import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import DraggableChild from "./DraggableChildren";
import { CategoryT } from "@/app/_types/category_Types/categoryType";

interface propType {
  name: string;
  id: number;
  parentId: number|null;
  nestedChild: CategoryT[];
  setEditFormData: React.Dispatch<React.SetStateAction<CategoryT | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddClick: (id: number) => void;
  handleEditClick: (id: number) => void;
}

const ChildrenItems: React.FC<propType> = ({
  name,
  id,
  parentId,
  nestedChild,
  setEditFormData,
  setLoading,
  handleAddClick,
  handleEditClick,
  refetch,
  setRefetch,
}: propType) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="ml-1">
      <div className="grid grid-rows grid-flow-col">
        <div className="w-70 ">
          <div
            className={`dark:bg-zinc-900 bg-zinc-200 flex mb-2 items-center justify-between  rounded pl-4 p-2`}
          >
            <div className="font-medium text-sm flex items-center ">
              <button onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
              </button>
              <p className="ml-4">{name}</p>
            </div>

            <div className=" flex ml-4">
              <button
                title="Add children"
                className={`p-1 mr-2 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                onClick={() => handleAddClick(id)}
              >
                <IoAdd />
              </button>
              <button
                title="Edit"
                className={`p-1 mr-2 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                onClick={() => handleEditClick(id)}
              >
                <FiEdit />
              </button>
            </div>
          </div>
          <div className={`${isCollapsed && "hidden"}`}>
            <DraggableChild
              setEditFormData={setEditFormData}
              refetch={refetch}
              parentId={parentId}
              setRefetch={setRefetch}
              setLoading={setLoading}
              nestedChild={nestedChild}
              handleAddClick={handleAddClick}
              handleEditClick={handleEditClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildrenItems;
