import Link from "next/link";
interface Props {
  title: string;
}
function BreadCamp({ title }: Props) {
  return (
    <main style={{ marginBottom: "10rem " }}>
      <div
        className="breadcrumb__area  breadcrumb-space overflow-hidden custom-width position-relative z-1"
        // data-background="/assets/imgs/breadcrumb/breadcrumb.png"
        style={{ background: "#006D21" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-12">
              <div className="breadcrumb__content">
                <div className="breadcrumb__title-wrapper mb-15 mb-sm-10 mb-xs-5">
                  <h1
                    className="breadcrumb__title color-white wow fadeInLeft animated"
                    data-wow-delay=".2s"
                  >
                    {title}
                  </h1>
                </div>
                <div
                  className="breadcrumb__menu wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <nav>
                    <ul>
                      <li>
                        <span>
                          <Link href="/">Home</Link>
                        </span>
                      </li>
                      <li className="active">
                        <span>{title}</span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BreadCamp;
