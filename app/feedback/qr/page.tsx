"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

const FEEDBACK_URL = "https://sldiaspora.org/feedback";

export default function FeedbackQrPage() {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(FEEDBACK_URL, {
      width: 480,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f9f6",
        padding: "24px",
      }}
    >
      <div
        className="feedback-qr-card"
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #d4e4da",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
          padding: "40px 48px",
          textAlign: "center",
          maxWidth: "420px",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "1.8rem", fontWeight: 800 }}>
          We&apos;d Love Your Feedback
        </h1>
        <p style={{ margin: "0 0 24px 0", color: "#5a6b76", fontSize: "1rem" }}>
          Scan the QR code with your phone camera to share your name and a comment with us.
        </p>

        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Scan to give feedback"
            width={280}
            height={280}
            style={{ margin: "0 auto", display: "block" }}
          />
        ) : (
          <div style={{ height: "280px" }} />
        )}

        <p style={{ marginTop: "20px", color: "#0f9d58", fontWeight: 700, fontSize: "0.95rem" }}>
          sldiaspora.org/feedback
        </p>

        <button
          type="button"
          onClick={() => window.print()}
          className="feedback-qr-print-button"
          style={{
            marginTop: "24px",
            padding: "12px 22px",
            borderRadius: "10px",
            border: "none",
            background: "#0f9d58",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Print
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .feedback-qr-card,
          .feedback-qr-card * {
            visibility: visible;
          }
          .feedback-qr-card {
            position: absolute;
            inset: 0;
            margin: auto;
            box-shadow: none !important;
            border: none !important;
          }
          .feedback-qr-print-button {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
