"use client";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CreateFile from "./createFile";
import Media from "./media";

const tabss = ({
  onLogoClick,
  setIsSheetOpen,
}: {
  onLogoClick: any;
  setIsSheetOpen: any;
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(1);
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <div className="max-w-full w-full h-full mx-auto">
      <Tabs selectedIndex={activeTabIndex} onSelect={handleTabChange}>
        <TabList>
          <Tab value={1}>Local Upload</Tab>
          <Tab value={2}>Media Library</Tab>
        </TabList>
        <TabPanel>
          <CreateFile onClickTab={handleTabChange} />
        </TabPanel>
        <TabPanel className="">
          <Media
            setIsSheetOpen={setIsSheetOpen}
            onLogoClick={onLogoClick}
            onClickTab={handleTabChange}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default tabss;
