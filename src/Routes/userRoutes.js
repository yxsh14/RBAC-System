import express from "express";
import { verifyJWT } from "../Middlewares/authMiddleware.js";
import authorizeRoles from "../Middlewares/roleMiddleware.js";

const router = express.Router();

router.route('/admin').get(verifyJWT, authorizeRoles("admin"), (req, res) => {
    res.send({ "message": "this is admin route." });
});
router.route('/moderator').get(verifyJWT, authorizeRoles("admin", "moderator"), (req, res) => {
    res.send({ "message": "this is moderator route." });
});
router.route('/user').get(verifyJWT, authorizeRoles("admin", "moderator", "user"), (req, res) => {
    res.send({ "message": "this is user route." });
});

export default router;
