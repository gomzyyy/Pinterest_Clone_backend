import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import { Post } from "../../models/userModel/postModel/post.model.js";
import jwt from "jsonwebtoken";
import mediaDB from "../../database/cloudinary.js";

export const postUploadController = async (req, res) => {
  try {
    const { title, imagePath, tags } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: "Unauthorised action!",
        success: false,
      });
    }
    if (!title || !imagePath || !tags) {
      return res.status(e.BAD_REQUEST.code).json({
        message: "Some required fields are empty!",
        success: false,
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
      if (error) {
        return res.status(e.UNAUTHORIZED.code).json({
          message: "Invalid token",
          success: false,
        });
      }
      const UID = decode.userId;
      const user = await User.findById({ UID });
      if (!user) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Can't find the user credientials.",
          success: false,
        });
      }
      let imageUrl;
      try {
        const uploadPostImageToCloudinary = await mediaDB(imagePath);
        if (uploadPostImageToCloudinary) {
          imageUrl = uploadPostImageToCloudinary;
        }
      } catch (uploadError) {
        return res.status(e.INTERNAL_SERVER_ERROR.code).json({
          message: "An error occured while creating the post.",
          success: false,
          error: uploadError.message,
        });
      }

      const newPost = new Post({
        title: title.trim(),
        admin: user._id,
        image: imageUrl,
        tags: Array.isArray(tags) ? tags : [],
      });
      await newPost.save();

      user.posts.push(newPost._id);

      await user.save();
      return res.status(e.OK.code).json({
        message: "Post created success!",
        success: true,
      });
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "An error occurred while creating post.",
      success: false,
      error: error.message,
    });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(e.UNAUTHORIZED.code).json({
        message: "Unauthorised action!",
        success: false,
      });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
      if (error) {
        return res.status(e.UNAUTHORIZED.code).json({
          message: "Invalid token",
          success: false,
        });
      }
      const { postId } = req.params;
      const postOk = await Post.findById({ postId });
      if (!postOk) {
        return res.status(e.BAD_REQUEST.code).json({
          message: "Can't find the post.",
          success: false,
        });
      }
      const UID = decode.userId;
      if (!UID) {
        return res.status(e.NOT_FOUND.code).json({
          message: "Can't find the user credientials.",
          success: false,
        });
      }
      const user = await User.findById({ UID });
      if (!user) {
        return res.status(e.NOT_FOUND.code).json({
          message: "User not found with the given token!",
          success: false,
        });
      }
      const deletePost = await Post.findByIdAndDelete({ postId });
      if (!deletePost) {
        return res.status(e.INTERNAL_SERVER_ERROR.code).json({
          message: "Unable to delete the post.",
          success: false,
        });
      }
      user.posts.pull(postId)
     await user.save()
     return res.status(e.OK.code).json({
      message:"Post deleted successfully!",
      success:true
     })
    });
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: "An error occurred while deleting post.",
      success: false,
      error: error.message,
    });
  }
};
