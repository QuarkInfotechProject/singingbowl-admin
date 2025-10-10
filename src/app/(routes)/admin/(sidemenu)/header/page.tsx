"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import Edit from "./edit/page";

import { MdDelete } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import AddContent from "./add/page";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  InThePressResponse,
  PressItem,
} from "@/app/_types/inThepress-Types/inThePress";
import { LuCircle } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
// import parse from 'html-react-parser';

const Page = () => {
  const [orderData, setOrderData] = useState<InThePressResponse | null>(null);

  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const { toast } = useToast();

  const toggleCreateDialogs = () => {
    setIsSheetOpens(true);
  };
  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/header/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();

        setRefetch(true);
        toast({ description: `${data.message}`,  className:"bg-green-500 text-white font-semibold"});
      } else {
        toast({
          description: "Failed to delete the category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async () => {
    try {
      setLoading(true);
      const url = `/api/header`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setOrderData(data.data);
      //   setTotalPages(data.data.last_page);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getOrder();
    setRefetch(false);
  }, [refetch]);
  console.log(orderData);

  const onToggleSwitch = async (id: number) => {
    setLoading(true);
    const idData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/header/status`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const data = await res.json();

        toast({ description: `${data.message}`, className:"bg-green-500 text-white font-semibold" });
        setRefetch(true);
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSwitchToggled(true);
    }
  };

  useEffect(() => {
    if (isSwitchToggled) {
      setRefetch((prevRefetch) => !prevRefetch);
      setIsSwitchToggled(false);
    }
  }, [isSwitchToggled, setRefetch]);

  const createMarkup = (content) => {
    return { __html: content };
  };
  return (
    <>
      <div>
        <div className="flex flex-row justify-between">
          <div className="ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={toggleCreateDialog}
                  className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl"
                >
                  <LuCircle className="w-5 h-5" />
                  <span>Add New Header</span>
                </Button>
              </DialogTrigger>

              {isSheetOpen && (
                <DialogContent className="max-w-[800px] h-[500px]">
                  <AddContent
                    setRefetch={setRefetch}
                    setIsSheetOpenss={setIsSheetOpen}
                  />
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
        <div className="border w-full mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Text</TableHead>
                <TableHead> Link</TableHead>

                {/* <TableHead>Status</TableHead> */}
                <th className="font-medium text-muted-foreground h-12 text-center ">
                  Action
                </th>
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-[200px] h-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-32 h-4" />
                    </TableCell>
                    {/* <TableCell>
            <Skeleton className="w-4 h-4 rounded-full" />
          </TableCell> */}
                    <TableCell>
                      <div className="flex gap-3">
                        <Skeleton className="w-8 h-4" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                {orderData?.map((item: PressItem) => (
                  <TableRow className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell className="font-medium text-sm ">
                      {" "}
                      <div
                        dangerouslySetInnerHTML={createMarkup(item.text)}
                      />{" "}
                    </TableCell>
                    <TableCell>{item.link}</TableCell>

                    {/* <TableCell className={`${item.isActive === 1 ? 'text-green-600' : 'text-red-600'}`}><GoDotFill className='w-5 h-5' /></TableCell> */}

                    <TableCell className="  flex gap-3 mt-9">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={Boolean(item.isActive)}
                                onCheckedChange={() => onToggleSwitch(item.id)}
                                className={`text-center mt-2 ${
                                  item.isActive
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                                style={{ transform: "scale(0.6)" }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Status Change</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Dialog>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <a
                                  onClick={toggleCreateDialogs}
                                  className={buttonVariants({
                                    variant: "outline",
                                  })}
                                >
                                  <FaEdit className="text-blue-500 hover:text-blue-700 transition-colors duration-150" />
                                </a>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {isSheetOpens && (
                          <DialogContent className="max-w-[800px] h-[500px]">
                            <Edit
                              dataId={item.id}
                              setIsSheetOpens={setIsSheetOpens}
                              setRefetch={setRefetch}
                            />
                          </DialogContent>
                        )}
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete the data ?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(item?.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>

                        <AlertDialogTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <a
                                    className={buttonVariants({
                                      variant: "outline",
                                    })}
                                  >
                                    <MdDelete className="h-4 w-4   text-red-500 hover:text-red-700 transition-colors duration-150" />
                                  </a>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </AlertDialogTrigger>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </>
  );
};

export default Page;
