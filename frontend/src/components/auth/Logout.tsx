import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const { setTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      setTheme(false); 
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-2 w-full cursor-pointer"
    >
      <LogOut className="text-destructive size-4" />
      Đăng xuất
    </div>
  );
};

export default Logout;
