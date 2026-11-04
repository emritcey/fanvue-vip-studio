import { beforeEach, describe, expect, it, vi } from "vitest";
import { messageFan, messageList } from "./messages";

vi.mock("@/env", () => ({
  env: {
    API_BASE_URL: "https://api.example.com/v1",
  },
}));

vi.mock("../session", () => ({
  getSession: vi.fn(),
}));

vi.mock("./headers", () => ({
  getFanvueHeaders: (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  }),
}));

import { getSession } from "../session";

const mockedGetSession = vi.mocked(getSession);
const fetchMock = vi.fn();

describe("messages api", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    mockedGetSession.mockResolvedValue({
      accessToken: "test-token",
      expiresAt: Date.now() + 60_000,
    });
  });

  it("messageFan posts to /chats/:uuid/message", async () => {
    fetchMock.mockResolvedValue({ ok: true });

    const result = await messageFan("fan-uuid", "hello fan");

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/v1/chats/fan-uuid/message",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "hello fan" }),
      }),
    );
  });

  it("messageList posts to /chats/mass-messages with the list id", async () => {
    fetchMock.mockResolvedValue({ ok: true });

    const result = await messageList("list-uuid", "hello vips");

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/v1/chats/mass-messages",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          includedLists: {
            customListUuids: ["list-uuid"],
          },
          text: "hello vips",
        }),
      }),
    );
  });

  it("does not call fetch when there is no session", async () => {
    mockedGetSession.mockResolvedValue(null);

    await expect(messageFan("fan-uuid", "hello")).resolves.toBeUndefined();
    await expect(messageList("list-uuid", "hello")).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
