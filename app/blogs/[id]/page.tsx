import BreadCamp from "@/app/components/BreadCamp";
import Header from "@/app/components/header";
import { getArticleById, getAssetUrl } from "@/lib/articles";
import { notFound } from "next/navigation";

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

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="News Details" />

      <section className="blog-details__area section-space overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-details__content">
                {featuredUrl ? (
                  <div className="blog-details__content-thumb">
                    <img src={featuredUrl} alt={article.title} />
                  </div>
                ) : null}

                <ul className="blog-details__content-meta mt-20 d-flex">
                  <li>
                    <span>By Admin</span>
                  </li>
                  <li>
                    <span>{formatDate(article.articleDate || article.dateCreated || article.dateUpdated)}</span>
                  </li>
                </ul>

                <div className="blog-details__content-text mt-20">
                  <h2 className="blog-details__content-text-title mb-20">{article.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {pdfUrl ? (
                  <div className="mt-30">
                    <h3 className="mb-15">PDF Document</h3>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="rr-btn">
                      Open PDF in New Tab
                    </a>
                    <div className="mt-20" style={{ border: "1px solid #d7e4dd", borderRadius: "12px", overflow: "hidden" }}>
                      <iframe
                        src={pdfUrl}
                        title={`${article.title} PDF`}
                        style={{ width: "100%", height: "780px", border: "0" }}
                      />
                    </div>
                  </div>
                ) : null}

                {article.images.length > 0 ? (
                  <div className="mt-40">
                    <h3 className="mb-20">Images</h3>
                    <div className="row g-3">
                      {article.images.map((imageId) => (
                        <div className="col-md-6" key={imageId}>
                          <img
                            src={getAssetUrl(imageId)}
                            alt={article.title}
                            style={{ width: "100%", borderRadius: "10px" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
