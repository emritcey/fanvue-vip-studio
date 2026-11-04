import { env } from "@/env";
import { getSession } from "../session";
import { getFanvueHeaders } from "./headers";

export async function messageList(listId: string, message: string) {
  const session = await getSession();
  if (!session) return;

  const body = {
    includedLists: {
      customListUuids: [listId],
    },
    text: message,
  };

  try {
    const res = await fetch(`${env.API_BASE_URL}/chats/mass-messages`, {
      method: "POST",
      headers: getFanvueHeaders(session.accessToken),
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function messageFan(uuid: string, message: string) {
  const session = await getSession();
  if (!session) return;

  try {
    const res = await fetch(`${env.API_BASE_URL}/chats/${uuid}/message`, {
      method: "POST",
      headers: getFanvueHeaders(session.accessToken),
      body: JSON.stringify({
        text: message,
      }),
    });

    console.log(res);

    return res.ok;
  } catch (error) {
    console.error(error);
    return null;
  }
}
