import express from "express";
import {
  AddPhoneNumber,
  ShowProfile,
  WhoIam,
  Interests,
  PersonlDetail,
  Hobbies,
  LikeProfile,
  LikedProfile,
  DeleteProfile,
  uploadImage,
  AddProfileDetail,
  uploadVideo,
  ShowSingleProfile,
  login,
  CreateChat,
  GetChat,
  FindChat,
  SendMessage,
  GetMessage,
  AddEmail,
  AddLiveLocation,
  LoginWithEmail,
  UpdateImage,
  UpdateProfile,
  DislikeProfile,
  DeleteForAllMessage,
  updateMessageById,
  DeleteChat,
  updateChatProperties,
} from "../controller/userController.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.route("/AddPhoneNumber").post(AddPhoneNumber);
router.route("/email").post(AddEmail);
router.route("/LoginWithEmail").post(LoginWithEmail);
router.route("/login").post(login);
router.route("/ShowProfile/:id").post(ShowProfile);
router.route("/ShowSingleProfile/:id").post(ShowSingleProfile);
router.route("/AddProfileDetail/:id").post(AddProfileDetail);
router.route("/WhoIam/:id").post(WhoIam);
router.route("/UpdateProfile/:id").post(UpdateProfile);
router.route("/uploadImage", upload.array("avatars")).post(uploadImage);
router.route("/UpdateImage/:id", upload.array("avatars")).post(UpdateImage);
router.route("/uploadVideo").post(uploadVideo);
router.route("/Interests/:id").post(Interests);
router.route("/PersonlDetail/:id").post(PersonlDetail);
router.route("/Hobbies/:id").post(Hobbies);
router.route("/LikeProfile/:id").post(LikeProfile);
router.route("/DislikeProfile/:id").post(DislikeProfile);
router.route("/LikedProfile/:id").post(LikedProfile);
router.route("/DeleteProfile/:id").post(DeleteProfile);
router.route("/DeleteForAllMessage/:messageId").post(DeleteForAllMessage);
router.route("/updateMessageById/:messageId").post(updateMessageById);
router.route("/updateChatProperties/:chatId").post(updateChatProperties);
router.route("/deleteChat/:chatId").post(DeleteChat);
router.route("/createChat").post(CreateChat);
router.route("/getChat/:userId").get(GetChat);
router.route("/find").post(FindChat);
router.route("/sendMessage").post(SendMessage);
router.route("/getMessage/:chatId").post(GetMessage);
router.route("/addLiveLocation/:id").post(AddLiveLocation);

export default router;
