import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";

const register=async (req,res)=>{
    try {
        // 1. Data from frontend
        const {username, password, role} = req.body;

        // 2. Validating data
        if ([username, role, password].some((field) => field?.trim === "")) {
            return res.status(401).json(new ApiError(401, null,"All fields are required")); 
        }
        // 3. Checking the username is unique or not
        const existedUser=await User.findOne({username});
        if (existedUser) return res.status(401).json(new ApiError(401, null,"Username already exists.")); 

        // 4. Hashing password
        const hashedPassword = await bcrypt.hash(password,10);
        
        // 5. Saving the user
        const newUser=new User({username,password:hashedPassword,role});
        await newUser.save();
        return res.status(201).json(new ApiResponse(200, newUser,`User Registered with username ${username}`));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,"Something went wrong while creating the account.")); 
    }

};
const generateAccessAndRefreshToken = (async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        // refreshToken saving in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,"Something went wrong while generating access and refresh token.")); 
    }
})
const login=async (req,res)=>{
    try {
        // 1. Getting data from frontend
        const {username,password}=req.body;

        // 2. Validating data 
        if ([username, password].some((field) => field?.trim === "")) {
            return res.status(409).json(new ApiError(409, null,"All fields are required")); 
        }

        // 3. Finding the user
        const user=await User.findOne({username});
        if (!user){
            return res.status(409).json(new ApiError(409, null,`No user with username ${username}`)); 
        }

        // 4. Checking the password
        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json(new ApiError(401, null,`Invalid username or password`)); 
        }
        // 5. Generate tokens using schema methods
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

        // Sending the token and user to frontend
        const loggedInUser=await User.findById(user._id).select("-refreshToken");
        
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken, options)
        .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in Successfully."))
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,`Error while logging in.`)); 
    }
}
const logout=async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $set:{refreshToken:undefined}
        })
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .clearCookie("accessToken",options) 
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User Logged Out Successfully."))     
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,`Error while logging out.`)); 
    }
}
export{
    register,
    login,
    logout,
};