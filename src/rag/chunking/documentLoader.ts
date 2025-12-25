import { Document } from "@langchain/core/documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import cliProgress from "cli-progress";
import { crawlResumeUrls } from "./webcrawler.ts";

const progressBar = new cliProgress.SingleBar({});
export async function loadDocuments(): Promise<Document[]> {
  const resumeUrls = await crawlResumeUrls();

  console.log(
    `Starting document download. ${resumeUrls.length} total documents.`
  );

  progressBar.start(resumeUrls.length, 0);
  const rawDocuments: Document[] = [];

  for (const url of resumeUrls) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    rawDocuments.push(...docs);
    progressBar.increment();
  }

  progressBar.stop();
  console.log(`${rawDocuments.length} documents loaded.`);
  return rawDocuments;
}

// const rawDocuments = await loadDocuments(); 

// console.log(rawDocuments.slice(0, 4));
