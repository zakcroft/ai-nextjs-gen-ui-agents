import { createAgent } from "@/app/agents/langGraph/utils/createAgent";
import { LlmChatOpenAI } from "@/app/agents/langGraph/llms/chatGpt";
import { AgentStateChannels } from "@/app/agents/langGraph/types/state";
import { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { chartTool } from "@/app/agents/langGraph/tools/chartTool";

const chartGeneratorAgent = await createAgent({
  llm: LlmChatOpenAI,
  tools: [chartTool],
  systemMessage:
    "You excel at generating bar charts. Use the researcher's information to generate the charts.",
});

export const chartGeneratorAgentNode = async (
  state: AgentStateChannels,
  config?: RunnableConfig,
) => {
  const result = await chartGeneratorAgent.invoke(state, config);
  return {
    messages: [
      new HumanMessage({ content: result.output, name: "ChartGenerator" }),
    ],
  };
};
