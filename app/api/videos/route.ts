import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo, VIDEO_DIMENSIONS } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// ✅ GET: Fetch videos (Only user-specific videos if userId is provided)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Get userId from query

    await connectToDatabase();

    const query = userId ? { userId } : {}; // If userId exists, fetch only their videos
    const videos = await Video.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 });
  }
}

// ✅ POST: Authenticated users can upload videos
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();

    if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
      return NextResponse.json({ error: "Please fill all fields" }, { status: 400 });
    }

    // ✅ Assign `userId` from authenticated session
    const videoData = {
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      userId: session?.user?.id, // ✅ Set `userId` from session
      controls: body.controls ?? true,
      transformation: {
        height: body.transformation?.height || VIDEO_DIMENSIONS.height,
        width: body.transformation?.width || VIDEO_DIMENSIONS.width,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create video" }, { status: 500 });
  }
}

// ✅ DELETE: Only video owner can delete their video
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get the video ID
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing video id" }, { status: 400 });
    }

    await connectToDatabase();

    // Ensure the user can only delete their own video
    const video = await Video.findById(id);
    console.log("Video User ID -> ",video)
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (video.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own videos" }, { status: 403 });
    }

    await video.deleteOne();
    return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete video" }, { status: 500 });
  }
}
