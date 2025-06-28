import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, confirmPassword } = body;

    if (!username) {
      return NextResponse.json(
        { message: "กรุณากรอกชื่อผู้ใช้" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (password.length > 20) {
      return NextResponse.json(
        { message: "รหัสผ่านต้องมีความยาวไม่เกิน 20 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Lamproject");
    const users = db.collection("users");

    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
