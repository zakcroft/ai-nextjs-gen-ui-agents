"use server";
import { ReactNode } from "react";

import { END, START, StateGraph, StateGraphArgs } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { toolNode, boundModel } from "./tools";
import { MemorySaver } from "@langchain/langgraph";

import { nanoid } from "nanoid";
import { researcherNode } from "@/app/agents/langGraph/agents/researchAgent";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

interface IState {
  messages: BaseMessage[];
}

// Here we only save in-memory
const memory = new MemorySaver();

// messages: [...history.get(), { role: "user", content: input }],
//   text: ({ content, done }) => {
//     if (done) {
//       history.done((messages: ServerMessage[]) => [
//         ...messages,
//         { role: "assistant", content },
//       ]);
//     }
// This defines the agent state
// const graphState: StateGraphArgs<IState>["channels"] = {
//   messages: {
//     value: (x: BaseMessage[], input: BaseMessage[]) => {
//       const history = getMutableAIState();
//
//       console.log("x", x);
//       console.log("input", input);
//       console.log("history", history.get());
//
//       const messages = [...history.get(), { role: "user", content: input[0] }];
//       console.log("messages", messages);
//       return messages;
//     },
//     default: () => [],
//   },
// };

// This defines the agent state
const graphState: StateGraphArgs<IState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => {
      // console.log("x", x);
      // console.log("y", y);
      const c = x.concat(y);
      // console.log("concat", c);
      return c;
    },
    default: () => [],
  },
};

const routeMessage = (state: IState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
  // console.log("lastMessage", lastMessage);
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  // Otherwise if there is, we continue and call the tools
  return "tools";
};

function nodeOne(state: IState, config?: RunnableConfig) {
  console.log("In node: ", config?.configurable?.user_id);

  return { messages: `Hello, ${state.messages.toString()}!` };
}

function nodeTwo(state: IState) {
  return state;
}

const callModel = async (state: IState, config?: RunnableConfig) => {
  const { messages } = state;
  const response = await boundModel.invoke(messages, config);
  return { messages: [response] };
};

const workflow = new StateGraph({
  channels: graphState,
})
  .addNode("agent", callModel)
  // .addNode("node_one", nodeOne)
  // .addNode("node_two", nodeTwo)
  .addNode("tools", researcherNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

let config = { configurable: { thread_id: "conversation-num-1" } };
const persistentGraph = workflow.compile({ checkpointer: memory });

export const agentOne = async (message: string) => {
  let inputs = { messages: [["user", message]] };
  // [...history.get(), { role: "user", content: input }],
  for await (const { messages } of await persistentGraph.stream(inputs, {
    ...config,
    streamMode: "values",
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
