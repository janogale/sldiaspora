"use client";

import { useState } from "react";
import Image from "next/image";
import FeedbackModal from "../components/feedback-modal";

export default function FeedbackPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(155deg, rgba(241,250,245,1) 0%, rgba(255,255,255,1) 55%, rgba(238,248,242,1) 100%)",
        padding: "16px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Image
          src="/assets/imgs/logo/logo.png"
          alt="Somaliland Diaspora"
          width={160}
          height={60}
          style={{ margin: "0 auto 12px", objectFit: "contain" }}
        />
        <p style={{ color: "#5a6b76", marginBottom: "16px" }}>
          {isOpen
            ? ""
            : "Thank you again for stopping by. You can close this page now."}
        </p>
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              padding: "12px 22px",
              borderRadius: "10px",
              border: "none",
              background: "#0f9d58",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Leave Feedback
          </button>
        )}
      </div>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
