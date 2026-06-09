import { AppShell } from "@/components/app-shell";
import { DBHydrator } from "@/components/db-hydrator";
import { DBSyncRoot } from "@/components/db-sync-root";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DBHydrator />
      <DBSyncRoot />
      <AppShell>{children}</AppShell>
    </>
  );
}
