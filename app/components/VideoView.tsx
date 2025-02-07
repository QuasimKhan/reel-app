import { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { IVideo } from "@/models/Video"; // Adjust the import according to your structure
import { useSession } from "next-auth/react";

interface VideoViewProps {
  videos: IVideo[]; // Array of video objects passed as a prop
}

const VideoView = ({ videos }: VideoViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track current video index
  const videoRef = useRef<HTMLVideoElement | null>(null); // Ref to video element for auto play
  const {data: session} = useSession();

  // Handle swipe up gesture to move to the next video
  const handleSwipeUp = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Optionally loop back to the first video
    }
  };

  // Handle swipe down gesture to move to the previous video
  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(videos.length - 1); // Optionally loop back to the last video
    }
  };

  // Swipeable options to detect gestures
  const swipeHandlers = useSwipeable({
    onSwipedUp: handleSwipeUp,
    onSwipedDown: handleSwipeDown,
    trackMouse: true,
    delta: 50, // Adjust this to control swipe sensitivity
  });

  const currentVideo = videos[currentIndex]; // Get current video data

  return (
    <div {...swipeHandlers} className="relative w-full h-screen bg-black">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={currentVideo.videoUrl}
        className="absolute top-0 left-0 w-full h-full object-cover"
        controls
        autoPlay
        loop
        preload="auto" // Preload next video for smoother transitions
      />
      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
        <h1 className="text-4xl font-bold">{session?.user.email}</h1>
        <h2 className="text-2xl font-bold">{currentVideo.title}</h2>
        <p className="mt-2">{currentVideo.description}</p>
      </div>

      {/* Swipe Indicator (Optional) */}
      <div className="absolute top-1/2 left-0 right-0 text-center text-white">
        <p>Swipe up or down to change video</p>
      </div>
    </div>
  );
};

export default VideoView;
