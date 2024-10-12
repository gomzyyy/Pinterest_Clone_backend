import { v2 as cloudinary } from "cloudinary";

const mediaDB = async (path) => {
  try {
    cloudinary.config({
      cloud_name: "dgki5gnzf",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const cloudinaryResponse = await cloudinary.uploader.upload(path);
    console.log(cloudinaryResponse);
    return cloudinaryResponse.url;
  } catch (error) {
    console.log(error);
  }
};

export default mediaDB;
