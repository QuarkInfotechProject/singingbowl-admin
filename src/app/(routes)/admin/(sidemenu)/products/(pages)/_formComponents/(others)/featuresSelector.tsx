"use client";

import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { FeaturesProvider, useFeatures, fetchFeatures } from '@/app/(routes)/admin/(sidemenu)/context/contextFeatures/context';
import { Feature } from '@/app/_types/features-Types/featureType';

type OptionT = {
  value: number;
  label: string;
};

const FeaturesSelects = ({ field }: any) => {
  const { state, dispatch } = useFeatures();
  const { activeDatas } = state;
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<OptionT[]>( []);

  const fetchDatas = useCallback(() => {
    fetchFeatures(dispatch, 1, {});
  }, [dispatch]);

  useEffect(() => {
    fetchDatas();
  }, [fetchDatas]);
  
  useEffect(() => {
    if (activeDatas?.data?.data && field.value) {
      const options = mapDataToOptions(activeDatas.data.data);
      const selectedOpts = options.filter(opt =>field.value ? field.value.includes(opt.value) : false);
      setSelectedOptions(selectedOpts);
    }
  }, [activeDatas, field.value]);

  const mapDataToOptions = (data: Feature[]): OptionT[] => {
    return data.map((item) => ({
      value: item.id,
      label: item.text,
    }));
  };

  const handleChange = (newSelectedOptions: readonly OptionT[]) => {
    setSelectedOptions([...newSelectedOptions]);
    const selectedValues = newSelectedOptions.map(option => option.value);
    field.onChange(selectedValues);
  };

  return (
    <Select
      isDisabled={loading}
      value={selectedOptions}
      onChange={handleChange}
      options={activeDatas?.data?.data ? mapDataToOptions(activeDatas.data.data) : []}
      placeholder="Select Features"
      isMulti
    />
  );
};

const FeaturesSelectorWithProviders = ({ field }: { field: any }) => (
  <FeaturesProvider>
    <FeaturesSelects field={field} />
  </FeaturesProvider>
);

export default FeaturesSelectorWithProviders;