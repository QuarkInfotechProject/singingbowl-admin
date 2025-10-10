"use client";

import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { ProcessProvider, useActive, fetchActive } from '@/app/(routes)/admin/(sidemenu)/context/cotextActiveOffer/context';

type FeatureDataT = {
  id: number;
  text: string;
};

type OptionT = {
  value: number;
  label: string;
};

const FeaturesSelect = ({ field }:any) => {
  const { state, dispatch } = useActive();
  const { activeData } = state;
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<OptionT[]>([]);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetchActive(dispatch, {}).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeData?.data && field.value) {
      const options = mapDataToOptions(activeData.data);
      const selectedOpts = options.filter(opt =>field.value ? field.value.includes(opt.value) : false);
      setSelectedOptions(selectedOpts);
    }
  }, [activeData, field.value]);


  const mapDataToOptions = (data: FeatureDataT[]): OptionT[] => {
    return data.map((item) => ({
      value: item.id,
      label: item.text,
    }));
  };

  const handleChange = (newSelectedOptions: OptionT[]) => {
    setSelectedOptions(newSelectedOptions);
    const selectedValues = newSelectedOptions.map(option => option.value);
    field.onChange(selectedValues);
  };

  return (
    <Select
      isDisabled={loading}
      value={selectedOptions}
      onChange={handleChange}
      options={activeData?.data ? mapDataToOptions(activeData.data) : []}
      placeholder="Select Features"
      isMulti
    />
  );
};

const TransactionPageWithProviders = ({ field }: { field: any }) => (
  <ProcessProvider>
    <FeaturesSelect field={field} />
  </ProcessProvider>
);

export default TransactionPageWithProviders;