import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import chatSchema from "../model/ChatModel.js";
import mesSchema from "../model/MessageModel.js";
export const uploadVideos = upload.single("video");

cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// Add User Phone Number
export const AddPhoneNumber = catchAsyncError(async (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber)
    return next(new ErrorHandler("Please Add your phoneNumber", 409));
  const existingUser = await User.findOne({ phoneNumber });
  if (existingUser)
    return next(new ErrorHandler("Number Already Present", 409));
  const newUser = await User.create({ phoneNumber });
  sendToken(res, newUser, "User Register", 201);
});

// Add User Email
export const AddEmail = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  console.log(existingUser);
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  const newUser = await User.create({ email });
  sendToken(res, newUser, "User Register", 201);
});

// Add User Email
export const LoginWithEmail = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: true,
      message: "Email already exists",
      success: "true",
      data: existingUser,
    });
  }
  res.status(400).json({ success: false, message: "No User Found" });
});

// Add User Basic Profile Data
export const AddProfileDetail = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { name, dateOfBirth, public_id, url } = req.body;
  if (!name) {
    return res.status(404).json({ message: "Enter the Name" });
  }

  if (!dateOfBirth) {
    return res.status(404).json({ message: "Enter date of Birth" });
  }
  user.dateOfBirth = dateOfBirth;
  user.name = name;
  // user.gallery.push(...public_id)
  public_id.forEach((item) => {
    user.gallery.push(item);
  });
  try {
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user profile" });
  }
});

// Add User Images
export const uploadImage = async (req, res, next) => {
  let images = [];
  if (req.files && req.files.avatars) {
    if (!Array.isArray(req.files.avatars)) {
      images.push(req.files.avatars);
    } else {
      images = req.files.avatars;
    }
  }
  let responce = [];
  for (const image of images) {
    try {
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      // console.log("--->",result);
      const publidId = result.public_id;
      const url = result.url;
      let data = {
        publidId,
        url,
      };
      //  console.log(data);
      responce.push(data);
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error uploading images" });
    }
  }
  // console.log("-->1",responce);
  res.send(responce);
};

// Add User Video
export const uploadVideo = async (req, res, next) => {
  if (!req.files || !req.files.video) {
    return res.status(400).json({ error: "No video file provided" });
  }

  let responce = [];

  try {
    const videoFile = req.files.video;
    const result = await cloudinary.v2.uploader.upload(videoFile.tempFilePath, {
      resource_type: "video",
    });
    const publidId = result.public_id;
    const url = result.url;
    let data = {
      publidId,
      url,
    };
    responce.push(data);
    res.send(responce);
  } catch (error) {
    return res.status(500).json({ error: "Error uploading video" });
  }
};

// Add User Related Data
export const WhoIam = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { whoIam } = req.body;
  if (!whoIam) return res.status(404).json({ message: "Please Select Gender" });
  user.whoIam = whoIam;
  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// Add User  Interest
export const Interests = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { interests } = req.body;
  if (!interests)
    return res.status(404).json({ message: "Please Select Interest" });
  user.interests = interests;
  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// Add User Personal Detail
export const PersonlDetail = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { height, country, intro, video, match } = req.body;
  if (!height) return res.status(404).json({ message: "Please Select Height" });
  if (!country)
    return res.status(404).json({ message: "Please Select Country" });

  if (!intro)
    return res
      .status(404)
      .json({ message: "Please Write Something About you" });

  user.height = height;
  user.country = country;
  user.intro = intro;
  user.idealMatch = match;
  if (video) {
    video.forEach((item) => {
      user.gallery.push(item);
    });
  }

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// Add User  Hobbies
export const Hobbies = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { hobbies } = req.body;
  if (!hobbies)
    return res.status(404).json({ message: "Please Select Hobbies" });
  user.hobbies = hobbies;
  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// Add User  Like
