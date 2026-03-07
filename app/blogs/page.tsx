import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { getArticles, getAssetUrl } from "@/lib/articles";

export const dynamic = "force-dynamic";

const articleTitleStyle = {
  color: "#0a6d3a",
  fontWeight: 600,
  fontSize: "2.7rem",
  lineHeight: 1.35,
  letterSpacing: "0.01em",
  textWrap: "balance",
  fontFamily: '"Sora", "Manrope", "Segoe UI", sans-serif',
  marginBottom: "18px",
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

      <section className="blog__area section-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {articles.length === 0 ? (
                <p>No articles available yet.</p>
              ) : (
                articles.map((article) => {
                  const imageUrl = article.featuredImage
                    ? getAssetUrl(article.featuredImage)
                    : "/assets/imgs/blog/blog-1img.png";
                  const contentLink = getFirstContentLink(article.content);

                  return (
                    <div className="blog__content mb-80" key={article.id}>
                      <div className="blog__content-thumb">
                        <img src={imageUrl} alt={article.title} />
                      </div>

                      <div className="blog__content-text mt-20">
                        <h2 className="blog__content-text-title" style={articleTitleStyle}>
                          {article.title}
                        </h2>
                        {contentLink ? (
                          <a href={contentLink} className="rr-btn mt-40">
                            Read More
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
