import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbconnect';
import Post from '@/models/Post';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lng = parseFloat(searchParams.get('lng') || '0');
  const lat = parseFloat(searchParams.get('lat') || '0');

  await dbConnect();

  try {
    const nearby = await Post.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 200 // Distance in meters
        }
      }
    });
    return NextResponse.json(nearby);
  } catch (error) {
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}