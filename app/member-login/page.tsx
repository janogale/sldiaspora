"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";

export default function MemberLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/member-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || "Login failed.");
        return;
      }

      router.push("/member-dashboard");
      router.refresh();
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div style={{ margin: "2rem" }} />
      <Header />
      <BreadCamp title="Member Login" />

      <section className="pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div
                style={{
                  border: "1px solid #d4e4da",
                  borderRadius: "14px",
                  padding: "28px",
                  background: "#fff",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
                }}
              >
                <h3 style={{ marginBottom: "10px", color: "#034833" }}>Sign In</h3>
                <p style={{ color: "#5a6b76", marginBottom: "20px" }}>
                  Approved members can access the dashboard and connect with others.
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div
                      style={{
                        marginBottom: "14px",
                        border: "1px solid #f5d5d5",
                        background: "#fef2f2",
                        color: "#991b1b",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "0.92rem",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      border: "none",
                      background: loading ? "#95bea4" : "#006d21",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "11px 16px",
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
