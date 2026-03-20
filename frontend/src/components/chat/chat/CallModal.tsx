import { useEffect, useRef, useState } from "react";
import { useCallStore } from "@/stores/useCallStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { useWebRTC } from "@/features/useWebRTC";

interface CallProps {
  userId?: string;
  displayName: string;
}

const CallModal = ({ userId, displayName }: CallProps) => {
  const { isOpen, setIsOpen, callType } = useCallStore();

  const {
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    callUser,
    acceptCall,
    endCall,
    toggleMic,
    toggleCamera,
    incomingCall,
    inCall,
  } = useWebRTC(userId, callType);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const outgoingStartedRef = useRef(false);

  const [activeCallType, setActiveCallType] = useState<"audio" | "video">(callType);

  // Lưu type cuộc gọi để UI vẫn đúng sau khi acceptCall làm `incomingCall=null`.
  useEffect(() => {
    if (incomingCall?.callType) setActiveCallType(incomingCall.callType);
  }, [incomingCall?.callType]);

  const effectiveCallType = activeCallType;

  // ⏱ Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (inCall) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => clearInterval(timer);
  }, [inCall]);

  // 📞 Outgoing call start
  // Khi user bấm "call/video" trong header thì `startCall()` chỉ set state `isOpen` + `targetUserId`.
  // `CallModal` phải tự gọi `callUser()` để bắt đầu WebRTC và emit `call-user`.
  useEffect(() => {
    if (!isOpen) outgoingStartedRef.current = false;

    if (
      isOpen &&
      userId &&
      !incomingCall &&
      !inCall &&
      !outgoingStartedRef.current
    ) {
      outgoingStartedRef.current = true;
      callUser();
    }
  }, [isOpen, userId, incomingCall, inCall, callUser]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    endCall();
    setIsOpen(false);
  };

  // ❌ Không có call thì không render
  // Lưu ý: receiver không set `isOpen`, nên sau khi accept (`incomingCall=null`) vẫn cần render khi `inCall=true`.
  if (!isOpen && !incomingCall && !inCall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* 🎥 REMOTE VIDEO (render luôn để tránh race condition ref) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover ${
            effectiveCallType === "video" ? "" : "hidden"
          }`}
        />

        {/* 🎧 REMOTE AUDIO (render luôn để nghe được audio call) */}
        <audio ref={remoteAudioRef} autoPlay />

        {/* 🎥 LOCAL VIDEO (render luôn để tránh race condition ref) */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`absolute bottom-20 right-4 w-32 h-48 object-cover rounded-lg border-2 border-white/30 ${
            effectiveCallType === "video" ? "" : "hidden"
          }`}
        />

        {/* 🎧 AUDIO CALL UI */}
        {effectiveCallType === "audio" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-semibold mb-2">{displayName}</div>
            <div className="text-sm text-white/60">
              {inCall ? formatTime(duration) : "Đang gọi..."}
            </div>
          </div>
        )}

        {/* 📌 HEADER */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{displayName}</h3>
              <p className="text-white/60 text-xs">
                {inCall ? formatTime(duration) : "Đang gọi..."}
              </p>
            </div>

            <button
              onClick={handleEndCall}
              className="text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 🎮 CONTROLS */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
          {/* MIC */}
          <button
            onClick={() => {
              toggleMic();
              setIsMuted((prev) => !prev);
            }}
            className={`p-4 rounded-full ${
              isMuted ? "bg-red-500" : "bg-white/20"
            }`}
          >
            {isMuted ? (
              <MicOff className="text-white" />
            ) : (
              <Mic className="text-white" />
            )}
          </button>

          {/* CAMERA */}
          {callType === "video" && (
            <button
              onClick={() => {
                toggleCamera();
                setIsVideoOff((prev) => !prev);
              }}
              className={`p-4 rounded-full ${
                isVideoOff ? "bg-red-500" : "bg-white/20"
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="text-white" />
              ) : (
                <Video className="text-white" />
              )}
            </button>
          )}

          {/* END */}
          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="text-white" />
          </button>
        </div>

        {/* 📞 INCOMING CALL */}
        {incomingCall && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="bg-white/10 p-8 rounded-2xl text-center">
              <h3 className="text-white text-xl mb-4">{displayName}</h3>

              <p className="text-white/60 mb-4">
                Cuộc gọi {incomingCall.callType === "video" ? "video" : "thoại"}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleEndCall}
                  className="px-6 py-3 bg-red-500 rounded-full text-white"
                >
                  Từ chối
                </button>

                <button
                  onClick={acceptCall}
                  className="px-6 py-3 bg-green-500 rounded-full text-white"
                >
                  <Phone className="inline mr-2" size={16} />
                  Chấp nhận
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CallModal;
