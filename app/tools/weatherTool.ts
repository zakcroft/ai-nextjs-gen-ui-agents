import { z } from "zod";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";

export const weatherTool = tool({
  description: "Get the weather in a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    console.log("location", location);
    console.log("MATH", 72 + Math.floor(Math.random() * 21) - 10);
    const weather = {
      location,
      description: "Sunny",
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    };
    return `It is currently ${weather.temperature}°C and ${weather.description} in ${location}!`;
  },
});
