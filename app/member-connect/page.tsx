import { redirect } from "next/navigation";
import styles from "./respond/page.module.css";

type SearchParams = Promise<{
  token?: string;
  decision?: string;
  status?: string;
  member?: string;
}>;

export default async function MemberConnectPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const status = params.status?.trim() || "";
  const memberName = params.member?.trim() || "the member";

  if (status) {
    const content =
      status === "accepted"
        ? {
            title: "Connection accepted",
            description: `${memberName} has been notified by email and can now continue the conversation directly by email.`,
          }
        : status === "declined"
          ? {
              title: "Request declined",
              description: `You declined the connection request from ${memberName}. Your email address was not shared.`,
            }
          : status === "error"
            ? {
                title: "Unable to process request",
                description: "The request could not be completed right now. Please try the link again from your email.",
              }
            : {
                title: "Invalid request",
                description: "This connection link is missing, expired, or invalid.",
              };

    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <span className={styles.badge}>Sldiaspora Member Portal</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </section>
      </main>
    );
  }

  const token = params.token?.trim() || "";
  const decision = params.decision?.trim();
  const isValidDecision = decision === "accept" || decision === "decline";

  if (token && isValidDecision) {
    const query = new URLSearchParams({
      connect: "1",
      token,
      decision,
    });
    redirect(`/member-login?${query.toString()}`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.badge}>Sldiaspora Member Portal</span>
        <h1>Invalid request</h1>
        <p>This connection link is missing, expired, or invalid.</p>
      </section>
    </main>
  );
}
