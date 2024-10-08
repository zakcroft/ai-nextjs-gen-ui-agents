"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { generateObject } from "ai";
import { JokeComponent } from "./joke-component";
import { jokeSchema } from "./joke";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Stock } from "./Stock";
import { Langfuse } from "langfuse";
import { agentApi } from "@/app/agents/langGraph/graph";

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: "https://cloud.langfuse.com",
});

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const langfuseTrace = langfuse.trace({
    name: "AI-UI-states/with-action",
  });

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div className={"bg-red"}>{content}</div>;
    },
    tools: {
      tellAJoke: {
        description: "Tell a joke",
        parameters: z.object({
          location: z.string().describe("the users location"),
        }),
        generate: async function* ({ location }) {
          yield <Skeleton highlightColor={"#f5f5f5"} className="p-4 m-4" />;

          const langfuseGeneration = langfuseTrace.generation({
            name: "generation",
            input: [...history.get(), { role: "user", content: input }],
            model: "gpt-3.5-turbo",
          });

          const joke = await generateObject({
            model: openai("gpt-3.5-turbo"),
            schema: jokeSchema,
            prompt:
              "Generate a joke that incorporates the following location:" +
              location,
          });

          langfuseGeneration.end({
            output: joke.object.punchline,
            // Conditionally log a warning state
            level: joke.object.punchline.includes(
              "I don't know how to help with that",
            )
              ? "WARNING"
              : "DEFAULT",
            statusMessage: joke.object.punchline.includes(
              "I don't know how to help with that",
            )
              ? "Refused to answer"
              : undefined,
          });

          console.log(location);
          console.log(joke.object);

          return <JokeComponent joke={joke.object} />;
        },
      },
      showStockInformation: {
        description:
          "Get stock information for symbol for the last numOfMonths months",
        parameters: z.object({
          symbol: z
            .string()
            .describe("The stock symbol to get information for"),
          numOfMonths: z
            .number()
            .describe("The number of months to get historical information for"),
        }),
        generate: async ({ symbol, numOfMonths }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing stock information for ${symbol}`,
            },
          ]);

          return <Stock symbol={symbol} numOfMonths={numOfMonths} />;
        },
      },
    },
  });

  console.log("result.value===", result.value);

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}
//
// export const AI = createAI<ServerMessage[], ClientMessage[]>({
//   actions: {
//     continueConversation,
//     agentApi,
//   },
//   initialAIState: [],
//   initialUIState: [],
// });
