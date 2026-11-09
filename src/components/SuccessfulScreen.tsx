import { Button } from "@fanvue/ui";

export const SuccessfulScreen = ({
    onSend,
}: {
    onSend: () => void;
}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4" data-testid="successful-screen">
            <p className="typography-header-heading-sm">Message sent successfully!</p>
            <Button variant="secondary" size="32" onClick={onSend} data-testid="send-another-message-button">
                Send another message
            </Button>
        </div>
    );
};
