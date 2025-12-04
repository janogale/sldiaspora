import BreadCamp from "../components/BreadCamp";
import Header2 from "../components/header2";
import RegisterForm from "../components/register-form";

export const metadata = {
  title: "Register - Somaliland Diaspora Department",
  description: "Register to engage with the Somaliland Diaspora Department",
};

export default function RegisterPage() {
  return (
    <main>
      <Header2 />
      <BreadCamp title="Register" />
      <section className="pt-100 pb-100 overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section__title-wrapper text-center mb-60">
                <h6
                  className="ction__title-wrapper-subtitle"
                  data-wow-delay=".2s"
                >
                  Registration Process
                  <svg
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ms-2"
                  >
                    <g clip-path="url(#clip0_3843_1169)">
                      <path
                        d="M4.92578 10.3748L6.49623 9.68052L5.62583 9.07031L4.92578 10.3748Z"
                        fill="#83CD20"
                      />
                      <path
                        d="M4.92578 10.3743L5.00073 8L13.9088 0L5.66505 9.1113L4.92578 10.3743Z"
                        fill="#83CD20"
                      />
                      <path d="M5 8L13.908 0L0 6.22704L5 8Z" fill="#83CD20" />
                      <path
                        d="M5.66406 9.1113L9.95686 12L13.9078 0L5.66406 9.1113Z"
                        fill="#034833"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3843_1169">
                        <rect width="13.908" height="12" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </h6>
                <h2
                  className="section__title-wrapper-title wow fadeInLeft animated"
                  data-wow-delay=".3s"
                >
                  Join the Somaliland Diaspora Community
                </h2>
                <p className="section__title-wrapper-subtitle mt-3">
                  Complete your registration in 3 simple steps to get started
                  with our services.
                </p>
              </div>

              <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12">
                  <RegisterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
