import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    const protectedRoutes = ["/dashboard", "/profile"];
    const isProtected = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path));

    if (!isProtected) return NextResponse.next();

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"],
};
