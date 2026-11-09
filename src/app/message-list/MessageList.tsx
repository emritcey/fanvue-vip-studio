"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChatInput,
  Toast,
  ToastProps,
} from "@fanvue/ui";
import type { CustomList } from "@/types/customList";
import { createVipListAction, sendVipMessageAction } from "./actions";
import { SuccessfulScreen } from "@/components/SuccessfulScreen";

export function MessageListClient({ list }: { list: CustomList | null }) {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = async (message: string) => {
    if (!list?.uuid) return;

    await sendVipMessageAction(list.uuid, message).then(res => {
      if (res) {
        setMessageSent(true);
        setToast({
          open: true,
          variant: "success",
          title: "Message sent",
          description: "Successfully sent the message.",
        });
        return;
      }
      setMessageSent(false);
      setToast({
        open: true,
        variant: "error",
        title: "Failed to send",
        description: "Something went wrong sending the message.",
      });
    });
  };

  return (
    <>
      <Card className="w-full max-w-lg" hierarchy="primary" type="default">
        {messageSent ? (
          <SuccessfulScreen onSend={() => setMessageSent(false)} />
        ) : (
          <>
            <CardHeader>
              <CardTitle>Message this month&apos;s VIPs</CardTitle>
              <CardDescription>
                Get in touch with all of your top spenders from this month by
                creating a custom list and sending a mass message.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {list && list.membersCount > 0 ? (
                <>
                  <p className="text-sm text-content-secondary">
                    {`${list.name} is ready with ${list.membersCount} VIP${list.membersCount === 1 ? "" : "s"}.`}
                  </p>
                  <ChatInput
                    minRows={5}
                    onSubmit={handleSubmit}
                    placeholder="Thanks so much for being my top fan this month! 💕"
                  />
                </>
              ) : list ? (
                <>
                  <p className="text-sm text-content-secondary">
                    There were no VIPs this month, so we couldn&apos;t add them to a list.
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-center text-sm text-content-secondary">
                    You don&apos;t have a VIP list for this month yet.
                    Let&apos;s create one!
                  </p>
                  <form action={createVipListAction}>
                    <Button type="submit" variant="primary">
                      Create a new list
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </>
        )
        }
      </Card >

      {
        toast ? (
          <Toast
            open={toast.open}
            onOpenChange={(open) =>
              setToast((current) => (current ? { ...current, open } : null))
            }
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
          />
        ) : null}
    </>
  );
}
