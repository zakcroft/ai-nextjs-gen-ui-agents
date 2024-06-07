"use client";

import { useChat } from "ai/react";
import { ToolInvocation } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  console.log("messages===", messages);
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId;

            if (
              toolInvocation.toolName === "weatherTool" &&
              // @ts-ignore
              toolInvocation?.result
            ) {
              console.log(" using weatherTool", toolInvocation);
              // @ts-ignore
              return toolInvocation.result;
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
