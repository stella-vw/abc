import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) return NextResponse.json({ error: "No username" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("test");
  const user = await db.collection("users").findOne({ username });

  return NextResponse.json(user || {});
}