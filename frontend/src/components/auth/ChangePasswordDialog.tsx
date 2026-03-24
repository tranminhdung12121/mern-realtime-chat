import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ChangePasswordDialog = ({ open, onOpenChange }: Props) => {
  const { updatePassword } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!currentPassword) {
      return toast.error("Vui lòng nhập mật khẩu hiện tại!");
    }

    if (password !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }

    if (password.length < 6) {
      return toast.error("Mật khẩu phải ít nhất 6 ký tự!");
    }

    try {
      await updatePassword(currentPassword, password, confirmPassword);

      // reset form
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      onOpenChange(false);
    } catch (error) {console.error(error)}
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()} // 🔥 FIX CHÍNH
      >
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Mật khẩu hiện tại</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mật khẩu mới</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Nhập lại mật khẩu mới</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 🔥 FIX CHÍNH
              handleSubmit();
            }}
            className="w-full bg-[#F97316]"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
