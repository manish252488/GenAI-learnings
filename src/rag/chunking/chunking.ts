// use the agentic chunking - to use an llm to decompose the documents into independent pieces of 
// information called propositions. the these propositions are then used to create the embeddings
// and store them in the vector database.
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitDocuments = async (documents: Document[]) => {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
        chunkSize: 1000,      // Max characters per chunk
        chunkOverlap: 200,    // Overlap for context retention
    });
    
    const chunks = await splitter.splitDocuments(documents);
    console.log(`Split into ${chunks.length} chunks`);
    return chunks;

};

