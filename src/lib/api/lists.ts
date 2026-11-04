import { env } from "@/env";
import { getSession } from "../session";
import type { CustomList, CustomListsResponse } from "@/types/customList";
import { getFanvueHeaders } from "./headers";

const LIST_NAME = `vip-liddst-${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

export async function createCustomList() {
  const session = await getSession();
  if (!session) return null;


  try {
    const res = await fetch(`${env.API_BASE_URL}/chats/lists/custom`, {
      method: "POST",
      headers: getFanvueHeaders(session.accessToken),
      body: JSON.stringify({
        name: LIST_NAME,
      }),
    });

    if (!res.ok) return null;
    return (await res.json()) as CustomList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addUsersToList(listId: string, userIds: string[]) {
  const session = await getSession();
  if (!session) return null;

  try {
    const res = await fetch(
      `${env.API_BASE_URL}/chats/lists/custom/${listId}/members`,
      {
        method: "POST",
        headers: getFanvueHeaders(session.accessToken),
        body: JSON.stringify({ userUuids: userIds }),
      },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function thisMonthCustomList(): Promise<CustomList[]> {
  const session = await getSession();
  if (!session) return [];

  try {
    const res = await fetch(
      `${env.API_BASE_URL}/chats/lists/custom?search=${LIST_NAME}`,
      {
        method: "GET",
        headers: getFanvueHeaders(session.accessToken),
      },
    );

    if (!res.ok) return [];

    const payload = (await res.json()) as CustomListsResponse;
    return payload.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
