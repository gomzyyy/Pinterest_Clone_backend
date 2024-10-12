import { HTTP_STATUS_CODES as e } from "../../staticData/errorMessages.js";
import { User } from "../../models/userModel/user.model.js";
import bcrypt from "bcryptjs";

export const signupController = async (req, res) => {
  try {
    const { userName, userId, password, confirmPassword, email } = req.body;
    if (!userName || !userId || !password || !confirmPassword || !email) {
      return res
        .status(e.BAD_REQUEST.code)
        .json({ message: "Empty fields are not allowed!", success: false });
    }
    if (password !== confirmPassword) {
      return res
        .status(e.BAD_REQUEST.code)
        .json({ message: "Password didn't matched!", success: false });
    }
    const user = await User.findOne({ userId });
    if (user) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "User already exists with this user ID! Try a different one.",
        success: false,
      });
    }
    const emailOk = await User.findOne({ email });
    if (emailOk) {
      return res.status(e.UNPROCESSABLE_ENTITY.code).json({
        message: "User already exists with this email! Try a different one.",
        success: false,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      userName,
      userId,
      email,
      password: encryptedPassword,
    });
    return res.status(e.OK.code).json({
      message: "User created successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
