import { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { LlmChatOpenAI } from "@/app/agents/langGraph/llms/chatGpt";
import { AgentStateChannels } from "@/app/agents/langGraph/types/state";
import { createAgent } from "@/app/agents/langGraph/utils/createAgent";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
const tavilyTool = [new TavilySearchResults({ maxResults: 1 })];

const researcherAgent = await createAgent({
  llm: LlmChatOpenAI,
  tools: tavilyTool,
  systemMessage:
    "You are a web researcher. You may use the Tavily search engine to search the web for" +
    " important information, so the Chart Generator in your team can make useful plots.",
});

export const researcherAgentNode = async (
  state: AgentStateChannels,
  config?: RunnableConfig,
) => {
  const result = await researcherAgent.invoke(state, config);
  return {
    messages: [
      new HumanMessage({ content: result.output, name: "Researcher" }),
    ],
  };
};
