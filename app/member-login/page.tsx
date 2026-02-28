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
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-6 col-lg-7 col-md-10">
              <div className={styles.backButtonWrap}>
                <Link href="/" className={styles.backButton}>
                  <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
                  Back to Website
                </Link>
              </div>

              <div className={styles.loginCard}>
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

                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>
                  Sign in to your member account to access your dashboard and diaspora services.
                </p>

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
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
