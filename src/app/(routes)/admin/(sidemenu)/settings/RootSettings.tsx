"use client";

import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import SectionButtons from "@/components/_admin_components/settings_components/SectionButton";
import SelectedSectionDetails from "@/components/_admin_components/settings_components/SelectedSectionDetails";
import { Setting } from "@/app/_types/settingTypes";
import axios from "axios";

const SettingsPage: React.FC = () => {
  const [configData, setConfigData] = useState<Setting[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [currentSectionSettings, setCurrentSectionSettings] = useState<
    Setting[]
  >([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/settings");

      if (response.data && Array.isArray(response.data.data)) {
        setConfigData(response.data.data);
        if (!selectedSection && response.data.data.length > 0) {
          setSelectedSection(response.data.data[0].section);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      setCurrentSectionSettings(
        configData.filter((item) => item.section === selectedSection)
      );
    }
  }, [selectedSection, configData]);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updatedSettings = [...currentSectionSettings];
    updatedSettings[index] = { ...updatedSettings[index], value: newValue };

    setCurrentSectionSettings(updatedSettings);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6  bg-gray-100 ">
      <SectionButtons
        uniqueSections={Array.from(
          new Set(configData && configData.map((item) => item.section))
        )}
        selectedSection={selectedSection}
        toggleSection={handleSectionClick}
      />
      <SelectedSectionDetails
        settings={currentSectionSettings}
        selectedSection={selectedSection}
        onUpdateSuccess={fetchData}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

export default SettingsPage;
