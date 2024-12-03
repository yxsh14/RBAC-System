import { AdminModerator } from "../Models/manageModel.js";
import { ManageRequest } from "../Models/requestModel.js";
import User from "../Models/userModel.js";
import { ApiError } from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";

// Send request to admin
export const sendRequestToAdmin = async (req, res) => {
    const { adminId } = req.body;
    const userId = req.user.id;

    try {
        const existingRequest = await ManageRequest.findOne({ userId, adminId });
        if (existingRequest) return res.status(400).json(new ApiResponse(400, null, "Request already exists."))
        const newRequest = await ManageRequest.create({ userId, adminId });
        return res.status(201).json(new ApiResponse(201, newRequest, "Request sent successfully."));

    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Approve or reject a request
export const manageRequest = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;
    try {
        const request = await ManageRequest.findById(requestId);
        if (!request) return res.status(404).json(new ApiResponse(404, null, "Request not found."));

        if (request.adminId.toString() !== adminId) return res.status(403).json(new ApiResponse(403, null, "Unauthorized action."));

        request.status = status;
        await request.save();

        if (status === "approved") {
            await AdminModerator.create({ adminId, moderatorId: request.userId });
            await User.findByIdAndUpdate(request.userId, { role: "moderator" });
        }

        return res.status(200).json(new ApiResponse(200, request, `Request ${status}`));
    } catch (error) {
        res.status(500).json(new ApiError(500, null, error.message));
    }
};

// Get all moderators for an admin
export const getModeratorsForAdmin = async (req, res) => {
    const adminId = req.user.id;

    try {
        const moderators = await AdminModerator.find({ adminId }).populate("moderatorId", "name email");
        res.status(200).json(new ApiResponse(200, moderators, `All moderators for admin ${adminId}`));
    } catch (error) {
        res.status(500).json(new ApiError(500, error.message));
    }
};
