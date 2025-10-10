"use client"
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
  
    
    TableCell,
  
    
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
  import { Button } from '@/components/ui/button';
  import { FaEye } from "react-icons/fa";

  import ViewOrder from './ViewOrder/page'
import { Order, OrderResponse } from '@/app/_types/order-Types/orderType';
import {
  Dialog,
  DialogContent,

  
  DialogTrigger,
} from "@/components/ui/dialog"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const OrderPage = () => {

    const [orderData,setOrderData]= useState<OrderResponse | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSheetOpens, setIsSheetOpens] = useState(false); 



    const PAGE_RANGE_DISPLAY = 3;

    const toggleCreateDialogs = () => {
      setIsSheetOpens(true);
    };

    const handlePreviousClick = () => {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    };
  
    const handleNextClick = () => {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
    };
  
    const generatePageNumbers = (
      totalPages: number,
      currentPage: number
    ): (number | '...')[] => {
      const pageNumbers: (number | '...')[] = [];
  
      if (totalPages <= PAGE_RANGE_DISPLAY) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        const startPage = Math.max(1, currentPage - PAGE_RANGE_DISPLAY);
        const endPage = Math.min(totalPages, currentPage + PAGE_RANGE_DISPLAY);
  
        if (startPage > 1) {
          pageNumbers.push(1);
          if (startPage > 2) {
            pageNumbers.push('...');
          }
        }
  
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
  
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pageNumbers.push('...');
          }
          pageNumbers.push(totalPages);
        }
      }
  
      return pageNumbers;
    };


    const getOrder = async () => {
        try {
          
          const url = `/api/order?page=${currentPage}`;
    
          const res = await fetch(url, {
            method: 'GET',
          });
          const data = await res.json();
          setOrderData(data);
          setTotalPages(data.data.last_page);
        } catch (error) {
        console.error("Failed to fetch data:", error);

        }
      };
    
      useEffect(() => {
        getOrder();
      }, [currentPage,totalPages]);
    
      

  return (
    <div className='border'>
        <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead >Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Phone Number</TableHead>
          <th className="font-medium text-muted-foreground h-12 text-center ">Action</th>
        </TableRow>
      </TableHeader>
      <TableBody>
       {orderData?.data.data?.map((item:Order)=>(
          <TableRow >
            <TableCell className="font-medium">{item.firstName} {item.lastName}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.companyName}</TableCell>
            <TableCell >{item.phone}</TableCell>
            <TableCell className=" text-center">
            <Dialog>
                  
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <a onClick={toggleCreateDialogs} className=" cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            <FaEye className='ml-20' />
                          </a>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Order</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 
                  {isSheetOpens &&
                    <DialogContent className="max-w-[500px] h-[350px]">
                      <ViewOrder dataId={item.id} />
                    </DialogContent>
                  }
                </Dialog>

               
                </TableCell>
          </TableRow>
      ))}
      </TableBody>
     
    </Table>
    <div className=" flex mt-4 text-left ">
                  <Button
                    variant="outline"
                    size="sm"
                    className="m-2"
                    onClick={handlePreviousClick}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
      
                  <div className="flex items-center gap-4">
                    {generatePageNumbers(totalPages, currentPage).map(
                      (page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === 'number' ? setCurrentPage(page) : null
                          }
                          className={page === currentPage ? 'font-bold' : ''}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={handleNextClick}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
    </div>
  )
}

export default OrderPage