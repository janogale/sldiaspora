import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { getArticles, getAssetUrl } from "@/lib/articles";
import ArticleCategoryFilter from "./article-category-filter";

export const dynamic = "force-dynamic";

const ARTICLE_CATEGORY_OPTIONS = [
  { value: "", label: "All Articles" },
  { value: "government", label: "Government Articles" },
  { value: "diaspora", label: "Diaspora Articles" },
] as const;

const articleTitleStyle = {
  color: "#0a6d3a",
  fontWeight: 600,
  fontSize: "2.3rem",
  lineHeight: 1.35,
  letterSpacing: "0.01em",
  textWrap: "balance",
  fontFamily: '"Sora", "Manrope", "Segoe UI", sans-serif',
  marginBottom: "14px",
} as const;

const cardStyle = {
  border: "1px solid #d9e9df",
  borderRadius: "18px",
  overflow: "hidden",
  background: "#ffffff",
  boxShadow: "0 14px 35px rgba(9, 55, 30, 0.08)",
  height: "100%",
} as const;

const cardThumbStyle = {
  aspectRatio: "16 / 9",
  overflow: "hidden",
  background: "#eff8f2",
} as const;

const cardImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
} as const;

const cardBodyStyle = {
  padding: "20px 20px 24px",
} as const;

const cardMetaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "16px",
  flexWrap: "wrap",
} as const;

const dateBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 14px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, rgba(241, 251, 246, 0.98) 0%, rgba(219, 243, 230, 0.96) 100%)",
  color: "#0b5a35",
  border: "1px solid rgba(166, 213, 188, 0.95)",
  fontSize: "1.03rem",
  fontWeight: 800,
  letterSpacing: "0.015em",
  boxShadow: "0 14px 30px rgba(10, 86, 52, 0.12)",
  backdropFilter: "blur(8px)",
} as const;

const dateDotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #10a15c 0%, #067647 100%)",
  flexShrink: 0,
  boxShadow: "0 0 0 4px rgba(16, 161, 92, 0.12)",
} as const;

const newsSectionStyle = {
  paddingTop: "0px",
} as const;

const filterSectionStyle = {
  marginTop: "-16px",
  marginBottom: "8px",
} as const;

const filterWrapStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  flexWrap: "wrap",
  gap: "16px",
  marginTop: "-4px",
  marginBottom: "22px",
  border: "1px solid #d5e6dc",
  borderRadius: "16px",
  background:
    "linear-gradient(145deg, rgba(244,250,246,1) 0%, rgba(255,255,255,1) 55%)",
  padding: "16px 18px",
  boxShadow: "0 10px 26px rgba(12, 74, 48, 0.07)",
} as const;

const cardActionWrapStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
} as const;

const compactButtonStyle = {
  padding: "9px 20px",
  minHeight: "unset",
  lineHeight: 1.1,
} as const;

function formatArticleDate(value: string | null): string {
  if (!value) return "Date to be announced";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedParams = (await searchParams) || {};
  const requestedCategory = (resolvedParams.category || "").trim();
  const articles = await getArticles(requestedCategory);

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="News" />

      <section style={filterSectionStyle}>
        <div className="container">
          <div style={filterWrapStyle}>
            <div>
              <h2 style={{ margin: 0, color: "#0f3e2f", fontWeight: 800, fontSize: "1.48rem", lineHeight: 1.2 }}>
                Latest Articles
              </h2>
              <p style={{ margin: "8px 0 0", color: "#5b6f66", fontSize: "1.1rem" }}>
                {requestedCategory
                  ? `Showing ${requestedCategory} articles`
                  : "Showing all published articles"}
              </p>
            </div>

            <ArticleCategoryFilter
              requestedCategory={requestedCategory}
              options={ARTICLE_CATEGORY_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="blog__area section-space" style={newsSectionStyle}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              {articles.length === 0 ? (
                <p>
                  {requestedCategory
                    ? `No ${requestedCategory} articles available yet.`
                    : "No articles available yet."}
                </p>
              ) : (
                <div className="row g-4">
                  {articles.map((article) => {
                    const imageUrl = article.featuredImage
                      ? getAssetUrl(article.featuredImage)
                      : "/assets/imgs/blog/blog-1img.png";
                    const articleLink = `/blogs/${article.id}`;
                    const pdfLink = article.pdfFile ? getAssetUrl(article.pdfFile) : null;
                    const displayDate = formatArticleDate(
                      article.articleDate || article.dateCreated || article.dateUpdated
                    );

                    return (
                      <div className="col-md-6" key={article.id}>
                        <article style={cardStyle}>
                          <div style={cardThumbStyle}>
                            <img src={imageUrl} alt={article.title} style={cardImageStyle} />
                          </div>

                          <div style={cardBodyStyle}>
                            <div style={cardMetaStyle}>
                              <span style={dateBadgeStyle}>
                                <span style={dateDotStyle}></span>
                                {displayDate}
                              </span>
                            </div>
                            <h2 className="blog__content-text-title" style={articleTitleStyle}>
                              {article.title}
                            </h2>
                            <div style={cardActionWrapStyle}>
                              <a href={articleLink} className="rr-btn" style={compactButtonStyle}>
                                Read More
                              </a>
                              {pdfLink ? (
                                <a
                                  href={pdfLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rr-btn"
                                  style={compactButtonStyle}
                                >
                                  Read PDF
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
