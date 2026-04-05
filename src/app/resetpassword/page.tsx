"use client";
// export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function PasswordResetPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || ""; // ✅ get token from URL
     console.log(token);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pass1, setpass1] = useState("");
  const [pass2, setpass2] = useState("");
  const [message,setMessage]=useState("");

  useEffect(() => {
  if (!token) {
    toast.error("Invalid or expired link");
  }
}, [token]);

  useEffect(() => {
    if (pass1.length > 0 && pass1 === pass2) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [pass1, pass2]);

  const handleSubmit = async () => {
  try {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);

    const res = await axios.post("/api/users/resetpassword", {
      password: pass1,
      token: token
    });

    toast.success("Password reset successful");
    setMessage(res.data.message);

    router.push("/login");

  } catch (error: any) {
    console.log("Password Reset Failed", error.response?.data);

    const backendError =
      error.response?.data?.error || "Something went wrong";

    toast.error(backendError);
    setMessage(backendError);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Reset Password"}</h1>

      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setpass1(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm new password"
        onChange={(e) => setpass2(e.target.value)}
      />

      <button
        disabled={buttonDisabled}
        className="p-2 m-2 border-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleSubmit}
      >
        {buttonDisabled ? "Passwords must match" : "Reset Password"}
      </button>

      <h1>{message}</h1>
    </div>
  );
}