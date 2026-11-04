import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@fanvue/ui";
import { AppShell } from "@/components/AppShell";
import { MessageFan } from "./MessageFan";

export default function MessageFanPage() {
  return (
    <AppShell showLogout>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Message a fan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <MessageFan />
      </div>
    </AppShell>
  );
}
