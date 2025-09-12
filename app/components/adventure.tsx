import React from 'react';
import Link from 'next/link';

const Adventure = () => {
  return (
    <section className="adventure__area section-space-top gray-bg">
      <div className="container">
        <div className="row">
          <div className="section-title2 mb-60">
            <div className="section-title2__wrapper">
              <span className="section-title2__wrapper-subtitle wow fadeInLeft animated" data-wow-delay=".2s">Available Countries
                <svg width="52" height="10" viewBox="0 0 52 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_3931_71)">
                    <path d="M47.2095 2.18344C46.4096 2.40672 45.5874 2.54041 44.758 2.58205L38.0745 3.30621C36.5625 3.47892 35.0713 3.80163 33.6232 4.26955C32.834 4.5352 32.0748 4.88255 31.3577 5.30596C30.5815 5.829 29.7739 6.30381 28.9394 6.7277C28.4366 6.96308 27.8868 7.08121 27.3317 7.07318C26.7204 7.03762 26.1425 6.78287 25.704 6.35566C24.8602 5.48534 24.6277 4.429 24.0763 3.75134C23.8482 3.41858 23.505 3.18194 23.1129 3.08697C22.6926 2.9938 22.2543 3.02378 21.8506 3.17334C20.9442 3.50304 20.1839 4.14329 19.7047 4.98041C19.1267 5.83745 18.675 6.81407 18.0172 7.73089C17.3771 8.71604 16.4285 9.46132 15.3199 9.85023C14.738 10.0164 14.1213 10.0164 13.5394 9.85023C12.9881 9.68671 12.4799 9.4031 12.0512 9.01977C11.2848 8.31641 10.6875 7.44879 10.3039 6.48188C9.91861 5.59163 9.63957 4.72795 9.25423 3.97057C8.81236 2.93529 8.01001 2.0954 6.99598 1.60672C5.98195 1.11803 4.82509 1.0137 3.74 1.31311C3.16364 1.45839 2.62491 1.72496 2.15977 2.09501C1.69463 2.46505 1.3138 2.93008 1.04267 3.45902C0.609026 4.27533 0.40251 5.19311 0.444721 6.11649C0.461366 6.70812 0.587529 7.29153 0.816785 7.83719C0.969589 8.22253 1.07589 8.4152 1.04267 8.44177C1.00945 8.46835 0.849998 8.30225 0.624113 7.93685C0.297997 7.39186 0.0960956 6.78164 0.0328167 6.1497C-0.094422 5.13874 0.0716196 4.11252 0.511162 3.19327C0.798973 2.56791 1.21785 2.01172 1.73939 1.56239C2.26094 1.11305 2.87299 0.781076 3.53404 0.588948C4.3414 0.353297 5.19125 0.301393 6.02128 0.437049C6.85131 0.572705 7.64045 0.892483 8.33077 1.37291C9.08192 1.93421 9.6841 2.67099 10.0847 3.51881C10.5165 4.34927 10.8221 5.22623 11.2008 6.05669C11.535 6.88412 12.053 7.62474 12.7156 8.22253C13.0179 8.51315 13.3907 8.71992 13.7973 8.82245C14.204 8.92498 14.6303 8.91971 15.0342 8.80716C15.9058 8.48049 16.6489 7.8818 17.1536 7.09975C17.7316 6.29586 18.1833 5.31924 18.8145 4.37584C19.1355 3.8867 19.5172 3.44023 19.9505 3.0471C20.4071 2.65024 20.9377 2.34768 21.5118 2.15685C22.1043 1.95424 22.7412 1.91975 23.3521 2.0572C23.9719 2.2..."/>
                    <path d="M45.4762 6.30876C45.4231 6.16924 46.1406 5.77727 47.2235 5.12619C47.7683 4.80065 48.4127 4.40202 49.1036 3.93032C49.4491 3.6978 49.768 3.43869 50.1666 3.17295C50.3373 3.05687 50.4954 2.92327 50.6383 2.77433C50.7579 2.65702 50.8527 2.51696 50.9173 2.36242C50.9506 2.23619 50.9173 2.24283 50.9173 2.19633C50.821 2.10822 50.7009 2.05045 50.5719 2.03023L49.283 1.68477C48.4592 1.45889 47.7218 1.23964 47.1039 1.0204C45.8682 0.621784 45.1108 0.302882 45.1573 0.163365C45.2038 0.0238476 46.001 0.0769986 47.2833 0.289596C47.9476 0.395895 48.6784 0.542055 49.5155 0.71479L50.8443 1.00711C51.184 1.06894 51.4955 1.23633 51.7345 1.48546C51.8826 1.65337 51.9774 1.86148 52.0069 2.08338C52.0341 2.28732 52.0113 2.4948 51.9405 2.68796C51.8291 2.98891 51.6521 3.26126 51.4223 3.4852C51.235 3.67786 51.0254 3.84737 50.7978 3.99011C50.4124 4.26915 50.0205 4.51497 49.6484 4.74085C48.9845 5.1379 48.2916 5.48435 47.5756 5.77726C46.3399 6.29547 45.5294 6.44163 45.4762 6.30876Z" fill="#034833"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_3931_71">
                      <rect width="52" height="9.86585" fill="white" transform="translate(0 0.105469)"/>
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <h2 className="section-title2__wrapper-title  wow fadeInLeft animated" data-wow-delay=".3s">Urban Escapes City <br /> Hopping Adventures</h2>
            </div>
            <div className="section-title2__button wow fadeInLeft animated" data-wow-delay="1s">
              <Link href="/countrie">View More <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
        <div className="row mb-minus-30">
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="adventure__item white-bg mb-30 wow fadeInLeft animated" data-wow-delay=".4s">
              <div className="adventure__item-icon mb-20">
                <img src="/assets/imgs/home-1/adventure/adventure-img1.png" alt="img not found" />
              </div>
              <div className="adventure__item-content">
                <h3>Canada</h3>
                <div className="adventure__item-content-list list-2 mt-20">
                  <ul>
                    <li><i className="fa-solid fa-check"></i>Mistakes To Avoid</li>
                    <li><i className="fa-solid fa-check"></i>Your Startup</li>
                    <li><i className="fa-solid fa-check"></i>Knew About Fonts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="adventure__item white-bg mb-30 wow fadeInLeft animated" data-wow-delay=".5s">
              <div className="adventure__item-icon mb-20">
                <img src="/assets/imgs/home-1/adventure/adventure-img2.png" alt="img not found" />
              </div>
              <div className="adventure__item-content">
                <h3>Bangladesh</h3>
                <div className="adventure__item-content-list list-2 mt-20">
                  <ul>
                    <li><i className="fa-solid fa-check"></i>Mistakes To Avoid</li>
                    <li><i className="fa-solid fa-check"></i>Your Startup</li>
                    <li><i className="fa-solid fa-check"></i>Knew About Fonts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="adventure__item white-bg mb-30 wow fadeInLeft animated" data-wow-delay=".6s">
              <div className="adventure__item-icon mb-20">
                <img src="/assets/imgs/home-1/adventure/adventure-img3.png" alt="img not found" />
              </div>
              <div className="adventure__item-content">
                <h3>Australia</h3>
                <div className="adventure__item-content-list list-2 mt-20">
                  <ul>
                    <li><i className="fa-solid fa-check"></i>Mistakes To Avoid</li>
                    <li><i className="fa-solid fa-check"></i>Your Startup</li>
                    <li><i className="fa-solid fa-check"></i>Knew About Fonts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div className="adventure__item white-bg mb-30 wow fadeInLeft animated" data-wow-delay=".7s">
              <div className="adventure__item-icon mb-20">
                <img src="/assets/imgs/home-1/adventure/adventure-img4.png" alt="img not found" />
              </div>
              <div className="adventure__item-content">
                <h3>United Kingdom</h3>
                <div className="adventure__item-content-list list-2 mt-20">
                  <ul>
                    <li><i className="fa-solid fa-check"></i>Mistakes To Avoid</li>
                    <li><i className="fa-solid fa-check"></i>Your Startup</li>
                    <li><i className="fa-solid fa-check"></i>Knew About Fonts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Adventure;