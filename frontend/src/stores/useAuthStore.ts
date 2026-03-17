import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      setUser: (user) => {
        set({ user });
      },

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
      },

      signUp: async (password, email, phone, firstName, lastName) => {
        try {
          set({ loading: true });
          //api
          await authService.signUp(password, email, phone, firstName, lastName);
          toast.success("Vui lòng xác thực OTP của bạn để hoàn tất đăng ký!");
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký không thành công");
        } finally {
          set({ loading: false });
        }
      },

      verifySignupOtp: async (email, otp) => {
        try {
          set({ loading: true });

          await authService.verifySignupOtp(email, otp);

          toast.success("Xác thực OTP thành công! Hãy đăng nhập");
        } catch (error) {
          console.error(error);
          toast.error("OTP không hợp lệ");
        } finally {
          set({ loading: false });
        }
      },

      resendOtp: async (email) => {
        try {
          await authService.resendOtp(email);

          toast.success("OTP mới đã được gửi");
        } catch (error) {
          console.error(error);

          toast.error("Không thể gửi lại OTP");
        }
      },

      signIn: async (email, password) => {
        try {
          get().clearState();
          set({ loading: true });

          useChatStore.getState().reset();

          const { accessToken } = await authService.signIn(email, password);
          get().setAccessToken(accessToken);

          await get().fetchMe();
          useChatStore.getState().fetchConversations();

          toast.success("Chào mừng bạn quay lại với Chatify 🎉");
        } catch (error) {
          console.error(error);
          toast.error("Đăng nhập không thành công!");
        } finally {
          set({ loading: false });
        }
      },
      googleLogin: async (credential: string) => {
        try {
          get().clearState();
          set({ loading: true });

          const { accessToken } = await authService.googleLogin(credential);

          get().setAccessToken(accessToken);

          await get().fetchMe();

          useChatStore.getState().fetchConversations();

          toast.success("Đăng nhập Google thành công 🎉");
        } catch (error) {
          console.error(error);
          toast.error("Google login thất bại!");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Đăng xuất thành công!");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi xảy ra khi đăng xuất. Hãy thử lại!");
        }
      },
      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({ loading: false });
        }
      },
      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe, setAccessToken } = get();
          const accessToken = await authService.refresh();
          setAccessToken(accessToken);
          if (!user) {
            await fetchMe();
            useChatStore.getState().fetchConversations();
          }
        } catch (error) {
          console.error(error);
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), //chỉ persist user
    },
  ),
);
