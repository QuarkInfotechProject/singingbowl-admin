"use client";
import React, { useState, useEffect } from "react";
import RootWarranty from "./RootReview";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";

import { WarrantyClaimsResponse } from "@/app/_types/Reviews-Types/reviews";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Reviewspage = () => {
  const [corporateData, setCorporateData] =
    useState<WarrantyClaimsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchPhone, setSearchPhone] = useState<string>("");
  const [searchProduct, setSearchProduct] = useState<string>("");

  const [isFiltering, setIsFiltering] = useState(false);
  const { toast } = useToast();

  const PAGE_RANGE_DISPLAY = 3;

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
  ): (number | "...")[] => {
    const pageNumbers: (number | "...")[] = [];

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
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const getMenus = async () => {
    const dataSubmit = isFiltering
      ? {
          type: searchType,
          isApproved: searchTerm,
          rating: searchPhone,
          productName: searchProduct,
        }
      : {
          type: searchType,
          isApproved: searchTerm,
          rating: searchPhone,
          productName: searchProduct,
        };

    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?page=${currentPage}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSubmit),
      });
      const data = await res.json();
      setIsFiltering(true);
      setTotalPages(data.data.last_page);
      setLoading(false);
      setCorporateData(data.data);
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Oops Unable to fetch menus",
        description: `${error}`,
      });
    }
  };

  useEffect(() => {
    getMenus();
    setRefetch(false);
  }, [currentPage, totalPages, refetch, isFiltering]);
  return (
    <div>
      <RootWarranty
        corporateData={corporateData}
        setRefetch={setRefetch}
        refetch={refetch}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setSearchEmail={setSearchEmail}
        searchType={searchType}
        setSearchType={setSearchType}
        searchEmail={searchEmail}
        setSearchPhone={setSearchPhone}
        setSearchProduct={setSearchProduct}
        searchProduct={searchProduct}
        searchPhone={searchPhone}
        onChangeClick={getMenus}
        setIsFiltering={setIsFiltering}
      />

      <div className="flex justify-end items-center mt-6 select-none">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            className={`relative inline-flex items-center rounded-l-md cursor-pointer px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage > 1) handlePreviousClick();
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="">Prev</span>
          </div>

          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
            Page {currentPage} of {totalPages}
          </span>

          <div
            className={`relative inline-flex cursor-pointer  items-center rounded-r-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage < totalPages) handleNextClick();
            }}
            disabled={currentPage === totalPages}
          >
            <span className="">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </nav>
      </div>
      {/* <div className=" flex mt-4 text-left ">
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
                </div> */}
    </div>
  );
};

export default Reviewspage;
