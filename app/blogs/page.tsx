import Link from "next/link";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { getArticles, getAssetUrl } from "@/lib/articles";

export const dynamic = "force-dynamic";

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

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

export default async function Page() {
  const articles = await getArticles();

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="News & Development" />

      <section className="blog__area section-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {articles.length === 0 ? (
                <p>No articles available yet.</p>
              ) : (
                articles.map((article) => {
                  const excerpt = stripHtml(article.content).slice(0, 280);
                  const imageUrl = article.featuredImage
                    ? getAssetUrl(article.featuredImage)
                    : "/assets/imgs/blog/blog-1img.png";

                  return (
                    <div className="blog__content mb-80" key={article.id}>
                      <div className="blog__content-thumb">
                        <img src={imageUrl} alt={article.title} />
                      </div>

                      <ul className="blog__content-meta mt-20 d-flex">
                        <li>
                          <Link href={`/blogs/${article.id}`}>By Admin</Link>
                        </li>
                        <li>
                          <span>{formatDate(article.dateCreated)}</span>
                        </li>
                      </ul>

                      <div className="blog__content-text mt-20">
                        <h2 className="blog__content-text-title">
                          <Link href={`/blogs/${article.id}`}>{article.title}</Link>
                        </h2>
                        <p>{excerpt}{excerpt.length >= 280 ? "..." : ""}</p>
                        <Link href={`/blogs/${article.id}`} className="rr-btn mt-40">
                          Learn More
                        </Link>
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
