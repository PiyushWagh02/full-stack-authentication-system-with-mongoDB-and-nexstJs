"use client";


import axios from "axios";
import Link from "next/link";


import React, { useEffect, useState } from "react";

export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyUserEmail = async (tokenToVerify: string) => {
        try {
            await axios.post("/api/users/verifyemail", { token: tokenToVerify });
            setVerified(true);
            setError(null);
        } catch (error: any) {
            setVerified(false);
            setError(error?.response?.data?.error || "Invalid or expired token");
            console.log(error?.response?.data || error?.message);
        }
    };

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token") || "";
        if (urlToken) {
            setToken(urlToken);
            verifyUserEmail(urlToken);
        }
    }, []);

    


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">
                verify your Email

            </h1>

            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>
            {
                verified && (
                    <div>
                        <h2 className="text-2xl">
                            Email Verified
                        </h2>
                        <Link href="/login" className="text-blue-500 underline">
                            Login
                        </Link>
                    </div>

 )
            }
            {
                error && (
                    <div>
                        <h2 className="text-2xl text-red-500">
                            {error}
                        </h2>
                    </div>





                )
            }

        </div>
    )


}