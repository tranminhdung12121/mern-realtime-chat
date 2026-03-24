import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
  type: "sidebar" | "chat" | "profile";
  name: string;
  id: string;
  avatarUrl?: string;
  className?: string;
}

const UserAvatar = ({ type, name, id, avatarUrl, className }: IUserAvatarProps) => {
  const isAI = id === "000000000000000000000001"; // 🔥 xác định AI
  const bgColor = isAI
    ? "bg-gradient-to-r from-purple-500 to-pink-500" // AI đẹp hơn
    : !avatarUrl
    ? "bg-blue-500"
    : "";

  if (!name) {
    name = isAI ? "AI" : "User";
  }

  return (
    <Avatar
      className={cn(
        className ?? "",
        type === "sidebar" && "size-12 text-base",
        type === "chat" && "size-8 text-sm",
        type === "profile" && "size-24 text-3xl shadow-md",
        isAI && "ring-purple-400" // 🔥 viền riêng cho AI
      )}
    >
      <AvatarImage src={avatarUrl} alt={name} />

      <AvatarFallback className={`${bgColor} text-white font-semibold`}>
        {isAI ? "🤖" : name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
