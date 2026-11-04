import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastProvider, ToastViewport } from "@fanvue/ui";
import { MessageListClient } from "./MessageList";
import { sendVipMessageAction } from "./actions";
import type { CustomList } from "@/types/customList";

vi.mock("./actions", () => ({
  createVipListAction: vi.fn(),
  sendVipMessageAction: vi.fn(),
}));

// Thin stub so we can trigger onSubmit without depending on ChatInput internals.
vi.mock("@fanvue/ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@fanvue/ui")>();
  return {
    ...actual,
    ChatInput: ({
      onSubmit,
      placeholder,
    }: {
      onSubmit: (message: string) => void;
      placeholder?: string;
    }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit("Thanks for being a top fan!");
        }}
      >
        <textarea placeholder={placeholder} />
        <button type="submit">Send</button>
      </form>
    ),
  };
});

const mockedSendVipMessageAction = vi.mocked(sendVipMessageAction);

const listWithMembers: CustomList = {
  name: "November VIPs",
  uuid: "list-uuid",
  createdAt: "2026-11-01T00:00:00.000Z",
  updatedAt: "2026-11-01T00:00:00.000Z",
  membersCount: 3,
};

const emptyList: CustomList = {
  ...listWithMembers,
  membersCount: 0,
};

function renderMessageList(list: CustomList | null) {
  return render(
    <ToastProvider>
      <MessageListClient list={list} />
      <ToastViewport />
    </ToastProvider>,
  );
}

describe("MessageList", () => {
  beforeEach(() => {
    mockedSendVipMessageAction.mockReset();
  });

  it("should render", () => {
    renderMessageList(listWithMembers);

    expect(screen.getByText("Message this month's VIPs")).toBeTruthy();
  });

  it("should show the create list CTA when there is no list", () => {
    renderMessageList(null);

    expect(
      screen.getByText(/You don't have a VIP list for this month yet/),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Create a new list" }),
    ).toBeTruthy();
  });

  it("should show an empty state when the list has no VIPs", () => {
    renderMessageList(emptyList);

    expect(screen.getByText(/There were no VIPs this month/)).toBeTruthy();
  });

  it("should call sendVipMessageAction with the list id and message", async () => {
    mockedSendVipMessageAction.mockResolvedValue(true);

    renderMessageList(listWithMembers);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(mockedSendVipMessageAction).toHaveBeenCalledWith(
        "list-uuid",
        "Thanks for being a top fan!",
      );
    });
  });

  it("should show the success screen after sending a message", async () => {
    mockedSendVipMessageAction.mockResolvedValue(true);

    renderMessageList(listWithMembers);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText("Message sent successfully!")).toBeTruthy();
      expect(screen.getByText("Message sent")).toBeTruthy();
    });
  });

  it("should show an error toast when sending fails", async () => {
    mockedSendVipMessageAction.mockResolvedValue(false);

    renderMessageList(listWithMembers);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText("Failed to send")).toBeTruthy();
    });
  });

  it("should return to the form when sending another message", async () => {
    mockedSendVipMessageAction.mockResolvedValue(true);

    renderMessageList(listWithMembers);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText("Message sent successfully!")).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Send another message" }),
    );

    expect(
      screen.getByPlaceholderText(
        "Thanks so much for being my top fan this month! 💕",
      ),
    ).toBeTruthy();
  });
});
