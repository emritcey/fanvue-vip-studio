import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  UserItem,
  UserItemTrailing,
} from "@fanvue/ui";
import { SendMessageButton } from "./SendMessageButton";
import type { TopSpendersResponse } from "@/types/topSpender";

export const Dashboard = ({
  topSpenders,
}: {
  topSpenders: TopSpendersResponse;
}) => {
  const topSpendersCount = topSpenders.data.length;
  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card
      className="max-w-lg"
      hierarchy="primary"
      type="default"
      data-testid="dashboard"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>VIP Fans</CardTitle>
            <CardDescription>
              Your top {topSpendersCount} spenders this {monthLabel}.
            </CardDescription>
          </div>
          {topSpendersCount === 0 ? (
            <Button
              variant="outline"
              disabled
              data-testid="message-all-button"
            >
              Message all VIPs
            </Button>
          ) : (
            <Button asChild variant="outline" data-testid="message-all-button">
              <Link href="/message-list">Message all VIPs</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {topSpenders.data.map((spender) => (
          <div
            key={spender.user.uuid}
            className="flex items-center justify-between"
          >
            <UserItem
              className="w-75"
              showHandle
              showAvatar
              user={{
                displayName: spender.user.displayName,
                handle: spender.user.handle,
              }}
              trailing={
                <UserItemTrailing
                  value={spender.gross.toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                />
              }
            />
            <SendMessageButton spenderUuid={spender.user.uuid} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
