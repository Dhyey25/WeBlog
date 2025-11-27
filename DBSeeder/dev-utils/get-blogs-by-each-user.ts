import { configDotenv } from "dotenv";
import * as path from "path";
import Blog from "../../models/blog";
import User from "../../models/user";
import connectDB from "../../db/connect";
import { Schema, Types } from "mongoose";

const newPath = path.join(__dirname, "..", "..", ".env");
configDotenv({ path: newPath });

const getBlogsByEachUser = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    const blogs = await Blog.find({});
    
    // count blogs by author
    let acc: { [key: string]: number } = {};
    const blogsByAuthor = blogs.reduce(
      (acc, blog) => {
        const author = blog.author.toString();
        if (!acc[author]) {
          acc[author] = 0;
        }
        acc[author]++;
        return acc;
      },
      acc as { [key: string]: number }
    );

    const sortedBlogsByAuthor = Object.entries(blogsByAuthor).sort(
      (a, b) => b[1] - a[1]
    );
    console.log(sortedBlogsByAuthor.slice(0, 5)); 
  } catch (error) {
    console.error(error);
  }
};

getBlogsByEachUser();