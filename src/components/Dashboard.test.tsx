import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "./Dashboard";
import type { TopSpendersResponse } from "@/types/topSpender";
import { TooltipProvider } from "@fanvue/ui";

vi.mock("./SendMessageButton", () => ({
  SendMessageButton: () => <button type="button">Send</button>,
}));

function renderDashboard(topSpenders: TopSpendersResponse) {
  return render(
    <TooltipProvider>
      <Dashboard topSpenders={topSpenders} />
    </TooltipProvider>,
  );
}

const spendersResponse: TopSpendersResponse = {
  data: [
    {
      gross: 15000,
      net: 12750,
      messages: 342,
      user: {
        uuid: "test-uuid",
        handle: "test-user",
        nickname: null,
        displayName: "Test User",
        isTopSpender: true,
        avatarUrl: "https://example.com/avatar.jpg",
        registeredAt: "2026-01-10T12:00:00.000Z",
      },
    },
  ],
  nextCursor: null,
  total: 1,
};

const emptyResponse: TopSpendersResponse = {
  data: [],
  nextCursor: null,
  total: 0,
};

describe("Dashboard", () => {
  it("should render", () => {
    renderDashboard(spendersResponse);

    expect(screen.getByTestId("dashboard")).toBeTruthy();
  });

  it("should render the top spenders", () => {
    renderDashboard(spendersResponse);

    expect(screen.getAllByText("Test User").length).toBeGreaterThan(0);
  });

  it("should disable the Message all VIPs if there are 0 top spenders", () => {
    renderDashboard(emptyResponse);

    expect(screen.getByTestId("message-all-button")).toBeDisabled();
  });

  it("should display zero if there are zero", () => {
    renderDashboard(emptyResponse);

    expect(screen.getByText(/Your top 0 spenders/)).toBeTruthy();
  });
});
