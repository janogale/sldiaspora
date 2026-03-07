"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function MemberLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className={styles.loginPage}>
      <section className={styles.loginSection}>
        <div className={`container ${styles.loginContainer}`}>
          <div className={styles.backButtonWrap}>
            <Link href="/" className={styles.backButton}>
              <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
              Back to Website
            </Link>
          </div>

          <div className={styles.loginShell}>
            <div className={styles.brandPanel}>
              <p className={styles.kicker}>Somaliland Diaspora Department</p>
              <div className={styles.logoWrap}>
                <Image
                  src="/assets/imgs/logo/logo.png"
                  alt="Somaliland Diaspora Department"
                  width={220}
                  height={72}
                  priority
                  className={styles.logoImage}
                />
              </div>

              <h2 className={styles.brandTitle}>Member Portal</h2>
              <p className={styles.brandSubtitle}>
                Securely access your profile, member dashboard, and diaspora services in one place.
              </p>

              <div className={styles.liveBadge}>
                <span className={styles.liveDot} aria-hidden="true"></span>
                Member Services Online
              </div>

              <ul className={styles.brandList}>
                <li>
                  <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                  Fast and secure login
                </li>
                <li>
                  <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                  Verified member connections
                </li>
                <li>
                  <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                  Access from any device
                </li>
              </ul>
            </div>

            <div className={styles.loginCard}>
              <div className={styles.mobileLogoWrap}>
                <Image
                  src="/assets/imgs/logo/logo.png"
                  alt="Somaliland Diaspora Department"
                  width={180}
                  height={58}
                  className={styles.logoImage}
                />
              </div>

              <h1 className={styles.title}>Welcome Back</h1>
              <p className={styles.subtitle}>
                Sign in to your member account to access your dashboard and diaspora services.
              </p>

              <div className={styles.securityNote}>
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                Secured member authentication
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="member-email" className={styles.label}>
                    Email Address
                  </label>
                  <input
                    id="member-email"
                    type="email"
                    className={`form-control ${styles.input}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="member@example.com"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="member-password" className={styles.label}>
                    Password
                  </label>
                  <div className={styles.passwordWrap}>
                    <input
                      id="member-password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${styles.input} ${styles.passwordInput}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <i
                        className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </div>

                {error && <div className={styles.errorBox}>{error}</div>}

                <button type="submit" disabled={loading} className={styles.loginButton}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className={styles.footerNote}>
                Need an account? Use the <Link href="/register">member registration</Link> form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
