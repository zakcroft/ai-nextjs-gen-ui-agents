"use client";

import { CoreMessage } from "ai";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  console.log("messages", messages);

  return (
    <div className={"flex justify-center "}>
      <div className={"flex flex-col w-2/3 "}>
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`}>
            {typeof message.content === "string"
              ? message.content
              : message.content
                  .filter((part) => part.type === "text")
                  .map((part, partIndex) => (
                    // @ts-ignore
                    <div key={partIndex}>{part.text}</div>
                  ))}
          </div>
        ))}
      </div>

      <input
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            setMessages((currentMessages) => [
              ...currentMessages,
              { role: "user", content: input },
            ]);
            setInput("");
            const response = await fetch("/api/generate", {
              method: "POST",
              body: JSON.stringify({
                messages: [...messages, { role: "user", content: input }],
              }),
            });

            const { messages: newMessages, toolResults } =
              await response.json();

            const [toolResult = {}] = toolResults || [];
            const { result } = toolResult || [];

            console.log("toolResults", toolResults);
            console.log("result", toolResult);

            if (result?.location && result?.temperature) {
              console.log(result?.location && result?.temperature);

              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  role: "assistant",
                  content: `${result.location} is ${result.temperature} Celsius`,
                },
              ]);
            } else {
              setMessages((currentMessages) => [
                ...currentMessages,
                ...newMessages,
              ]);
            }
          }
        }}
      />
    </div>
  );
}
