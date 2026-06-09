import { AuthOrchestrator } from "@/components/auth/auth-orchestrator";
import { CurtainIntro } from "@/components/motion/curtain";
import { DBHydrator } from "@/components/db-hydrator";
import { DBSyncRoot } from "@/components/db-sync-root";

export default function HomePage() {
  return (
    <>
      <DBHydrator />
      <DBSyncRoot />
      <CurtainIntro />
      <AuthOrchestrator />
    </>
  );
}
