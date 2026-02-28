"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type DashboardMember = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  country_of_nationality?: string;
  profession?: string;
  areas_of_interest?: string;
  profile_picture?: string | { id?: string } | null;
  status: string;
};

type MembersListItem = {
  id: string;
  full_name: string;
  address?: string;
  profession?: string;
  city?: string;
  country?: string;
  areas_of_interest?: string;
  profile_picture?: string | { id?: string } | null;
  contact_email?: string;
  contact_phone?: string;
};

type DashboardSection = "members" | "profile" | "settings";

const resolveAssetPath = (
  fileValue: string | { id?: string } | null | undefined
): string | null => {
  if (!fileValue) return null;
  if (typeof fileValue === "string") return `/api/directus-assets/${fileValue}`;
  if (fileValue.id) return `/api/directus-assets/${fileValue.id}`;
  return null;
};

export default function MemberDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [member, setMember] = useState<DashboardMember | null>(null);
  const [members, setMembers] = useState<MembersListItem[]>([]);

  const [activeSection, setActiveSection] = useState<DashboardSection>("members");
  const [searchTerm, setSearchTerm] = useState("");

  const [connectingId, setConnectingId] = useState<string>("");
  const [shareContact, setShareContact] = useState<"none" | "email" | "phone">("none");
  const [requestMessage, setRequestMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MembersListItem | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/member-auth/me", { method: "GET" });

        if (response.status === 401) {
          router.push("/member-login");
          return;
        }

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setError(result?.message || "Unable to load dashboard.");
          return;
        }

        setMember(result.member || null);
        setMembers(Array.isArray(result.members) ? result.members : []);
      } catch {
        setError("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const otherMembers = useMemo(
    () => members.filter((item) => item.id && item.id !== member?.id),
    [members, member?.id]
  );

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return otherMembers;

    return otherMembers.filter((item) =>
      [item.full_name, item.profession, item.city, item.country, item.areas_of_interest]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [otherMembers, searchTerm]);

  const handleLogout = async () => {
    await fetch("/api/member-auth/logout", { method: "POST" }).catch(() => null);
    router.push("/member-login");
  };

  const openConnectModal = (memberItem: MembersListItem) => {
    setSelectedMember(memberItem);
    setIsModalOpen(true);
    setSuccess("");
    setError("");
  };

  const closeConnectModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleConnect = async () => {
    if (!selectedMember?.id) return;

    setConnectingId(selectedMember.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/member-auth/request-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetMemberId: selectedMember.id,
          shareContact,
          message: requestMessage,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || "Failed to send connection request.");
        return;
      }

      setSuccess("Connection request sent successfully.");
      setRequestMessage("");
      closeConnectModal();
    } catch {
      setError("Failed to send connection request.");
    } finally {
      setConnectingId("");
    }
  };

  return (
    <main className={styles.dashboardPage}>
      {loading ? (
        <div className={styles.stateCard}>Loading dashboard...</div>
      ) : error && !member ? (
        <div className={styles.errorCard}>{error}</div>
      ) : !member ? (
        <div className={styles.stateCard}>No member profile available.</div>
      ) : (
        <div className={styles.layoutGrid}>
          <aside className={styles.sidebar}>
            <div className={styles.brandBlock}>
              <img src="/assets/imgs/logo/logo.png" alt="SLDD" className={styles.brandLogo} />
              <p>Member Dashboard</p>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                type="button"
                className={`${styles.navBtn} ${activeSection === "members" ? styles.navBtnActive : ""}`}
                onClick={() => setActiveSection("members")}
              >
                Members
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${activeSection === "profile" ? styles.navBtnActive : ""}`}
                onClick={() => setActiveSection("profile")}
              >
                Profile
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${activeSection === "settings" ? styles.navBtnActive : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                Settings
              </button>
            </nav>

            <button className={styles.logoutBtn} type="button" onClick={handleLogout}>
              Logout
            </button>
          </aside>

          <section className={styles.mainPanel}>
            <header className={styles.topBar}>
              <div>
                <h1>Welcome, {member.full_name || "Member"}</h1>
                <p>Manage your network and profile information from one place.</p>
              </div>
              <span className={styles.statusBadge}>{String(member.status || "active").toUpperCase()}</span>
            </header>

            {success && <div className={styles.successBanner}>{success}</div>}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {activeSection === "members" && (
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h2>Members Directory</h2>
                  <span>{filteredMembers.length} total</span>
                </div>

                <div className={styles.searchWrap}>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name, profession, city or country"
                    className={styles.searchInput}
                  />
                </div>

                {filteredMembers.length === 0 ? (
                  <div className={styles.emptyState}>No members found.</div>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Profession</th>
                          <th>Location</th>
                          <th>Interest</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className={styles.memberCell}>
                                <img
                                  src={
                                    resolveAssetPath(item.profile_picture) ||
                                    "/assets/imgs/about/about-big-img.png"
                                  }
                                  alt={item.full_name}
                                />
                                <div>
                                  <strong>{item.full_name}</strong>
                                  <span>{item.contact_email || "No email shared"}</span>
                                </div>
                              </div>
                            </td>
                            <td>{item.profession || "-"}</td>
                            <td>{[item.city || "", item.country || ""].filter(Boolean).join(", ") || "-"}</td>
                            <td>{item.areas_of_interest || "-"}</td>
                            <td>
                              <button type="button" className={styles.actionBtn} onClick={() => openConnectModal(item)}>
                                View & Connect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeSection === "profile" && (
              <div className={styles.card}>
                <div className={styles.profileHead}>
                  <img
                    src={
                      resolveAssetPath(member.profile_picture) ||
                      "/assets/imgs/about/about-big-img.png"
                    }
                    alt={member.full_name}
                  />
                  <div>
                    <h2>{member.full_name}</h2>
                    <p>{member.profession || "Profession not shared"}</p>
                  </div>
                </div>

                <div className={styles.profileGrid}>
                  <div>
                    <span>Email</span>
                    <strong>{member.email || "-"}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{member.phone || "-"}</strong>
                  </div>
                  <div>
                    <span>City</span>
                    <strong>{member.city || "-"}</strong>
                  </div>
                  <div>
                    <span>Country</span>
                    <strong>{member.country || "-"}</strong>
                  </div>
                  <div>
                    <span>Nationality</span>
                    <strong>{member.country_of_nationality || "-"}</strong>
                  </div>
                  <div>
                    <span>Areas of Interest</span>
                    <strong>{member.areas_of_interest || "-"}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h2>Connection Settings</h2>
                </div>
                <div className={styles.settingsGrid}>
                  <div>
                    <label>Share with requests</label>
                    <select
                      className={styles.selectInput}
                      value={shareContact}
                      onChange={(event) =>
                        setShareContact(event.target.value as "none" | "email" | "phone")
                      }
                    >
                      <option value="none">No contact details</option>
                      <option value="email">Share my email</option>
                      <option value="phone">Share my phone</option>
                    </select>
                  </div>
                  <div>
                    <label>Default message</label>
                    <textarea
                      className={styles.textArea}
                      value={requestMessage}
                      onChange={(event) => setRequestMessage(event.target.value)}
                      placeholder="Write a short message for your connection requests"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {isModalOpen && selectedMember && (
        <div className={styles.modalBackdrop} onClick={closeConnectModal}>
          <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
            <h3>{selectedMember.full_name}</h3>
            <p>{[selectedMember.city || "", selectedMember.country || ""].filter(Boolean).join(", ") || "Location not shared"}</p>
            <div className={styles.modalDetails}>
              <div>
                <span>Profession</span>
                <strong>{selectedMember.profession || "-"}</strong>
              </div>
              <div>
                <span>Interest</span>
                <strong>{selectedMember.areas_of_interest || "-"}</strong>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={closeConnectModal}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleConnect}
                disabled={connectingId === selectedMember.id}
              >
                {connectingId === selectedMember.id ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
