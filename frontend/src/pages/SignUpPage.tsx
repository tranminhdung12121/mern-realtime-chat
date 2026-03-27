import { Helmet } from "react-helmet-async";
import { SignupForm } from "@/components/auth/signup-form";

const SignUpPage = () => {
  return (
    <>
      <Helmet>
        <title>Đăng ký tài khoản | Chatify</title>
        <meta
          name="description"
          content="Tạo tài khoản Chatify miễn phí để kết nối và trò chuyện trực tuyến nhanh chóng."
        />
      </Helmet>

      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-purple px-4 py-5 overflow-y-auto">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignupForm />
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
