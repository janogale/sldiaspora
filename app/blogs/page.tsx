import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { getArticles, getAssetUrl } from "@/lib/articles";

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

const newsSectionStyle = {
  paddingTop: "18px",
} as const;

const filterWrapStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "14px",
  marginBottom: "18px",
} as const;

const filterLabelStyle = {
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#35524a",
  marginBottom: "6px",
  display: "block",
} as const;

const filterSelectStyle = {
  minWidth: "220px",
  minHeight: "44px",
  borderRadius: "10px",
  border: "1px solid #cfe0d6",
  padding: "0 12px",
  color: "#1f2937",
  background: "#ffffff",
  fontWeight: 600,
} as const;

const filterButtonStyle = {
  minHeight: "44px",
  borderRadius: "10px",
  border: "1px solid #0a6d3a",
  background: "#0a6d3a",
  color: "#ffffff",
  padding: "0 14px",
  fontWeight: 700,
  marginLeft: "8px",
} as const;

function getFirstContentLink(input: string): string | null {
  const match = input.match(/href\s*=\s*["']([^"']+)["']/i);
  const href = match?.[1]?.trim();
  if (!href) return null;

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  ) {
    return href;
  }

  return null;
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

      <section className="blog__area section-space" style={newsSectionStyle}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div style={filterWrapStyle}>
                <div>
                  <h2 style={{ margin: 0, color: "#0f3e2f", fontWeight: 800, fontSize: "1.55rem" }}>
                    Latest Articles
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#5b6f66" }}>
                    {requestedCategory
                      ? `Showing ${requestedCategory} articles`
                      : "Showing all published articles"}
                  </p>
                </div>

                <form method="GET">
                  <label htmlFor="article-category" style={filterLabelStyle}>
                    Article Category
                  </label>
                  <select
                    id="article-category"
                    name="category"
                    defaultValue={requestedCategory}
                    style={filterSelectStyle}
                  >
                    {ARTICLE_CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value || "all"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button type="submit" style={filterButtonStyle}>
                    Apply
                  </button>
                </form>
              </div>

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
                    const contentLink = getFirstContentLink(article.content);

                    return (
                      <div className="col-md-6" key={article.id}>
                        <article style={cardStyle}>
                          <div style={cardThumbStyle}>
                            <img src={imageUrl} alt={article.title} style={cardImageStyle} />
                          </div>

                          <div style={cardBodyStyle}>
                            <h2 className="blog__content-text-title" style={articleTitleStyle}>
                              {article.title}
                            </h2>
                            {contentLink ? (
                              <a href={contentLink} className="rr-btn">
                                Read More
                              </a>
                            ) : null}
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
