import { getCurrentUser } from "@/lib/api/user";
import { AppShell } from "@/components/AppShell";
import { Dashboard } from "@/components/Dashboard";
import { getTopSpendersAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const me = await getCurrentUser();

  const isAuthed = !!me;
  const params = await searchParams;
  const errorParam =
    typeof params?.error === "string" ? params.error : undefined;
  const errorDescriptionParam =
    typeof params?.error_description === "string"
      ? params.error_description
      : undefined;

  const topSpenders = isAuthed ? await getTopSpendersAction() : null;

  return (
    <AppShell showLogout={isAuthed} showLogin={!isAuthed} center>
      {!isAuthed && (errorParam || errorDescriptionParam) ? (
        <div className="mx-auto max-w-md rounded-xl border border-error-secondary bg-error-surface px-4 py-3 text-sm text-error-content">
          {errorDescriptionParam || errorParam}
        </div>
      ) : isAuthed && topSpenders ? (
        <div className="mx-auto w-full max-w-lg">
          <Dashboard topSpenders={topSpenders} />
        </div>
      ) : (
        <section className="mx-auto max-w-xl text-center sm:text-left">
          <h1 className="font-outfit text-4xl font-semibold tracking-tight text-content-primary sm:text-5xl sm:leading-[1.1]">
            Fanvue VIP Studio
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-content-secondary sm:text-lg">
            Review top spenders and reach your VIPs with ease.
          </p>
        </section>
      )}
    </AppShell>
  );
}
