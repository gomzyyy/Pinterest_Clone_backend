import mongoose, { Schema } from "mongoose";
import { CategoriesEnum, ReportPostEnum } from "../../../staticData/constants.js";

const CategoryModel = new Schema({
  category:{
    type:String,
    enum:CategoriesEnum,
    default:'Education'
  },
  Others:{
    type:String,
    maxLength:[20, "Category can't exceed 20 characters"]
  }
})
const Category = mongoose.model("Category", CategoryModel)

const ReportPostModel = new Schema({
  reportType:{
    type:String,
    enum:ReportPostEnum,
    default:'Spam'
  },
  Others:{
    type:String,
    maxLength:[20, "Category can't exceed 20 characters"]
  }
})
const ReportPost = mongoose.model("ReportPost", ReportPostModel)


const PostModel = new Schema({
  title: {
    type: String,
    required: [true, "title is required."],
    maxLength: [60, "Title should not exceed 60 characters."],
    trim:true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  reportStatus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReportPost",
  }],
  visible: {
    type: Boolean,
    default: true,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  tags:[{
    type:String,
    required:true,
    trim:true
  }],
  description:{
    type:String,
    default:"",
    maxLength:[300, "Description should not exceed 300 characters."],
    minLength:[12, "Please provide more information or rather ignore the description."],
    trim:true
  },
  downloadable:{
    type:Boolean,
    default:true
  }
},{timestamps:true});

export const Post = mongoose.model("Post", PostModel)
