import { useEffect, useRef } from "react";

export const VideoCall: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <video data-testid="user-video" ref={videoRef} autoPlay muted={true} />
  );
};
