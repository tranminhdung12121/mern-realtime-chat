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

const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên bắt buộc phải có"),
  lastname: z.string().min(1, "Họ bắt buộc phải có"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(11, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstname, lastname, email, phone, password } = data;
    await signUp(password, email, phone, firstname, lastname);
    navigate(`/verify-otp?email=${email}`);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a
                  href="/"
                  className="mx-auto flex items-center gap-2 w-fit group"
                >
                  <img
                    src="/logoChatify.png"
                    alt="logoChatify"
                    className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xl font-bold text-[#F97316]">
                    Chatify
                  </span>
                </a>
                <h1 className="text-2xl font-bold text-gray-800">
                  Tạo tài khoản
                </h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu
                </p>
              </div>

              {/* họ và tên */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Nguyễn"
                    className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                    {...register("lastname")}
                  />
                  {errors.lastname && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="Văn A"
                    className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
              </div>

              
              {/* email */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  type="email"
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
              {/* phone */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số điện thoại
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="0901234567"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••"
                  className="border-gray-300 focus:border-[#F97316] focus:ring-[#F97316] focus:ring-1 focus:outline-none transition-colors"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* nút đăng ký */}
              <Button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#FB923C] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-[38px] text-base rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>

              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a
                  href="/signin"
                  className="text-[#F97316] hover:text-[#FB923C] font-medium underline underline-offset-4 transition-colors"
                >
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>

          <div className="bg-gradient-to-br from-[#F97316] to-[#FB923C] relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-lg font-semibold">
                Tham gia cộng đồng Chatify
              </p>
              <p className="text-sm opacity-90">
                Kết nối với hàng triệu người dùng
              </p>
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
