import { SidebarInset } from "../../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-[#f8e7dd] dark:bg-zinc-950">
      <ChatWindowHeader />

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-md px-3 py-5 rounded-3xl bg-white dark:bg-zinc-900 shadow-lg border border-[#f55718]/20">
          {/* Logo */}
          <div className="relative mx-auto mb-4 w-fit h-fit">
            {/* Glow animation */}
            <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-2xl opacity-40 animate-pulse pulse-ring"></div>
            {/* Logo */}
            <img
              src="/logoLayout.png"
              alt="Chatify Logo"
              className="relative max-w-[270px] h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-1 leading-normal bg-gradient-to-r from-[#f55718] to-[#ff7a45] bg-clip-text text-transparent">
            Chào mừng đến với Chatify
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Chọn một cuộc hội thoại để bắt đầu trò chuyện với bạn bè của bạn.
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
