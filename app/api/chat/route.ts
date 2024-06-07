import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { weatherTool } from "@/app/tools/weatherTool";
import { createStreamableValue } from "ai/rsc";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("messages===", messages);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages,
    tools: {
      weatherTool,
    },
  });

  console.log(result);

  // if (result.toolResults.length && result.toolCalls.length) {
  //   const { toolResults, toolCalls } = await result;
  //   console.log("if (toolResults && toolCalls) {", toolResults && toolCalls);
  //   const resultStram = await streamText({
  //     model: openai("gpt-3.5-turbo"),
  //     prompt: `Tell me a joke that incorporates ${toolResults[0].result.location} and it's current temperature (${toolResults[0].result.temperature})`,
  //   });
  //   return createStreamableValue(resultStram.textStream).value;
  // }

  // return new StreamingTextResponse(stream, {}, data);

  return result.toAIStreamResponse();
}
