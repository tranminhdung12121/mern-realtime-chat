import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Key, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const emailSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP phải 6 số"),
});

const resetSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  const {
    forgotPasswordRequestOtp,
    verifyForgotPasswordOtp,
    resetPassword,
    resendOtp,
    loading,
  } = useAuthStore();

  const emailForm = useForm({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm({ resolver: zodResolver(otpSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetSchema) });

  // ✅ Timer chuẩn
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ⛳ STEP 1
  const handleSendEmail = async (data: any) => {
    try {
      await forgotPasswordRequestOtp(data.email);

      setEmail(data.email);
      setTimer(60);
      setStep(2);
    } catch (error) {
      console.error(error);
    }
  };

  // ⛳ STEP 2
  const handleVerifyOTP = async (data: any) => {
    try {
      await verifyForgotPasswordOtp(email, data.otp);
      setStep(3);
    } catch (error) {
      console.error(error);
    }
  };

  // ⛳ STEP 3
  const handleResetPassword = async (data: any) => {
    try {
      await resetPassword(data.password);

      // reset state
      setStep(1);
      setEmail("");
      setTimer(0);

      emailForm.reset();
      otpForm.reset();
      resetForm.reset();

      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  // 🔁 resend OTP
  const handleResend = async () => {
    try {
      await resendOtp(email);
      setTimer(60);
    } catch (error) {
      console.error(error);
    }
  };

  const steps = [
    { icon: Mail, title: "Quên mật khẩu", desc: "Nhập email để nhận mã OTP" },
    { icon: Key, title: "Xác thực OTP", desc: `OTP đã gửi tới ${email}` },
    { icon: Lock, title: "Đặt lại mật khẩu", desc: "Nhập mật khẩu mới" },
  ];

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}
      {...props}
    >
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-4 mb-6">
            <a href="/" className="flex items-center gap-2">
              <img src="/Group 1 (2).png" alt="logo" className="h-12 w-auto" />
              <span className="text-xl font-bold text-[#F97316]">Chatify</span>
            </a>

            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <h1 className="text-2xl font-bold text-gray-800">
                {steps[step - 1].title}
              </h1>
              <p className="text-sm text-gray-500">{steps[step - 1].desc}</p>
            </motion.div>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step >= s
                    ? "bg-[#F97316] text-white"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={emailForm.handleSubmit(handleSendEmail)}
                className="space-y-4"
              >
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </Label>
                  <Input
                    className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                    {...emailForm.register("email")}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button disabled={loading} className="w-full">
                  {loading ? "Đang gửi..." : "Gửi OTP"}
                </Button>
              </motion.form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={otpForm.handleSubmit(handleVerifyOTP)}
                className="space-y-4"
              >
                <Input
                  autoFocus
                  maxLength={6}
                  placeholder="Nhập OTP"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...otpForm.register("otp")}
                />

                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}

                {timer > 0 ? (
                  <p className="text-center text-sm text-gray-400">
                    Gửi lại mã sau{" "}
                    <span className="font-semibold text-orange-500">
                      {timer}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResend}
                    className="text-center text-sm text-orange-500 hover:underline"
                  >
                    Gửi lại OTP
                  </button>
                )}

                <Button
                  disabled={loading || otpForm.watch("otp")?.length !== 6}
                  className="w-full"
                >
                  {loading ? "Đang xác thực..." : "Xác nhận OTP"}
                </Button>
              </motion.form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={resetForm.handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <Input
                  type="password"
                  placeholder="Mật khẩu mới"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...resetForm.register("password")}
                />

                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...resetForm.register("confirmPassword")}
                />

                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}

                <Button disabled={loading} className="w-full">
                  {loading ? "Đang đổi..." : "Đổi mật khẩu"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <a
              href="/signin"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors"

            >
              <ArrowLeft className="h-3 w-3" />
              Quay lại đăng nhập
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