export const LikeProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const likedUserId = req.body.liked;
  const likedUser = await User.findById(likedUserId);
  if (!likedUser)
    return res.status(404).json({ message: "Liked user not found" });
  if (user.liked.includes(likedUserId))
    return res
      .status(404)
      .json({ success: false, message: "User already liked this profile" });
  const isMatched = likedUser.liked.includes(id);
  user.liked.push(likedUserId);
  await user.save();
  if (isMatched) {
    return res.status(200).json({
      success: "match",
      message: "Match found",
      data: {
        match: likedUser,
        myprofile: user,
      },
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "User liked successfully",
      data: { likedUser: likedUserId },
    });
  }
});

// Dislike Profile
export const DislikeProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const dislikedUserId = req.body.disliked;
  const dislikedUser = await User.findById(dislikedUserId);
  if (!dislikedUser)
    return res.status(404).json({ message: "Disliked user not found" });

  // Check if the disliked user ID exists in the list of users who liked the current user
  if (!dislikedUser.liked.includes(id))
    return res
      .status(404)
      .json({ success: false, message: "User has not liked this profile" });

  // Remove the current user's ID from the list of users who liked the disliked user
  dislikedUser.liked = dislikedUser.liked.filter(
    (likedId) => likedId.toString() !== id
  );

  await dislikedUser.save();

  return res.status(200).json({
    success: true,
    message: "User disliked successfully",
    data: { dislikedUser: dislikedUserId },
  });
});

// Who Like Me
export const LikedProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Find profiles of users who have liked the current user (users in the liked array)
  const likedProfiles = await User.find({ liked: user._id });
  if (likedProfiles.length === 0) {
    return res.status(404).json({ success: false, message: "No likes found" });
  }

  const filteredProfiles = likedProfiles.filter((profile) => {
    // Check if the profile exists and has a valid _id property
    return profile && profile._id && !profile._id.equals(user._id);
  });
  res.status(200).json({
    success: true,
    data: filteredProfiles,
  });
});

// Delete  Profile
export const DeleteProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const deletedProfile = await User.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    data: deletedProfile,
    message: "User Delete Successfully",
  });
});

// Add Update Personal Detail
export const UpdateProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  const { height, country, intro, match, name, interest, work, education } =
    req.body;

  user.height = height || user.height;
  user.country = country || user.country;
  user.intro = intro || user.intro;
  user.name = name || user.name;
  user.work = work || user.work;
  user.interests = interest || user.interests;
  user.idealMatch = match || user.idealMatch;
  user.education = education || user.education;

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// Add Update Images
export const UpdateImage = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  let images = [];
  if (req.files && req.files.avatars) {
    if (!Array.isArray(req.files.avatars)) {
      images.push(req.files.avatars);
    } else {
      images = req.files.avatars;
    }
  }
  let responce = [];
  for (const image of images) {
    try {
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      const publidId = result.public_id;
      const url = result.url;
      let data = {
        publidId,
        url,
      };
      //  console.log(data);
      responce.push(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Error uploading images" });
    }
  }
  // console.log("-->1",responce[0].publidId);
  // console.log("-->1",responce[0].url);
  // console.log(responce[0]);
  const data = responce[0];
  user.gallery.unshift(data);
  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    data: updatedUser,
    message: "Image Update Successfully",
  });
};

