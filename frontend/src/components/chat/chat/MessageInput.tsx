import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useState } from "react";
import { Button } from "../../ui/button";
import { ImagePlus, Send, X } from "lucide-react";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const isAskingAI = value.toLowerCase().includes("@ai");

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!value.trim() && files.length === 0) return;

    const currValue = value;
    const currFiles = files;

    setValue("");
    setFiles([]);

    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.find((p) => p._id !== user._id);

        if (!otherUser) return;

        await sendDirectMessage(otherUser._id, currValue, currFiles);
      } else {
        await sendGroupMessage(selectedConvo._id, currValue, currFiles);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-3 bg-background border-t">
      {isAskingAI && (
        <div className="mb-2 flex items-center gap-2 text-sm text-purple-500">
          🤖 Đang hỏi Chatify AI
        </div>
      )}
      {/* preview files */}
      {files.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {files.map((file, index) => {
            const url = URL.createObjectURL(file);

            return (
              <div key={index} className="relative w-20 h-20">
                {file.type.startsWith("image") ? (
                  <img
                    src={url}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <video
                    src={url}
                    className="w-full h-full object-cover rounded"
                  />
                )}

                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="file"
          multiple
          hidden
          id="fileInput"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <ImagePlus className="size-4" />
        </Button>

        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Soạn tin nhắn..."
            className="pr-16"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <EmojiPicker
              onChange={(emoji: string) => setValue((prev) => prev + emoji)}
            />
          </div>
        </div>

        <Button
          onClick={sendMessage}
          disabled={!value.trim() && files.length === 0}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
