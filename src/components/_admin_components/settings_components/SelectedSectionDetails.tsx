"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectedSectionDetailsProps {
  settings: Setting[];
  selectedSection: string | null;
  onUpdateSuccess: () => void;
  onValueChange: (index: number, newValue: string) => void;
}

const SelectedSectionDetails: React.FC<SelectedSectionDetailsProps> = ({
  settings,
  selectedSection,
  onUpdateSuccess,
  onValueChange,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isChanged, setIsChanged] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<boolean[]>(
    new Array(settings.length).fill(false)
  );

  useEffect(() => {
    setValidationErrors(new Array(settings.length).fill(false));
  }, [settings]);

  const idsAndValues = settings.map((item) => ({
    id: item.uuid,
    value: item.value || "",
    title: item.title,
  }));

  // Split settings into two columns
  const midpoint = Math.ceil(idsAndValues.length / 2);
  const leftColumnSettings = idsAndValues.slice(0, midpoint);
  const rightColumnSettings = idsAndValues.slice(midpoint);

  const handleUpdateClick = async () => {
    const hasErrors = idsAndValues.some((item) => item.value.trim() === "");
    if (hasErrors) {
      setValidationErrors(idsAndValues.map((item) => item.value.trim() === ""));
      toast({
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/settings/update", {
        section: selectedSection,
        configs: idsAndValues,
      });

      if (response.status === 200) {
        toast({
          description: response?.data?.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setIsChanged(false);
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating:", error);
      toast({
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index: number, newValue: string) => {
    const updatedSettings = [...settings];
    updatedSettings[index] = { ...updatedSettings[index], value: newValue };

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = newValue.trim() === "";
    setValidationErrors(updatedErrors);

    const changed = updatedSettings.some(
      (item, i) => item.value !== settings[i].value
    );

    setIsChanged(changed);
    onValueChange(index, newValue);
  };

  const renderSettingField = (
    item: (typeof idsAndValues)[0],
    index: number
  ) => (
    <div key={item.id} className="mb-6">
      <Label
        htmlFor={item.id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {item.title}
      </Label>
      <div className="relative">
        <Input
          id={item.id}
          type="text"
          value={item.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          className={`w-full rounded-md border ${
            validationErrors[index]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1`}
          placeholder={`Enter ${item.title.toLowerCase()}`}
        />
        {validationErrors[index] && (
          <p className="mt-1 text-xs text-red-500">This field is required</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col ">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {selectedSection} Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left Column */}
            <div className="space-y-2">
              {leftColumnSettings.map((item, idx) =>
                renderSettingField(item, idx)
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              {rightColumnSettings.map((item, idx) =>
                renderSettingField(item, idx + midpoint)
              )}
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-4 border-t">
            <Button
              onClick={handleUpdateClick}
              // disabled={isLoading || !isChanged}
              className="flex items-center gap-2 bg-[#5e72e4] hover:bg-[#465ad1] text-white px-6"
            >
              {/* {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )} */}
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SelectedSectionDetails;
