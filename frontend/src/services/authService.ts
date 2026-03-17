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
};
