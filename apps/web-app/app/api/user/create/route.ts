import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        if (req.method !== "POST") {
            return NextResponse.json(
                { success: false, message: "Method not allowed" },
                { status: 405 }
            );
        }

        const body = await req.json();
        const { username, email, password } = body;


        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                userId: user.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
