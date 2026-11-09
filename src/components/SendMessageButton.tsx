"use client";

import Link from "next/link";
import {
  AutoMessageIcon,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@fanvue/ui";

export function SendMessageButton({
  spenderUuid,
}: {
  spenderUuid: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="w-12 justify-center px-0"
          size="48"
          variant="outline"
          asChild
        >
          <Link href={`/message-fan/${spenderUuid}`}>
            <AutoMessageIcon />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Send message</TooltipContent>
    </Tooltip>
  );
}
