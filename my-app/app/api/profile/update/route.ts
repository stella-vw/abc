import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { username, name, major, year, aboutMe, profilePic } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("test");

    const result = await db.collection("users").updateOne(
      { username: username }, // Find the user by their username
      { 
        $set: { 
          name, 
          major, 
          year, 
          aboutMe,
          profilePic,
        } 
      }
    );

    return NextResponse.json({ message: "Update successful" });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
  }
}