import express from "express";
import { verifyJWT } from "../Middlewares/authMiddleware.js";
import {authorizeRoles, validateModeratorForAdmin} from "../Middlewares/roleMiddleware.js";
import {editBlog, getAllBlogs,} from "../Controllers/blogController.js";
import {  sendRequestToAdmin } from "../Controllers/manageController.js";

const router = express.Router();

// Routes Admin and Moderator
router.route("/edit/:blogId").patch(verifyJWT, authorizeRoles("admin", "moderator"), validateModeratorForAdmin, editBlog);

// User Routes
router.route("/user/access").post(verifyJWT, authorizeRoles("user","moderator"), sendRequestToAdmin);

router
    .route("/user/blogs")
    .get(verifyJWT, authorizeRoles("admin", "moderator", "user"), getAllBlogs);



export default router;
