'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ViewUser from '../View/page'
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface ViewButtonProps {
  uuid: string;
}


const ViewButton = ({DataId}: any) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleViews =()=>{
    setIsDialogOpen(true);
  };
  
  return (
    <>
    <Dialog>
              <DialogTrigger asChild>
                <div  className=" text-sm w-32" onClick={toggleViews} >
                 
                View
                </div>
              </DialogTrigger>
              {isDialogOpen && (
                <DialogContent className="bg-gray-50">
                <ViewUser  DataId={DataId} />
                 
                </DialogContent>
              )}
            </Dialog>
            </>
    // <Link href={ `/admin/adminUser/View/${DataId}`}>
      
    //   <div className="relative inline-block">
    //     <TooltipProvider>
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <span>
    //             <button
    //             >
    //               <div >
    //                 <Button variant="outline" >
    //                   <FaEye  className='hover:text-blue-500'/>
    //                   </Button>
                    
    //               </div>
    //             </button>
    //           </span>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           <p>View Admin user</p>
    //         </TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
       
    //   </div>
    //  </Link>
  );
};

export default ViewButton;
