import { Helmet } from "react-helmet-async";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>Lấy lại mật khẩu | Chatify</title>
        <meta
          name="description"
          content="Khôi phục mật khẩu Chatify nhanh chóng và an toàn."
        />
      </Helmet>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
        <div className="w-full max-w-sm md:max-w-lg">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
