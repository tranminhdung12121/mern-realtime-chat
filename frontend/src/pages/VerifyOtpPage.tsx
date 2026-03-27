import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function VerifyOtpPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const { verifySignupOtp, resendOtp } = useAuthStore();
  const navigate = useNavigate();

  // countdown resend OTP
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  const handleVerify = async () => {
    if (!email || otp.length !== 6) return;

    await verifySignupOtp(email, otp);

    navigate("/signin");
  };

  const handleResend = async () => {
    if (!email) return;

    await resendOtp(email);

    setTimer(60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-50",
        className,
      )}
      {...props}
    >
      <Card className="w-full max-w-md p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* back button */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Quay lại đăng ký</span>
          </button>

          {/* header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="logo" className="h-14" />
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Xác thực OTP
            </h1>

            <p className="text-sm text-gray-500">
              Mã xác thực đã gửi đến{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          {/* OTP input */}
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            placeholder="Nhập mã OTP"
            className="h-14 text-center text-xl font-bold border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl tracking-widest"
          />

          {/* verify button */}
          <Button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận OTP
          </Button>

          {/* resend */}
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-gray-400">
                Gửi lại mã sau{" "}
                <span className="font-semibold text-orange-500">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium hover:underline underline-offset-4 transition-all"
              >
                Gửi lại mã OTP
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
