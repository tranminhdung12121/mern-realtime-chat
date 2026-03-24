import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import { useState } from "react";
import UserAvatar from "../chat/UserAvatar";

interface RequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem = ({
  requestInfo,
  actions,
  type,
}: RequestItemProps) => {
  const [showMessage, setShowMessage] = useState(false);

  if (!requestInfo) return null;

  const info = type === "sent" ? requestInfo.to : requestInfo.from;
  if (!info) return null;

  return (
    <div
      className="p-4 rounded-xl border bg-background hover:bg-muted/40 transition cursor-pointer"
      onClick={() => setShowMessage((prev) => !prev)}
    >
      {/* top */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <UserAvatar
            type="sidebar"
            name={info.displayName}
            id={info._id}
            avatarUrl={info.avatarUrl}
          />

          <div className="flex flex-col">
            <span className="font-medium text-sm">{info.displayName}</span>

            <span className="text-xs text-muted-foreground">{info.email}</span>
          </div>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      </div>

      {/* message */}
      {showMessage && requestInfo.message && (
        <div className="mt-3 ml-11 text-sm bg-muted px-3 py-2 rounded-lg break-words">
          {requestInfo.message}
        </div>
      )}
    </div>
  );
};

export default FriendRequestItem;
