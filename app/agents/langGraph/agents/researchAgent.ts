import { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { llmChatOpenAI } from "@/app/agents/langGraph/llms/chatGpt";
import { AgentStateChannels } from "@/app/agents/langGraph/types/state";
import { createAgent } from "@/app/agents/langGraph/utils/createAgent";

import { tavilyTool } from "@/app/agents/langGraph/tools/webSearchTool";
import { AGENTS } from "@/app/agents/langGraph/agents/constants";

const researcherAgent = await createAgent({
  llm: llmChatOpenAI,
  tools: tavilyTool,
  systemMessage:
    "You are a web researcher. You may use the Tavily search engine to search the web for" +
    " important information, so the Chart Generator in your team can make useful plots.",
});

export const researcherAgentNode = async (
  state: AgentStateChannels,
  config?: RunnableConfig,
) => {
  console.log("researcherAgentNode state  ==== ", state);
  console.log("researcherAgentNode config  ==== ", config);
  const result = await researcherAgent.invoke(state, config);
  console.log("researcherAgentNode  ==== ", result);
  return {
    messages: [
      new HumanMessage({ content: result.output, name: AGENTS.RESEARCHER }),
    ],
  };
};
