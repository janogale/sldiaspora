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
    <div className="fb-overlay" onClick={onClose}>
      <div className="fb-card" onClick={(event) => event.stopPropagation()}>
        <div className="fb-drag-handle" />

        <div className="fb-header">
          <div>
            <h3 className="fb-title">
              {status === "done" ? "Thank You! 🎉" : "Share Your Feedback"}
            </h3>
            <p className="fb-subtitle">
              {status === "done"
                ? "We appreciate you taking the time to share your thoughts with us."
                : "Tell us your name and leave a comment — we'd love to hear from you."}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="fb-close"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {status === "done" ? (
          <div className="fb-thanks">
            <div className="fb-thanks-icon">🙏</div>
            <p className="fb-thanks-text">
              Thanks, {name.split(" ")[0]}! Your feedback means a lot to us.
            </p>
            {onClose && (
              <button type="button" onClick={onClose} className="fb-done-button">
                Done
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fb-form">
            <div className="fb-field">
              <label htmlFor="feedback-name" className="fb-label">
                Your Name
              </label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Enter your name"
                className="fb-input"
                autoComplete="name"
              />
            </div>

            <div className="fb-field">
              <label htmlFor="feedback-comment" className="fb-label">
                Your Comment
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts, suggestions, or experience..."
                className="fb-textarea"
              />
            </div>

            {status === "error" && <p className="fb-error">{errorMessage}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="fb-submit"
            >
              {status === "submitting" ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .fb-overlay * {
          box-sizing: border-box;
        }

        .fb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(3px);
        }

        .fb-card {
          width: 100%;
          max-width: 440px;
          max-height: 88vh;
          background: #ffffff;
          border-radius: 22px;
          border: 1px solid #d4e4da;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          display: flex;
          flex-direction: column;
        }

        .fb-drag-handle {
          display: none;
        }

        .fb-header {
          padding: 22px 24px 16px;
          background: linear-gradient(135deg, #f1faf5 0%, #ffffff 100%);
          border-bottom: 1px solid #eef3f0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .fb-title {
          margin: 0 0 6px 0;
          color: #0f172a;
          font-weight: 800;
          font-size: 1.35rem;
          line-height: 1.25;
        }

        .fb-subtitle {
          margin: 0;
          color: #5a6b76;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .fb-close {
          flex-shrink: 0;
          border: none;
          background: #f1f5f3;
          color: #64748b;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fb-form {
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
        }

        .fb-field {
          margin-bottom: 16px;
        }

        .fb-label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #0f172a;
          font-size: 0.85rem;
        }

        .fb-input,
        .fb-textarea {
          width: 100%;
          margin: 0;
          padding: 13px 14px;
          border-radius: 12px;
          border: 1.5px solid #dbe7e0;
          font-size: 16px;
          font-family: inherit;
          color: #0f172a;
          background: #fafcfb;
          transition: border-color 0.15s ease, background 0.15s ease;
          box-sizing: border-box;
        }

        .fb-input[type="text"] {
          margin-left: 0;
        }

        .fb-input:focus,
        .fb-textarea:focus {
          outline: none;
          border-color: #0f9d58;
          background: #ffffff;
        }

        .fb-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .fb-error {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.85rem;
          margin: 0 0 16px 0;
        }

        .fb-submit {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: #0f9d58;
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .fb-submit:active {
          transform: scale(0.98);
        }

        .fb-submit:disabled {
          background: #94c7ac;
          cursor: default;
        }

        .fb-thanks {
          padding: 36px 24px 32px;
          text-align: center;
        }

        .fb-thanks-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .fb-thanks-text {
          color: #0f172a;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .fb-done-button {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: #0f172a;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }

        /* Mobile: bottom-sheet style for a native, app-like feel */
        @media (max-width: 560px) {
          .fb-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .fb-card {
            max-width: 100%;
            max-height: 92vh;
            border-radius: 20px 20px 0 0;
            border: none;
            border-top: 1px solid #e5efe9;
            padding-bottom: env(safe-area-inset-bottom, 0px);
            animation: fb-slide-up 0.25s ease-out;
          }

          .fb-drag-handle {
            display: block;
            width: 40px;
            height: 4px;
            border-radius: 999px;
            background: #d9e3dd;
            margin: 10px auto 0;
          }

          .fb-header {
            padding: 14px 20px 14px;
          }

          .fb-title {
            font-size: 1.2rem;
          }

          .fb-subtitle {
            font-size: 0.85rem;
          }

          .fb-form {
            padding: 16px 20px 20px;
          }

          .fb-thanks {
            padding: 28px 20px 24px;
          }
        }

        @keyframes fb-slide-up {
          from {
            transform: translateY(24px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
