import express from "express";
import { verifyJWT } from "../Middlewares/authMiddleware.js";
import authorizeRoles from "../Middlewares/roleMiddleware.js";
import {
    createBlog,
    editBlog,
    deleteBlog,
    getAllBlogs,
} from "../Controllers/blogController.js";
import { getModeratorsForAdmin, manageRequest, sendRequestToAdmin } from "../Controllers/manageController.js";

const router = express.Router();

// Admin Routes
router
    .route("/admin/create")
    .post(verifyJWT, authorizeRoles("admin"), createBlog);


router
    .route("/admin/delete/:blogId")
    .delete(verifyJWT, authorizeRoles("admin"), deleteBlog);

router
    .route("/edit/:blogId")
    .patch(verifyJWT, authorizeRoles("admin"), editBlog);

router.route("/manage/:requestId").patch(verifyJWT, authorizeRoles("admin"), manageRequest);

router.route("/admin/moderators").get(verifyJWT, authorizeRoles("admin"), getModeratorsForAdmin);
// Moderator

// User Routes
router
    .route("/user/blogs")
    .get(verifyJWT, authorizeRoles("admin", "moderator", "user"), getAllBlogs);

router.route("/user/request").post(verifyJWT, authorizeRoles("user"), sendRequestToAdmin);

export default router;
