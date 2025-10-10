"use client";

import RootCoupon from "./RootCoupon";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CouponResponse } from "@/app/_types/coupon-Types/couponType";

const CouponsPage = () => {
  const [couponData, setCouponData] = useState<CouponResponse | null>(null);

  const [refetch, setRefetch] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchActive, setSearchActive] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  // useEffect(() => {
  //   const getCoupons = async () => {

  //     try {

  //       const res = await fetch(`/api/coupons`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({

  //         }),
  //       });
  //       const data = await res.json();
  //       setCouponData(data);
  //       // setCouponDataExcluded(data);
  //       setTotalPages(data.data.last_page)

  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     }

  //   }
  //   getCoupons();
  // }, [ refetch, currentPage])
  const getCoupons = useCallback(async (couponCode: string) => {
    const Name = { couponCode };
    try {
      setLoading(true);
      const res = await fetch(`/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Name),
      });
      const data = await res.json();
      console.log("Received data:", data);
      if (data) {
        setCouponData(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops Unable to fetch menus",
        description: `${error}`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refetch) {
      getCoupons(searchTerm);
      setRefetch(false);
    }
  }, [refetch, getCoupons, searchTerm, searchActive]);

  const getpagination = async () => {
    try {
      const url = `/api/coupons/coupon-page/${currentPage}`;

      const res = await fetch(url, {
        method: "POST",
      });
      const data = await res.json();
      setCouponData(data);
      setTotalPages(data.data.last_page);
    } catch (error) {}
  };

  useEffect(() => {
    getpagination();
  }, [currentPage, totalPages]);
  const handleSearchChange = (term: string, active: string) => {
    setSearchTerm(term);
    // setSearchActive(active);
  };
  const handleSearchClear = () => {
    setSearchTerm("");
    // setSearchActive('');
    getCoupons("");
  };

  const handleSearchSubmit = () => {
    getCoupons(searchTerm);
  };
  return (
    <>
      <RootCoupon
        couponData={couponData}
        setRefetch={setRefetch}
        refetch={refetch}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setSearchActive={setSearchActive}
        searchActive={searchActive}
        onhandelClick={handleSearchSubmit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
      />
      {/* pagination */}

      {/* <div className=" flex mt-4 text-left ">
 <Button
    variant="outline"
    size="sm"  
    className='m-2'
    onClick={handlePreviousClick}
    disabled={currentPage === 1}>
    Previous
  </Button>
  
  <div className='flex items-center gap-4'>
            {generatePageNumbers(totalPages, currentPage).map((page, index) => (
              <button
                key={index}
                onClick={() => (typeof page === 'number' ? setCurrentPage(page) : null)}
                className={page === currentPage ? 'font-bold' : ''}
              >
                {page}
              </button>
            ))}
          </div>
        <div className='mt-2'>
  <Button
    variant="outline"
    size="sm"
    className='ml-2'
    onClick={handleNextClick}
    disabled={currentPage === totalPages}>
    Next
  </Button>
  </div>
  </div> */}
      {/* end pagination */}
    </>
  );
};
export default CouponsPage;
