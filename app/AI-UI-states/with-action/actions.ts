// Define the AI state and UI state types
import { ReactNode } from "react";
import { createAI, getAIState, getMutableAIState } from "ai/rsc";
import { CoreMessage, generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export type AIState = Array<{
  role: "user" | "assistant";
  content: string;
}>;

export type UIState = Array<{
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}>;

async function sendMessage(message: string) {
  "use server";

  const history = getMutableAIState();

  // Update the AI state with the new user message.
  history.update([...history.get(), { role: "user", content: message }]);

  const response = await generateText({
    model: openai("gpt-3.5-turbo"),
    messages: history.get(),
  });

  // Update the AI state again with the response from the model.
  history.done([...history.get(), { role: "assistant", content: response }]);

  console.log(history);
  console.log(response);

  return response;
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});
