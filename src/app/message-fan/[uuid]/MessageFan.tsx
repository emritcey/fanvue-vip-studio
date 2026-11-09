"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChatInput,
  Toast,
  ToastProps,
} from "@fanvue/ui";
import { useParams } from "next/navigation";
import { sendFanMessageAction } from "./actions";
import { SuccessfulScreen } from "@/components/SuccessfulScreen";

export function MessageFan() {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  const { uuid } = useParams();

  const handleSubmit = async (message: string) => {
    if (!uuid || typeof uuid !== "string") return;

    await sendFanMessageAction(uuid, message).then(res => {
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
          <div data-testid="chat-input">
            <CardHeader>
              <CardTitle>Message your fan!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ChatInput
                minRows={5}
                onSubmit={handleSubmit}
                placeholder="Thanks so much for being my top fan this month! 💕"
              />
            </CardContent>
          </div>
        )}
      </Card>

      {toast ? (
        <Toast
          data-testid="message-sent-toast"
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
