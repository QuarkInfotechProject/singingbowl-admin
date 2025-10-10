import React from "react";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { BellDot, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
const ShowNotification = ({
  isSheetOpen,
  setIsSheetOpen,
  notifications,
  sheetRef,
  refreshNotifications,
}: any) => {
  const allNotification = notifications?.notifications || [];
  const { toast } = useToast();
  const router = useRouter();
  // Mark notification as read
  const handleMarkRead = async ({
    readid,
    id,
  }: {
    readid: string;
    id: string;
  }) => {
    const formData = { id: readid };
    try {
      const result = await axios.post(
        "/api/notifications/mark-as-read",
        formData
      );
      if (result.status === 200) {
        toast({
          description: `${result.data.message}`,
          className: "bg-green-500 font-semibold text-white",
        });
      }
      refreshNotifications();
      setIsSheetOpen(false);
      router.push(`/admin/products/edit/${id}`);
    } catch (error) {
      toast({
        description: "Error marking as read.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };
  // delete notification
  const handleDelete = async (id: any) => {
    const formData = { id: id };
    try {
      const result = await axios.post("/api/notifications/destroy", formData);
      if (result.status === 200) {
        toast({
          description: `${result.data.message}`,
          className: "bg-green-500 font-semibold text-white",
        });
      }
      setIsSheetOpen(false);
      refreshNotifications();
    } catch (error) {
      toast({
        description: "Error marking as read.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };
  // Mark as read all
  const handleMarkAllasRead = async () => {
    const formData = { id: " " };
    try {
      const result = await axios.post(
        "/api/notifications/mark-as-read",
        formData
      );
      if (result.status === 200) {
        toast({
          description: `${result.data.message}`,
          className: "bg-green-500 font-semibold text-white",
        });
      }
      setIsSheetOpen(false);
      refreshNotifications();
    } catch (error) {
      toast({
        description: "Error marking as read.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };
  const getUnreadBg = (read: any) => {
    switch (read) {
      case "No":
        return "bg-slate-100";
      case "Yes":
        return "";
      default:
        return "";
    }
  };
  return (
    <>
      <div className="relative ">
        {isSheetOpen && (
          <div
            ref={sheetRef}
            className="absolute flex flex-col p-4 py-3 rounded-md top-10 right-6 w-[440px] h-auto z-50 bg-white overflow-hidden shadow-md max-h-[500px] border"
          >
            {/* Close Button */}
            <div className="flex justify-end">
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setIsSheetOpen(false)}
              />
            </div>

            <div className="flex flex-col flex-grow overflow-y-auto hide-scrollbar  px-2 mt-2">
              {/* Notification List */}
              <div className="flex flex-col space-y-2">
                {allNotification?.length !== 0 ? (
                  allNotification?.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`flex items-center space-x-2 px-2 rounded-md cursor-pointer border p-1 group ${getUnreadBg(
                        notification?.read
                      )}`}
                      onClick={() =>
                        handleMarkRead({
                          readid: notification.id,
                          id: notification.productId,
                        })
                      }
                    >
                      <div className="font-medium space-y-1 dark:text-white">
                        <div className="">{notification?.message}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {notification?.createdAt}
                        </div>
                      </div>

                      {/* Delete Icon */}
                      <span
                        className="cursor-pointer hover:scale-110 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      >
                        <MdDelete size={20} className="text-red-500" />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col justify-center space-y-1 items-center p-2">
                    <div className="bg-[#F1F1F1] p-5 rounded-full h-20 flex justify-center  w-20">
                      <BellDot
                        size={44}
                        strokeWidth={2.25}
                        className="mb-4 fill-[#E0DCEB]"
                      />
                    </div>
                    <p className="whitespace-nowrap text-red-500 font-bold text-md">
                      No Notifications Yet
                    </p>
                    <p className="whitespace-nowrap text-gray-400 font-semibold mb-2">
                      You have no notifications right now
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mark All as Read Button */}
            {allNotification.length !== 0 && (
              <>
                <div className="flex justify-end z-50 p-2 sticky bottom-0 bg-white">
                  <Button variant="default" onClick={handleMarkAllasRead}>
                    Mark all as read
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ShowNotification;