// Show Profile
export const ShowProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { interests, country, age, maxDistance } = req.query;

  const currentUser = await User.findById(id);

  if (!currentUser) {
    return res.status(404).json({ success: false, message: "Please Login" });
  }

  let users = await User.find({ _id: { $ne: currentUser._id } });

  // Filter by interests (case-sensitive exact match)
  if (interests) {
    const queryInterests = interests.toLowerCase();
    users = users.filter((user) => {
      return user.interests && user.interests.toLowerCase() === queryInterests;
    });
  }

  // Filter by country (case-insensitive search)
  if (country) {
    const queryCountry = country.toLowerCase();
    users = users.filter((user) => {
      return user.country && user.country.toLowerCase() === queryCountry;
    });
  }

  // Filter by age
  if (age) {
    const currentYear = new Date().getFullYear();
    const ageFilter = parseInt(age);
    users = users.filter((user) => {
      if (user.dateOfBirth) {
        // Assuming dateOfBirth is in the format "MM/DD/YYYY"
        const birthYear = parseInt(user.dateOfBirth.split("/")[2]);
        const userAge = currentYear - birthYear;
        return userAge >= ageFilter;
      }
      return false;
    });
  }

  // Filter by maxDistance
  if (maxDistance) {
    const maxDistanceFilter = parseInt(maxDistance);
    users = users.filter((user) => {
      return user.distance !== undefined && user.distance < maxDistanceFilter;
    });
  }

  // If no matching users found for the provided filters, show all users
  if (users.length === 0) {
    users = await User.find({ _id: { $ne: currentUser._id } });
  }

  // Calculate distances for the remaining users
  users.forEach((user) => {
    user.distance = calculateDistance(
      currentUser.latitude,
      currentUser.longitude,
      user.latitude,
      user.longitude
    );
    user.distance = Math.round(user.distance); // Round the distance to the nearest whole number
  });

  // Save the updated users
  await Promise.all(users.map((user) => user.save()));

  return res.status(200).json({ success: true, data: users });
});

// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Helper function to convert degrees to radians
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Show Single Profile
export const ShowSingleProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// Login Profile
export const login = catchAsyncError(async (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber)
    return next(new ErrorHandler("Please Add your phoneNumber", 409));
  const existingUser = await User.findOne({ phoneNumber });
  // if (!existingUser) return next(new ErrorHandler("No User Found", 409));
  if (!existingUser) {
    res.status(409).json({
      success: "false",
      message: "No User Found",
    });
  }

  res.status(200).json({
    success: "true",
    data: existingUser,
  });
});

// Create Chat  H
export const CreateChat = catchAsyncError(async (req, res, next) => {
  let { user, other } = req.body;
  try {
    const old = await chatSchema.findOne({
      $or: [
        { user, other },
        { user: user, other: other },
      ],
    });
    if (old != null) {
      return res.json({
        status: "error",
        message: "Chat is already available",
      });
    }
    let chat = await chatSchema.create({
      user,
      other,
    });
    res.json({
      status: "success",
      data: chat,
    });
  } catch (e) {
    console.log(e);
    return res.json({ status: "error", message: "Invalid parameters" });
  }
});

