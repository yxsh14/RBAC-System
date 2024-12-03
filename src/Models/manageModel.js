// AdminModerator Schema
import mongoose from "mongoose";
const adminModeratorSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    moderatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const AdminModerator = mongoose.model("AdminModerator", adminModeratorSchema);