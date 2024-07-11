"use server";

import { createAI } from "ai/rsc";

import { ReactNode } from "react";
import { agentApi } from "@/app/agents/langGraph/graph";
import { ChatMessage } from "@langchain/core/messages";

export interface ServerMessage extends ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage extends ChatMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    agentApi,
  },
  initialAIState: [],
  initialUIState: [],
});
