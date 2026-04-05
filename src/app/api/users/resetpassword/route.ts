import connect from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextResponse } from "next/server";

connect();

export async function POST(request:any) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    console.log(reqBody);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password required" },
        { status: 400 }
      );
    }

    // ✅ Find user by token + expiry
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    const isSamePassword = await bcrypt.compare(
  password,
  user.password
);

   if (isSamePassword) {
  return NextResponse.json(
    { error: "New password cannot be same as old password" },
    { status: 400 }
  
    
  );
}


    // ✅ Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt)

    // ✅ Update password + clear token
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Password reset successful",
      success: true,
    });

  } catch (error:any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}