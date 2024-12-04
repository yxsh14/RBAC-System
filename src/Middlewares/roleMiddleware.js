import { AdminModerator } from "../Models/manageModel.js";
import Blog from "../Models/blogModel.js"; 
import ApiResponse from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            // user's role matches any of the authorized roles
            if (!roles.includes(user.role)) {
                return res
                    .status(403)
                    .json(new ApiResponse(403,null, "Access denied. You don't have permission to perform this action."));
            }

            
            next();
        } catch (error) {
            return res.status(500).json(new ApiError(500,null,"Error while checking authorization."));
        }
    };
};

export default authorizeRoles;




export const validateModeratorForAdmin = async (req, res, next) => {
    try {
        const user = req.user;

        if (user.role === "moderator") {
            const { blogId } = req.params;

            const blog = await Blog.findById(blogId).select("createdBy");
            if (!blog) {
                return res.status(404).json({ message: "Blog not found." });
            }

            const isAuthorized = await AdminModerator.findOne({
                adminId: blog.createdBy,
                moderatorId: user._id,
            });

            if (!isAuthorized) {
                return res
                    .status(403)
                    .json(new ApiResponse(403,null, "Access denied. You are not authorized to manage this blog."));
            }
        }

        next();
    } catch (error) {
        return res.status(500).json(new ApiError(500,null,"Error while checking authorization of moderator."));
    }
};



