import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";

        if (!token) {
            throw new Error("No token found");
        }

        const decodedToken: any = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        );

        return decodedToken.id;

    } catch (error: any) {
        console.log("TOKEN ERROR:", error.message); // 👈 debug
       return null;
    }
};