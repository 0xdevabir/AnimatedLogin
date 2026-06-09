import { NextResponse } from "next/server";

// The actual session lives in localStorage which the server cannot read.
// This proxy simply ensures dashboard routes resolve cleanly; the AppShell
// client component performs the redirect to "/" when no session is present.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
