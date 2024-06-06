"use server";

import { createStreamableValue, readStreamableValue } from "ai/rsc";
import { CoreMessage, streamText, tool, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function continueConversation(messageHistory: CoreMessage[]) {
  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: messageHistory,
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
    async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      // implement your own storage logic:
      // await saveChat({ text, toolCalls, toolResults });
    },
  });

  // console.log(result.toolResults);

  const data = { test: "hello" };
  const stream = createStreamableValue(result.textStream);
  const toolResults = createStreamableValue(result.toolResults);
  // console.log(toolResults.value);
  return { message: stream.value, data, toolResults: toolResults.value };

  //  what's the weather like in london
  // return {
  //   messages: [
  //     ...messageHistory,
  //     {
  //       role: "assistant" as const,
  //       content: result.text,
  //     },
  //   ],
  //   data,
  // };
}
