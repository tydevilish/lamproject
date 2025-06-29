import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username?.trim()) {
            return NextResponse.json(
                { message: "กรุณากรอกชื่อผู้ใช้" },
                { status: 400 }
            );
        }

        if (!password?.trim()) {
            return NextResponse.json(
                { message: "กรุณากรอกรหัสผ่าน" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Lamproject");
        const user = await db.collection("users").findOne({ username });

        if (!user) {
            return NextResponse.json(
                { message: "ไม่พบชื่อผู้ใช้นี้" },
                { status: 404 }
            );
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { message: "รหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }


        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const res = NextResponse.json({ message: "Login successful" });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60,
            path: "/",
            sameSite: "lax",
        });

        return res;

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }


}