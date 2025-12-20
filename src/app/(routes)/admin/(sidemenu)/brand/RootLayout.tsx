"use client";
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import ShowBrand from "./show/page";
import { useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";
import { IoIosArrowBack } from "react-icons/io";
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
import { Switch } from "@/components/ui/switch";
// Type definitions
interface RootLogo {
  id: number;
  url: string;
}

interface RootBanner {
  id: number;
  url: string;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  status: number;
  logo: RootLogo | null;
  banner: RootBanner | null;
}

interface BrandResponse {
  data: Brand[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const RootLayout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [isLoadding, setIsLoadding] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeletedId] = useState<number | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [brandData, setBrandData] = useState<BrandResponse | null>(null);
  const router = useRouter();
  const fetchBrands = async (page: number = 1) => {
    try {
      setIsLoadding(true);
      const response = await clientSideFetch({
        url: "/brand",
        method: "post",
        debug: true,
        toast: toast,
        body: { page },
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message,
          className: "bg-green-500 font-semibold text-white",
        });
        setBrandData(response.data.data);
        setRefetch(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadding(false);
    }
  };
  useEffect(() => {
    fetchBrands();
  }, [refetch]);

  const HandleView = (id: number) => {
    setSelectedId(id);
    setIsSheetOpen(true);
  };
  const handleEdit = (id: number) => {
    router.push(`/admin/brand/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (!id) return;
    setSelectedDeletedId(id);
    setIsDeleteOpen(true);
  };
  // Delete Logic
  const onDelete = async (id: number) => {
    const bodyData = {
      id: id,
    };
    try {
      const response = await clientSideFetch({
        url: "/brand/destroy",
        method: "post",
        toast: toast,
        debug: true,
        body: bodyData,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message.message,
          className: "bg-green-500 font-semibold text-white",
        });
        setRefetch(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Status change Logic
  const handleChangeStatus = async (id: number) => {
    if (!id) return;
    const bodyData = {
      id: id,
    };
    try {
      const response = await clientSideFetch({
        url: "/brand/change-status",
        method: "post",
        toast: toast,
        debug: true,
        body: bodyData,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message,
          className: "bg-green-500 font-semibold text-white",
        });
        setRefetch(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <>
      {isLoadding ? (
        <>
          <LoaddingSkelations />
        </>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">All Brands</h1>
            <button
              onClick={() => router.push("/admin/brand/add")}
              className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl"
            >
              <LucidePlusCircle className="w-5 h-5" />
              <span>Add Brand</span>
            </button>
          </div>
          <div className="mt-7 border rounded-md">
            <Table>
              <TableHeader className="py-5">
                <TableRow>
                  <TableHead className="whitespace-normal">
                    Logo Image
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Banner Image
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Slug</TableHead>

                  <TableHead className="whitespace-nowrap">Status</TableHead>

                  <TableHead className="whitespace-nowrap text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brandData?.data?.map((brand: Brand, index: number) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      {brand?.logo?.url ? (
                        <Image
                          alt={brand?.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-full p-1"
                          src={brand.logo.url}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                          No Logo
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {brand?.banner?.url ? (
                        <Image
                          alt={brand?.name}
                          width={100}
                          height={100}
                          className="h-20 w-20 object-cover rounded-full p-1"
                          src={brand.banner.url}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                          No Banner
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {brand.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {brand.slug}
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={Boolean(brand.status)}
                        onCheckedChange={() => handleChangeStatus(brand.id as number)}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <BsThreeDots className="border-none outline-none text-xl" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => handleEdit(brand.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => HandleView(brand.id)}
                            >
                              View
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                                onClick={() => handleDelete(brand.id)}
                              >
                                Delete
                              </DropdownMenuItem> */}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <DialogTrigger asChild></DialogTrigger>

            {isSheetOpen && (
              <DialogContent className="min-w-96 p-3    h-auto">
                <ShowBrand id={String(selectedId)} />
              </DialogContent>
            )}
          </Dialog>
        </div>
      )}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the data ?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-500 hover:bg-red-600 text-white mt-4 hover:text-white"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#5e72e4] hover:bg-[#465ad1]"
              onClick={() => {
                if (selectedDeleteId) {
                  onDelete(selectedDeleteId);
                  setIsDeleteOpen(false);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        <AlertDialogTrigger></AlertDialogTrigger>
      </AlertDialog>
      <Paginations
        fetchBrands={fetchBrands}
        current_page={brandData?.current_page ?? 1}
        total={brandData?.total ?? 0}
        per_page={brandData?.per_page ?? 10}
        last_page={brandData?.last_page ?? 1}
      />
    </>
  );
};

export default RootLayout;
const LoaddingSkelations = () => {
  return (
    <>
      <div className="w-full border p-4 rounded-lg animate-pulse">
        {/* Header */}
        <div className="py-4">
          <div className="flex flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center p-1"
              disabled
            >
              <IoIosArrowBack className="h-4 w-4" />
            </Button>
            <div className="h-7 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="mt-4 space-y-6">
          {/* Name and Slug Row */}
          <div className="flex justify-between items-center gap-x-5">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Status and Meta Title Row */}
          <div className="flex justify-between items-center gap-x-5">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const Paginations = ({
  current_page,
  last_page,
  per_page,
  total,
  fetchBrands,
}: {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  fetchBrands: (newPage: number) => void;
}) => {
  const [page, setPage] = useState(current_page);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > last_page) return;
    setPage(newPage);
    fetchBrands(newPage);
  };

  return (
    <div className="flex justify-end items-center mt-6 select-none">
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {/* Previous Button */}
        <div
          className={`relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${current_page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={() => handlePageChange(current_page - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="">Prev</span>
        </div>

        {/* Page Info */}
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-gray-300 focus:outline-offset-0">
          Page {current_page} of {last_page}
        </span>

        {/* Next Button */}
        <div
          className={`relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${current_page === last_page ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={() => handlePageChange(current_page + 1)}
        >
          <span className="">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </nav>
    </div>
  );
};
