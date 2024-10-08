"use client";

import { useState } from "react";
import { ClientMessage } from "@/app/agents/langGraph/actions";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { agentApi } = useActions();

  console.log("conversation useUIState", conversation);

  return (
    <div className={"flex flex-col items-center "}>
      <h1 className={"mb-6"}>I'm an agent.</h1>
      <div className={"w-1/3"}>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <input
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
        type="text"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: nanoid(), role: "user", display: input },
            ]);

            console.log("input===", input);
            const message = await agentApi(input);

            console.log("agentOne message", message);

            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ]);
            setInput("");
          }
        }}
      />
    </div>
  );
}
