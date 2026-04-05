"use client"
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage(){
    const router = useRouter();
    const [data,setData] = React.useState("nothing");
    const logout = async ()=>{
        try {
            await axios.get("/api/users/logout")
            toast.success("Logout successful")
            router.push("/login")
        } catch (error:any) {
            console.log(error.message)
            toast.error(error.message)
            
        }
    }

    const getUserDetails = async ()=>{
const response = await axios.get("/api/users/me");
        console.log(response.data);
        setData(response.data.data._id);

    }
    return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr/>
            <p>Profile page</p>
            <h2>{data === "nothing" ? "No user data available" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
            <hr/>
            <button
            onClick={logout} 
            className="bg-blue-500 text-white p-2 rounded">
                Logout
            </button>

             <button
            onClick={getUserDetails} 
            className="bg-blue-500 text-white p-2 rounded">
                Get User Details
            </button>

            </div>
           
        )

}