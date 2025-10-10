"use client";
import React, { useEffect, useState } from "react";
import RootGeneral from "./RootGeneral";
import RootRestrictions from "./RootRestriciton";
import RootLimits from "./RootLimits";
// import Loading from '../../loading';
import { CouponData } from "@/app/_types/coupon-Types/couponShow";
import { Product } from "@/app/_types/products_Type/productType";
const CouponsEdit = ({ params }: { params: { id: string } }) => {
  const [activeTab, setActiveTab] = useState("");
  const [editCouponsData, setEditCouponsData] = useState<
    CouponData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/coupons/show/${id}`;
      setIsLoading(true);
      try {
        const res = await fetch(url, {
          method: "GET",
        });
        const data = await res.json();

        setEditCouponsData(data.data);
        const productIds = data.data.products.map(
          (products: Product) => products
        );
        const excludeProductsIds = data.data.excludeProducts.map(
          (products: Product) => products.id
        );
                const perCoupons = data.data.usageLimitPerCoupon.toString();
        const perCustomer = data.data.usageLimitPerCustomer.toString();
        const couponsIds = data.data.relatedCoupons.map(
          (coupons: Product) => coupons
        );
        const couponsExcludedIds = data.data.excludedCoupons.map(
          (coupons: Product) => coupons
        );
            setFormData({
          id: data.data.id,
          name: data.data.name,
          code: data.data.code,
          isPercent: data.data.isPercent,
          value: data.data.value,
          freeShipping: data.data.freeShipping,
          startDate: data.data.startDate,
          endDate: data.data.endDate,
          isActive: data.data.isActive,
          minimumSpend: data.data.minimumSpend,
          products:productIds||[],
          excludeProducts: excludeProductsIds||[],
          usageLimitPerCoupon: perCoupons,
          usageLimitPerCustomer: perCustomer,
          maxDiscount: data.data.maxDiscount,
          isPublic: data.data.isPublic,
          isBulkOffer: data.data.isBulkOffer,
          applyAutomatically: data.data.applyAutomatically,
          individualUse: data.data.individualUse,
          relatedCoupons: couponsIds,
          excludedCoupons: couponsExcludedIds,
          paymentMethods: [],
          minQuantity: "",
          categories: data.categories || [],
          excludeCategories: data.excludeCategories || [],
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData(params.id);
  }, [params.id, refetch]);

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <>
      <RootGeneral
        editCouponsData={editCouponsData}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default CouponsEdit;
