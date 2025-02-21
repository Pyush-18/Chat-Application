import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadImage } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getUsersforSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user?._id;

  if (!isValidObjectId(loggedInUserId)) {
    throw new ApiError(400, "Invalid user id");
  }
  const filteredUsers = await User.find({
    _id: { $ne: { _id : new mongoose.Types.ObjectId(loggedInUserId) } },
  }).select("-password");
  if (filteredUsers.length <= 0) {
    throw new ApiError(400, "There is no other users");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, filteredUsers, "Other users fetched successfully")
    );
});

export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user?._id;
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const { text, image } = req.body;
  const senderId = req.user?._id;
  let imageUrl;
  if (image) {
    const response = await uploadImage(image);
    imageUrl = response?.secure_url;
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId)
  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage", newMessage)
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newMessage, "Message send successfully"));
});
