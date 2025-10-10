"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Home,
  Gift,
  Star,
  AlertCircle,
  Rocket,
  Users,
  Globe,
  FileText,
  Captions,
} from "lucide-react";

import RootContents from "./RootContent";
import NewLaunche from "../newLaunche/RootLaunche";
import BestSeller from "../best-seller/RootBest";
import Partner from "../affiliate/page";
import InThePress from "../inThePress/page";
import Headers from "../header/page";
import Flash_Offer from "../Flash-offer/Flash_Offer";
import { IconSquarePercentage } from "@tabler/icons-react";

const TabIcon = ({ icon: Icon, isActive }) => (
  <Icon
    size={20}
    className={`mr-2 ${isActive ? "text-black" : "text-gray-500"}`}
  />
);

const TabButton = ({ icon, label, isActive, onClick }) => (
  <motion.button
    // whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-gray-100 text-black font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <TabIcon icon={icon} isActive={isActive} />
    {label}
  </motion.button>
);

const ContentsPage = () => {
  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { id: "", label: "All", icon: Layout },
    { id: "1", label: "Hero Section", icon: Home },
    {
      id: "Flash_Offer",
      label: "Flash Offer Banner",
      icon: IconSquarePercentage,
    },
    { id: "2", label: "Offer Banner", icon: Gift },
    { id: "3", label: "Pop Up", icon: AlertCircle },
    { id: "best", label: "Best Seller", icon: Star },
    { id: "new", label: "New Launch", icon: Rocket },
    { id: "partner", label: "Partner", icon: Users },
    { id: "media", label: "Media & Coverages", icon: Globe },
    { id: "press", label: "In The Press", icon: FileText },
    { id: "headers", label: "Header", icon: Captions },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "":
      case "1":
      case "2":
      case "3":
        return <RootContents type={activeTab === "" ? "" : activeTab} />;
      case "best":
        return <BestSeller />;
      case "new":
        return <NewLaunche />;
      case "partner":
        return <Partner activeTab={activeTab} />;
      case "media":
        return <Partner activeTab="0" />;
      case "press":
        return <InThePress />;
      case "headers":
        return <Headers />;
        case "Flash_Offer":
          return <Flash_Offer/>
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-xl font-bold text-black mb-6">
          Content Management
        </h1>
        <nav>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>
      <main className="flex-1 p-8 overflow-auto ">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-100 p-0"
          >
            <h2 className="text-2xl font-semibold absolute">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ContentsPage;
