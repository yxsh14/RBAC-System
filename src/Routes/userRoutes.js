import express from "express";
import { verifyJWT } from "../Middlewares/authMiddleware.js";
import authorizeRoles from "../Middlewares/roleMiddleware.js";
import {
  createBlog,
  editBlog,
  deleteBlog,
  getAllBlogs,
} from "../Controllers/blogController.js";

const router = express.Router();

// admin create blog route
router
  .route("/admin/create")
  .post(verifyJWT, authorizeRoles("admin"), createBlog);

// admin delete blog route
router
  .route("/admin/delete/:blogId")
  .delete(verifyJWT, authorizeRoles("admin"), deleteBlog);

// Route for editing a blog 
router
  .route("/edit/:blogId")
  .patch(verifyJWT, authorizeRoles("admin", "moderator"), editBlog);

// Route for getting all blogs
router
  .route("/user/blogs")
  .get(verifyJWT, authorizeRoles("admin", "moderator", "user"), getAllBlogs);

export default router;
