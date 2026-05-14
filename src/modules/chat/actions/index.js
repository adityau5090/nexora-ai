"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/modules/authentication_module/actions"
import { MessageRole, MessageType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import OpenAI from "openai";


export const createChatWithMessage = async (values) => {
    try {
        const user = await currentUser();

        if(!user){
            return {
                success: false,
                message: "Unauthorized user"
            }
        }

        const {content, model } = values;

        if(!content || !content.trim() || !model){
            return {
                success: false,
                message: "Message content and model is required"
            }
        }



        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")

        const chat = await db.chat.create({
            data:{
                title,
                model,
                userId: user.id,
                message: {
                    create: {
                        content,
                        messageRole: MessageRole.USER,
                        messageType: MessageType.NORMAL,
                        model
                    }
                }
            },
            include:{
                message: true
            }
        })

        revalidatePath("/");

        return {success: true, message:"Chat created successfully", data:chat}
    } catch (error) {
        console.error("Error creating chat : ", error);
        return {
            success: false,
            message: "Failed to create chat"
        }
    }
}

export const getAllChats = async () => {
    try {
        const user = await currentUser();

        if(!user){
            return {
                success: false,
                message: "Unauthorized access"
            }
        }

        const chats = await db.chat.findMany({
            where: {
                userId: user.id
            },
            include: {
                message: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return {
            success: true,
            message: "Chat fetched successfully",
            data: chats
        }
    } catch (error) {
        console.error("Error fetching chats : ", error);
        return {
            success: false,
            message: "Failed to fetch chats from db"
        }
    }
}

export const deleteChat = async (chatId) => {
    try {
       const user = await currentUser();
        if(!user){
            return {
                success: false,
                message: "Unauthorized access"
            }
        } 

        const chat = await db.chat.findUnique({
            where: {
                id : chatId,
                userId: user.id
            }
        })

        if(!chat){
            return {
                success: false,
                message : "chat not found"
            }
        }

        await db.chat.delete({
            where: {
                id: chatId,
            }
        })

        revalidatePath("/");

        return {
            success: true,
            message: "Chat successfully deleted"
        }
    } catch (error) {
        console.error("Error deleting chat :", error);
        return {
            success: false,
            message: "Failed to delete chat"
        }
    }
}

export const getChatById = async (chatId) => {
    try {
        const user = await currentUser();

        if(!user){
            return{
                success: false,
                message: "Unauthorized user"
            }
        }

        const chat = await db.chat.findUnique({
            where: {
                id: chatId,
                userId : user.id
            },
            include: {
                message: true
            }
        })

        return {
            success: true,
            message: "Chat fetched successfully",
            data: chat
        }
    } catch (error) {
        console.error("Error fetching chat : ", error);
        return {
            success: false,
            message: "Failed to fetch chat"
        }
    }
}

export const createImage = async (values) => {

    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

    try {
        const user = await currentUser()

        if(!user){
            return {
                success: false,
                message: "Unauthorized access"
            }
        }

        const { input, model} = values;

    if(!input || !input.trim() || !model){
            return {
                success: false,
                message: "Message content and model is required"
            }
        }

    const inputPrompt= `
        Role: You are an expert AI image generator.

        Task:
        Transform the user's description into a highly detailed visual scene.

        Guidelines:
        - Focus on subject details (appearance, textures, expressions)
        - Add environment and background details
        - Use appropriate lighting (soft, cinematic, dramatic, natural, etc.)
        - Define colors and mood clearly
        - Include camera angle and composition (close-up, wide shot, depth of field)

        Rules:
        - If the prompt is short, creatively expand it while staying relevant
        - If no style is specified, use a realistic or cinematic style
        - Optimize output for high-quality image generation

        User Input:
        ${input}

        Final Output:
        Generate an image based on this description.
        Do NOT return text. Only generate the image.

 `
   const response = await openai.responses.create({
        model: model,
        input: inputPrompt,
        tools: [{type: "image_generation", action: "auto"}],
        tool_choice: { type: "image_generation" }
    });

    // console.log(response)

    // Save the image to a file
    const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

    let imageBase64 = null
    if (imageData.length > 0) {
        imageBase64 = imageData[0];
        const fs = await import("fs");
        fs.writeFileSync("otter.png", Buffer.from(imageBase64, "base64"));
    }
    // console.log("Image = ", imageBase64);

    return {
        success: true,
        message: "Image generated successfully",
        data: imageBase64
    };
    } catch (error) {
        console.log("Error in generating image :", error)
        return {
            success: false,
            message: "Error in generating image"
        }
    }

}