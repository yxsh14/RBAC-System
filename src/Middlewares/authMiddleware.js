import User from "../Models/userModel.js";
import { ApiError } from "../Utils/ApiError.js";
import jwt from "jsonwebtoken";
export const verifyJWT=async(req,res,next)=>{
    try {
        //Check for the authorization token in cookies and  header
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if (!token) return res.status(400).json(new ApiError(401, null,"Unauthorized Access.")); 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) return res.status(400).json(new ApiError(401, null,"Invalid Access Token")); 

        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) return res.status(400).json(new ApiError(401, null,"Invalid Access Token")); 
        req.user=user;
        next()
    } catch (error) {
        return res.status(400).json(new ApiError(401, null,"Invalid Access Token")); 
    }
}