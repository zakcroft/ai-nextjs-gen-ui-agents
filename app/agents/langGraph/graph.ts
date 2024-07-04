import { START, StateGraph } from "@langchain/langgraph";
import {
  agentStateChannels,
  AgentStateChannels,
} from "@/app/agents/langGraph/types/state";
import { researcherAgentNode } from "@/app/agents/langGraph/agents/researchAgent";
import { chartGeneratorAgentNode } from "@/app/agents/langGraph/agents/chartAgent";
import { MEMBERS } from "@/app/agents/langGraph/agents/constants";

const workflow = new StateGraph<AgentStateChannels, unknown, string>({
  channels: agentStateChannels,
}) // 2. Add the nodes; these will do the work
  // .addNode("supervisor", supervisorChain);
  .addNode("Researcher", researcherAgentNode)
  .addNode("ChartGenerator", chartGeneratorAgentNode);

// 3. Define the edges. We will define both regular and conditional ones
// After a worker completes, report to supervisor
MEMBERS.forEach((member) => {
  workflow.addEdge(member, "supervisor");
});

workflow.addConditionalEdges("supervisor", (x: AgentStateChannels) => x.next);

workflow.addEdge(START, "supervisor");

const graph = workflow.compile();
