import connect from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse,NextRequest } from "next/server";
import next from "next";
import { sendEmail } from "@/src/helpers/mailer";




connect();


export async function POST(request:NextRequest){ 
        try{
         const reqBody =await request.json()

         const {username,email,password} = reqBody;
            if(!username || !email || !password){
                return NextResponse.json({error:"Please fill all the fields"},{status:400})
            }

            console.log(reqBody)

            //check if user already exists
          const user = await  User.findOne({email})


          if(user){
            return NextResponse.json({error:"User already exists"},{status:400})
          }

          //hash password
          const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt)
            
         const newUser =new User({
            username,
            email,
            password:hashedPassword
         })

         const savedUser = await newUser.save();
         console.log("Saved user:", savedUser); // 👈 debug

         //send verification email

         await sendEmail({
            email,
            emailType:"VERIFY",
            userId:savedUser._id
         })
          
         return NextResponse.json({
            message:"User created successfully",
            success:true,
            savedUser

         })


        }catch(error){
            return NextResponse.json(
  { error: error instanceof Error ? error.message : "Something went wrong" },
  { status: 500 }
)
        }
}