import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import jwt from "jsonwebtoken";

export const logoutController = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(e.BAD_GATEWAY.code).json({
          message: "No token found!",
          success: false,
        });
      }
      jwt.verify(
        token,
        process.env.SECRET_KEY,
        async (error, decode) => {
          if (error) {
            return res.status(e.BAD_GATEWAY.code).json({
              message: "Invalid token",
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
          } else {
            return res.status(e.OK.code).json({
              message: "Logout success!",
              success: true,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  