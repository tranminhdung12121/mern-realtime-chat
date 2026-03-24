import api from "@/lib/axios";

export const authService = {
  signUp: async (
    password: string,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        password,
        email,
        phone,
        firstName,
        lastName,
      },
      { withCredentials: true },
    );
    return res.data;
  },
  verifySignupOtp: async (email: string, otp: string) => {
    const res = await api.post("/auth/verify-signup-otp", {
      email,
      otp,
    });

    return res.data;
  },

  resendOtp: async (email: string) => {
    const res = await api.post("/auth/resend-otp", {
      email,
    });

    return res.data;
  },

  signIn: async (email: string, password: string) => {
    const res = await api.post(
      "auth/signin",
      { email, password },
      { withCredentials: true },
    );
    return res.data; // access token
  },

  googleLogin: async (credential: string) => {
    const res = await api.post(
      "/auth/google",
      { credential },
      { withCredentials: true },
    );
    return res.data;
  },

  signOut: async () => {
    return api.post("/auth/signout", { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },

  forgotPasswordRequestOtp: async (email: string) => {
    const res = await api.post("/auth/forgot-password/request-otp", { email });
    return res.data;
  },

  verifyForgotPasswordOtp: async (email: string, otp: string) => {
    const res = await api.post("/auth/forgot-password/verify-otp", {
      email,
      otp,
    });
    return res.data; // có resetToken
  },

  resetPassword: async (password: string, resetToken: string) => {
    const res = await api.patch(
      "/auth/forgot-password/reset",
      { password },
      {
        headers: {
          Authorization: `Bearer ${resetToken}`,
        },
      },
    );
    return res.data;
  },

  updatePassword: async (
    currentPassword: string,
    password: string,
    confirmPassword: string,
  ) => {
    const res = await api.patch(
      "/users/updatePassword",
      {
        currentPassword,
        password,
        confirmPassword,
      },
      { withCredentials: true },
    );
    return res;
  },
  updateEmail: async (email: string, currentPassword: string) => {
    const res = await api.patch(
      "/users/updateEmail",
      { email, currentPassword },
      { withCredentials: true },
    );
    return res.data;
  },

  verifyUpdateEmailOtp: async (email: string, otp: string) => {
    const res = await api.patch(
      "/users/updateEmailOtp",
      { email, otp },
      { withCredentials: true },
    );
    return res.data;
  },
};
