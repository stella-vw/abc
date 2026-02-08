// api route for use login

import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const client = await clientPromise;
    const db = client.db("test"); 

    // find the user
    const user = await db.collection("users").findOne({ username});

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // comparing credentials
    if (user.password === password) {
      return NextResponse.json({ message: "Success", user: { name: user.name} });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}