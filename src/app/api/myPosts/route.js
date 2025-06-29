// /app/api/myPosts/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const client = await clientPromise;
        const db = client.db("Lamproject");

        const posts = await db
            .collection("posts")
            .find({ username })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ posts });
    } catch (err) {
        console.error("Error fetching myPosts:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
