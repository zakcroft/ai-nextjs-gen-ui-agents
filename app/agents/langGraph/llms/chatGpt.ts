import { ChatOpenAI } from "@langchain/openai";
export const MODEL = "gpt-4o";

export const LlmChatOpenAI = new ChatOpenAI({
  modelName: MODEL,
  temperature: 0,
});
