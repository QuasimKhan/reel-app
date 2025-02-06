import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { useSession } from "next-auth/react";



export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const user = await User.findById(params.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const user = await User.findById(params.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await user.remove();
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  
}

export async function PUT(req: Request, { params }: { params: { userId: string } }) {

  try {
    // Parse incoming data
    const { oldPassword, newPassword, confirmNewPassword } = await req.json();

    // Validate new password
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
    }
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();



    // Find the user by ID
    const user = await User.findById(session?.user.id);
    console.log("User: ", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Save the updated user document
    await user.save();

    // Return a success response
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
