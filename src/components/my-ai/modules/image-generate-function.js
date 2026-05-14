import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


async function generateImage(input) {
   try {
    if(!input ){
        return null
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
        A detailed, vivid, and visually rich image description.

 `
   const response = await openai.responses.create({
        model: "gpt-5",
        input: inputPrompt,
        tools: [{type: "image_generation", action: "auto"}],
    });

    console.log(response)

    // Save the image to a file
    const imageData = response.output
    .filter((output) => output.type === "image_generation_call")
    .map((output) => output.result);

    if (imageData.length > 0) {
        const imageBase64 = imageData[0];
        const fs = await import("fs");
        fs.writeFileSync("otter.png", Buffer.from(imageBase64, "base64"));
    }
    console.log("Image = ", imageBase64);

    return imageBase64;
    } catch (error) {
        console.log("Error in generating image :", error)
        return null
    }
}

