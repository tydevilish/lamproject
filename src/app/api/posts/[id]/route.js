import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();

        const client = await clientPromise;
        const db = client.db("Lamproject");

        const result = await db.collection("posts").findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: body.title,
                    content: body.content,
                    language: body.language,
                    updatedAt: new Date(),
                },
            },
            { returnDocument: "after" }
        );

        return NextResponse.json({ updatedPost: result.value });
    } catch (err) {
        console.error("PUT error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const client = await clientPromise;
        const db = client.db("Lamproject");

        await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: "โพสต์ถูกลบแล้ว" });
    } catch (err) {
        console.error("DELETE error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
