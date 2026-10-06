"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import MotionNudge from "@/components/motion-nudge";
import DomainNotice from "@/components/domain-notice";
import Analytics from "@/components/analytics";
import { usePerfProfile } from "@/hooks/use-perf-profile";

// Decorative / realtime extras are split out of the main bundle and loaded
// after the page is already usable, so they don't slow down the first paint.
const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });
const RemoteCursors = dynamic(
  () => import("@/components/realtime/remote-cursors"),
  { ssr: false }
);
const EasterEggs = dynamic(() => import("@/components/easter-eggs"), { ssr: false });
const ElasticCursor = dynamic(() => import("@/components/ui/ElasticCursor"), {
  ssr: false,
});
const RadialMenu = dynamic(() => import("@/components/radial-menu/index"), {
  ssr: false,
});

export default function AppOverlays() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // The résumé route disables the elastic cursor (keeps the particle bg).
  const isResume = pathname?.startsWith("/resume") ?? false;

  const { particleCount, maxDpr, disableDecorative, isMobile } = usePerfProfile();

  return (
    <>
      {particleCount > 0 && (
        <Particles
          className="fixed inset-0 -z-10 animate-fade-in"
          quantity={particleCount}
          maxDpr={maxDpr}
        />
      )}
      {isHome && <RemoteCursors />}
      <EasterEggs />
      {!isResume && !disableDecorative && !isMobile && <ElasticCursor />}
      {isHome && <RadialMenu />}
      {isHome && <MotionNudge />}
      <DomainNotice />
      <Analytics />
    </>
  );
}
