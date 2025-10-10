'use client';

import { EmailResponseT, EmailT } from '@/app/_types/email-Types/emailTypes';
import { FiEdit } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';
import { FaEdit } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const RootEmail = ({
  emailData,
}: {
  emailData: EmailResponseT | undefined;
}) => {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter()
  useEffect(() => {
    if (emailData) {
      setLoading(false);
    }
  }, [emailData]);
  const handleEdit = (name:string)=>{
    router.push(`/admin/email-template/edit/${name}`)
  }
  return (
    <Card className="w-full">
    <CardHeader>
      <CardTitle>Email Template </CardTitle>
      <CardDescription>Manage email template</CardDescription>
    </CardHeader>
   <CardContent>
      {isLoading ? (
    <div className="">
    <div className="w-full">
      <div className="border-b">
        {/* Table Header Skeleton */}
        <div className="flex justify-between p-2">
          <Skeleton className="w-24 h-6" /> {/* Name Column */}
          <Skeleton className="w-24 h-6" /> {/* Title Column */}
          <Skeleton className="w-24 h-6 ml-40" /> {/* Action Column */}
        </div>
      </div>

      <div className="space-y-2 p-2">
        {/* Table Row Skeletons */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-between p-2">
            <Skeleton className="w-40 h-6" /> {/* Name Skeleton */}
            <Skeleton className="w-40 h-6" /> {/* Title Skeleton */}
            <Skeleton className="w-10 h-6 ml-40" /> {/* Action Skeleton */}
          </div>
        ))}
      </div>
    </div>
  </div>
      ) : (
        <div className="">
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className='ml-7'>Title</TableHead>
                <th className="ml-40 font-medium text-muted-foreground h-12">Action</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailData?.data.map((item: EmailT) => (
                <TableRow >
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className=''>{item.title}</TableCell>
                  <TableCell className=" text-center">
                  <DropdownMenu>
  <DropdownMenuTrigger><BsThreeDots/> </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <div
                             
                       onClick={()=>handleEdit(item.name)}
                            >
    <DropdownMenuItem className='cursor-pointer'>Edit</DropdownMenuItem>
    </div>
   
  </DropdownMenuContent>
</DropdownMenu>
                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className=" text-center ">
                            <Link
                              className={buttonVariants({ variant: 'outline' })}
                              href={`/admin/email-template/edit/${item.name}`}
                            >
                              <FaEdit className="h-4 w-4 text-blue-500 hover:text-blue-700 transition-colors duration-150" />
                            </Link>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}

                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                        <div className=" ">
                          <Link
                            className={buttonVariants({ variant: 'outline' })}
                            href={`/admin/setting/email/email-view/${item.name}`}
                          >
                            <FaEye className="h-4 w-4  hover:text-blue-600" />
                          </Link>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Detail view</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
  </CardContent>
    </Card>
  );
};
export default RootEmail;
