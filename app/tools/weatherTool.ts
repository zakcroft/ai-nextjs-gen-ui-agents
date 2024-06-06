import { z } from "zod";
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-4o"),
  temperature: 0.5,
  tools: {
    weather: tool({
      description: "Get the weather in a location",
      parameters: z.object({
        location: z.string().describe("The location to get the weather for"),
      }),
      execute: async ({ location }) => {
        console.log("location", location);
        console.log("MATH", 72 + Math.floor(Math.random() * 21) - 10);
        return {
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        };
      },
    }),
  },
  toolChoice: "auto", // auto (default), required, none
  prompt:
    "What is the weather in San Francisco and what attractions should I visit?",
});
