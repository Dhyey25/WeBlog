// import axios from "axios"
// import { StatusCodes } from "http-status-codes"
// import { BadRequestError } from "../errors"

// //types
// import { Request, Response } from "express"

// const getTextSuggestion = async (req: Request, res: Response) => {
//     const text = req.query.text
    
//     if (!text)
//         throw new BadRequestError("Please provide a 'text' for suggestion.")

//     const response = await axios.post(
//     "https://router.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
//     {
//       inputs: [
//         {
//           role: "user",
//           content: text,
//         },
//       ],
//       parameters: {
//         max_new_tokens: 25,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       timeout: 60_000,
//     },
//   )

//   const generatedText =
//     response.data?.[0]?.generated_text ??
//     response.data?.generated_text ??
//     ""

//   res.status(StatusCodes.OK).json({
//     success: true,
//     data: generatedText,
//     msg: "Data fetched successfully",
//   })
// }
// const getImageSuggestionPrompt = async (req: Request, res: Response) => {
//     const prompt = req.query.prompt

//     if (!prompt)
//         throw new BadRequestError(
//             "Please provide a 'prompt' for image suggestion.",
//         )

//     const response = await axios.post(
//     "https://router.huggingface.co/models/runwayml/stable-diffusion-v1-5",
//     {
//       inputs: prompt,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       responseType: "stream",
//     },
//   )

//   res.setHeader("Content-Type", "image/png")
//   res.setHeader("x-ai-generated-image", "true")
//   res.setHeader("Access-Control-Expose-Headers", "x-ai-generated-image")

//   response.data.pipe(res)
// }

// export { getTextSuggestion, getImageSuggestionPrompt }

//------------------------------------------------------------------------------------

import { HfInference } from "@huggingface/inference";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import * as dotenv from 'dotenv';
// Ensure env variables are loaded
dotenv.config();

// 1. Initialize the Hugging Face Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const getTextSuggestion = async (req: Request, res: Response) => {
  const text = req.query.text as string;
  //const model = 'meta-llama/Llama-3.2-3B-Instruct:novita'; 
  //const model = "openai/gpt-oss-20b:novita";

  if (!text) {
    throw new BadRequestError("Please provide a 'text' for suggestion.");
  }

  try {
    // 2. Use the SDK for Chat Completion
    // This automatically handles the format and URLs for you.
    const response = await hf.chatCompletion({
      model: "openai/gpt-oss-20b:novita",
      messages: [
            { role: "user", content: text }
      ],
        max_tokens: 200,
        temperature: 0.7,
        wait_for_model: true, // Wait for the model to load if it's not active
      });

    const generatedText = response.choices?.[0]?.message?.content || "";

    // let generatedText = "";
    // if (Array.isArray(content)) {
    //     generatedText = content
    //        .filter((c) => c.type === "text")
    //        .map((c) => c.text)
    //        .join("");
    // } else if(typeof content === "string") {
    //     generatedText = content;
    // }else {
    //     generatedText = "No text generated.";
    // }

    console.log("HF SDK Text Response:", generatedText);

    

    res.status(StatusCodes.OK).json({
      success: true,
      data: generatedText.trim(),
      msg: "Data fetched successfully",
    });

  } catch (error: any) {
    console.error("HF SDK Text Error:", error.message);

    // Handle the "Model loading" error specifically
    if (error.message.includes("loading")) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            msg: "Model is warming up. Please try again in 30 seconds.",
        });
        return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error generating text. Please check server logs.",
      error: error.message,
    });
  }
};

const getImageSuggestionPrompt = async (req: Request, res: Response) => {
  const prompt = req.query.prompt as string;

  if (!prompt) {
    throw new BadRequestError("Please provide a 'prompt' for image suggestion.");
  }

  try {
    // 3. Use the SDK for Image Generation
    const image = await hf.textToImage({
      provider:"nebius",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
      parameters: { num_inference_steps: 5 },
    });

    // 4. Convert the Blob to a Buffer so Express can send it
    const arrayBuffer = await (image as any).arrayBuffer()
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("x-ai-generated-image", "true");
    res.send(buffer);

  } catch (error: any) {
    console.error("HF SDK Image Error:", error.message);
    
    if (error.message.includes("loading")) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
           msg: "Image model is loading. Try again in 20 seconds.",
       });
       return;
   }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error generating image",
      error: error.message,
    });
  }
};

export { getTextSuggestion, getImageSuggestionPrompt };


// import { Request, Response } from "express"
// import { StatusCodes } from "http-status-codes"
// import axios from "axios"

// // FIX: Updated to Mistral v0.3 (Reliable on Router)
// const TEXT_API_URL =
//     "https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
// const IMAGE_API_URL =
//     "https://router.huggingface.co/models/runwayml/stable-diffusion-v1-5"

// const getTextSuggestion = async (req: Request, res: Response) => {
//     const { text, prompt } = req.query as { text?: string; prompt?: string }
//     const inputPrompt = text || prompt || req.body.text || req.body.prompt

//     if (!inputPrompt) {
//         return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({ msg: "Prompt is required" })
//     }

//     try {
//         // Mistral Instruct expects a string input in this format
//         const formattedPrompt = `[INST] Write a short, engaging blog post paragraph about: ${prompt} [/INST]`

//         const response = await axios.post(
//             TEXT_API_URL,
//             {
//                 inputs: formattedPrompt,
//                 parameters: {
//                     max_new_tokens: 300, // Increased for better length
//                     return_full_text: false,
//                     temperature: 0.7,
//                 },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//             },
//         )

//         // Handle the array response format from Hugging Face
//         let generatedText = ""
//         if (Array.isArray(response.data) && response.data.length > 0) {
//             generatedText = response.data[0].generated_text
//         } else if (response.data?.generated_text) {
//             generatedText = response.data.generated_text
//         }

//         res.status(StatusCodes.OK).json({
//             data: generatedText ? generatedText.trim() : "No text generated.",
//             success: true,
//         })
//     } catch (error: any) {
//         console.error("AI Text Gen Error:", error.response?.data || error.message)
        
//         // Handle specific 503 loading error
//         if (error.response?.status === 503) {
//             return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
//                 msg: "Model is loading (503). Please try again in 10 seconds.",
//             })
//         }
        
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             msg: "Error generating text",
//             error: error.message,
//         })
//     }
// }

// const getImageSuggestionPrompt = async (req: Request, res: Response) => {
//     const { text, prompt } = req.query as { text?: string; prompt?: string }
//     const inputPrompt = prompt || text

//     if (!inputPrompt) {
//         return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({ msg: "Prompt is required" })
//     }

//     try {
//         const response = await axios.post(
//             IMAGE_API_URL,
//             { inputs: prompt },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 responseType: "arraybuffer", // Important for receiving image data
//             },
//         )

//         res.set("Content-Type", "image/jpeg")
//         res.status(StatusCodes.OK).send(response.data)
//     } catch (error: any) {
//         console.error("AI Image Gen Error:", error.response?.data || error.message)
        
//         if (error.response?.status === 503) {
//              return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
//                 msg: "AI Model is warming up, please try again in 30 seconds.",
//              })
//         }

//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             msg: "Error generating image",
//             error: error.message,
//         })
//     }
// }

// export { getTextSuggestion, getImageSuggestionPrompt }