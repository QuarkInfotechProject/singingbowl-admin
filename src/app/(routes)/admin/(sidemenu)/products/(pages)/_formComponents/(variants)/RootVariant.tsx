import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import VariantOptions from "./VariantOptions";
import VariantDetails from "./VariantDetailOld";
import { OptionValueT } from "../AllImages";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formSchema } from "../../add/page";
import { UseFormReturn, useWatch } from "react-hook-form";
import z from "zod";

interface OptionT {
  name: string;
  isColor: string;
  values: OptionValueT[] | [];
}
const RootVariant = ({
  form,
  colorValues,
  setColorValues,
  setIsVariant,
  setBaseOrAdditional,
  setUploadedImages,
  isColorImagesEditing,
  setIsColorImagesEditing,
  valueIndex,
  setValueIndex,
  maxOptions
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setColorValues: Dispatch<SetStateAction<OptionValueT>>;
  setIsVariant: Dispatch<SetStateAction<boolean>>;
  setBaseOrAdditional: Dispatch<SetStateAction<"base" | "additional" | "descriptions">>;
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
  colorValues: OptionValueT;
  isColorImagesEditing: boolean;
  setIsColorImagesEditing: Dispatch<SetStateAction<boolean>>;
  valueIndex: number;
  setValueIndex: Dispatch<SetStateAction<number>>;
  maxOptions:number
}) => {
  const [isColorIdentified, setIsColorIdentified] = useState(true);

  const [variantInput, setVariantInput] = useState("");
  const [isVariantEditing, setIsVariantEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(1);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);

  // const options = options || []

  const options = useWatch({
    control: form.control,
    name: "options",
  });
  const handleConfirm = (e: any) => {
    e.preventDefault();
    if (isVariantEditing) {
      // for string array
      form.setValue(`options.${currentEditIndex}.name`, variantInput);
      setVariantInput("");
      setVariantDialogOpen(false);
    } else {
      const oldOptions = [...options];
      const updatedOptions = [
        ...oldOptions,
        {
          name: variantInput,
          isColor: "0",
          values: [],
        },
      ];
      form.setValue("options", updatedOptions);
      setVariantInput("");
      setVariantDialogOpen(false);
    }
  };
  const handleDeleteVariant = (title: string) => {
    const oldVariant = [...options];
    const updatedVariant = oldVariant.filter((item) => item.name !== title);
    form.setValue("options", updatedVariant);
  };
  useEffect(() => {
    if (variantDialogOpen === false) {
      setVariantInput("");
    }
  }, [variantDialogOpen]);
  return (
    <>
      <div className="p-5 bg-white">
        <div className="flex item-center justify-between">
          <h2 className="font-medium mb-4">
            Variants{" "}
            <span className="text-sm">{`${options && options.length}/5`}</span>
          </h2>
          <div className="hidden items-center space-x-2">
            <label
              htmlFor="isColor"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is your product color identified
            </label>
            <Checkbox
              disabled={true}
              checked={isColorIdentified}
              // onCheckedChange={() => handleColorToggle()}
              id="isColor"
            />
          </div>
        </div>
        <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
          <div className="mx-auto">
            {options.length !== 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Variant Name</TableHead>
                      <TableHead className="">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {options.map((item, index) => {
                      if (item.name === "Color") {
                        return (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  disabled={true}
                                  title="Cannot delete Color"
                                  variant={"outline"}
                                >
                                  <FaTrash className="mr-2" />{" "}
                                  <span className="text-xs font-normal">
                                    Delete
                                  </span>
                                </Button>
                                <div
                                  className="flex items-center p-2 text-xs text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
                                  role="alert"
                                >
                                  <svg
                                    className="flex-shrink-0 inline w-4 h-4 me-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                  </svg>
                                  <span className="sr-only">Info</span>
                                  <div>
                                    <span className="font-medium">Note:</span>{" "}
                                    Color is a required variant and cannot be
                                    deleted.
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      return (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  title="Edit"
                                  className="mr-3"
                                  variant={"outline"}
                                  onClick={() => {
                                    setIsVariantEditing(true);
                                    setVariantInput(item.name);
                                    setCurrentEditIndex(index);
                                  }}
                                >
                                  <FaEdit className="mr-2" />{" "}
                                  <span className="text-xs font-normal">
                                    Edit
                                  </span>
                                </Button>
                              </DialogTrigger>
                              <Button
                                type="button"
                                onClick={() => handleDeleteVariant(item.name)}
                                title="Delete"
                                // size={"icon"}
                                variant={"outline"}
                              >
                                <FaTrash className="mr-2" />{" "}
                                <span className="text-xs font-normal">
                                  Variant
                                </span>
                              </Button>
                              <div
                                className="flex items-center p-2 text-xs text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                                role="alert"
                              >
                                <svg
                                  className="flex-shrink-0 inline w-4 h-4 me-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="sr-only">Info</span>
                                <div>
                                  <span className="font-medium">
                                    Be Careful !
                                  </span>{" "}
                                  Deleting a variant will delete all its options
                                  (values) as well.
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div>
                <Image
                  className="mx-auto"
                  height={300}
                  width={300}
                  alt="variant image"
                  src="/images/variant.svg"
                />
              </div>
            )}
            <div className="flex items-center justify-center">
              <DialogTrigger asChild>
                <Button
                  className="text-sm mt-4 border-gray-600 font-normal"
                  variant="outline"
                  type="button"
                 disabled={options.length===5}
                  onClick={() => {
                    setIsVariantEditing(false);
                  }}
                >
                  Add Variant
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md">
              <form className="space-y-2" id="add-variant">
                <DialogHeader>
                  <DialogTitle>
                    {" "}
                    {isVariantEditing ? "Edit Variant" : "Add Variant"}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      {isVariantEditing ? "Edit Variant" : "Add Variant"}
                    </Label>
                    <Input
                      value={variantInput}
                      onChange={(e) => setVariantInput(e.target.value)}
                      id="link"
                      placeholder="Variant Name"
                    />
                    {options.length > 0 &&
                      options.map((item) => item.name).includes(variantInput) &&
                      !isVariantEditing && (
                        <p className="text-sm text-red-600">
                          Variant already exists
                        </p>
                      )}
                  </div>
                </div>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      onClick={(e) => handleConfirm(e)}
                      disabled={
                        variantInput.trim().length <= 0 ||
                        (options.length > 0 &&
                          options
                            .map((item) => item.name)
                            .includes(variantInput)) ||
                        [
                          "Colors",
                          "Color",
                          "Colour",
                          "Colours",
                          "color",
                          "colors",
                          "colour",
                          "colours",
                        ].includes(variantInput)
                      }
                    >
                      Confirm
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </div>
        </Dialog>
      </div>
      {options && options.length > 0 && (
        <div className="p-5 bg-white">
          <div className="flex item-center justify-between">
            <h2 className="font-medium mb-4">Variant Options</h2>
          </div>
          <VariantOptions
            setBaseOrAdditional={setBaseOrAdditional}
            setUploadedImages={setUploadedImages}
            setIsVariant={setIsVariant}
            colorValues={colorValues}
            setColorValues={setColorValues}
            form={form}
            isColor={isColorIdentified}
            // color images editing stuff
            isColorImagesEditing={isColorImagesEditing}
            setIsColorImagesEditing={setIsColorImagesEditing}
            valueIndex={valueIndex}
            setValueIndex={setValueIndex}
          />
        </div>
      )}
    </>
  );
};

export default RootVariant;
