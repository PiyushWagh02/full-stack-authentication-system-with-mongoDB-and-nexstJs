"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";





export default function ForgotPassword() {

  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);


  useEffect(() => {
    if (email.length > 0) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }

  }, [email]);

  const handleSubmit = async () => {

    try {
      setLoading(true);

      const response = await axios.post("/api/users/forgotpassword",{email})
      console.log("", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Password Reset Failed", error.message);
      toast.error(error.message);

    } finally {
      setLoading(false);
    }



  }


  return (

    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Forgot Password"}</h1>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="p-2 m-2 gap-1.5 border-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>
        {buttonDisabled ? "Please fill all the fields" : "Reset Password"}
      </button>
    </div>

  )
}