import { useState, useEffect } from "react";
import { UseFormReturn, useFieldArray, useWatch } from "react-hook-form";
import { formSchema } from "../../add/page";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { transformOutgoingData } from "../../edit/[uuid]/RootLayout";

interface OptionValue {
  optionName: string;
  optionData?: string;
  files?: {
    baseImage?: string;
    additionalImage?: string[];
    descriptionVideo?: string;
  };
}

const VariantForm = ({
  form,
  variantTitle,
  variantIndex,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  variantTitle: string;
  variantIndex: number;
}) => {
  const [optionName, setOptionName] = useState("");
  const { fields, append, remove } = useFieldArray({
    name: `options.${variantIndex}.values`,
    control: form.control,
  });
  const variantValues = useWatch({
    control: form.control,
    name: `options.${variantIndex}.values`,
    defaultValue: [],
  }) as OptionValue[];
  const optionExists = variantValues
    ? variantValues.some(
        (item) =>
          item?.optionName?.toLowerCase() === optionName.toLowerCase().trim()
      )
    : false;

  const handleSaveOptionName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionName.trim()) return;
    append({
      optionName: optionName.trim(),
      optionData: "",
    });

    // Clear the input field after adding
    setOptionName("");
  };

  const handleDeleteOptionName = (optionNameIndex: number) => {
    remove(optionNameIndex);
  };

  // Watch for changes in the parent form's options
  const allOptions = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  });

  // Update the form when options change
  useEffect(() => {
    if (
      transformOutgoingData(allOptions) &&
      transformOutgoingData(allOptions)[variantIndex]
    ) {
      form.trigger(`options.${variantIndex}.values`);
    }
  }, [allOptions, form, variantIndex]);

  return (
    <div className="p-3 my-8 border rounded bg-blue-50">
      <h3 className="mb-4">
        {variantTitle} options <span className="text-red-500">*</span>
      </h3>

      {/* List of added values */}
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field, index) => {
          const item = variantValues?.[index] || { optionName: "" };

          return (
            <div key={field.id}>
              <div className="flex items-center justify-between border bg-white rounded p-3">
                <p>{item.optionName}</p>
                <Button
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  onClick={() => handleDeleteOptionName(index)}
                  title="Delete"
                  variant={"outline"}
                >
                  <FaTrash className="mr-2" />
                  <span className="text-xs font-normal">Delete</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add new option form */}
      <form
        onSubmit={handleSaveOptionName}
        id={`add-variant-form-${variantIndex}`}
      >
        <div className="flex bg-white p-3 items-center justify-between rounded mt-3">
          <div className="relative w-3/4">
            <input
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              type="text"
              id={`variantOption-${variantIndex}`}
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-700 bg-transparent rounded-md border-2 border-gray-300 appearance-none outline-none focus:border-blue-500 peer"
              placeholder=""
            />
            <label
              htmlFor={`variantOption-${variantIndex}`}
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Option Name
            </label>
            {optionExists && (
              <p className="text-red-600 text-sm mt-1">
                This option already exists in {variantTitle}
              </p>
            )}
          </div>
          <div>
            <Button
              onClick={handleSaveOptionName}
              type="submit"
              disabled={!optionName.trim() || optionExists}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VariantForm;
