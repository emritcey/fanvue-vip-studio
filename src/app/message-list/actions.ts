"use server";

import { addUsersToList, createCustomList } from "@/lib/api/lists";
import { getTopSpenders } from "@/lib/api/user";
import { messageList } from "@/lib/api/messages";
import { revalidatePath } from "next/cache";

export async function createVipListAction() {
  const topSpenders = await getTopSpenders();
  const list = await createCustomList();
  if (!list?.uuid) return;

  const userUuids = topSpenders.data.map((spender) => spender.user.uuid);
  if (userUuids.length) {
    await addUsersToList(list.uuid, userUuids);
  }

  revalidatePath("/message-list");
}

export async function sendVipMessageAction(listId: string, message: string) {
  return await messageList(listId, message);
}
