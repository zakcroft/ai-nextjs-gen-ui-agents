import { JsonOutputToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { llmChatOpenAI } from "@/app/agents/langGraph/llms/chatGpt";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { END } from "@langchain/langgraph";

import { agentsArr } from "@/app/agents/langGraph/agents/constants";

const systemPrompt =
  "You are a supervisor tasked with managing a conversation between the" +
  " following workers: {members}. Given the following user request," +
  " respond with the worker to act next. Each worker will perform a" +
  " task and respond with their results and status. When finished," +
  " respond with FINISH.";
const options = [END, ...agentsArr];

// Define the routing function
const functionDef = {
  name: "route",
  description: "Select the next role.",
  parameters: {
    title: "routeSchema",
    type: "object",
    properties: {
      next: {
        title: "Next",
        anyOf: [{ enum: options }],
      },
    },
    required: ["next"],
  },
};

const toolDef = {
  type: "function",
  function: functionDef,
} as const;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("messages"),
  [
    "system",
    "Given the conversation above, who should act next?" +
      " Or should we FINISH? Select one of: {options}",
  ],
]);

const formattedPrompt = await prompt.partial({
  options: options.join(", "),
  members: agentsArr.join(", "),
});

// console.log(formattedPrompt);

export const supervisorChain = formattedPrompt
  .pipe(
    llmChatOpenAI.bindTools([toolDef], {
      tool_choice: { type: "function", function: { name: "route" } },
    }),
  )
  .pipe(new JsonOutputToolsParser())
  // select the first one
  // @ts-ignore
  .pipe((x) => {
    console.log(x[0].args);
    return x[0].args;
  });
