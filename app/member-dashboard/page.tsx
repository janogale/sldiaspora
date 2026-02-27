"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";

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
  const [member, setMember] = useState<DashboardMember | null>(null);
  const [members, setMembers] = useState<MembersListItem[]>([]);

  const [connectingId, setConnectingId] = useState<string>("");
  const [shareContact, setShareContact] = useState<"none" | "email" | "phone">(
    "none"
  );
  const [requestMessage, setRequestMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterProfession, setFilterProfession] = useState("");
  const [filterInterest, setFilterInterest] = useState("");

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

  const filterOptions = useMemo(() => {
    const unique = (items: Array<string | undefined>) =>
      Array.from(new Set(items.filter(Boolean) as string[])).sort();

    return {
      countries: unique(otherMembers.map((item) => item.country)),
      professions: unique(otherMembers.map((item) => item.profession)),
      interests: unique(otherMembers.map((item) => item.areas_of_interest)),
    };
  }, [otherMembers]);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return otherMembers.filter((item) => {
      const matchesTerm = term
        ? [item.full_name, item.profession, item.city, item.country]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term)
        : true;

      const matchesCountry = filterCountry
        ? String(item.country || "") === filterCountry
        : true;

      const matchesProfession = filterProfession
        ? String(item.profession || "") === filterProfession
        : true;

      const matchesInterest = filterInterest
        ? String(item.areas_of_interest || "") === filterInterest
        : true;

      return matchesTerm && matchesCountry && matchesProfession && matchesInterest;
    });
  }, [otherMembers, searchTerm, filterCountry, filterProfession, filterInterest]);

  const handleLogout = async () => {
    await fetch("/api/member-auth/logout", { method: "POST" }).catch(() => null);
    router.push("/member-login");
  };

  const handleConnect = async (targetMemberId: string) => {
    setConnectingId(targetMemberId);
    setError("");

    try {
      const response = await fetch("/api/member-auth/request-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetMemberId,
          shareContact,
          message: requestMessage,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || "Failed to send connection request.");
        return;
      }

      setRequestMessage("");
      alert("Connection request sent.");
    } catch {
      setError("Failed to send connection request.");
    } finally {
      setConnectingId("");
    }
  };

  const openConnectModal = (memberItem: MembersListItem) => {
    setSelectedMember(memberItem);
    setIsModalOpen(true);
  };

  const closeConnectModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <main>
      <div style={{ margin: "2rem" }} />
      <Header />
      <BreadCamp title="Member Dashboard" marginBottom="0rem" titleTopPadding="2rem" />

      <section className="member-dashboard">
        <div className="container-fluid member-dashboard__wrap">
          {loading ? (
            <div className="dashboard-state">Loading dashboard...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : !member ? (
            <div className="dashboard-state">No member profile available.</div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="profile-card">
                  <div className="profile-card__head">
                    <div className="profile-avatar">
                      <img
                        src={
                          resolveAssetPath(member.profile_picture) ||
                          "/assets/imgs/about/about-big-img.png"
                        }
                        alt={member.full_name}
                      />
                    </div>
                    <div>
                      <div className="profile-name">{member.full_name}</div>
                      <div className="profile-meta">
                        <span>{member.city || ""}</span>
                        <span>{member.country || ""}</span>
                      </div>
                      <span className="profile-badge">
                        {String(member.status || "").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div>
                      <span>Email</span>
                      <strong>{member.email || "-"}</strong>
                    </div>
                    <div>
                      <span>Phone</span>
                      <strong>{member.phone || "-"}</strong>
                    </div>
                    <div>
                      <span>Profession</span>
                      <strong>{member.profession || "Not shared"}</strong>
                    </div>
                    <div>
                      <span>Interest</span>
                      <strong>{member.areas_of_interest || "Not shared"}</strong>
                    </div>
                  </div>

                  <button className="logout-btn" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <div>
                      <h5>Connection Preferences</h5>
                      <p>Control what you share when requesting a connection.</p>
                    </div>
                  </div>
                  <div className="row g-2 align-items-end">
                    <div className="col-md-5">
                      <label className="panel-label">Share with your request</label>
                      <select
                        className="form-control"
                        value={shareContact}
                        onChange={(e) =>
                          setShareContact(e.target.value as "none" | "email" | "phone")
                        }
                      >
                        <option value="none">No contact details</option>
                        <option value="email">Share my email</option>
                        <option value="phone">Share my phone</option>
                      </select>
                    </div>
                    <div className="col-md-7">
                      <label className="panel-label">Message (optional)</label>
                      <input
                        className="form-control"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Add a short intro message"
                      />
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel">
                  <div className="panel-header">
                    <div>
                      <h5>Member Directory</h5>
                      <p>Connect with active members and explore their profiles.</p>
                    </div>
                    <span className="panel-count">{filteredMembers.length} Members</span>
                  </div>

                  <div className="directory-filters">
                    <div className="filter-item">
                      <label>Search</label>
                      <input
                        className="form-control"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by name, profession, city"
                      />
                    </div>
                    <div className="filter-item">
                      <label>Country</label>
                      <select
                        className="form-control"
                        value={filterCountry}
                        onChange={(event) => setFilterCountry(event.target.value)}
                      >
                        <option value="">All</option>
                        {filterOptions.countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-item">
                      <label>Profession</label>
                      <select
                        className="form-control"
                        value={filterProfession}
                        onChange={(event) => setFilterProfession(event.target.value)}
                      >
                        <option value="">All</option>
                        {filterOptions.professions.map((profession) => (
                          <option key={profession} value={profession}>
                            {profession}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-item">
                      <label>Interest</label>
                      <select
                        className="form-control"
                        value={filterInterest}
                        onChange={(event) => setFilterInterest(event.target.value)}
                      >
                        <option value="">All</option>
                        {filterOptions.interests.map((interest) => (
                          <option key={interest} value={interest}>
                            {interest}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredMembers.length === 0 ? (
                    <div className="dashboard-empty">No members available yet.</div>
                  ) : (
                    <div className="directory-table">
                      <div className="directory-row directory-row--head">
                        <span>Member</span>
                        <span>Profession</span>
                        <span>Location</span>
                        <span>Interest</span>
                        <span>Action</span>
                      </div>
                      {filteredMembers.map((item) => (
                        <div key={item.id} className="directory-row">
                          <div className="directory-cell member-cell">
                            <img
                              src={
                                resolveAssetPath(item.profile_picture) ||
                                "/assets/imgs/about/about-big-img.png"
                              }
                              alt={item.full_name}
                            />
                            <div>
                              <div className="member-name">{item.full_name}</div>
                              <div className="member-sub">
                                {item.city || ""} {item.country ? `, ${item.country}` : ""}
                              </div>
                            </div>
                          </div>
                          <span>{item.profession || "Not shared"}</span>
                          <span>
                            {[item.city || "", item.country || ""]
                              .filter(Boolean)
                              .join(", ") || "-"}
                          </span>
                          <span>{item.areas_of_interest || "Not shared"}</span>
                          <div className="directory-cell">
                            <button
                              type="button"
                              onClick={() => openConnectModal(item)}
                              className="member-action"
                            >
                              View & Connect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && selectedMember && (
        <div className="connect-modal" onClick={closeConnectModal}>
          <div className="connect-modal__card" onClick={(event) => event.stopPropagation()}>
            <div className="connect-modal__header">
              <div>
                <h4>{selectedMember.full_name}</h4>
                <p>
                  {[selectedMember.city || "", selectedMember.country || ""]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <button type="button" onClick={closeConnectModal}>
                ✕
              </button>
            </div>

            <div className="connect-modal__body">
              <div>
                <span>Address</span>
                <strong>{selectedMember.address || "Not shared"}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedMember.contact_email || "Not shared"}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{selectedMember.contact_phone || "Not shared"}</strong>
              </div>
              <div>
                <span>Area of Interest</span>
                <strong>{selectedMember.areas_of_interest || "Not shared"}</strong>
              </div>
            </div>

            <div className="connect-modal__footer">
              <button type="button" onClick={closeConnectModal} className="ghost-btn">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConnect(selectedMember.id)}
                disabled={connectingId === selectedMember.id}
                className="member-action"
              >
                {connectingId === selectedMember.id ? "Sending..." : "Request to connect"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .member-dashboard {
          padding: 40px 0 100px;
          background: radial-gradient(
              circle at top,
              rgba(0, 109, 33, 0.08),
              transparent 55%
            ),
            #f7faf8;
        }

        .member-dashboard__wrap {
          max-width: 1400px;
          padding-left: 24px;
          padding-right: 24px;
        }

        .dashboard-state {
          padding: 18px;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e0ebe5;
          color: #1f2937;
        }

        .dashboard-error {
          padding: 16px;
          border-radius: 12px;
          background: #fef2f2;
          border: 1px solid #f5d5d5;
          color: #991b1b;
        }

        .profile-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid #e0ebe5;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 110px;
        }

        .profile-card__head {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 18px;
        }

        .profile-avatar img {
          width: 86px;
          height: 86px;
          border-radius: 20px;
          object-fit: cover;
          border: 2px solid rgba(0, 109, 33, 0.15);
        }

        .profile-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: #034833;
          margin-bottom: 4px;
        }

        .profile-meta {
          display: flex;
          gap: 10px;
          font-size: 0.9rem;
          color: #5b6b66;
        }

        .profile-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          font-weight: 700;
          background: rgba(0, 109, 33, 0.12);
          color: #006d21;
          margin-top: 8px;
        }

        .profile-details {
          display: grid;
          gap: 10px;
          margin-bottom: 18px;
        }

        .profile-details span {
          display: block;
          font-size: 0.78rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .profile-details strong {
          display: block;
          font-size: 1.05rem;
          color: #1f2937;
        }

        .logout-btn {
          width: 100%;
          border: none;
          background: #0b3d2b;
          color: #ffffff;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .logout-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(3, 72, 51, 0.2);
        }

        .dashboard-panel {
          background: #ffffff;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid #e0ebe5;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
          margin-bottom: 18px;
        }

        .directory-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .filter-item label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 6px;
          color: #1f2937;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .panel-header h5 {
          margin-bottom: 4px;
          color: #034833;
          font-weight: 700;
        }

        .panel-header p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .panel-count {
          font-size: 0.82rem;
          padding: 6px 12px;
          background: #eef7f1;
          color: #006d21;
          border-radius: 999px;
          font-weight: 600;
        }

        .panel-label {
          font-weight: 600;
          margin-bottom: 4px;
          display: block;
          color: #1f2937;
        }

        .dashboard-empty {
          padding: 16px;
          border-radius: 12px;
          background: #f7faf8;
          color: #6b7280;
        }

        .directory-table {
          display: grid;
          gap: 10px;
        }

        .directory-row {
          display: grid;
          grid-template-columns: minmax(200px, 1.4fr) 1fr 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e2ece6;
          background: #ffffff;
        }

        .directory-row--head {
          background: #f1f7f3;
          font-weight: 700;
          color: #1f2937;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
        }

        .directory-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .member-cell img {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid rgba(0, 109, 33, 0.12);
        }

        .member-name {
          font-weight: 700;
          color: #0b3d2b;
        }

        .member-sub {
          font-size: 0.82rem;
          color: #6b7280;
        }

        .member-action {
          border: none;
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 600;
          background: #006d21;
          color: #ffffff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .member-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(0, 109, 33, 0.2);
        }

        .member-action:disabled {
          background: #95bea4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .connect-modal {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .connect-modal__card {
          background: #ffffff;
          border-radius: 18px;
          max-width: 520px;
          width: 100%;
          padding: 22px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
        }

        .connect-modal__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .connect-modal__header h4 {
          margin-bottom: 4px;
          color: #034833;
        }

        .connect-modal__header p {
          margin: 0;
          color: #6b7280;
        }

        .connect-modal__header button {
          border: none;
          background: transparent;
          font-size: 20px;
          color: #9ca3af;
        }

        .connect-modal__body {
          display: grid;
          gap: 12px;
          margin-bottom: 18px;
        }

        .connect-modal__body span {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .connect-modal__body strong {
          font-size: 0.98rem;
          color: #1f2937;
        }

        .connect-modal__footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .ghost-btn {
          border: 1px solid #d4e4da;
          background: #ffffff;
          color: #1f2937;
          border-radius: 10px;
          padding: 8px 14px;
          font-weight: 600;
        }

        @media (max-width: 991px) {
          .profile-card {
            position: static;
          }

          .directory-row {
            grid-template-columns: minmax(160px, 1.2fr) 1fr 1fr;
            grid-auto-rows: auto;
          }

          .directory-row span:nth-child(4),
          .directory-row span:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .member-dashboard {
            padding: 60px 0 80px;
          }

          .member-dashboard__wrap {
            padding-left: 16px;
            padding-right: 16px;
          }

          .profile-card,
          .dashboard-panel {
            padding: 18px;
          }

          .panel-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .directory-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .directory-row--head {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
