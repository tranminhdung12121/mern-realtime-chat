import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useLayoutEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCallStore } from "@/stores/useCallStore";
import CallModal from "./CallModal";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();
  const { user } = useAuthStore();
  const { targetUserId } = useCallStore();

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );
  // trạng thái tin nhắn
  const currentUserId = user?._id;

  const seenBy = selectedConvo?.seenBy ?? [];
  const lastSenderId = selectedConvo?.lastMessage?.sender?._id;

  const isSeen =
    !!currentUserId &&
    lastSenderId === currentUserId &&
    seenBy.some((u) => u._id !== currentUserId);

  const lastMessageStatus: "đã gửi" | "đã xem" = isSeen ? "đã xem" : "đã gửi";

  const key = `chat-scroll-${activeConversationId}`;
  // ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // kéo xuống dưới khi load convo
  useLayoutEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current?.scrollIntoView({ block: "end" }); //behavior: "smooth",
  }, [activeConversationId]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    }

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Lỗi xảy ra khi fetch thêm tin", error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) {
      return;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item);
      requestAnimationFrame(() => {
        // cuộn sau khi trình duyệt đã chayj xong layout
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }
  return (
    <div className="p-3 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
      >
        {/* Always mount `Call` so recipient can listen for `incoming-call` events */}
        <CallModal userId={targetUserId ?? undefined } displayName={user?.displayName ?? "ẩn danh"}/>
        <div ref={messagesEndRef}></div>
        {(!messages || messages.length === 0) && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Chưa có tin nhắn nào trong cuộc trò chuyện này.
          </div>
        )}
        {messages?.length ? (
          <>
            {/*flex-col-reverse*/}
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMoreMessages}
              hasMore={hasMore}
              scrollableTarget="scrollableDiv"
              loader={<p>Đang tải...</p>}
              inverse={true}
              style={{
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "visible",
              }}
            >
              {reversedMessages.map((message, index) => (
                <MessageItem
                  key={message._id ?? index}
                  message={message}
                  index={index}
                  messages={reversedMessages}
                  selectedConvo={selectedConvo}
                  lastMessageStatus={lastMessageStatus}
                />
              ))}
            </InfiniteScroll>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ChatWindowBody;
