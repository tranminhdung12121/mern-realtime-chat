import { useRef } from "react";

export const usePeerConnection = (
  socket: any,
  peerIdRef: React.MutableRefObject<string | null>,
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  remoteAudioRef: React.MutableRefObject<HTMLAudioElement | null>,
) => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const videoUnavailableRef = useRef(false);
  const audioUnavailableRef = useRef(false);
  const initInFlightRef = useRef<Promise<boolean> | null>(null);

  const init = async (type: "audio" | "video") => {
    const wantsVideoRequested = type === "video";
    const wantsVideo = wantsVideoRequested && !videoUnavailableRef.current;
    const wantsAudio = !audioUnavailableRef.current;

    if (initInFlightRef.current) {
      await initInFlightRef.current.catch(() => {});
      const existing = localStreamRef.current;
      if (existing) {
        const hasAudio = existing.getAudioTracks().length > 0;
        const hasVideo = existing.getVideoTracks().length > 0;
        if (hasAudio && (!wantsVideo || hasVideo)) return true;
      }
    }

    initInFlightRef.current = (async () => {
      try {
        const existing = localStreamRef.current;
        if (existing) {
          const hasAudio = existing.getAudioTracks().length > 0;
          const hasVideo = existing.getVideoTracks().length > 0;

          if (hasAudio && (!wantsVideo || hasVideo)) {
            if (!pcRef.current) {
              const pc = new RTCPeerConnection({
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject",
                  },
                ],
              });

              existing.getTracks().forEach((track) =>
                pc.addTrack(track, existing),
              );

              pc.ontrack = (event) => {
                const remoteStream =
                  event.streams?.[0] ??
                  (event.track ? new MediaStream([event.track]) : null);
                if (!remoteStream) return;

                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream;
                  remoteVideoRef.current.play().catch(() => {});
                }

                if (remoteAudioRef.current) {
                  remoteAudioRef.current.srcObject = remoteStream;
                  remoteAudioRef.current.play().catch(() => {});
                }
              };

              pc.onicecandidate = (event) => {
                const targetId = peerIdRef.current;
                if (event.candidate && socket && targetId) {
                  socket.emit("ice-candidate", {
                    to: String(targetId),
                    candidate: event.candidate,
                  });
                }
              };

              pcRef.current = pc;
            }

            return true;
          }
        }

        let stream: MediaStream | null = null;

        if (wantsVideo || wantsAudio) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: wantsVideo,
              audio: wantsAudio,
            });
          } catch (err: any) {
            const isDeviceInUse =
              err?.name === "NotReadableError" ||
              String(err?.message ?? "")
                .toLowerCase()
                .includes("device in use");

            if (wantsVideoRequested && isDeviceInUse) {
              videoUnavailableRef.current = true;

              if (wantsAudio) {
                try {
                  stream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true,
                  });
                } catch (err2: any) {
                  const audioInUse =
                    err2?.name === "NotReadableError" ||
                    String(err2?.message ?? "")
                      .toLowerCase()
                      .includes("device in use");
                  if (audioInUse) {
                    audioUnavailableRef.current = true;
                    stream = null;
                  } else {
                    throw err2;
                  }
                }
              } else {
                stream = null;
              }
            } else if (isDeviceInUse) {
              if (!wantsVideoRequested) {
                audioUnavailableRef.current = true;
              }
              stream = null;
            } else {
              throw err;
            }
          }
        }

        if (stream) {
          localStreamRef.current = stream;

          if (localVideoRef.current && stream.getVideoTracks().length > 0) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(() => {});
          }
        }

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ],
        });

        if (stream) {
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        }

        pc.ontrack = (event) => {
          const remoteStream =
            event.streams?.[0] ??
            (event.track ? new MediaStream([event.track]) : null);
          if (!remoteStream) return;

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(() => {});
          }

          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play().catch(() => {});
          }
        };

        pc.onicecandidate = (event) => {
          const targetId = peerIdRef.current;
          if (event.candidate && socket && targetId) {
            socket.emit("ice-candidate", {
              to: String(targetId),
              candidate: event.candidate,
            });
          }
        };

        pcRef.current = pc;
        return true;
      } catch (err) {
        console.error("❌ getUserMedia error:", err);
        return false;
      }
    })();

    try {
      return await initInFlightRef.current;
    } finally {
      initInFlightRef.current = null;
    }
  };

  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    videoUnavailableRef.current = false;
    audioUnavailableRef.current = false;
  };

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
  };

  return {
    pcRef,
    init,
    cleanup,
    toggleMic,
    toggleCamera,
  };
};