"use server";

import { messageFan } from "@/lib/api/messages";

export async function sendFanMessageAction(uuid: string, message: string) {
  return await messageFan(uuid, message);
}
