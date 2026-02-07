import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const client = await clientPromise;
    const db = client.db("test"); // Use your DB name

    // 1. Check if the user already exists
    const existingUser = await db.collection("users").findOne({ username });
    
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // 2. Insert the new user into MongoDB
    const result = await db.collection("users").insertOne({
      username,
      password, // Note: In a real app, we would hash this!
      createdAt: new Date()
    });

    return NextResponse.json({ message: "User created!", userId: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}