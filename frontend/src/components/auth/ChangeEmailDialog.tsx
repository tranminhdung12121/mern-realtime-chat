import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ChangeEmailDialog = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  const { updateEmail, verifyUpdateEmailOtp, resendOtp } = useAuthStore();

  // ✅ đúng chuẩn hook
  useEffect(() => {
    if (step !== 2 || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmail(email, password);
      setStep(2);
      setTimer(60);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyUpdateEmailOtp(email, otp);
      setStep(1);
      setEmail("");
      setPassword("");
      setOtp("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await resendOtp(email);
      setTimer(60);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật email</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email mới</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button className="w-full bg-[#F97316]">Gửi OTP</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label>Nhập OTP</Label>
              <Input
                placeholder="6 số OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <Button className="w-full bg-[#F97316]">Xác nhận</Button>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-400">
                  Gửi lại mã sau{" "}
                  <span className="font-semibold text-orange-500">
                    {timer}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium hover:underline"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
