import * as cheerio from "cheerio";
import urlModule from "url";
import cliProgress from "cli-progress";

// Note: Full Langchain document takes a very long time to download. A short documentation is provided for the course (recommended).

const Resume_URL =
  "https://graceful-cascaron-e699ad.netlify.app";


const progressBar = new cliProgress.SingleBar({
  format: "Documents Crawled: {value}",
});

async function fetchLinkedUrls(url: string, downloadedUrls: Set<string>) {
  if (downloadedUrls.has(url)) return;

  progressBar.update(downloadedUrls.size);
  try {
    const response = await fetch(url);

    const html = await response.text();
    const $ = cheerio.load(html);

    downloadedUrls.add(url); // Add URL to downloaded set

    // Extract all anchor tags
    const links: string[] = [];
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith(Resume_URL)) {
        links.push(href);
      }
    });

    // Download HTML from linked URLs with reduced depth
    for (const link of links) {
      const absoluteUrl = urlModule.resolve(url, link);
      await fetchLinkedUrls(absoluteUrl, downloadedUrls);
    }
  } catch (error) {
    console.error(`Error downloading HTML from ${url}: ${error}`);
  }
}

export async function crawlResumeUrls(): Promise<string[]> {
  const urls = new Set<string>();

  console.log("Crawling Resume...");
  progressBar.start(1000, 0);

  await fetchLinkedUrls(Resume_URL, urls);

  progressBar.stop();
  return [...urls];
}


