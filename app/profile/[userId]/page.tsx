"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userId } = useParams(); // Get userId from URL

  const [videos, setVideos] = useState([]);
  const [deletePassword, setDeletePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmDeletePassword, setConfirmDeletePassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Redirect user if not authenticated or accessing another user's profile
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.id !== userId) {
      toast.error("Unauthorized Access!");
      router.push("/");
    }
  }, [session, status, userId, router]);

  // Fetch user's videos
  useEffect(() => {
    if (session) {
      fetch(`/api/videos?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setVideos(data))
        .catch(() => toast.error("Failed to load videos"));
    }
  }, [session, userId]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      if (!res.ok) throw new Error("Password change failed");
      toast.success("Password changed successfully!");
      setShowPasswordModal(false); // Close the modal
    } catch (error) {
      console.error(error);
      toast.error("Failed to change password");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword !== confirmDeletePassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch(`/api/user/${userId}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!res.ok) throw new Error("Incorrect password!");
      toast.success("Account deleted successfully!");
      signOut();
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  // Handle video deletion
  const handleDeleteVideo = async (videoId: string) => {
    try {
      const res = await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: videoId }),
      });

      if (!res.ok) throw new Error("Failed to delete video");

      toast.success("Video deleted successfully!");
      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (error) {
      toast.error("Error deleting video");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-4xl">
        {/* User Details */}
        <div className="flex items-center mb-6">
          <div className="flex flex-col ml-4">
            <h1 className="text-3xl font-semibold text-gray-50">{session.user?.name}</h1>
            <p className="text-gray-50 text-sm"><span>UserID</span>: {session.user?.email}</p>
          </div>
        </div>

        {/* User's Uploaded Videos */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-50">Your Videos</h2>
          <p className="text-gray-500 text-sm">Total videos: {videos.length}</p>

          {videos.length > 0 ? (
            <div className="grid gap-8 mt-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div key={video._id} className="bg-gray-100 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                  <video
                    src={video.videoUrl}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    controls
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{video.title}</p>
                      <p className="text-sm text-gray-600">{video.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No videos uploaded yet.</p>
          )}
        </div>

        {/* Change Password Button */}
        <div className="mt-12">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 transition-all"
          >
            Change Password
          </button>
        </div>

        {/* Delete Account Button */}
        <div className="mt-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white py-3 px-6 rounded-lg w-full hover:bg-red-600 transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input input-bordered w-full mb-4 p-3 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full mb-4 p-3 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="input input-bordered w-full mb-4 p-3 rounded-md"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
            <form onSubmit={handleDeleteAccount}>
              <input
                type="password"
                placeholder="Enter Password to Confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="input input-bordered w-full mb-4 p-3 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmDeletePassword}
                onChange={(e) => setConfirmDeletePassword(e.target.value)}
                className="input input-bordered w-full mb-4 p-3 rounded-md"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
