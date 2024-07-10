"use server";

import { createAI } from "ai/rsc";

import { ReactNode } from "react";
import { agentApi } from "@/app/agents/langGraph/graph";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
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
