import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
config();
export async function getRetriever() {

    const embeddingLLM = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY,
    });
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
    });
    const indexName = "portfolio-index";
    const pineconeIndex = pinecone.index(indexName);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddingLLM,
        {
            pineconeIndex: pineconeIndex,
        }
    );
    return vectorStore.asRetriever();
}

// test code

// const re = await retriever();
// const context = await re.invoke("What is the main purpose of the portfolio?");
// console.log(context);