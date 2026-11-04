"use server";

import { getTopSpenders } from "@/lib/api/user";

export async function getTopSpendersAction() {
  return getTopSpenders();
}
