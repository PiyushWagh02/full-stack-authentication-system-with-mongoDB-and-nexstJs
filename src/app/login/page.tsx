"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import User from "@/src/models/userModel";




export default function LoginPage(){
    const router = useRouter();
    const [user,setUser]=React.useState({
        email:"",
        password:"",
       
    })

    

    const [buttonDisabled,setButtonDisabled] = React.useState(false)
  
    const [loading,setLoading] = React.useState(false)

    useEffect(()=>{
        if(user.email.length>0 && user.password.length>0){
            setButtonDisabled(false)
        }else{
            setButtonDisabled(true)
        }

    },[user]);



    const onLogin = async () =>{
        try {
            setLoading(true);
          const res =  await axios.post("/api/users/login",user)
            toast.success(res.data.message)
            console.log("Login successful",res.data)
            router.push("/profile")
        }catch(error:any){
            console.log("Login failed",error.message)
            toast.error(error.message)
        }finally{
            setLoading(false);
        }



    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
           <h1>{loading ? "Logging in..." : "Logil"}</h1>
           <hr/>
          

            
           <label htmlFor="email">email</label>
           <input
           className="p-4 border border-gray-300 rounded-md w-full"
           id="email"
           type="text"
           value={user.email}
           onChange={(e)=>setUser({...user,email:e.target.value})}
           placeholder="email"
           />

           <label htmlFor="password">password</label>
           <input
           className="p-4 border border-gray-300 rounded-md w-full"
           id="password"
           type="password"
           value={user.password}
           onChange={(e)=>setUser({...user,password:e.target.value})}
           placeholder="password"
           />

         <button className="p-2 m-2 gap-1.5 border-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={onLogin}>
            Login
         </button>

         <Link href="/signup" className="text-blue-500 hover:underline">
            Not have an account yet? Signup
            </Link>
            <Link href="/forgotpassword" className="text-blue-500 hover:underline">
            Forgot Password
            </Link>
        </div>
    )
}