import { AdminModerator } from "../Models/adminModerator.js";
import Blog from "../Models/blogModel.js"; // Assuming you have a Blog model

const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            // Check if the user's role matches any of the authorized roles
            if (!roles.includes(user.role)) {
                return res
                    .status(403)
                    .json({ message: "Access denied. You don't have permission to perform this action." });
            }

            // If the user is a moderator, perform additional checks
            if (user.role === "moderator") {
                const { blogId } = req.params;

                // Fetch the blog's admin (creator)
                const blog = await Blog.findById(blogId).select("createdBy");
                if (!blog) {
                    return res.status(404).json({ message: "Blog not found." });
                }

                // Check if the moderator is authorized to manage this admin's blogs
                const isAuthorized = await AdminModerator.findOne({
                    adminId: blog.createdBy,
                    moderatorId: user._id,
                });

                if (!isAuthorized) {
                    return res
                        .status(403)
                        .json({ message: "Access denied. You are not authorized to manage this blog." });
                }
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error.", error: error.message });
        }
    };
};

export default authorizeRoles;
