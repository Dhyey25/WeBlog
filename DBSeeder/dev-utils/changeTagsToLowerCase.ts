import { configDotenv } from "dotenv";
import * as path from "path";
import mongoose from "mongoose";
import Blog from "../../models/blog";
import connectDB from "../../db/connect";

const newPath = path.join(__dirname, "..", "..", ".env");
configDotenv({ path: newPath });

const changeTagsToLowerCase = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    const blogs = await Blog.find({}).select("tags title");
    
    for (let blog of blogs) {
      if (blog.title.length > 100) {
        blog.title = blog.title.slice(0, 100);
      }
      blog.tags.forEach((tag, index) => {
        blog.tags[index] = tag.toLowerCase();
      });
      await blog.save();
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
};

changeTagsToLowerCase();