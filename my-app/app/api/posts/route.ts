import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbconnect';
import Post from '../../../models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Mapping frontend fields to your Mongoose Schema
    const newPost = await Post.create({
      title: body.title,
      buildingName: body.buildingName,
      type: body.type,
      notes: body.notes,
      location: body.location, // Should be { type: 'Point', coordinates: [lng, lat] }
      // We use 'author' as defined in your schema (the ObjectId)
      author: body.authorId, 
      // We don't need to send createdAt; the schema does it automatically!
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Post Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Keep your GET route to fetch the pins for the map
export async function GET() {

    
  try {
    await dbConnect();
    const posts = await Post.find({});
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}