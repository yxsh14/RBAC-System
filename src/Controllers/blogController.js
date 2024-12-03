import Blog from "../Models/blogModel.js";
import ApiResponse from "../Utils/ApiResponse.js";
import {ApiError} from "../Utils/ApiError.js";
export const createBlog=async(req,res)=>{
    try {
        const {title,content}=req.body;
        if (!title || !content){
            return res.status(400).json(new ApiResponse(400,null,`Title and Content are required.`));
        }
        const blog=await Blog.create({
            title,
            content,
            createdBy:req.user._id,
        });
        res.status(201).json(new ApiResponse(200,blog,"New Blog Created."))
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,`Failed to create the blog: ${error.message}`)); 
    }
}

export const editBlog=async(req,res)=>{
    try {
        const {blogId}=req.params;
        const {title, content}=req.body;

        if (!title && !content){
            return res.status(400).json(new ApiResponse(400,null, "Provide the title or content to update."));
        }

        const blog=await Blog.findById(blogId);

        if (!blog){
            return res.status(404).json(new ApiResponse(404,null,"Blog not found."));
        }

        // Moderators can edit any blog, Admins can only edit their own blogs
        if (req.user.role === "admin" && String(blog.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: "Admins can only edit their own blogs." });
        }

        if (title) blog.title=title;
        if (content) blog.content=content;

        await blog.save();
        res.status(200).json(new ApiResponse(200,blog,"Blog updated successfully."));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,`Failed to edit the blog: ${error.message}`)); 
    }
}

export const deleteBlog=async(req,res)=>{
    try {
        const {blogId}=req.params;

        const blog =await Blog.findById(blogId);
        if (!blog){
            return res.status(404).json(new ApiResponse(404,null,"Blog not found."));
        }

        if (String(blog.createdBy)!==String(req.user._id)){
            return res.status(403).json(new ApiResponse(404,null,"Admins can only delete their own blogs."));
        }
        await Blog.findByIdAndDelete(blogId);
        res.status(200).json(new ApiResponse(200,null,"Blog deleted successfully."));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,`Failed to delete the blog: ${error.message}`)); 
    }
}
export const getAllBlogs=async(req,res)=>{
    try {
        const blogs= await Blog.find().populate("createdBy","username");
        res.status(200).json(new ApiResponse(200,blogs,"Blog Fetched Successfully."))
    } catch (error) {
        return res.status(500).json(new ApiError(500, null,`Failed to fetch the blogs: ${error.message}`)); 
    }
}