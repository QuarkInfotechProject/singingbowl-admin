"use client"
import React, { useCallback, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { FaEye, FaTrash } from "react-icons/fa";
import { Order } from '@/app/_types/orderType/orderType';
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


import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProcessProvider, useActivity,fetchActivity } from '../context/contextActivityLog/context';
import { Transaction } from '@/app/_types/transactiontype/transactionType';
import { IoFilterOutline } from 'react-icons/io5';
import { cn } from "@/lib/utils";
// import RootArtifactOrder from './RootArtifactOrder';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminUserData } from '@/app/_types/adminUser-Types/adminShow';
import { clientSideFetch } from '@/app/_utils/clientSideFetch';
import { Skeleton} from '@/components/ui/skeleton';


const TransactionPage = () => {
  const { state,dispatch  } = useActivity();
  const paymentMethods = ["admin", "Super Admin"];
  const TypeMetyhods = ["Coupon Created", "Coupon Destroyed","Coupon Updated"];
  const shippingCompany = ["None", "Pathao"];
  const { transactionData, currentPage, totalPages } = state;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchName, setSearchName] = useState(''); 
  const [searchShipping, setSearchShipping] = useState(''); 
  const [searchType, setSearchType] = useState('');
  const [searchIp, setSearchIp] = useState('');
  const [searchEnd, setSearchEnd] = useState('');
  const [searchStart, setSearchStart] = useState('');
  const [adminData, setAdminData] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const PAGE_RANGE_DISPLAY = 3;
 

 const filterOrder = transactionData?.orders?.map((item)=>item.id)
  const submitData ={
    orders:filterOrder,
    shippingCompany:searchShipping
  }

  const pages = 1;
  useEffect(() => {
   
    const fetchData = async () => {
      // try {
        
        setLoading(true);
        const res = await clientSideFetch(
          {url:'/users',
          debug:true,
          method:"post",
          // body:{...values},
          toast:toast,
          // handleLoading:handleIsLoading
          }
        )
        // const response = await axios.post(`/api/adminUser?page=${pages}`);
      if(res && res.status === 200){
        setAdminData(res.data.data);
        // toast({description:"Product added successfully."})
        // router.push("/admin/products")
      }
        // toast({
        //   description:"Cannot add product",
        //   variant:"destructive"
        // })
       
      // } catch (err) {
       
      //   setError(err.message);
      // } finally {
        
        setLoading(false);
      
    };

    // Call the fetchData function
    fetchData();
  }, []);


  useEffect(() => {
    fetchActivity(dispatch, currentPage, {
      userName: searchName, 
      activityType: searchType,
      ipAddress: searchIp,
      startDate:searchStart,
      endDate:searchEnd,
    });
  }, [currentPage]);

  

  
  const isSearchFieldFilled = () => searchName || searchType ||searchIp || searchStart || searchEnd ;

  const handleClear = () => {
    // Reset search fields and fetch all transactions again
    setSearchName('');
    setSearchType('');
    setSearchIp("");
    setSearchStart("");
    setSearchEnd("");
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 }); // Reset to first page when clearing filters
      fetchActivity(dispatch, 1, {});
  };
  const handleFilterOrders = () => {
    fetchActivity(dispatch, currentPage, {
        userName: searchName, 
        activityType: searchType,
        ipAddress: searchIp,
        startDate:searchStart,
        endDate:searchEnd,
    
    });
  };


  const handlePreviousClick = () => {
    const newPages = currentPage - 1;
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPages });
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <div>
      </div>
        <div>
   
  <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
         
                <IoFilterOutline  className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4 mr-6">
              <DropdownMenuLabel>Search </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2">
              
 

<select
  value={searchName}
  onChange={(e) => setSearchName(e.target.value)}
  className="input border w-full h-10 rounded-sm  border-blue-500 text-sm "
  
>
<option value="" disabled hidden className=" text-slate-200 font-extralight text-sm">
    Filter by Admin User
  </option>

  {adminData.data?.map((item,index) => (
    <option key={index} value={item.fullName} className='border-blue-500 '>
      {item.fullName}
    </option>
  ))}
</select>
 
                <div className="flex flex-row gap-2">
                  
            <Button
              className="bg-blue-500  border"
              onClick={handleFilterOrders}  
            >
              Search
            </Button>
            {isSearchFieldFilled() && (
              <Button
                className=" bg-red-500  "
                onClick={handleClear}
              >
                Cancel
              
              </Button>
            )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu> 
         
        </div>
      </div>
   
<Card className="w-full">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Details of activity log</CardDescription>
      </CardHeader>

      <CardContent>
   
{/* 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          
<Button onClick={handleFilterOrders} className="mb-6 w-fit">Apply Filters</Button>
        </div>
         */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Ip Address</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Description</TableHead>
        
              </TableRow>
            </TableHeader>
        
             
                    <TableBody>
                      {loading ? (
                        Array(4).fill(null).map((_, index) => (
                          <TableRow key={index}>
                            {[...Array(5)].map((_, i) => (
                              <TableCell key={i}><Skeleton className="h-4 w-24" /></TableCell>
                            ))}
                          </TableRow>
                        ))
                      ): 
                    transactionData?.data?.length > 0 ? (
                      
            transactionData?.data?.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{order.modifierUsername}</TableCell>
                <TableCell>{order.created_at}</TableCell>
                <TableCell>
                  
                    {order.ipAddress}
            
                </TableCell>
                <TableCell>{order.activityType}</TableCell>
          
                <TableCell className='w-96'>
                  

                    {order.description}
                 
                </TableCell>
               
              </TableRow>
            ))
             ):(           <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              <div className="flex flex-col items-center justify-center">
                <p className="text-red-500 text-lg font-bold">
                  No results found.
                </p>
              </div>
            </TableCell>
          </TableRow>
          )}
           
             </TableBody>
             {/* ):(
            
<>
{[...Array(4)].map((_, index) => (
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <Skeleton className="h-4 w-24" /> 
                </TableCell>
                
                <TableCell>
                  <Skeleton className="h-4 w-28" /> 
                </TableCell>
                
                <TableCell>
                  <Skeleton className="h-4 w-20" /> 
                </TableCell>
                
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                
                <TableCell className="w-96">
                  <Skeleton className="h-4 w-full" /> 
                </TableCell>
              </TableRow>
))}
              
              </>
           
          )}
            */}
          </Table>
        </div>
      
      </CardContent>
    </Card>
    <div className="flex justify-end items-center mt-6 select-none">
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <div
           
            className={`relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={()=>{ if (currentPage > 1) handlePreviousClick()}}
            disabled={currentPage === 1}
          >
           
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="">Prev</span>
          </div>
          
          <span className="relative inline-flex items-center px-4 py-2  text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
            Page {currentPage} of {totalPages}
          </span>
          
          <div

            className={`relative inline-flex items-center rounded-r-md px-2 cursor-pointer  py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              if (currentPage < totalPages) handleNextClick();
            }}
            disabled={  currentPage === totalPages}
          >
            <span className="">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </nav>
      </div>
   
    </div>
  )
}

// Wrap the component with the OrderProvider
const TransactionPageWithProviders = () => (
 
    <ProcessProvider>
      <TransactionPage />
    </ProcessProvider>

);

export default TransactionPageWithProviders;
