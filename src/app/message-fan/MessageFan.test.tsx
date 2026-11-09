import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastProvider, ToastViewport } from "@fanvue/ui";
import { MessageFan } from "./[uuid]/MessageFan";
import { sendFanMessageAction } from "./[uuid]/actions";

vi.mock("next/navigation", () => ({
    useParams: () => ({ uuid: "test-fan-uuid" }),
}));

vi.mock("./[uuid]/actions", () => ({
    sendFanMessageAction: vi.fn(),
}));

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

const mockedSendFanMessageAction = vi.mocked(sendFanMessageAction);

function renderMessageFan() {
    return render(
        <ToastProvider>
            <MessageFan />
            <ToastViewport />
        </ToastProvider>,
    );
}

describe("MessageFan", () => {
    beforeEach(() => {
        mockedSendFanMessageAction.mockReset();
    });

    it("should render", () => {
        renderMessageFan();

        expect(screen.getByText("Message your fan!")).toBeTruthy();
    });

    it("should show the chat input", () => {
        renderMessageFan();

        expect(screen.getByTestId("chat-input")).toBeTruthy();
    });

    it("should call sendFanMessageAction with the fan uuid and message", async () => {
        mockedSendFanMessageAction.mockResolvedValue(true);

        renderMessageFan();

        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        await waitFor(() => {
            expect(mockedSendFanMessageAction).toHaveBeenCalledWith(
                "test-fan-uuid",
                "Thanks for being a top fan!",
            );
        });
    });

    it("should show the success screen & toast after sending a message", async () => {
        mockedSendFanMessageAction.mockResolvedValue(true);

        renderMessageFan();

        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        await waitFor(() => {
            expect(screen.getByTestId("successful-screen")).toBeTruthy();

            expect(screen.getByTestId("message-sent-toast")).toBeTruthy();
            expect(screen.getByText("Message sent")).toBeTruthy();
        });
    });


    it("should show an error toast when sending fails", async () => {
        mockedSendFanMessageAction.mockResolvedValue(false);

        renderMessageFan();

        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        await waitFor(() => {
            expect(screen.getByTestId("message-sent-toast")).toBeTruthy();
            expect(screen.getByText("Failed to send")).toBeTruthy();
        });
    });

    it("should return to the form when sending another message", async () => {
        mockedSendFanMessageAction.mockResolvedValue(true);

        renderMessageFan();

        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        await waitFor(() => {
            expect(screen.getByText("Message sent successfully!")).toBeTruthy();
        });

        fireEvent.click(screen.getByTestId("send-another-message-button"));

        await waitFor(() => {
            expect(screen.getByTestId("chat-input")).toBeTruthy();
        });
    });
});
