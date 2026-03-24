import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";
import { toast } from "sonner";

const SentRequests = () => {
  const { sentList, declineRequest, loading } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào.
      </p>
    );
  }
  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info("Đã hủy yêu cầu kết bạn");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type="sent"
            actions={
              <div className="flex items-center justify-between gap-3 p-3">
                <Button
                  size="sm"
                  variant="destructiveOutline"
                  className="bg-gray-200"
                  onClick={() => handleDecline(req._id)}
                  disabled={loading}
                >
                  Hủy yêu cầu
                </Button>
              </div>
            }
          />
        ))}
      </>
    </div>
  );
};

export default SentRequests;
