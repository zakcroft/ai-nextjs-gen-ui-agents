import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { weatherTool } from "../../tools/weatherTool";
import { z } from "zod";

// https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-with-tool-calling#chatbot-with-tools
export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    system: "You are a helpful assistant.",
    messages,
    tools: {
      weatherTool,
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: z.object({
          message: z.string().describe("The message to ask for confirmation."),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          "Get the user location. Always ask for confirmation before using this tool.",
        parameters: z.object({}),
      },
    },
  });

  return result.toAIStreamResponse();
}
