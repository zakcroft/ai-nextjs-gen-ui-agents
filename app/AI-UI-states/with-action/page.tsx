"use client";

import { useActions, useUIState } from "ai/rsc";

import { AI } from "@/app/AI-UI-states/with-action/actions";

export default function Page() {
  const { sendMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessages([
      ...messages,
      { id: Date.now(), role: "user", display: event.target.message.value },
    ]);

    console.log(event.target.message.value);

    const response = await sendMessage(event.target.message.value);
    setMessages([
      ...messages,
      { id: Date.now(), role: "assistant", display: response },
    ]);
  };

  return (
    <>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.display}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
