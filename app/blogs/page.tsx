import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { getArticles, getAssetUrl } from "@/lib/articles";

export const dynamic = "force-dynamic";

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

export default async function Page() {
  const articles = await getArticles();

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="News" />

      <section className="blog__area section-space" style={newsSectionStyle}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              {articles.length === 0 ? (
                <p>No articles available yet.</p>
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
