import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-[#f8e7dd] dark:bg-zinc-950">
      <ChatWindowHeader />

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-md px-6 py-10 rounded-3xl bg-white dark:bg-zinc-900 shadow-lg border border-[#f55718]/20">

          {/* Icon */}
          <div className="size-24 mx-auto mb-6 rounded-full flex items-center justify-center 
          bg-gradient-to-br from-[#f55718] to-[#ff7a45] shadow-md">
            <span className="text-4xl">💬</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#f55718] to-[#ff7a45] bg-clip-text text-transparent">
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
