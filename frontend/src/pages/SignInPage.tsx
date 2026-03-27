import { Helmet } from "react-helmet-async";
import { SigninForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <>
      <Helmet>
        <title>Đăng nhập | Chatify</title>
        <meta
          name="description"
          content="Đăng nhập vào Chatify để bắt đầu trò chuyện trực tuyến nhanh chóng và bảo mật."
        />
      </Helmet>

      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SigninForm />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
