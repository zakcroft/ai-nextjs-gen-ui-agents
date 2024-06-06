import { openai } from "@ai-sdk/openai";
import { tool, generateText, CoreMessage } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  console.log(messages);

  const {
    text,
    toolResults,
    toolCalls,
    finishReason,
    responseMessages,
    usage,
  } = await generateText({
    model: openai("gpt-3.5-turbo"),
    system: "You are a friendly assistant!",
    messages,
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
  });

  console.log(text);
  return Response.json({ messages: responseMessages });
  // return Response.json({
  //   messages: [
  //     ...messages,
  //     {
  //       role: "ai",
  //       content: text,
  //     },
  //   ],
  //   toolResults,
  //   toolCalls,
  //   finishReason,
  //   responseMessages,
  //   usage,
  // });
}
