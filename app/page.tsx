"use client";

import { useChat } from "ai/react";
import Link from "next/link";

const links = [
  "/generate/with-route",
  "/generate/with-action",
  "/stream/with-route",
  "/stream/with-action",
  "/with-route-client-tools",
];

export default function Chat() {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {links.map((l, i) => (
        <Link href={l} key={i} className={"text-white w-full"}>
          {l}
        </Link>
      ))}
    </div>
  );
}
