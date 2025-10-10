"use client";
import React, { useEffect, useState } from "react";
import RootGeneral from "./RootGeneral";

const CouponsAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    isPercent: false,
    value: "",
    freeShipping: false,
    startDate: "",
    endDate: "",
    isActive: false,
    minimumSpend: "",
    products: [],
    excludeProducts: [],
    usageLimitPerCoupon: "",
    usageLimitPerCustomer: "",
    maxDiscount: "",
    isPublic: false,
    isBulkOffer: false,
    applyAutomatically: false,
    individualUse: false,
    relatedCoupons: [],
    excludedCoupons: [],
    categories: [],
    excludeCategories: [],

  });
  return (
    <>
      <RootGeneral formData={formData} setFormData={setFormData} />
    </>
  );
};

export default CouponsAdd;
