import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import fs from 'fs';
import { config } from "dotenv";

config();

// Note: Gemini models cannot generate images - they are text/chat models only.
// The BytesOutputParser was converting Gemini's text response to bytes.
// For actual image generation, you need to use a service like OpenAI DALL-E, Stability AI, etc.

const imageGenration = async () => {
    try {
        const promptTemplate = new PromptTemplate({
            template: "Generate an image of {image}",
            inputVariables: ["image"],
        });
        
        const model = new ChatGoogleGenerativeAI({
            model: "imagen-4.0-generate-001",
            apiKey: process.env.GOOGLE_API_KEY,
        });
        
        // Use StringOutputParser since Gemini returns text, not binary image data
        const outputParser = new StringOutputParser();
        const chain = promptTemplate.pipe(model).pipe(outputParser);
        
        const answer = await chain.invoke({
            image: "A beautiful sunset over a calm ocean",
        });
        
        console.log('answer --> ', answer);
        
        // Save the text response (since Gemini cannot generate images)
        fs.writeFileSync('image-response.txt', answer);
        console.log('Note: Gemini returned text, not an image. Response saved to image-response.txt');
        console.log('To generate actual images, use a service like OpenAI DALL-E or Stability AI.');
    } catch (error) {
        console.error('Error:', error);
    }
};

imageGenration();