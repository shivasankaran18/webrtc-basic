
import React, { ReactHTML, useEffect, useRef, useState } from "react";

export const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:6969');
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'receiver',
        })
      );
    };

    const peerConnection = new RTCPeerConnection();
    setPc(peerConnection);

    peerConnection.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'createOffer') {
        peerConnection.setRemoteDescription(message.sdp).then(() => {
          peerConnection.createAnswer().then((answer) => {
            peerConnection.setLocalDescription(answer);
            socket.send(
              JSON.stringify({
                type: 'createAnswer',
                sdp: answer,
              })
            );
          });
        });
      } else if (message.type === 'iceCandidate') {
        peerConnection.addIceCandidate(message.candidate);
      }
    };
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Failed to play video:", error);
      });
    }
  };

  return (
    <div>
      <video ref={videoRef} controls muted></video>
      <button onClick={handlePlay}>Play Video</button>
    </div>
  );
};
