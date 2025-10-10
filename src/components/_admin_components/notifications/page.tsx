"use client";
import React, { useState, useEffect, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import ShowNotification from "./show/page";
import axios from "axios";
const Page = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const notificationRef = useRef(null);
  const sheetRef = useRef(null);

  const getNotification = async () => {
    try {
      const result = await axios.get("/api/notifications");
      if (result.status === 200) {
        setNotification(result?.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    getNotification();

    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        sheetRef.current &&
        !sheetRef.current.contains(event.target)
      ) {
        setIsSheetOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSheet = (e) => {
    e.stopPropagation();
    setIsSheetOpen((prevState) => !prevState);
  };

  return (
    <>
      <div
        ref={notificationRef}
        className="cursor-pointer relative"
        onClick={toggleSheet}
      >
        {notification?.unReadNotificationCount>0 && (
          <p className="absolute -right-3 font-bold -top-3 bg-red-600 rounded-full h-6  w-6 flex justify-center items-center text-white text-sm">
            {notification?.unReadNotificationCount}
          </p>
        )}
        <MdNotifications size={28} />
      </div>

      <ShowNotification
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        notifications={notification}
        sheetRef={sheetRef}
        refreshNotifications={getNotification} p

      />
    </>
  );
};

export default Page;
