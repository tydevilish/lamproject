// /app/api/posts/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const { title, content, language } = await req.json();

        if (!title || !content || !language) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newPost = {
            username,
            title,
            content,
            language,
            createdAt: new Date(),
        };

        const client = await clientPromise;
        const db = client.db("Lamproject");
        const result = await db.collection("posts").insertOne(newPost);

        return NextResponse.json({
            success: true,
            post: { ...newPost, _id: result.insertedId },
        });
    } catch (err) {
        console.error("Error adding post:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
