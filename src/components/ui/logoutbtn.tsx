"use client";
import { AiOutlineLogout } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import axios from "axios";
import adminRoutes from "@/lib/adminRoutes";
import logout from "../../../public/icons/logout.svg";
const Logout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const handleLogout = async () => {
    const res = await axios.post("/api/logout");
    if (res.status === 200) {
      router.push("/login");
      window.location.reload();
    }
  };
  return (
    <button className="flex gap-3" onClick={handleLogout}>
      <AiOutlineLogout className="mt-1 text-lg" />
      <div>Logout</div>
    </button>
  );
};

export default Logout;
