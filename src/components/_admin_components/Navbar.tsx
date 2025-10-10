"use client";
import { IoSettingsOutline } from "react-icons/io5";
import GreetingComponent from "./greeting";
import { Toaster } from "../ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsChevronDown } from "react-icons/bs";
import Logout from "../ui/logoutbtn";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Notification from "./notifications/page";
import axios from "axios";
import displayError from "@/lib/display-error";
import { FiRefreshCw } from "react-icons/fi";

interface NavDropdownClientProps {
  username: string | undefined;
}
const NavDashboard = ({ username }: NavDropdownClientProps) => {
  const { toast } = useToast();
  async function handlePurgeCache() {
    toast({
      title: "Purging cache...",
      description: "Please wait while we refresh the cache.",
      variant: "default",
      className: "bg-yellow-600 text-white ",
    });
    // const toastId = toast.loading("Purging cache...");
    try {
      const response = await axios.post("/api/revalidate", {
        paths: ["/"],
        tags: ["promotions"],
        purgeEverything: true,
      });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Cache purged successfully!",
          variant: "default",
          className: "bg-green-600 text-white ",
        });
        // toast({
        //   title: "Success",
        //   description: "Cache purged successfully!",
        //   variant: "default",
        // });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purge cache. Please try again.",
        variant: "destructive",
      });
      console.error("Cache purge error:", error);
    }
  }
  return (
    <nav className=" shadow  border-gray-200 ">
      <div className="container mx-auto flex justify-between items-center py-4 ">
        <div className="text-xl font-bold">
          <GreetingComponent />
        </div>
        <div className="flex items-center space-x-2">
          <Notification />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-300 px-3 py-2 rounded-md">
              <span className="font-semibold">{username}</span>
              <BsChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-600">
                <Link
                  href="/admin/change-password"
                  className="flex items-center gap-2"
                >
                  <IoSettingsOutline className="text-lg" />
                  <span>Change Password</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handlePurgeCache}
                className="hover:bg-gray-600"
              >
                <div className="flex items-center gap-2  cursor-pointer">
                  <FiRefreshCw className="text-lg" />
                  <span>Purge Cache</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-gray-600">
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavDashboard;
