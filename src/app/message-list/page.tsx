import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@fanvue/ui";
import { AppShell } from "@/components/AppShell";
import { thisMonthCustomList } from "@/lib/api/lists";
import { MessageListClient } from "./MessageList";

export default async function MessageListPage() {
  const thisMonthList = (await thisMonthCustomList())[0] ?? null;

  return (
    <AppShell showLogout>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Message List</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <MessageListClient list={thisMonthList} />
      </div>
    </AppShell>
  );
}
