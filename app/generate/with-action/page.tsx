"use client";

import { useState } from "react";
import { getAnswer } from "./actions";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Home() {
  const [generation, setGeneration] = useState<string>("");

  return (
    <div>
      <button
        className={
          "flex justify-center w-full p-4 bg-blue-500 text-white underline"
        }
        onClick={async () => {
          const { text } = await getAnswer("Why is the sky blue?");
          setGeneration(text);
        }}
      >
        Generate - this does not stream
      </button>
      <div className={"flex justify-center w-full p-4 bg-green-500 text-white"}>
        {generation}
      </div>
    </div>
  );
}
