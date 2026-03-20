import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import { useCallStore } from "@/stores/useCallStore";
import { usePeerConnection } from "./usePeerConnection";

type IncomingCallData = {
  from: { _id: string | { toString?: () => string } };
  offer: RTCSessionDescriptionInit;
  callType: "audio" | "video";
};

export const useWebRTC = (
  remoteUserId?: string,
  callType: "audio" | "video" = "video",
) => {
  const { socket } = useSocketStore();
  const { endCallUI } = useCallStore();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const peerIdRef = useRef<string | null>(null);

  const [incomingCall, setIncomingCall] =
    useState<IncomingCallData | null>(null);
  const [inCall, setInCall] = useState(false);

  const { pcRef, init, cleanup, toggleMic, toggleCamera } =
    usePeerConnection(
      socket,
      peerIdRef,
      localVideoRef,
      remoteVideoRef,
      remoteAudioRef,
    );

  // giữ nguyên phần còn lại (callUser, acceptCall, socket...)

  const callUser = async () => {
    if (!socket || !remoteUserId) return;

    peerIdRef.current = remoteUserId;

    const ok = await init(callType);
    if (!ok) return;

    const pc = pcRef.current!;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", {
      to: remoteUserId,
      offer,
      callType,
    });

    setInCall(true);
  };

  const acceptCall = async () => {
    if (!socket || !incomingCall) return;

    const callerId = String(
      incomingCall.from._id?.toString?.() ?? incomingCall.from._id,
    );
    if (!peerIdRef.current) peerIdRef.current = callerId;

    const ok = await init(incomingCall.callType);
    if (!ok) return;

    const pc = pcRef.current!;

    await pc.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer),
    );

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer-call", {
      to: String(incomingCall.from._id),
      answer,
    });

    setIncomingCall(null);
    setInCall(true);
  };

  const endCall = () => {
    const targetId = peerIdRef.current;

    if (socket && targetId) {
      socket.emit("end-call", { to: String(targetId) });
    }

    cleanup();

    peerIdRef.current = null;

    setIncomingCall(null);
    setInCall(false);
    endCallUI();
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", (data: IncomingCallData) => {
      const fromId = String(
        data.from._id?.toString?.() ?? data.from._id,
      );
      peerIdRef.current = fromId;
      setIncomingCall(data);
    });

    socket.on("call-answered", async ({ answer }) => {
      await pcRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (!candidate) return;

      await pcRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate),
      );
    });

    socket.on("call-ended", () => {
      endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [socket]);

  return {
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
  };
};