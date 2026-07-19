import BreadCamp from "@/app/components/BreadCamp";
import Header from "@/app/components/header";
import { getArticleById, getAssetUrl } from "@/lib/articles";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const featuredUrl = article.featuredImage ? getAssetUrl(article.featuredImage) : null;
  const pdfUrl = article.pdfFile ? getAssetUrl(article.pdfFile) : null;
  const publishedDate = formatDate(article.articleDate || article.dateCreated || article.dateUpdated);

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="News Details" />

      <section style={{ backgroundColor: "#f8faf9", minHeight: "100vh", padding: "60px 0 80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">

              {/* Article Card */}
              <article style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              }}>

                {/* Featured Image */}
                {featuredUrl ? (
                  <div style={{ position: "relative", width: "100%", maxHeight: "480px", overflow: "hidden" }}>
                    <img
                      src={featuredUrl}
                      alt={article.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        maxHeight: "480px",
                      }}
                    />
                    {article.category && article.category !== "Uncategorized" && (
                      <span style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        backgroundColor: "#1a6b45",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "5px 14px",
                        borderRadius: "20px",
                      }}>
                        {article.category}
                      </span>
                    )}
                  </div>
                ) : null}

                {/* Content Area */}
                <div style={{ padding: "44px 52px 52px" }}>

                  {/* Meta Row */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}>
                    {!featuredUrl && article.category && article.category !== "Uncategorized" && (
                      <span style={{
                        backgroundColor: "#e8f4ee",
                        color: "#1a6b45",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}>
                        {article.category}
                      </span>
                    )}
                    {publishedDate && (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "14px" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {publishedDate}
                      </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "14px" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Admin
                    </span>
                  </div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.3,
                    marginBottom: "32px",
                    borderBottom: "2px solid #e8f4ee",
                    paddingBottom: "24px",
                  }}>
                    {article.title}
                  </h1>

                  {/* Article Body */}
                  <div style={{
                    fontSize: "1.065rem",
                    lineHeight: 1.85,
                    color: "#374151",
                  }}
                    className="article-body-content"
                  >
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </div>

                  {/* PDF Section */}
                  {pdfUrl ? (
                    <div style={{
                      marginTop: "48px",
                      padding: "28px 32px",
                      backgroundColor: "#f0f9f4",
                      borderRadius: "12px",
                      border: "1px solid #c6e8d5",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a6b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          Attached Document
                        </h3>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            backgroundColor: "#1a6b45",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 600,
                            padding: "10px 20px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            transition: "background 0.2s",
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Open PDF
                        </a>
                      </div>
                      <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #c6e8d5" }}>
                        <iframe
                          src={pdfUrl}
                          title={`${article.title} PDF`}
                          style={{ width: "100%", height: "780px", border: "0", display: "block" }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Image Gallery */}
                  {article.images.length > 0 ? (
                    <div style={{ marginTop: "48px" }}>
                      <h3 style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a6b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        Photo Gallery
                      </h3>
                      <div className="row g-3">
                        {article.images.map((imageId) => (
                          <div className="col-md-6" key={imageId}>
                            <div style={{ borderRadius: "10px", overflow: "hidden", aspectRatio: "16/10", backgroundColor: "#f3f4f6" }}>
                              <img
                                src={getAssetUrl(imageId)}
                                alt={article.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Back Link */}
                  <div style={{ marginTop: "52px", paddingTop: "28px", borderTop: "1px solid #e5e7eb" }}>
                    <Link
                      href="/blogs"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#1a6b45",
                        fontWeight: 600,
                        fontSize: "15px",
                        textDecoration: "none",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Back to News &amp; Articles
                    </Link>
                  </div>

                </div>
              </article>

            </div>
          </div>
        </div>
      </section>

      <style>{`
        .article-body-content p {
          margin-bottom: 1.4em;
        }
        .article-body-content h2,
        .article-body-content h3,
        .article-body-content h4 {
          font-weight: 700;
          color: #111827;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.3;
        }
        .article-body-content h2 { font-size: 1.45rem; }
        .article-body-content h3 { font-size: 1.2rem; }
        .article-body-content h4 { font-size: 1.05rem; }
        .article-body-content ul,
        .article-body-content ol {
          padding-left: 1.6em;
          margin-bottom: 1.4em;
        }
        .article-body-content li {
          margin-bottom: 0.5em;
        }
        .article-body-content blockquote {
          border-left: 4px solid #1a6b45;
          margin: 1.6em 0;
          padding: 12px 20px;
          background: #f0f9f4;
          border-radius: 0 8px 8px 0;
          color: #374151;
          font-style: italic;
        }
        .article-body-content a {
          color: #1a6b45;
          text-decoration: underline;
        }
        .article-body-content img {
          max-width: 100%;
          border-radius: 10px;
          margin: 1em 0;
        }
        .article-body-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.4em;
          font-size: 0.95rem;
        }
        .article-body-content th,
        .article-body-content td {
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          text-align: left;
        }
        .article-body-content th {
          background: #f0f9f4;
          font-weight: 600;
          color: #111827;
        }
        @media (max-width: 768px) {
          .article-body-content h2 { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
}
