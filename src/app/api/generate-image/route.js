import OpenAI from "openai";



export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({
        success: false,
        message: "Prompt is required",
      });
    }

    const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
      quality: "low",
    });

    const imageBase64 = result.data[0].b64_json;

    return Response.json({
      success: true,
      image: imageBase64,
    });

  } catch (error) {
    console.error("❌ OpenAI Image Error:", error);

    return Response.json({
      success: false,
      message: error.message || "Image generation failed",
    });
  }
}