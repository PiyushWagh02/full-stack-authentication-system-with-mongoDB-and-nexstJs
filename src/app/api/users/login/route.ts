import connect from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {

    try {



        const reqBody = await request.json()

        const { email, password } = reqBody;

        if (!email || !password) {
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 })
        }

        console.log(reqBody)

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid Username" }, { status: 400 })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 })
        }

        //crete token data

        const tokenData = {
            id:user._id,
            username:user.username,
            email:user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!,{expiresIn:"1h"})

       const response = NextResponse.json({
            message: "Login successful",
            success: true,
            
        })

        response.cookies.set("token", token, {
            httpOnly: true,
           
        })


        return response;


    } catch (error:any) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        )


    }
}