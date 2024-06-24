import { END, START, StateGraph, StateGraphArgs } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { toolNode, boundModel } from "./tools";

interface IState {
  messages: BaseMessage[];
}

// This defines the agent state
const graphState: StateGraphArgs<IState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
};

const routeMessage = (state: IState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  // Otherwise if there is, we continue and call the tools
  return "tools";
};

const callModel = async (state: IState, config?: RunnableConfig) => {
  const { messages } = state;
  const response = await boundModel.invoke(messages, config);
  return { messages: [response] };
};

const workflow = new StateGraph({
  channels: graphState,
})
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

const graph = workflow.compile();

const callOne = async (state: IState, config?: RunnableConfig) => {
  let inputs = { messages: [["user", "Hi I'm Yu, niced to meet you."]] };
  for await (const { messages } of await graph.stream(inputs, {
    streamMode: "values",
  })) {
    let msg = messages[messages?.length - 1];
    if (msg?.content) {
      console.log(msg.content);
    } else if (msg?.tool_calls?.length > 0) {
      console.log(msg.tool_calls);
    } else {
      console.log(msg);
    }
    console.log("-----\n");
  }
};
