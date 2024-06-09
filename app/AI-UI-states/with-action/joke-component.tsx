"use client";

import { useState } from "react";
import { ButtonVariant } from "../../components/ui/buttonVariant";
import { Joke } from "./joke";

export const JokeComponent = ({ joke }: { joke?: Joke }) => {
  const [showPunchline, setShowPunchline] = useState(false);
  return (
    <div className="bg-neutral-100 p-4 rounded-md m-4 max-w-prose flex items-center justify-between text-black">
      <p>{showPunchline ? joke?.punchline : joke?.setup}</p>
      <ButtonVariant
        onClick={() => setShowPunchline(true)}
        disabled={showPunchline}
        variant="outline"
      >
        Show Punchline!
      </ButtonVariant>
    </div>
  );
};
