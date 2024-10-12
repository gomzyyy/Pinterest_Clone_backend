import { Router } from "express";
import {
  signupController,
  loginController,
  logoutController,
  updateUserController,
  postUploadController,
  deletePostController,
} from "../source.js";
import { upload } from "../middlewares/multer.js";

const route = Router();

route.post("/signup", signupController);
route.post("/login", loginController);
route.post("/user/logout", logoutController);
route.post(
  "/user/profile/update",
  upload.single("avatar"),
  updateUserController
);
route.post("/user/upload", upload.single("post"), postUploadController);
route.post("/user/posts/delete:postId", deletePostController);

export default route;
