import Link from "next/link";
import { Button } from "@fanvue/ui";
import { LogoutButton } from "@/components/LogoutButton";

type AppShellProps = {
  children: React.ReactNode;
  showLogout?: boolean;
  showLogin?: boolean;
  center?: boolean;
};

export function AppShell({
  children,
  showLogout = false,
  showLogin = false,
  center = false,
}: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--primitives-color-green-50)] text-content-primary">
      <div className="app-shell__glow" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-6 sm:px-10 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-baseline gap-3 no-underline">
            <span className="font-outfit text-2xl font-semibold tracking-tight sm:text-3xl">
              Fanvue VIP Studio
            </span>
          </Link>
          {showLogout ? (
            <LogoutButton />
          ) : showLogin ? (
            <Button asChild variant="secondary">
              <a href="/api/oauth/login" target="_top">
                Login with Fanvue
              </a>
            </Button>
          ) : null}
        </header>

        <main
          className={
            center
              ? "flex flex-1 flex-col justify-center py-12 sm:py-16"
              : "flex flex-1 flex-col py-10 sm:py-12"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
