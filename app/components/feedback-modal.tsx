"use client";

import { FormEvent, useState } from "react";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), comment: comment.trim() }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result?.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div
      className="feedback-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #d4e4da",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            padding: "24px 28px",
            background:
              "linear-gradient(135deg, rgba(241,250,245,1) 0%, rgba(255,255,255,1) 100%)",
            borderBottom: "1px solid #eef3f0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 6px 0", color: "#0f172a", fontWeight: 800, fontSize: "1.6rem" }}>
              {status === "done" ? "Thank You!" : "Share Your Feedback"}
            </h3>
            <p style={{ margin: 0, color: "#5a6b76", fontSize: "0.95rem" }}>
              {status === "done"
                ? "We appreciate you taking the time to share your thoughts with us."
                : "Tell us your name and leave a comment, we'd love to hear from you."}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                fontSize: "28px",
                lineHeight: 1,
                cursor: "pointer",
                fontWeight: 300,
              }}
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {status === "done" ? (
          <div style={{ padding: "32px 28px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🙏</div>
            <p style={{ color: "#0f172a", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>
              Thanks, {name.split(" ")[0]}! Your feedback means a lot to us.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="feedback-name"
                style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#0f172a", fontSize: "0.9rem" }}
              >
                Your Name
              </label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #d4e4da",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="feedback-comment"
                style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#0f172a", fontSize: "0.9rem" }}
              >
                Your Comment
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts, suggestions, or experience..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #d4e4da",
                  fontSize: "0.95rem",
                  resize: "vertical",
                }}
              />
            </div>

            {status === "error" && (
              <p style={{ color: "#b91c1c", fontSize: "0.85rem", marginBottom: "14px" }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: status === "submitting" ? "#8fb7a0" : "#0f9d58",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: status === "submitting" ? "default" : "pointer",
              }}
            >
              {status === "submitting" ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
