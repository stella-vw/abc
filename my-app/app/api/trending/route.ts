// api route to get how many posts are at one building

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    // groups posts by building and counts them
    const surgeBuildings = await db.collection("posts").aggregate([
      {
        $group: {
          _id: "$buildingName",
          count: { $sum: 1 },
          avgLat: { $first: { $arrayElemAt: ["$location.coordinates", 1] } },
          avgLng: { $first: { $arrayElemAt: ["$location.coordinates", 0] } }
        }
      },
      // return buildings where there is 3+ posts at a building
      { $match: { count: { $gt: 3 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    return NextResponse.json(surgeBuildings);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch trending data" }, { status: 500 });
  }
}