// Get Chat
export const GetChat = catchAsyncError(async (req, res, next) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Find Chat H
export const FindChat = catchAsyncError(async (req, res, next) => {
  try {
    let { uid } = req.body;

    let chats = await chatSchema.find({
      $or: [{ user: uid }, { other: uid }],
    });

    const chatsWithData = await Promise.all(
      chats.map(async (data) => {
        if (data.user == uid) {
          const findPerson = await User.findById(data.user);
          const findPerson1 = await User.findById(data.other).select(
            "_id gallery name"
          );
          const chatWithPersonData = {
            chatId: data._id,
            userId: data.user,
            other: findPerson1,
            lastMessage: data.lastMessage,
            unread: data.unread,
            archive: data.archive,
            mute: data.mute,
          };
          return chatWithPersonData;
        } else {
          const findPerson = await User.findById(data.user);
          const findPerson1 = await User.findById(data.user).select(
            "_id gallery name"
          );
          const chatWithPersonData = {
            chatId: data._id,
            userId: data.other,
            other: findPerson1,
            lastMessage: data.lastMessage,
            unread: data.unread,
            archive: data.archive,
            mute: data.mute,
          };
          return chatWithPersonData;
        }
      })
    );

    res.json({
      status: "success",
      data: chatsWithData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: "invalid parameters",
    });
  }
});

// Send Message
export const SendMessage = catchAsyncError(async (req, res, next) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Message
export const GetMessage = catchAsyncError(async (req, res, next) => {
  const { chatId } = req.params;
  try {
    const result = await mesSchema.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Live Location Cordinates
export const AddLiveLocation = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { longitude, latitude } = req.body;
  const existingUser = await User.findById(id);
  if (!existingUser) return next(new ErrorHandler("No User Found", 409));
  existingUser.longitude = longitude;
  existingUser.latitude = latitude;
  const addLocation = await existingUser.save();
  res.status(200).json({
    success: true,
    data: addLocation,
  });
});

// Delete Message For All
export const DeleteForAllMessage = catchAsyncError(async (req, res, next) => {
  const { messageId } = req.params; // Get the message ID from request parameters
  const { userId } = req.body; // Assuming you have user information in the request (e.g., after authentication)

  // Find the message by ID
  const message = await mesSchema.findById(messageId);

  if (!message) {
    console.log("Message not found");
    return res.status(404).json({ message: "Message not found" }); // Respond with a 404 status
  }

  // Check if the message was sent by the same user
  if (message.sender.toString() !== userId) {
    console.log("Unauthorized: You can only delete your own messages");
    return res.status(401).json({
      message: "Unauthorized: You can only delete your own messages",
    }); // Respond with a 401 status (Unauthorized)
  }

  // If the message was sent by the same user, delete it
  const data = await mesSchema.findByIdAndDelete(messageId);
  if (data) {
    res.json({ success: true, message: "Delete" });
  }
});

// Update a specific message by ID
export const updateMessageById = catchAsyncError(async (req, res, next) => {
  try {
    const { messageId } = req.params; // Get the message ID from request parameters
    const { newText } = req.body; // Get the updated text from the request body

    // Find the message by ID and update it
    const updatedMessage = await mesSchema.findByIdAndUpdate(
      messageId,
      { text: newText },
      { new: true } // Return the updated message
    );

    if (!updatedMessage) {
      // console.log("Message not found");
      return res.status(404).json({ message: "Message not found" }); // Respond with a 404 status
    }

    // console.log("Message updated:", updatedMessage);s
    return res.status(200).json(updatedMessage); // Respond with the updated message
  } catch (error) {
    console.error("Error updating message:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the message" }); // Respond with a 500 status for server errors
  }
});

// Delete Message For All
export const DeleteChat = catchAsyncError(async (req, res, next) => {
  try {
    const { chatId } = req.params; // Get the message ID from request parameters

    // Find the message by ID and delete it
    const deletedMessage = await chatSchema.findByIdAndDelete(chatId);

    if (!deletedMessage) {
      // console.log("Message not found");
      return res.status(404).json({ message: "Chat not found" }); // Respond with a 404 status
    }

    // console.log("Message deleted:", deletedMessage);
    return res.status(204).json({ status: success, data: "Chat Deleted" }); // Respond with a 204 status (No Content) for successful deletion
  } catch (error) {
    // console.error("Error deleting message:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the Chat" }); // Respond with a 500 status for server errors
  }
});

// Update chat properties (unread, mute, archive)
export const updateChatProperties = catchAsyncError(async (req, res, next) => {
  try {
    const { chatId } = req.params; // Get the chat ID from request parameters
    const { unread, mute, archive } = req.body; // Get properties to update from the request body

    // Find the chat by ID
    const chat = await chatSchema.findById(chatId);

    if (!chat) {
      // console.log("Chat not found");
      return res.status(404).json({ message: "Chat not found" }); // Respond with a 404 status
    }

    // Update the chat properties based on the request body
    if (unread) {
      chat.unread = unread;
    }

    if (typeof mute === "boolean") {
      chat.mute = mute;
    }

    if (typeof archive === "boolean") {
      chat.archive = archive;
    }

    // Save the updated chat
    await chat.save();

    // console.log("Chat properties updated:", chat);
    return res.status(200).json(chat); // Respond with the updated chat
  } catch (error) {
    console.error("Error updating chat properties:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating chat properties" }); // Respond with a 500 status for server errors
  }
});
