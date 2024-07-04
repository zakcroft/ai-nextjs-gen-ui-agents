import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StructuredTool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";

import { ChatOpenAI } from "@langchain/openai";
import { Runnable } from "@langchain/core/runnables";

export async function createAgent({
  llm,
  tools,
  systemMessage,
}: {
  llm: ChatOpenAI;
  tools: StructuredTool[];
  systemMessage: string;
}): Promise<Runnable> {
  const toolNames = tools.map((tool) => tool.name).join(", ");
  const formattedTools = tools.map((t) => convertToOpenAITool(t));

  let prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant, collaborating with other assistants." +
        " Use the provided tools to progress towards answering the question." +
        " If you are unable to fully answer, that's OK, another assistant with different tools " +
        " will help where you left off. Execute what you can to make progress." +
        " If you or any of the other assistants have the final answer or deliverable," +
        " prefix your response with FINAL ANSWER so the team knows to stop." +
        " You have access to the following tools: {tool_names}.\n{system_message}",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  prompt = await prompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
  });

  return prompt.pipe(llm.bind({ tools: formattedTools }));
}
