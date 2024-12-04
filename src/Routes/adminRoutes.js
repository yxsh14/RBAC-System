import express from "express";
import { verifyJWT } from "../Middlewares/authMiddleware.js";
import { authorizeRoles } from "../Middlewares/roleMiddleware.js";
import {
    createBlog,
    editBlog,
    deleteBlog,
    getBlogsByAdmin,
} from "../Controllers/blogController.js";
import { getModeratorsForAdmin, getRequestsForAdmin, manageRequest } from "../Controllers/manageController.js";

const router = express.Router();
router.route("/create").post(verifyJWT, authorizeRoles("admin"), createBlog);


router
    .route("/delete/:blogId")
    .delete(verifyJWT, authorizeRoles("admin"), deleteBlog);

router.route("/:requestId").patch(verifyJWT, authorizeRoles("admin"), manageRequest);

router.route("/moderators").get(verifyJWT, authorizeRoles("admin"), getModeratorsForAdmin);

router.route("/requests").get(verifyJWT, authorizeRoles("admin"), getRequestsForAdmin);

router.route("/blogs").get(verifyJWT, authorizeRoles("admin"), getBlogsByAdmin);




export default router;
