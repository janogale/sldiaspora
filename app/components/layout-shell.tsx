"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";
import MemberRegistrationModal from "./member-registration-modal";

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isMemberAuthLayout =
    pathname?.startsWith("/member-login") ||
    pathname?.startsWith("/member-dashboard") ||
    pathname?.startsWith("/diaspora-week/register") ||
    pathname?.startsWith("/diaspora-week/portal");

  if (isMemberAuthLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <MemberRegistrationModal />
      {children}
      <Footer />
    </>
  );
}
