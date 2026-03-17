import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/sidebarDirect/AddFriendModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import type { SearchUser } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, UserPlus, Sparkles, Shield } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface SendRequestProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  user: SearchUser;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  user,
  onSubmit,
  onBack,
}: SendRequestProps) => {
  const [message, setMessage] = useState("");

  // Gợi ý tin nhắn
  const messageSuggestions = [
    "👋 Chào bạn, mình có thể kết bạn được không?",
    "✨ Mình thấy chúng ta có nhiều điểm chung, kết bạn nhé!",
    "💬 Rất vui được làm quen với bạn!",
    "🌟 Mình muốn kết bạn để trò chuyện cùng bạn!",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    // Cập nhật giá trị trong react-hook-form
    const event = { target: { name: "message", value: suggestion } };
    register("message").onChange(event);
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      {/* Background decoration */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-amber-50/30 
        rounded-2xl pointer-events-none"
      ></div>

      <div className="relative space-y-6">
        {/* User info card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="group relative"
        >
          {/* Glow background */}
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-0 
    bg-gradient-to-r from-orange-300/20 via-orange-200/30 to-amber-300/20
    group-hover:opacity-100 transition duration-500"
          />

          {/* Card */}
          <div
            className="relative flex items-center gap-4 p-5 rounded-2xl
    border border-orange-100/60
    bg-gradient-to-br from-white to-orange-50/30
    shadow-md hover:shadow-lg
    hover:border-orange-200
    transition-all duration-300"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {/* avatar glow */}
              <div
                className="absolute inset-0 rounded-full blur-md opacity-0
        bg-gradient-to-r from-orange-400 to-amber-400
        group-hover:opacity-60 transition duration-300"
              />

              <UserAvatar
                type="sidebar"
                name={user.displayName ?? ""}
                avatarUrl={user.avatarUrl ?? undefined}
                className="relative size-14 ring-4 ring-white shadow-lg 
        group-hover:ring-orange-100 transition"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <span
                className="text-base font-semibold text-gray-800
        group-hover:text-orange-600 transition"
              >
                {user.displayName}
              </span>

              <span
                className="text-xs text-gray-500 font-mono
        group-hover:text-orange-500 transition"
              >
                Email: {user.email}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Message section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Label
              htmlFor="message"
              className="text-base font-semibold text-gray-700 
              flex items-center gap-2"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-100 to-amber-100">
                <Send className="h-4 w-4 text-orange-600" />
              </div>
              Lời giới thiệu
            </Label>

            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              <Shield className="h-3 w-3 mr-1" />
              Riêng tư
            </Badge>
          </div>

          {/* Message suggestions */}
          <div className="flex flex-wrap gap-2">
            {messageSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-xs bg-white border border-orange-200 rounded-full
                  hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50
                  hover:border-orange-300 hover:text-orange-700 shadow-sm
                  transition-all duration-300"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>

          {/* Textarea */}
          <div className="relative group">
            <Textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                register("message").onChange(e);
              }}
              className="w-full p-4 border-2 border-orange-100/50 rounded-xl
                focus:border-orange-300 focus:ring-4 focus:ring-orange-100
                bg-white/80 backdrop-blur-sm resize-none
                placeholder:text-gray-400 text-gray-700
                transition-all duration-300
                group-hover:border-orange-200"
              placeholder="Viết lời giới thiệu để gửi kết bạn..."
            />

            {/* Character count */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {message.length}/300
            </div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
          >
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-semibold">Mẹo:</strong> Lời giới thiệu
                chân thành và ấm áp sẽ giúp bạn dễ dàng kết bạn hơn!
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 h-11 border-2 border-orange-200 hover:border-orange-300
                hover:bg-orange-50 hover:text-orange-700
                transition-all duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </Button>

            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-amber-500 
                hover:from-orange-600 hover:to-amber-600 text-white font-semibold
                shadow-lg shadow-orange-200/50 hover:shadow-orange-300/50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 transform hover:scale-[1.02]
                group relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="h-4 w-4 border-2 border-white border-t-transparent 
                      rounded-full animate-spin"
                    ></div>
                    Đang gửi lời mời...
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Kết bạn
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shimmer effect */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                transition-transform duration-1000 bg-gradient-to-r from-transparent 
                via-white/20 to-transparent"
              ></div>
            </Button>
          </DialogFooter>
        </motion.div>
      </div>
    </form>
  );
};

export default SendFriendRequestForm;
