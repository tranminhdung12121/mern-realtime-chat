import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
const signInSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(2, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { email, password } = data;
    await signIn(email, password);
    navigate("/");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a
                  href="/"
                  className="mx-auto flex items-center gap-2 w-fit group"
                >
                  <img
                    src="/Group 1 (2).png"
                    alt="logo"
                    className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xl font-bold text-[#F97316]">
                    Chatify
                  </span>
                </a>
                <h1 className="text-2xl font-bold text-gray-800">
                  Chào mừng quay lại
                </h1>
                <p className="text-muted-foreground text-balance">
                  Đăng nhập vào tài khoản của bạn
                </p>
              </div>

              {/* email */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  type="text"
                  id="email"
                  placeholder="chatify@gmail.com"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <a
                  href="/forgot-password"
                  className="text-right text-xs h-full text-gray-500 hover:text-[#F97316] transition-colors relative hover:after:w-full "
                >
                  Quên mật khẩu?
                </a>
              </div>
              {/* nút đăng nhập */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-[#F97316] hover:bg-[#FB923C] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>
                {/* ✅ GOOGLE LOGIN */}
                <div className="w-full relative group">
                  <div className="relative w-full [&>div]:w-full [&>div>div]:!rounded-xl [&>div>div]:!shadow-none">
                    <GoogleLogin
                      theme="outline"
                      size="large"
                      shape="pill"
                      width="100%"
                      auto_select={false}
                      onSuccess={async (credentialResponse) => {
                        if (!credentialResponse.credential) return;
                        await googleLogin(credentialResponse.credential);
                        navigate("/");
                      }}
                      onError={() => {
                        console.log("Google Login Failed");
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a
                  href="/signup"
                  className="text-[#F97316] hover:text-[#FB923C] font-medium underline underline-offset-4 transition-colors"
                >
                  Đăng ký
                </a>
              </div>
            </div>
          </form>

          <div className="bg-gradient-to-br from-[#F97316] to-[#FB923C] relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-lg font-semibold">Kết nối với bạn bè</p>
              <p className="text-sm opacity-90">Trò chuyện mọi lúc, mọi nơi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-balance px-6 text-center text-gray-500">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a
          href="/terms"
          className="text-[#F97316] hover:text-[#FB923C] underline underline-offset-4 transition-colors"
        >
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a
          href="/privacy"
          className="text-[#F97316] hover:text-[#FB923C] underline underline-offset-4 transition-colors"
        >
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </div>
    </div>
  );
}
