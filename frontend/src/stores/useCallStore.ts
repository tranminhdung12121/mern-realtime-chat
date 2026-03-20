import type { CallState } from "@/types/store";
import { create } from "zustand";



export const useCallStore = create<CallState>((set) => ({
  isOpen: false,
  targetUserId: null,
  callType: "video",

  startCall: (userId, callType = "video") =>
    set({
      isOpen: true,
      targetUserId: userId,
      callType,
    }),

  endCallUI: () =>
    set({
      isOpen: false,
      targetUserId: null,
    }),
    
    setIsOpen: (open) => set({ isOpen: open }),
}));