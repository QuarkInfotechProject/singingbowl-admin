"use client";
import React, { useState } from "react";

import DarazCount from "../daraz-count/page";
import Features from "../features/page"
import ActiveOffers from "../active-offers/page"
import { CiDiscount1 } from "react-icons/ci";
import { LuListStart } from "react-icons/lu";
import { BiLogoDailymotion } from "react-icons/bi";

const menuItems = [
  {
    name: "Active Offers",
    url: "/active-Offers",
    icon: CiDiscount1,
    component: ActiveOffers,
  },
  {
    name: "Daraz Count",
    url: "/admin/daraz-count",
    icon: BiLogoDailymotion,
    component: DarazCount,
  },
  {
    name: "Features",
    url: "/features",
    icon: LuListStart,
    component: Features,
  },
  
  
];

const OthersRootContents = () => {
  const [activeTab, setActiveTab] = useState("/active-Offers");

  const renderActiveComponent = () => {
    const activeItem = menuItems.find((item) => item.url === activeTab);
    if (activeItem?.component) {
      const Component = activeItem.component;
      return <Component />;
    }
    return <ActiveOffers />;
  };

  return (
    <div className="h-screen flex p-2 ">
      {/* Sidebar */}
      <div className="w-64 rounded-sm flex-shrink-0 shadow-lg  h-screen">
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Others Panel</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.url}>
                    <button
                      onClick={() => setActiveTab(item.url)}
                      className={`w-full text-left px-4 font-semibold py-2 rounded transition-colors duration-150 hover:bg-gray-300 hover:text-black
                            ${
                              activeTab === item.url
                                ? "bg-gray-200 text-black"
                                : "text-gray-500"
                            }
                            flex items-center gap-3`}
                    >
                      <Icon size={24} />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen flex flex-col overflow-y-auto hide-scrollbar">
        <div className="flex-1 bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow-xl h-full flex flex-col">
            {/* Header - Non-scrollable */}
            {/* <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                {menuItems.find((item) => item.url === activeTab)?.icon &&
                  React.createElement(
                    menuItems.find((item) => item.url === activeTab)?.icon,
                    { size: 24 }
                  )}
                <h2 className="text-2xl font-semibold">
                  {menuItems.find((item) => item.url === activeTab)?.name ||
                    "Welcome"}
                </h2>
              </div>
            </div> */}
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-auto p-6">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersRootContents;
