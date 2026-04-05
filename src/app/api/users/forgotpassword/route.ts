import connect from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import next from "next";
import { sendEmail } from "@/src/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()

        const { email } = reqBody;
        if (!email) {
            return NextResponse.json({ error: "Please enter the email" }, { status: 400 })
        }

        console.log(reqBody)

        //check if user already exists
        const user = await User.findOne({ email })


        if (!user) {
            return NextResponse.json({ error: "User does not  exists" }, { status: 400 })
        }




        //send reset email

        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id
        })

        return NextResponse.json({
            message: "Reset password request",
            success: true,
            user

        })


    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        )
    }
}