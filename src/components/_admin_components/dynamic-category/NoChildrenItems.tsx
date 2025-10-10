
import { IoAdd } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';

interface propTypes {
  name: string;
  id: number;
  handleAddClick: (id:number) => void; 
  handleEditClick: (id:number) => void; 
}
export const NoChildrenItems: React.FC<propTypes>  = ({ name, id, handleAddClick,
  handleEditClick, }: propTypes) => {
  
 
  return (
    <div
      className={` bg-secondary mb-2 flex items-center justify-between rounded pl-4 p-2`}
    >
      
        <div className="text-sm">{name}</div>
        <div className=' flex ml-4'>
                <button
                  title="Add children"
                  className={`p-1 mr-2 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                  onClick={()=>handleAddClick(id)}
                >
                  <IoAdd/>
                </button>
                <button
                  title="Edit"
                  className={`p-1 mr-2 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                  onClick={()=>handleEditClick(id)}
                >
                  <FiEdit  />
                </button>
            </div>
    </div>
  );
};
