import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText, StreamData, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4-turbo"),

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

  // const data = new StreamData();
  //
  // data.append({ extra: "data" });
  //
  // const stream = result.toAIStream({
  //   onFinal(_) {
  //     data.close();
  //   },
  // });

  // return new StreamingTextResponse(stream, {}, data);

  return result.toAIStreamResponse();
}
