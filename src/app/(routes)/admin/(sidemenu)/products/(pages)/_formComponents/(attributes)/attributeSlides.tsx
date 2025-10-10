"use client";
import React, { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../edit/[uuid]/page";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { useGlobalContext } from "../../../(context)/context";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { Plus } from "lucide-react";

const NewAttr = ({
  prevAttributes,
  form,
}: {
  prevAttributes: any[] | undefined | null;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { attributes } = useGlobalContext();

  // Initialize with empty array ALWAYS - no exceptions
  const initializeSelectValues = () => {
    if (!prevAttributes || !Array.isArray(prevAttributes) || prevAttributes.length === 0) {
      return [];
    }
    
    return prevAttributes.map((attr) => ({
      id: attr.id || Date.now() + Math.random(),
      attributeId: attr.attributeId || 0,
      name: attr.name || "",
      selectedValues: attr.values || [],
    }));
  };

  // State declarations with guaranteed array initialization
  const [selectValues, setSelectValues] = useState<any[]>(initializeSelectValues());
  const [attributeValues, setAttributeValues] = useState<{
    [key: number]: any[];
  }>({});
  const [loadingValues, setLoadingValues] = useState<{
    [key: number]: boolean;
  }>({});

  // Direct function to update form
  const updateFormValues = (newSelectValues: any[]) => {
    if (!Array.isArray(newSelectValues)) {
      console.error("updateFormValues received non-array:", newSelectValues);
      return;
    }
    
    const formData = newSelectValues.map((item) => ({
      id: item.id.toString(),
      attributeId: item.attributeId.toString(),
      values: (item.selectedValues || []).map((value: any) => value.value || value.id),
    }));

    form.setValue("attributes", formData);
  };

  // Get attribute values from API
  const getValues = async (attrId: number) => {
    if (!attrId || attributeValues[attrId]) return;

    setLoadingValues((prev) => ({ ...prev, [attrId]: true }));

    try {
      const response = await clientSideFetch({
        url: `/attributes/show/${attrId}`,
        method: "get",
        toast: "skip",
      });

      if (response?.data?.data?.values) {
        setAttributeValues((prev) => ({
          ...prev,
          [attrId]: response.data.data.values,
        }));
      }
    } catch (error) {
      console.error("Error fetching attribute values:", error);
    } finally {
      setLoadingValues((prev) => ({ ...prev, [attrId]: false }));
    }
  };

  // Handle attribute selection (single select)
  const handleAttributeChange = async (selectedOption: any, rowId: number) => {
    setSelectValues(currentValues => {
      if (!Array.isArray(currentValues)) {
        console.error("selectValues is not an array in handleAttributeChange");
        return [];
      }
      
      const newSelectValues = currentValues.map((item) =>
        item.id === rowId
          ? {
              ...item,
              attributeId: selectedOption ? selectedOption.value : 0,
              name: selectedOption ? selectedOption.label : "",
              selectedValues: [],
            }
          : item
      );

      updateFormValues(newSelectValues);
      return newSelectValues;
    });

    if (selectedOption?.value) {
      await getValues(selectedOption.value);
    }
  };

  // Handle values selection (multi select)
  const handleValuesChange = (selectedOptions: any[], rowId: number) => {
    setSelectValues(currentValues => {
      if (!Array.isArray(currentValues)) {
        console.error("selectValues is not an array in handleValuesChange");
        return [];
      }
      
      const newSelectValues = currentValues.map((item) =>
        item.id === rowId
          ? { ...item, selectedValues: selectedOptions || [] }
          : item
      );

      updateFormValues(newSelectValues);
      return newSelectValues;
    });
  };

  // Handle deleting a row
  const handleDeleteRow = (rowId: number) => {
    setSelectValues(currentValues => {
      if (!Array.isArray(currentValues)) {
        console.error("selectValues is not an array in handleDeleteRow");
        return [];
      }
      
      const newSelectValues = currentValues.filter((item) => item.id !== rowId);
      updateFormValues(newSelectValues);
      return newSelectValues;
    });
  };

  // Handle adding new row - NO SPREADING, use concat instead
  const handleAddRow = () => {
    setSelectValues(currentValues => {
      // Ensure we always have an array
      const safeCurrentValues = Array.isArray(currentValues) ? currentValues : [];
      
      const newRow = {
        id: Date.now() + Math.random(), // Ensure unique ID
        attributeId: 0,
        name: "",
        selectedValues: [],
      };
      
      // Use concat instead of spread operator
      const newSelectValues = safeCurrentValues.concat([newRow]);
      updateFormValues(newSelectValues);
      return newSelectValues;
    });
  };

  // Handle adding key spaces for a specific attribute
  const handleAddKeySpaces = (attributeId: number, attributeName: string) => {
    const currentValues = Array.isArray(selectValues) ? selectValues : [];
    const existingKeySpecs = form.getValues("keySpecs") || [];
    
    const currentRow = currentValues.find(row => row.attributeId === attributeId);
    if (!currentRow || !currentRow.selectedValues?.length) {
      console.warn("No values selected for this attribute");
      return;
    }

    const valuesToAdd = currentRow.selectedValues.map((value: any) => 
      value.label || value.value || value
    );

    const existingKeySpace = existingKeySpecs.find((ks: any) => ks.key === attributeName);
    
    if (existingKeySpace) {
      const newValues = valuesToAdd.filter((val: string) => 
        !existingKeySpace.value.includes(val)
      );
      
      if (newValues.length > 0) {
        const updatedKeySpaces = existingKeySpecs.map((ks: any) =>
          ks.key === attributeName
            ? { ...ks, value: existingKeySpace.value.concat(newValues) }
            : ks
        );
        form.setValue("keySpecs", updatedKeySpaces);
      }
    } else {
      const newKeySpace = {
        id: Date.now(),
        key: attributeName,
        value: valuesToAdd,
      };
      
      form.setValue("keySpecs", existingKeySpecs.concat([newKeySpace]));
    }
  };

  // Get filtered attribute options for a specific row
  const getAttributeOptionsForRow = (currentRowId: number) => {
    const currentValues = Array.isArray(selectValues) ? selectValues : [];
    
    const otherSelectedAttributeIds = currentValues
      .filter(
        (item) =>
          item.id !== currentRowId && item.attributeId && item.attributeId !== 0
      )
      .map((item) => item.attributeId);

    const availableAttributes = (attributes || []).filter(
      (attr) => !otherSelectedAttributeIds.includes(attr.id)
    );

    return availableAttributes.map((attr) => ({
      label: attr.name,
      value: attr.id,
    }));
  };

  // Get available values for a specific attribute
  const getValueOptionsForAttribute = (attributeId: number) => {
    if (!attributeId || !attributeValues[attributeId]) return [];

    return attributeValues[attributeId].map((value) => ({
      label: value.value,
      value: value.id,
    }));
  };

  // Convert selected values to options format
  const getSelectedValueOptions = (selectedValues: any) => {
    if (!selectedValues || !Array.isArray(selectedValues)) return [];

    return selectedValues.map((value: any) => ({
      label: value.value || value.name || value.label,
      value: value.id || value.value,
    }));
  };

  // Ensure selectValues is always an array before rendering
  const safeSelectValues = Array.isArray(selectValues) ? selectValues : [];

  return (
    <div className="px-5">
      <div className="space-y-4 rounded-lg p-5 bg-blue-50">
        <p className="text-2xl font-bold">Attributes</p>
        
        {/* Debug Info */}
        <div className="bg-yellow-100 p-2 rounded mb-4 text-sm">
          <p><strong>Debug:</strong> selectValues is {Array.isArray(selectValues) ? 'array' : typeof selectValues} with length {safeSelectValues.length}</p>
        </div>

        {safeSelectValues.map((row) => (
          <div
            key={row.id}
            className="flex items-center space-x-4 p-4 rounded-lg"
          >
            {/* Attribute Section */}
            <div className="w-96">
              <p className="font-semibold text-base py-1">Attributes</p>
              <Select
                value={
                  row.attributeId && row.name
                    ? { label: row.name, value: row.attributeId }
                    : null
                }
                options={getAttributeOptionsForRow(row.id)}
                onChange={(selectedOption) =>
                  handleAttributeChange(selectedOption, row.id)
                }
                placeholder="Select Attribute"
                isClearable
              />
            </div>

            {/* Values Section */}
            <div className="w-2/4">
              <p className="font-semibold text-base py-1">Values</p>
              <Select
                isMulti
                value={getSelectedValueOptions(row.selectedValues)}
                options={getValueOptionsForAttribute(row.attributeId)}
                onChange={(selectedOptions) =>
                  handleValuesChange(selectedOptions, row.id)
                }
                placeholder={
                  loadingValues[row.attributeId]
                    ? "Loading values..."
                    : "Select Values"
                }
                isDisabled={!row.attributeId}
                isLoading={loadingValues[row.attributeId]}
              />
            </div>

            {/* Add Key Spaces Button */}
            <div className="mt-7">
              <Button 
                className="h-10" 
                type="button"
                onClick={() => handleAddKeySpaces(row.attributeId, row.name)}
                disabled={!row.attributeId || !row.selectedValues?.length}
              >
                <Plus className="mr-3" /> Add key spaces
              </Button>
            </div>

            {/* Delete Button */}
            <div className="flex items-center mt-8">
              <button
                type="button"
                onClick={() => handleDeleteRow(row.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Row Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-md hover:bg-blue-600 transition-all"
            disabled={safeSelectValues.length >= (attributes?.length || 0)}
          >
            Add New Attribute
          </button>
          {safeSelectValues.length >= (attributes?.length || 0) && (
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