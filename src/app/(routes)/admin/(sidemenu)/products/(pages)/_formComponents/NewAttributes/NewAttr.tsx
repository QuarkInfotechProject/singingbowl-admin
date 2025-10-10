"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../edit/[uuid]/page";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Plus } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalContext } from "../../../(context)/context";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";

interface Option {
  value: string;
  label: string;
}

const NewAttr = ({
  prevAttributes,
  form,
}: {
  prevAttributes: any[];
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { attributes } = useGlobalContext();
  const { toast } = useToast();
  const [keyCounter, setKeyCounter] = useState(0);
  
  // Update the useState initialization to properly set form values
  const [selectValues, setSelectValues] = useState(() => {
    const initialValues =
      Array.isArray(prevAttributes) && prevAttributes.length > 0
        ? prevAttributes.map((attr, index) => ({
            id: attr.id,
            reactKey: attr.id || `existing-${index}`,
            attributeId: attr.attributeId,
            name: attr.name,
            selectedValues: attr.values || [],
          }))
        : [];

    // Immediately update form values with initial data
    if (initialValues.length > 0) {
      const formData = initialValues.map((item) => ({
        id: item.id === null || item.id === "" ? null : String(item.id),
        attributeId: String(item.attributeId),
        values: item.selectedValues.map((v) =>
          typeof v === "object" ? v.value || v.id : v
        ),
      }));

      // Set the form value immediately during initialization
      setTimeout(() => {
        form.setValue("attributes", formData, { shouldValidate: true });
      }, 0);
    }

    return initialValues;
  });

  const [attributeValues, setAttributeValues] = useState<{
    [key: number]: Option[];
  }>({});
  const [attributeData, setAttributeData] = useState<{
    [key: number]: any;
  }>({});
  const [loadingValues, setLoadingValues] = useState<{
    [key: number]: boolean;
  }>({});
  const [valueLoading, setValueLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [inputValues, setInputValues] = useState<{
    [key: string]: string;
  }>({});
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (initialLoadDone) return;

    const fetchInitialValues = async () => {
      const attributeIdsToFetch = selectValues
        .filter(
          (item) => item.attributeId && !attributeValues[item.attributeId]
        )
        .map((item) => Number(item.attributeId));

      if (attributeIdsToFetch.length > 0) {
        for (const attrId of attributeIdsToFetch) {
          await fetchAttributeDetails(attrId);
        }
      }
      setInitialLoadDone(true);
    };

    if (selectValues.length > 0) {
      fetchInitialValues();
    } else {
      setInitialLoadDone(true);
    }
  }, [selectValues.length, initialLoadDone]);

  const updateFormValues = (newSelectValues: any[]) => {
    const formData = newSelectValues.map((item) => ({
      id: item.id === null || item.id === "" ? null : String(item.id),
      attributeId: String(item.attributeId),
      values: item.selectedValues.map((v: any) =>
        typeof v === "object" ? v.value || v.id : v
      ),
    }));

    // Set the form value and trigger validation
    form.setValue("attributes", formData, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Fetch attribute details with values - modified to support force refresh
  const fetchAttributeDetails = useCallback(
    async (attributeId: number, forceRefresh = false) => {
      if (!attributeId || (!forceRefresh && attributeValues[attributeId])) return;

      setLoadingValues((prev) => ({ ...prev, [attributeId]: true }));

      try {
        const response = await clientSideFetch({
          url: `/attributes/show/${attributeId}`,
          method: "get",
          toast: "skip",
        });
        
        const attr = response?.data?.data;
        if (attr?.values) {
          setAttributeData((prev) => ({ ...prev, [attributeId]: attr }));
          setAttributeValues((prev) => ({
            ...prev,
            [attributeId]: attr.values.map((val: any) => ({
              value: val.id,
              label: val.value,
            })),
          }));
        }
      } catch (error) {
        toast({
          title: "Failed to fetch attribute values",
          className: "bg-red-500 text-white font-semibold",
        });
      } finally {
        setLoadingValues((prev) => ({ ...prev, [attributeId]: false }));
      }
    },
    [toast, attributeValues]
  );

  // Handle creating new value on Enter key - fixed to force refresh
  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent, reactKey: string, attributeId: number) => {
      const inputValue = inputValues[reactKey] || "";
      
      if (event.key !== "Enter" || !inputValue.trim()) return;
      event.preventDefault();

      const options = attributeValues[attributeId] || [];
      const alreadyExists = options.some(
        (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (alreadyExists) {
        toast({
          title: "This value already exists",
          className: "bg-yellow-500 text-white font-semibold",
        });
        return;
      }

      const currentAttributeData = attributeData[attributeId];
      if (!currentAttributeData) return;

      const updatedValues = [
        ...currentAttributeData.values.map((v: any) => v.value),
        inputValue.trim(),
      ];

      try {
        setValueLoading((prev) => ({ ...prev, [reactKey]: true }));
        const updateRes = await clientSideFetch({
          url: "/attributes/update",
          method: "post",
          toast: "skip",
          body: {
            ...currentAttributeData,
            values: updatedValues,
          },
        });

        if (updateRes?.status === 200) {
          toast({
            title: "New value added",
            className: "bg-green-500 text-white font-semibold",
          });
          setInputValues((prev) => ({ ...prev, [reactKey]: "" }));
          
          // Force refresh the attribute details to get the latest values
          await fetchAttributeDetails(attributeId, true);
        }
      } catch {
        toast({
          title: "Error creating new value",
          className: "bg-red-500 text-white font-semibold",
        });
      } finally {
        setValueLoading((prev) => ({ ...prev, [reactKey]: false }));
      }
    },
    [inputValues, attributeValues, attributeData, toast, fetchAttributeDetails]
  );

  const handleAttributeChange = async (
    selectedOption: any,
    reactKey: string
  ) => {
    const newSelectValues = selectValues.map((item) =>
      item.reactKey === reactKey
        ? {
            ...item,
            attributeId: selectedOption?.value || "",
            name: selectedOption?.label || "",
            selectedValues: [],
          }
        : item
    );

    setSelectValues(newSelectValues);
    updateFormValues(newSelectValues);

    if (selectedOption?.value) {
      await fetchAttributeDetails(selectedOption.value);
    }
  };

  const handleValuesChange = (selectedOptions: any[], reactKey: string) => {
    const newSelectValues = selectValues.map((item) =>
      item.reactKey === reactKey
        ? { ...item, selectedValues: selectedOptions || [] }
        : item
    );

    setSelectValues(newSelectValues);
    updateFormValues(newSelectValues);
  };

  const handleInputChange = (inputValue: string, reactKey: string) => {
    setInputValues((prev) => ({ ...prev, [reactKey]: inputValue }));
  };

  const handleDeleteRow = (reactKey: string) => {
    const newSelectValues = selectValues.filter(
      (item) => item.reactKey !== reactKey
    );
    setSelectValues(newSelectValues);
    updateFormValues(newSelectValues);

    if (popoverOpen === reactKey) {
      setPopoverOpen(null);
    }
  };

  const handleAddRow = () => {
    // Generate a unique React key for the new row
    const uniqueReactKey = `new-${Date.now()}-${keyCounter}`;
    setKeyCounter((prev) => prev + 1);

    const newRow = {
      id: null,
      reactKey: uniqueReactKey,
      attributeId: "",
      name: "",
      selectedValues: [],
    };
    const newSelectValues = [...selectValues, newRow];
    setSelectValues(newSelectValues);
    updateFormValues(newSelectValues);
  };

  const getAttributeOptionsForRow = (currentReactKey: string) => {
    const otherSelectedIds = selectValues
      .filter((item) => item.reactKey !== currentReactKey && item.attributeId)
      .map((item) => item.attributeId);

    const available = attributes.filter(
      (attr) => !otherSelectedIds.includes(attr.id)
    );

    return available.map((attr) => ({
      label: attr.name,
      value: attr.id,
    }));
  };

  const getValueOptionsForAttribute = (attributeId: number) => {
    return attributeValues[attributeId] || [];
  };

  const getSelectedValueOptions = useMemo(() => {
    return (selectedValues: any, attributeId: number) => {
      if (!Array.isArray(selectedValues)) return [];
      
      const options = attributeValues[attributeId] || [];
      return selectedValues.map((v: any) => {
        if (v.label && v.value) return v;
        if (typeof v === "string") {
          const matchingValue = options.find((opt: any) => opt.value === v);
          return matchingValue || { label: v, value: v };
        }
        return { label: v.value || v.name || v.label, value: v.id || v.value };
      });
    };
  }, [attributeValues]);

  const getSelectedValuesForKeySpaces = (row: any) => {
    if (!Array.isArray(row.selectedValues)) return [];
    return row.selectedValues.map((v: any) => ({
      label: v.label || v.value || v.name || v,
      value: v.value || v.id || v,
    }));
  };

  const handleSelectSingleKeyValue = (row: any, valueToAdd: string) => {
    const attributeName = row.name;
    const existingKeySpecs = form.getValues("keySpecs") || [];

    const existingKeySpace = existingKeySpecs.find(
      (ks: any) => ks.key === attributeName
    );

    if (existingKeySpace) {
      if (!existingKeySpace.value.includes(valueToAdd)) {
        const updatedKeySpecs = existingKeySpecs.map((ks: any) =>
          ks.key === attributeName
            ? { ...ks, value: [...ks.value, valueToAdd] }
            : ks
        );
        form.setValue("keySpecs", updatedKeySpecs);
      }
    } else {
      const newKeySpace = { id: "", key: attributeName, value: [valueToAdd] };
      form.setValue("keySpecs", [...existingKeySpecs, newKeySpace]);
    }
  };

  const handlePopoverOpenChange = (open: boolean, reactKey: string) => {
    setPopoverOpen(open ? reactKey : null);
  };

  return (
    <div className="px-5">
      <div className="space-y-2 p-3 bg-[#EFF6FF] rounded-lg">
        <p className="text-base px-5 font-medium">Attributes</p>
        {selectValues.map((row) => (
          <div
            key={row.reactKey}
            className="flex items-start space-x-2 p-4 rounded-lg"
          >
            <div className="w-96">
              <p className="font-semibold text-lg py-1 ">Attributes</p>
              <Select
                value={
                  row.attributeId && row.name
                    ? { label: row.name, value: row.attributeId }
                    : null
                }
                options={getAttributeOptionsForRow(row.reactKey)}
                onChange={(selectedOption) =>
                  handleAttributeChange(selectedOption, row.reactKey)
                }
                placeholder="Select Attribute"
                isClearable
              />
            </div>

            <div className="w-2/4">
              <p className="font-semibold text-base py-1">Values</p>
              <CreatableSelect
                isMulti
                isClearable
                isLoading={loadingValues[row.attributeId] || valueLoading[row.reactKey]}
                inputValue={inputValues[row.reactKey] || ""}
                onInputChange={(inputValue) => handleInputChange(inputValue, row.reactKey)}
                onKeyDown={(e) => handleKeyDown(e, row.reactKey, row.attributeId)}
                value={getSelectedValueOptions(row.selectedValues, row.attributeId)}
                options={getValueOptionsForAttribute(row.attributeId)}
                onChange={(selected) =>
                  handleValuesChange(selected, row.reactKey)
                }
                placeholder={
                  loadingValues[row.attributeId]
                    ? "Loading values..."
                    : valueLoading[row.reactKey]
                    ? "Creating value..."
                    : "Select or create values"
                }
                isDisabled={!row.attributeId}
              />
            </div>

            <div className="mt-8">
              <Popover
                open={popoverOpen === row.reactKey}
                onOpenChange={(open) =>
                  handlePopoverOpenChange(open, row.reactKey)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    className="h-9 rounded-3xl text-xs"
                    type="button"
                    disabled={
                      !row.attributeId ||
                      !row.selectedValues ||
                      row.selectedValues.length === 0
                    }
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add key spaces
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="space-y-2 w-64">
                  {getSelectedValuesForKeySpaces(row).length > 0 ? (
                    getSelectedValuesForKeySpaces(row).map((val, index) => {
                      const alreadySelected = form
                        .getValues("keySpecs")
                        ?.find((ks: any) => ks.key === row.name)
                        ?.value.includes(val.label);

                      return (
                        <div
                          key={`${val.value}-${index}`}
                          className="flex items-center justify-between bg-gray-50 p-1 rounded text-sm"
                        >
                          <span>{val.label}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-green-500 text-white"
                            disabled={alreadySelected}
                            onClick={() =>
                              handleSelectSingleKeyValue(row, val.label)
                            }
                          >
                            {alreadySelected ? "Selected" : "Select"}
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-2 text-gray-500">
                      No values selected
                    </div>
                    )}
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center mt-9">
              <button
                type="button"
                onClick={() => handleDeleteRow(row.reactKey)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-8">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-1 bg-blue-500 text-white font-medium text-base rounded-3xl hover:bg-blue-600 transition"
            disabled={selectValues.length >= attributes.length}
          >
            Add New Attribute
          </button>
          {selectValues.length >= attributes.length && (
            <p className="text-sm text-gray-500 mt-2">
              All available attributes have been added
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewAttr;