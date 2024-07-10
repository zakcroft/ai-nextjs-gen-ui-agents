"use server";

import { START, StateGraph } from "@langchain/langgraph";
import {
  agentStateChannels,
  AgentStateChannels,
} from "@/app/agents/langGraph/types/state";
import { researcherAgentNode } from "@/app/agents/langGraph/agents/researchAgent";
import { chartGeneratorAgentNode } from "@/app/agents/langGraph/agents/chartAgent";
import { supervisorChain } from "@/app/agents/langGraph/agents/supervisorChain";
import { MEMBERS } from "@/app/agents/langGraph/agents/constants";
import { nanoid } from "nanoid";

const workflow = new StateGraph<AgentStateChannels, unknown, string>({
  channels: agentStateChannels,
}) // 2. Add the nodes; these will do the work
  .addNode("Supervisor", supervisorChain)
  .addNode("Researcher", researcherAgentNode)
  .addNode("ChartGenerator", chartGeneratorAgentNode);

// 3. Define the edges. We will define both regular and conditional ones
// After a worker completes, report to supervisor
MEMBERS.forEach((member) => {
  workflow.addEdge(member, "Supervisor");
});

workflow.addConditionalEdges("Supervisor", (x: AgentStateChannels) => x.next);

workflow.addEdge(START, "Supervisor");

const graph = workflow.compile();

export const agentApi = async (message: string) => {
  let inputs = { messages: [["user", message]] };
  // [...history.get(), { role: "user", content: input }],
  for await (const { messages } of await graph.stream(inputs, {
    // ...config,
    streamMode: "values",
    recursionLimit: 5,
  })) {
    let msg = messages[messages?.length - 1];

    console.log("msg", msg);

    if (msg?.content) {
      return {
        id: nanoid(),
        role: "assistant",
        display: <div className={"bg-red inline"}>{msg?.content}</div>,
      };
    } else if (msg?.tool_calls?.length > 0) {
      console.log("tool_calls", msg.tool_calls);
    } else {
      console.log(msg);
    }
    console.log("-----\n");
  }
};
