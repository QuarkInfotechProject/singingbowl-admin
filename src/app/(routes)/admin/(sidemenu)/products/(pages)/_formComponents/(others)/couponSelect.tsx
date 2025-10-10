"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Select from "react-select";
import { CouponResponse } from "@/app/_types/coupon-Types/couponType";

type FeatureDataT = {
  id: number;
  code: string;
};

type OptionT = {
  value: number;
  label: string;
};

const CouponSelect = ({ field }: any) => {
  const [loading, setLoading] = useState(false);
  const [couponData, setCouponData] = useState<CouponResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<OptionT[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadDone = useRef(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/coupons/showCode`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCouponData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchCoupons();
    }
  }, [fetchCoupons]);

  useEffect(() => {
    if (couponData?.data && field.value) {
      const options = mapDataToOptions(couponData.data);
      const selectedOpts = options.filter((opt) =>
        field.value ? field.value.includes(opt.value) : false
      );
      setSelectedOptions(selectedOpts);
    }
  }, [couponData, field.value]);

  const mapDataToOptions = (data: FeatureDataT[]): OptionT[] => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map((item) => ({
      value: item.id,
      label: item.code,
    }));
  };

  const handleChange = (newSelectedOptions: OptionT[]) => {
    setSelectedOptions(newSelectedOptions);
    const selectedValues = newSelectedOptions.map((option) => option.value);
    field.onChange(selectedValues);
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <Select
      isMulti
      isClearable
      isSearchable
      isLoading={loading}
      value={selectedOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      options={couponData?.data ? mapDataToOptions(couponData?.data) : []}
      className="w-full"
      placeholder="Search coupons..."
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "No coupons found" : "Type to search coupons"
      }
    />
  );
};

export default CouponSelect;
