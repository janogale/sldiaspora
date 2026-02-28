"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";
import MemberRegistrationModal from "./member-registration-modal";

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isMemberLoginPage = pathname?.startsWith("/member-login");

  if (isMemberLoginPage) {
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
