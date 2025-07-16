import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return response;
}
