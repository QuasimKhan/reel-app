"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 import VideoView from "./components/VideoView";// Import VideoView component
import { IVideo } from "@/models/Video";


export default function HomePage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  console.log(session);

  // Fetch videos from the API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Failed to load videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        toast.error("Error fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 text-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 p-4 text-center">
        <p className="text-lg">No videos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Uploaded Videos</h1>

      {/* Render the VideoView component and pass the videos */}
      <VideoView videos={videos} />

      <ToastContainer />
    </div>
  );
}
