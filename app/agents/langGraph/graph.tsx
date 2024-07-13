"use server";

import { START, StateGraph } from "@langchain/langgraph";
import {
  agentStateChannels,
  AgentStateChannels,
} from "@/app/agents/langGraph/types/state";
import { researcherAgentNode } from "@/app/agents/langGraph/agents/researchAgent";
import { chartGeneratorAgentNode } from "@/app/agents/langGraph/agents/chartAgent";
import { supervisorChain } from "@/app/agents/langGraph/agents/supervisorChain";
import { AGENTS, agentsArr } from "@/app/agents/langGraph/agents/constants";
import { nanoid } from "nanoid";
import { HumanMessage } from "@langchain/core/messages";

const workflow = new StateGraph<AgentStateChannels, unknown, string>({
  channels: agentStateChannels,
}) // 2. Add the nodes; these will do the work
  .addNode(AGENTS.SUPERVISOR, supervisorChain)
  .addNode(AGENTS.RESEARCHER, (state, config) => {
    console.log(state, config);
    return researcherAgentNode(state, config);
  })
  .addNode(AGENTS.CHART_GENERATOR, chartGeneratorAgentNode);

agentsArr.forEach((agent) => {
  console.log(agent);
  workflow.addEdge(agent, AGENTS.SUPERVISOR);
});
workflow.addConditionalEdges(AGENTS.SUPERVISOR, (x: AgentStateChannels) => {
  console.log("Supervisor conditional edge", x.next);
  return x.next;
});

workflow.addEdge(START, AGENTS.SUPERVISOR);

const graph = workflow.compile();

export const agentApi = async (message: string) => {
  let streamResults = graph.stream(
    {
      messages: [
        new HumanMessage({
          content: message,
        }),
      ],
    },
    { streamMode: "values", recursionLimit: 100 },
  );

  for await (const output of await streamResults) {
    if (!output?.__end__) {
      console.log(output);
      console.log("----");
    }
  }

  // let inputs = {
  //   messages: [
  //     new HumanMessage({
  //       content: message,
  //     }),
  //   ],
  // };
  // [...history.get(), { role: "user", content: input }],
  // for await (const { messages } of await graph.stream(inputs, {
  //   // ...config,
  //   streamMode: "values",
  //   recursionLimit: 5,
  // })) {
  //   let msg = messages[messages?.length - 1];
  //
  //   console.log("msg", msg);
  //
  //   if (msg?.content) {
  //     console.log("msg.content", msg.content);
  //     return {
  //       id: nanoid(),
  //       role: "assistant",
  //       display: <div className={"bg-red inline"}>{msg?.content}</div>,
  //     };
  //   } else if (msg?.tool_calls?.length > 0) {
  //     console.log("tool_calls", msg.tool_calls);
  //   } else {
  //     console.log(msg);
  //   }
  //   console.log("-----\n");
  // }
};
