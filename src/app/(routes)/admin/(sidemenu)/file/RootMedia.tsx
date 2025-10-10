
import React, { useState } from 'react';
import { FileResponse } from '@/app/_types/media_Types/file_Types/fileTypes';
import copy from 'copy-to-clipboard';
import { BsThreeDots } from 'react-icons/bs';
import EditFile from './editDialog/page'
import { useToast } from "@/components/ui/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { FaCopy } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Loading from './Loading';

const RootMedia = ({ fileShowCategory,setRefetch,refetch,
  
}: {  fileShowCategory: FileResponse | null; setRefetch:  React.Dispatch<React.SetStateAction<boolean>>;
  refetch:  boolean; }) => {



  const { toast } = useToast()
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});
  const [showToast, setShowToast] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);
  const [isDailogOpen,setIsDailogOpen]= useState(false);


  
  const toggleDropdown = (itemId:number) => {
    const updatedStates = { ...dropdownStates, [itemId]: !dropdownStates[itemId] };
    setDropdownStates(updatedStates);
  };
 

  const handleCopyUrl = (url: string) => {
    try {
      copy(url);
      showCopyToast();
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
    }
  };

  const showCopyToast = () => {
    toast({ description: "URL copied" });
    setShowToast(true);
    setTimeout(() => { setShowToast(false); }, 2000);
  };

  // const handleCopyUrl = (url: string) => {
  //   navigator.clipboard.writeText(url)
  //     .then(() => {
  //       toast({
          
  //         description: "URL copied ",
          
  //       });
  //       setShowToast(true);
  //       setTimeout(() => {
  //         setShowToast(false); 
  //       }, 2000); 
  //     })
  //     .catch((error) => {
  //       console.error('Failed to copy URL to clipboard:', error);
  //     });
  // };




  const onDeletes = async (id: number) => {
    setIsLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/media/delete`, {
        method: 'POST',
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();
        setRefetch(true);

        toast({ description: `${data.message}` });
      } else {
        toast({
          description: 'Failed to delete the category',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: `${error}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      
  };
}
 
  const toggleCreateDialog =()=>{
    setIsDailogOpen(true);
  }

  const renderData =  fileShowCategory?.data?.data ;
  return (
   
    <div className="grid grid-cols-5 gap-y-4 p-4 gap-x-6  mt-4 ml-4 mb-4  overflow-x-auto select-none h-96">

  
      {renderData?.map((item) => (
        <div key={item.id} className="relative">
          <div className="relative">
            <img
              src={item.thumbnailUrl}
              alt="images"
              width={110}
              height={110}
              className="items-center h-[110px] w-[110px] mx-auto  justify-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100 rounded-sm ">
              <div className="flex items-center justify-center  h-full">
              
                <button
                  className="text-white text-[13px] flex mt-16 items-center gap-3  px-3 py-1 rounded  hover:bg-gray-950 "
                  onClick={() => handleCopyUrl(item.imageUrl)} 
                >
                  <FaCopy  />
                  Copy Url
                </button>
              </div>
         
              <BsThreeDots
                className="cursor-pointer text-2xl text-white text-md top-0 right-0 absolute"
                onClick={() => toggleDropdown(item?.id)}
              />
            
              {dropdownStates[item.id] && (
                <div className="absolute z-10 bg-white divide-y divide-gray-100 top-5 right-0 shadow dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                    <Dialog   isOpen={isDailogOpen} onClose={() => setIsDailogOpen(false)} >
  <DialogTrigger asChild>
  <a  onClick={toggleCreateDialog}
                        
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit
                      </a>
      
        
    </DialogTrigger>
    {isDailogOpen &&
  <DialogContent className="max-w-[800px]  h-[500px]" >
   <EditFile setIsDailogOpen={setIsDailogOpen} dataId={item.id} setRefetch ={setRefetch}/>
  </DialogContent>
  }
</Dialog>
                     
                    </li>
                    <li>
                      <AlertDialog>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete the file?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='bg-red-500 hover:bg-red-600 text-white hover:text-white'>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='bg-green-500 hover:bg-green-600' onClick={() => onDeletes(item.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        <AlertDialogTrigger>
                          <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            Delete
                          </a>
                        </AlertDialogTrigger>
                      </AlertDialog>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-2 flex flex-col text-center  overflow-hidden dark:bg-gray-950">
            <span className="text-center dark:text-white text-sm ">{item.fileName}</span>
            <span className="text-center dark:text-gray-600 text-[11px] ">
              {item.width} x {item.height}
            </span>
          </div>
        </div>
      ))}
   
 
    
    </div>
     
  );
};

export default RootMedia;