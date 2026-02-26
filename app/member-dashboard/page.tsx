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

  return (
    <main>
      <div style={{ margin: "2rem" }} />
      <Header />
      <BreadCamp title="Member Dashboard" />

      <section className="pt-80 pb-100">
        <div className="container">
          {loading ? (
            <p>Loading dashboard...</p>
          ) : error ? (
            <div
              style={{
                border: "1px solid #f5d5d5",
                background: "#fef2f2",
                color: "#991b1b",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              {error}
            </div>
          ) : !member ? (
            <p>No member profile available.</p>
          ) : (
            <div className="row g-4">
              <div className="col-lg-4">
                <div
                  style={{
                    border: "1px solid #d7e5dc",
                    borderRadius: "14px",
                    padding: "20px",
                    background: "#fff",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "14px" }}>
                    <img
                      src={resolveAssetPath(member.profile_picture) || "/assets/imgs/about/about-big-img.png"}
                      alt={member.full_name}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #e6efe9",
                      }}
                    />
                  </div>
                  <h4 style={{ marginBottom: "10px", color: "#034833" }}>{member.full_name}</h4>
                  <p style={{ margin: "0 0 6px 0" }}><strong>Status:</strong> {member.status}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>Email:</strong> {member.email || "-"}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>Phone:</strong> {member.phone || "-"}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>Country:</strong> {member.country || "-"}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>City:</strong> {member.city || "-"}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>Profession:</strong> {member.profession || "Not shared"}</p>
                  <p style={{ margin: 0 }}>
                    <strong>Interest:</strong> {member.areas_of_interest || "Not shared"}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      marginTop: "16px",
                      border: "1px solid #d4e4da",
                      background: "#fff",
                      color: "#1f2937",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontWeight: 600,
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="col-lg-8">
                <div
                  style={{
                    border: "1px solid #d7e5dc",
                    borderRadius: "14px",
                    padding: "20px",
                    background: "#fff",
                    marginBottom: "16px",
                  }}
                >
                  <h5 style={{ marginBottom: "10px", color: "#034833" }}>Connection Preferences</h5>
                  <div className="row g-2 align-items-end">
                    <div className="col-md-5">
                      <label style={{ fontWeight: 600, marginBottom: "4px", display: "block" }}>
                        Share with your request
                      </label>
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
                      <label style={{ fontWeight: 600, marginBottom: "4px", display: "block" }}>
                        Message (optional)
                      </label>
                      <input
                        className="form-control"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Add a short intro message"
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #d7e5dc",
                    borderRadius: "14px",
                    padding: "20px",
                    background: "#fff",
                  }}
                >
                  <h5 style={{ marginBottom: "14px", color: "#034833" }}>Approved Members</h5>
                  {otherMembers.length === 0 ? (
                    <p style={{ marginBottom: 0 }}>No members available yet.</p>
                  ) : (
                    <div className="row g-3">
                      {otherMembers.map((item) => (
                        <div key={item.id} className="col-md-6">
                          <div
                            style={{
                              border: "1px solid #e2ece6",
                              borderRadius: "10px",
                              padding: "12px",
                              background: "#fbfdfc",
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <img
                                src={resolveAssetPath(item.profile_picture) || "/assets/imgs/about/about-big-img.png"}
                                alt={item.full_name}
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700 }}>{item.full_name}</div>
                                <div style={{ fontSize: "0.88rem", color: "#4b5563" }}>
                                  {[item.profession || "", item.city || "", item.country || ""]
                                    .filter(Boolean)
                                    .join(" • ")}
                                </div>
                                <div style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                                  {item.areas_of_interest || "No interest shared"}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleConnect(item.id)}
                              disabled={connectingId === item.id}
                              style={{
                                marginTop: "10px",
                                border: "none",
                                background: connectingId === item.id ? "#95bea4" : "#006d21",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "7px 12px",
                                fontWeight: 600,
                                width: "100%",
                                cursor: connectingId === item.id ? "not-allowed" : "pointer",
                              }}
                            >
                              {connectingId === item.id
                                ? "Sending..."
                                : "Request to connect"}
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
    </main>
  );
}
