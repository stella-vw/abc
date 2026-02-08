// api route for creating and getting posts in MongoDB

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbconnect';
import Post from '../../../models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newPost = await Post.create({
      title: body.title,
      buildingName: body.buildingName,
      type: body.type,
      notes: body.notes,
      location: body.location,
      author: body.authorId,
      authorPic: body.authorPic,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Post Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({});
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}