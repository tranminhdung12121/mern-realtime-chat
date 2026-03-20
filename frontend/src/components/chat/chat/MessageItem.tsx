import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "../UserAvatar";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Clock, MoreHorizontal, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "@/stores/useChatStore";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "đã gửi" | "đã xem";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const deleteMessage = useChatStore((s) => s.deleteMessage);

  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString(),
  );
console.log("aiid",message.senderId)
  const handleRecall = () => {
  deleteMessage(message._id, message.conversationId);
};

  return (
    <>
      {/* Time separator */}
      {isShowTime && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center my-2"
        >
          <Badge
            variant="outline"
            className="text-xs bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-orange-200 dark:border-zinc-700"
          >
            <Clock className="h-3 w-3 mr-1 text-orange-500" />
            {formatMessageTime(new Date(message.createdAt))}
          </Badge>
        </motion.div>
      )}

      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Chatify"}
                id={message.senderId || ""}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* message bubble */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col group relative",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          {/* recall menu */}
          {message.isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                  absolute
                  -left-8
                  top-1
                  opacity-0
                  group-hover:opacity-100
                  transition
                  text-zinc-400
                  hover:text-zinc-600
                  "
                >
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={handleRecall}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Thu hồi tin nhắn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* message card */}
          <Card
            className={cn(
              "p-3 space-y-2",
              message.isOwn
                ? "chat-bubble-sent border-0"
                : "chat-bubble-received",
            )}
          >
            {/* recalled message */}
            
              <>
                {/* text */}
                {message.content && (
                  <p className="text-sm leading-relaxed break-words">
                    {message.content}
                  </p>
                )}

                {/* attachments */}
                {message.attachments?.map((file, i) => {
                  if (file.type === "image") {
                    return (
                      <Dialog key={i}>
                        <DialogTrigger asChild>
                          <img
                            src={file.url}
                            className="rounded-lg max-w-[220px] cursor-pointer hover:scale-105 transition"
                          />
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
                          <div className="relative">
                            <img
                              src={file.url}
                              className="w-full h-auto rounded-lg"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  }

                  if (file.type === "video") {
                    return (
                      <video
                        key={i}
                        src={file.url}
                        controls
                        className="rounded-lg max-w-[220px]"
                      />
                    );
                  }

                  return (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      className="text-blue-500 underline text-sm"
                    >
                      Tải file
                    </a>
                  );
                })}
              </>
            
          </Card>

          {/* seen / delivered */}
          {message.isOwn &&
            message._id === selectedConvo.lastMessage?._id && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-1.5 py-0.5 h-4 border-0",
                  lastMessageStatus === "đã xem"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {lastMessageStatus}
              </Badge>
            )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;
