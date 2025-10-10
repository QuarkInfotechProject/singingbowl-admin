"use client";
import React, { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "../../add/page";
import { Switch } from "@/components/ui/switch";
import FeaturesSelect from "./featuresSelector";
import ActiveOfferSelect from "./activeOfferSelect";
import CouponSelect from "./couponSelect";

import { FaTimes } from "react-icons/fa";
import * as TablerIcons from "@tabler/icons-react";
interface Specification {
  icon: string;
  content: string;
}
const Others = ({
  form,
  fieldNames = "specifications",
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  fieldNames?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  // const [currentIcon, setCurrentIcon] = useState<string>("circle");
  // const specifications = form.watch("specifications") || [];
  const [currentIcon, setCurrentIcon] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [matchingIcons, setMatchingIcons] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const specifications: Specification[] =
    form.getValues("specifications") || [];

  const getTablerIcon = (
    iconName: string
  ): React.ComponentType<TablerIcons.IconProps> => {
    const formattedIconName =
      "Icon" +
      iconName
        ?.split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

    return (
      (TablerIcons as any)[formattedIconName] || TablerIcons.IconQuestionMark
    );
  };

  useEffect(() => {
    if (inputValue && !currentIcon) {
      const matches = Object.keys(TablerIcons)
        .filter((key) => key.toLowerCase().includes(inputValue.toLowerCase()))
        .map((key) => key.replace("Icon", "").toLowerCase());
      setMatchingIcons(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [inputValue, currentIcon]);

  const handleRemoveTag = (tagToRemove: { icon: string; content: string }) => {
    const updatedSpecifications = specifications.filter(
      (spec) =>
        spec.content !== tagToRemove.content || spec.icon !== tagToRemove.icon
    );
    form.setValue("specifications", updatedSpecifications, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const newSpecification = { icon: currentIcon, content: inputValue };
  const updatedSpecifications = [...specifications];
  // const
  // console.log("sp[ecification value", );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = inputValue.trim();

      if (currentIcon && value) {
        // Create new specification with proper typing
        const newSpecification = {
          icon: currentIcon,
          content: value,
        };

        // Update specifications array while maintaining proper typing
        const updatedSpecifications = [
          ...(form.getValues("specifications") || []),
          newSpecification,
        ];

        // Set the value in the form
        form.setValue("specifications", updatedSpecifications, {
          shouldValidate: true,
          shouldDirty: true,
        });

        // Reset input states
        setInputValue("");
        setCurrentIcon("");
      }
    }
  };
  const handleIconClick = (icon: string) => {
    setCurrentIcon(icon);
    setShowDropdown(false);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // const CurrentIconComponent = getTablerIcon(currentIcon);
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Additional Details
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="featureId"
            render={({ field }) => (
              <FormItem className="bg-white p-4 rounded-md shadow-sm">
                <FormLabel className="text-lg font-medium text-black">
                  Features
                </FormLabel>
                <FormDescription className="mt-1 text-sm text-gray-500">
                  Choose features for your product.
                </FormDescription>
                <FormControl className="mt-2">
                  <FeaturesSelect field={field} />
                </FormControl>
                <FormMessage className="mt-2 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activeOfferId"
            render={({ field }) => (
              <FormItem className="bg-white p-4 rounded-md shadow-sm">
                <FormLabel className="text-lg font-medium text-black">
                  Active Offer
                </FormLabel>
                <FormDescription className="mt-1 text-sm text-gray-500">
                  Choose active offers for your product.
                </FormDescription>
                <FormControl className="mt-2">
                  <ActiveOfferSelect field={field} />
                </FormControl>
                <FormMessage className="mt-2 text-sm" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="couponId"
            render={({ field }) => (
              <FormItem className="bg-white p-4 rounded-md shadow-sm">
                <FormLabel className="text-lg font-medium text-black">
                  Coupon
                </FormLabel>
                <FormDescription className="mt-1 text-sm text-gray-500">
                  Choose coupon offers for your product.
                </FormDescription>
                <FormControl className="mt-2">
                  <CouponSelect field={field} />
                </FormControl>
                <FormMessage className="mt-2 text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specifications"
            render={({ field }) => (
              <FormItem className="bg-white p-4 rounded-md shadow-sm">
                <FormLabel className="text-lg font-medium text-black">
                  Specifications
                </FormLabel>
                <FormDescription className="mt-1 text-sm text-gray-500">
                  Select an icon, then add a description. Press "Enter" to add
                  the specification.
                </FormDescription>
                <FormControl className="mt-2">
                  <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 bg-white">
                    {specifications?.map((spec, index) => {
                      const IconComponent = getTablerIcon(spec.icon);
                      return (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 m-1 text-sm"
                        >
                          {IconComponent && (
                            <IconComponent size={16} className="mr-1" />
                          )}
                          <span>{spec.content}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(spec)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      );
                    })}
                    <div className="flex items-center flex-grow relative">
                      {currentIcon && (
                        <div className="mr-2">
                          {React.createElement(getTablerIcon(currentIcon), {
                            size: 16,
                          })}
                        </div>
                      )}
                      <Input
                        ref={inputRef}
                        type="text"
                        className="flex-grow border-none focus:ring-0"
                        placeholder={
                          currentIcon
                            ? "Add a description..."
                            : "Search for an icon..."
                        }
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      {showDropdown && (
                        <div className="absolute h-32 overflow-auto top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
                          {matchingIcons.map((icon) => {
                            const IconComponent = getTablerIcon(icon);
                            return (
                              <div
                                key={icon}
                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleIconClick(icon)}
                              >
                                <IconComponent size={16} className="mr-2" />
                                <span>{icon}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="mt-2 text-sm" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Others;
