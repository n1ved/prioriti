// app/api/generate/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const { files } = await request.json();

    const result = await model.generateContent([files,'Analyze']);
    console.log(result)
    return Response.json({ result: result.response.text() });
}
