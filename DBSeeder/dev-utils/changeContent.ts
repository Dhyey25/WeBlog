import { configDotenv } from "dotenv";
import * as path from "path";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Blog from "../../models/blog"; // Assuming standard model path
import connectDB from "../../db/connect";

const newPath = path.join(__dirname, "..", "..", ".env");
configDotenv({ path: newPath });

const changeContent = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    const blogs = await Blog.find({}).select("content");
    
    for (let blog of blogs) {
      if (blog._id.toString().slice(0, 8) !== "bbbbbbbb") console.log(blog._id);
      
      let text: any = "";
      try {
          // Handle cases where content might already be JSON or raw string
           const parsed = JSON.parse(blog.content);
           if(parsed.blocks) text = parsed; // already formatted
           else text = blog.content; 
      } catch(e) {
          text = blog.content;
      }

      // Simple mock transformation logic
      // In reality, this relies on the structure of your data.json
      
      // Saving as EditorJS format structure
      blog.content = JSON.stringify({
        time: 1550476186479,
        blocks: (typeof text === 'string' ? text : "Placeholder").split("\n\n").map((paragraph: any) => ({
          id: uuidv4(),
          type: "paragraph",
          data: {
            text: paragraph.trim(),
          },
        })),
        version: "2.8.1",
      });
      
      await blog.save();
    }
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

changeContent();