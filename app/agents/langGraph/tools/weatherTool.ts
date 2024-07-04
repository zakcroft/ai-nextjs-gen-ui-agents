import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// import "cheerio"; // This is required in notebooks to use the `CheerioWebBaseLoader`

export const weatherTool = new DynamicStructuredTool({
  name: "search",
  description:
    "Use to surf the web, fetch current information, check the weather, and retrieve other information.",
  schema: z.object({
    query: z.string().describe("The query to use in your search."),
  }),
  func: async ({}: { query: string }) => {
    // This is a placeholder for the actual implementation
    return "Cold, with a low of 13 ℃";
  },
});

// await weatherTool.invoke({ query: "What's the weather like?" });
