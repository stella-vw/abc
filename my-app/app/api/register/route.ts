// registration route to create new user in MongoDB

import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const client = await clientPromise;
    const db = client.db("test"); 

    // checks if the user already exists
    const existingUser = await db.collection("users").findOne({ username });
    
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // inserts the new user into MongoDB
    const result = await db.collection("users").insertOne({
      username,
      password, 
      createdAt: new Date()
    });

    return NextResponse.json({ message: "User created!", userId: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}