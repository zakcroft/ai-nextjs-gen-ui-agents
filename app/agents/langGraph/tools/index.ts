import { BaseMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

import { weatherTool } from "./weatherTool";
import { chartTool } from "./chartTool";
import { MODEL } from "@/app/agents/langGraph/llms/chatGpt";

const tools = [weatherTool, chartTool];

export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);

const model = new ChatOpenAI({ model: MODEL });

export const boundModel = model.bindTools(tools);
