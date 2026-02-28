import React from "react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const naviegate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      naviegate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout}>Đăng xuất</Button>;
};

export default Logout;
