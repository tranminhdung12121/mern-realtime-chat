import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>((set, get) => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });

        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Lỗi khi updateAvatarUrl", error);
      toast.error("Upload avatar không thành công!");
    }
  },
  updateInforMe: async (displayName, phone, bio) => {
  try {
    const { user, setUser } = useAuthStore.getState();

    const data = await userService.updateInforMe(
      displayName,
      phone,
      bio
    );

    if (user) {
      setUser({
        ...user,
        displayName: data.user.displayName,
        phone: data.user.phone,
        bio: data.user.bio,
      });
    }

    toast.success("Cập nhật thông tin thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin", error);
    toast.error("Cập nhật thông tin không thành công!");
  }
}

}));
