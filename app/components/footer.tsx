import React from "react";
import Link from "next/link";
import { SiDiscord, SiGithub, SiTwitter } from "react-icons/si";
import { ButtonVariant } from "./ui/buttonVariant";

const Footer: React.FC = () => {
  return (
    <footer className="w-fit p-1 md:p-2 fixed bottom-0 right-0">
      <div className="flex justify-end">
        <ButtonVariant
          variant={"ghost"}
          size={"icon"}
          className="text-muted-foreground/50"
        >
          <Link href="https://discord.gg/zRxaseCuGq" target="_blank">
            <SiDiscord size={18} />
          </Link>
        </ButtonVariant>
        <ButtonVariant
          variant={"ghost"}
          size={"icon"}
          className="text-muted-foreground/50"
        >
          <Link href="https://twitter.com/morphic_ai" target="_blank">
            <SiTwitter size={18} />
          </Link>
        </ButtonVariant>
        <ButtonVariant
          variant={"ghost"}
          size={"icon"}
          className="text-muted-foreground/50"
        >
          <Link href="https://git.new/morphic" target="_blank">
            <SiGithub size={18} />
          </Link>
        </ButtonVariant>
      </div>
    </footer>
  );
};

export default Footer;
