"use client";
// https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-with-tool-calling#chatbot-with-tools
import { useChat } from "ai/react";
import { ToolInvocation } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      api: "/api/chat-client-tools",
      maxToolRoundtrips: 5,

      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === "getLocation") {
          console.log(" using getLocation tool");
          const cities = [
            "New York",
            "Los Angeles",
            "Chicago",
            "San Francisco",
          ];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      },
    });

  console.log("messages===", messages);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId;

            if (toolInvocation.toolName === "weatherTool") {
              console.log(" using weatherTool");
              const result = toolInvocation || {};
              console.log(result);

              // if (result?.location && result?.temperature) {
              //   setMessages((currentMessages) => [
              //     ...currentMessages,
              //     {
              //       role: "assistant",
              //       content: `${result.location} is ${result.temperature} Celsius`,
              //     },
              //   ]);
              // } else {
              //   setMessages((currentMessages) => [
              //     ...currentMessages,
              //     ...newMessages,
              //   ]);
              // }
            }

            // render confirmation tool (client-side tool with user interaction)
            if (toolInvocation.toolName === "askForConfirmation") {
              console.log(" using askForConfirmation tool");
              return (
                <div key={toolCallId}>
                  {toolInvocation.args.message}
                  <div>
                    {"result" in toolInvocation ? (
                      <b>{toolInvocation.result}</b>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            addToolResult({
                              toolCallId,
                              result: "Yes, confirmed.",
                            })
                          }
                        >
                          Yes
                        </button>
                        <button
                          onClick={() =>
                            addToolResult({
                              toolCallId,
                              result: "No, denied",
                            })
                          }
                        >
                          No
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            // other tools:
            console.log(" using OTHER tool", toolInvocation);
            return "result" in toolInvocation ? (
              <div key={toolCallId}>
                Tool call {`${toolInvocation.toolName}: `}
                {toolInvocation.result}
              </div>
            ) : (
              <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
            );
          })}
          <br />
          <br />
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
