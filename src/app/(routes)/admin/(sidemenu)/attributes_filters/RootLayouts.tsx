"use client";
import React, { useState } from "react";
import { CategoryT } from "@/app/_types/category_Types/categoryType";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface RootLayoutsProps {
  categories: CategoryT[];
}

export interface Root {
  code: number;
  message: string;
  data: RootData;
}

export interface RootData {
  current_page: number;
  data: RootDataData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: RootDataLinks[];
  next_page_url: any;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface RootDataData {
  id: number;
  attributeSet: string;
  attributeName: string;
  sort_order: number;
  is_active: number;
}

export interface RootDataLinks {
  url: any;
  label: string;
  active: boolean;
}

// Helper function to flatten categories recursively
const flattenCategories = (categories: CategoryT[]): CategoryT[] => {
  const flattened: CategoryT[] = [];

  const flatten = (cats: CategoryT[], level: number = 0) => {
    cats.forEach((cat) => {
      flattened.push({
        ...cat,
        name: `${"—".repeat(level)} ${cat.name}`,
      });
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children, level + 1);
      }
    });
  };

  flatten(categories);
  return flattened;
};

const RootLayouts: React.FC<RootLayoutsProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const flattenedCategories = flattenCategories(categories);

  React.useEffect(() => {
    if (!selectedCategory && flattenedCategories.length > 0) {
      setSelectedCategory(flattenedCategories[0].id.toString());
    }
  }, [flattenedCategories, selectedCategory]);

  React.useEffect(() => {
    setSelectedAttributes([]);
  }, [selectedCategory]);

  const getSelectedCategory = async (id: string) => {
    if (!id) {
      console.log("No category ID provided");
      return { data: { data: { data: [] } } }; // Return empty structure instead of null
    }
    try {
      const res = await clientSideFetch({
        url: `/categories/attributes?category_id=${id}`,
        method: "get",
        toast: toast,
      });

      console.log("API Response:", res);

      // Ensure we always return a valid structure
      if (!res || res === null || res === undefined) {
        console.warn("API returned null/undefined, returning empty structure");
        return { data: { data: { data: [] } } };
      }

      return res;
    } catch (error) {
      console.error("Error fetching category attributes:", error);
      // Return empty structure instead of null on error
      return { data: { data: { data: [] } } };
    }
  };

  const {
    data: attributesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["selectedCategory", selectedCategory],
    queryFn: () => getSelectedCategory(selectedCategory),
    enabled: !!selectedCategory,
    retry: 1,
    staleTime: 30000, // 30 seconds
    placeholderData: { data: { data: { data: [] } } }, // Provide placeholder data
  });

  const updateAttributeStatus = async (payload: {
    category_id: string;
    attribute_id: number;
    is_active: boolean;
  }) => {
    const res = await clientSideFetch({
      url: "/categories/attributes/status",
      method: "post",
      body: payload,
      toast: toast,
    });
    return res;
  };

  const reorderAttributes = async (payload: {
    category_id: string;
    attribute_order: number[];
  }) => {
    const res = await clientSideFetch({
      url: "/categories/attributes/reorder",
      method: "post",
      body: payload,
      toast: toast,
    });
    return res;
  };

  const statusMutation = useMutation({
    mutationFn: updateAttributeStatus,
    onSuccess: () => {
      // Set a timeout to allow the backend to process before refetching
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["selectedCategory", selectedCategory],
        });
      }, 500);
    },
    onError: (error) => {
      console.error("Error updating attribute status:", error);
      toast({
        title: "Error",
        description: "Failed to update attribute status",
        variant: "destructive",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAttributes,
    onSuccess: async (data) => {
      console.log("Reorder success, response:", data);

      toast({
        title: "Success",
        description: "Attributes reordered successfully",
      });

      setSelectedAttributes([]);

      // Wait a bit before refetching to allow backend to update
      setTimeout(async () => {
        try {
          await queryClient.refetchQueries({
            queryKey: ["selectedCategory", selectedCategory],
          });
        } catch (error) {
          console.error("Error refetching after reorder:", error);
        }
      }, 500);
    },
    onError: (error) => {
      console.error("Error reordering attributes:", error);
      toast({
        title: "Error",
        description: "Failed to reorder attributes",
        variant: "destructive",
      });
    },
  });

  const handleStatusToggle = (attributeId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? false : true;
    statusMutation.mutate({
      category_id: selectedCategory,
      attribute_id: attributeId,
      is_active: newStatus,
    });
  };

  const handleCheckboxChange = (attributeId: number) => {
    setSelectedAttributes((prev) => {
      if (prev.includes(attributeId)) {
        return prev.filter((id) => id !== attributeId);
      } else {
        return [...prev, attributeId];
      }
    });
  };

  const handleReorder = () => {
    if (selectedAttributes.length === 0) {
      toast({
        title: "No attributes selected",
        description: "Please select attributes to reorder",
        variant: "destructive",
      });
      return;
    }

    reorderMutation.mutate({
      category_id: selectedCategory,
      attribute_order: selectedAttributes,
    });
  };

  // Extract attributes from the response - handle the wrapped response structure
  const attributes = React.useMemo(() => {
    console.log("Processing attributesData:", attributesData);

    // Add comprehensive null/undefined check at the start
    if (
      !attributesData ||
      attributesData === null ||
      attributesData === undefined
    ) {
      console.log("attributesData is null/undefined");
      return [];
    }

    // Handle the wrapped response structure: data.data.data.data
    if (
      attributesData.data &&
      attributesData.data.data &&
      attributesData.data.data.data &&
      Array.isArray(attributesData.data.data.data)
    ) {
      console.log("Found data at: data.data.data.data");
      return attributesData.data.data.data;
    }

    // Fallback: if the response has the structure: data.data.data
    if (
      attributesData.data &&
      attributesData.data.data &&
      Array.isArray(attributesData.data.data)
    ) {
      console.log("Found data at: data.data.data");
      return attributesData.data.data;
    }

    // Fallback: if the response is directly the data array
    if (Array.isArray(attributesData.data)) {
      console.log("Found data at: data");
      return attributesData.data;
    }

    // Fallback: if attributesData itself is an array
    if (Array.isArray(attributesData)) {
      console.log("attributesData itself is an array");
      return attributesData;
    }

    console.log("No valid data structure found, returning empty array");
    return [];
  }, [attributesData]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Attributes Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-base font-medium mb-2 block">
                Select Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-fit min-w-40">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {flattenedCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <p>Loading attributes...</p>
              </div>
            )}

            {isError && (
              <div className="text-center py-4">
                <p className="text-red-600">
                  Error loading attributes. Please try again.
                </p>
              </div>
            )}

            {!isLoading && !isError && attributes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Attributes for Selected Category
                  </h3>
                  {selectedAttributes.length > 0 && (
                    <Button
                      onClick={handleReorder}
                      disabled={reorderMutation.isPending}
                      className="bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      {reorderMutation.isPending
                        ? "Reordering..."
                        : `Reorder ${selectedAttributes.length} Attributes`}
                    </Button>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="flex justify-center items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedAttributes.length === attributes.length &&
                            attributes.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAttributes(
                                attributes.map((attr: RootDataData) => attr.id)
                              );
                            } else {
                              setSelectedAttributes([]);
                            }
                          }}
                          className="rounded-full cursor-pointer border-gray-300 h-4 w-4"
                        />
                        <p>Sort</p>
                      </TableHead>
                      <TableHead className="text-center">
                        Attribute Set
                      </TableHead>
                      <TableHead className="text-center">
                        Attribute Name
                      </TableHead>
                      <TableHead className="text-center">Sort Order</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-center">
                    {attributes.map(
                      (attribute: RootDataData, index: number) => (
                        <TableRow
                          key={attribute.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="w-12">
                            <div className="flex items-center justify-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedAttributes.includes(
                                  attribute.id
                                )}
                                onChange={() =>
                                  handleCheckboxChange(attribute.id)
                                }
                                className="rounded-full h-4 w-4 cursor-pointer border-gray-300"
                              />
                              {selectedAttributes.includes(attribute.id) && (
                                <span className="text-xs font-normal text-gray-400 h-2 w-2 rounded-full text-center">
                                  {selectedAttributes.indexOf(attribute.id) + 1}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {attribute.attributeSet}
                          </TableCell>
                          <TableCell>{attribute.attributeName}</TableCell>
                          <TableCell className="text-center">
                            {attribute.sort_order}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Switch
                                checked={attribute.is_active === 1}
                                onCheckedChange={() =>
                                  handleStatusToggle(
                                    attribute.id,
                                    attribute.is_active
                                  )
                                }
                                disabled={statusMutation.isPending}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading &&
              !isError &&
              attributes.length === 0 &&
              selectedCategory && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No attributes found for this category.
                  </p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RootLayouts;
