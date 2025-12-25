import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";
config();
// basic prompt template

async function gemini() {
    const promptTemplate = new PromptTemplate({
        template: "Who created {language} and what is it?",
        inputVariables: ["language"],
    });
    const formattedPrompt = await promptTemplate.format({
        language: 'Node.js',
    });
    console.log('formattedPrompt --> ', formattedPrompt);
}

gemini();