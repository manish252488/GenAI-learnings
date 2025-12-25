import { config } from "dotenv";
import { loadDocuments } from "../chunking/documentLoader.ts";
import { splitDocuments } from "../chunking/chunking.ts";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import cliProgress from "cli-progress";
config();

const rawDocuments = await loadDocuments();
const chunked = await splitDocuments(rawDocuments);
const embeddingLLM = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
});
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
});

const indexName = "portfolio-index";

try {
    const existingIndexes = await pinecone.listIndexes();
    const indexExists = existingIndexes.indexes?.some(idx => idx.name === indexName);
    
    if (!indexExists) {
        console.log(`Index "${indexName}" not found. Creating index...`);
        await pinecone.createIndex({
            name: indexName,
            dimension: 1536,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1"
                }
            }
        });
        console.log(`Index "${indexName}" created successfully.`);
        // Wait a bit for index to be ready
        console.log("Waiting for index to be ready...");
        await new Promise(resolve => setTimeout(resolve, 10000));
    } else {
        console.log(`Index "${indexName}" already exists.`);
    }
} catch (error) {
    console.error("Error checking/creating index:", error);
    throw error;
}

const pineconeIndex = pinecone.Index(indexName);

const progressBar = new cliProgress.SingleBar({});

progressBar.start(chunked.length, 0);

// process chunks

for (let i = 0; i < chunked.length; i += 100) {
    const batch = chunked.slice(i, i + 100);
    await PineconeStore.fromDocuments(batch, embeddingLLM, {
        pineconeIndex: pineconeIndex
    });
    progressBar.increment(batch.length);
}

progressBar.stop();
console.log("Documents indexed successfully");


/** 
 * response
Crawling Resume...
Documents Crawled: 0
Starting document download. 1 total documents.
progress [========================================] 100% | ETA: 0s | 1/1
1 documents loaded.
Split into 38 chunks
Index "portfolio-index" not found. Creating index...
Index "portfolio-index" created successfully.
Waiting for index to be ready...
progress [========================================] 100% | ETA: 0s | 38/38
Documents indexed successfully
*/