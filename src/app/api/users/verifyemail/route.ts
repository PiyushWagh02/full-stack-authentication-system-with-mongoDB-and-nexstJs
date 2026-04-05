import connnect from "@/src/dbConfig/dbConfig"
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log("Received token:", token); // 👈 debug


        const user = await User.findOne({
            verifyToken: token,
             verifyTokenExpiry:{ $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({
                error: "Invalid or expired token"
            }, { status: 400 })
        }

        console.log("User found:", user); // 👈 debug


        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })




    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}