"use client"
import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CreateFile from './createFile';
import Media from "./media"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogClose,
  } from "@/components/ui/dialog";

interface TabsProps {
    trigger: any;
    onSelect: (imageUrl: string) => void;
    toUpdate: string;
    onLogoClick:any;
    setIsSheetOpen:any;
  }
  const Tabss: React.FC<TabsProps> = ({ trigger, onSelect, toUpdate,onLogoClick,setIsSheetOpen }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(1);
    const [open, setOpen] = useState(false);

    const handleTabChange = (index) => {
        setActiveTabIndex(index);
      };
      const handleImageSelect = () => {
        const imageUrl = prompt('Enter Image URL'); 
        if (imageUrl) onSelect(imageUrl);
      };

  return (
    <>
             <Dialog open={open} onOpenChange={setOpen}>
      <div>
      <DialogTrigger className="w-full" asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
            <div>
        <Tabs selectedIndex={activeTabIndex} onSelect={handleTabChange}>
    <TabList>
      <Tab value={1} >Local Upload</Tab>
      <Tab value={2}>Media Library</Tab>
    </TabList>  

    <TabPanel>
     
      <CreateFile onClickTab={ handleTabChange}/>
    </TabPanel>
    <TabPanel className="w-fit">
      
      <Media setIsSheetOpen={setIsSheetOpen}  onLogoClick={onLogoClick} onClickTab={ handleTabChange} />
    </TabPanel>
  </Tabs>
  </div>
        </DialogContent>
        </div>
        </Dialog>
    </>
  )
}

export default Tabss