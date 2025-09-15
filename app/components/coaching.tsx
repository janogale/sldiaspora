import Link from "next/link";

const Coaching = () => {
  return (
    <section className="gray-bg overflow-hidden position-relative">
      <div className="coaching__area white-bg position-relative overflow-hidden section-space-top bottom custom-width border">
        <div className="container">
          <div className="row">
            <div className="section__title-wrapper text-center mb-60">
              <h6
                className="section__title-wrapper-center-subtitle mb-10 wow fadeInLeft animated"
                data-wow-delay=".6s"
              >
                <svg
                  width="52"
                  height="10"
                  viewBox="0 0 52 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3795_207)">
                    <path d="M4.78951 2.14437C5.58938 2.36766 6.41161 2.50135 7.24102 2.54299L13.9245 3.26714C15.4366 3.43986 16.9277 3.76256 18.3758 4.23048C19.165 4.49614 19.9243 4.84349 20.6413 5.2669C21.4175 5.78994 22.2251 6.26475 23.0596 6.68864C23.5625 6.92402 24.1122 7.04215 24.6674 7.03411C25.2786 6.99856 25.8565 6.7438 26.2951 6.3166C27.1388 5.44628 27.3713 4.38993 27.9228 3.71228C28.1509 3.37951 28.494 3.14288 28.8861 3.04791C29.3064 2.95474 29.7447 2.98472 30.1484 3.13427C31.0548 3.46398 31.8151 4.10423 32.2943 4.94135C32.8723 5.79839 33.3241 6.775 33.9818 7.69183C34.6219 8.67698 35.5705 9.42226 36.6791 9.81116C37.261 9.97733 37.8777 9.97733 38.4596 9.81116C39.0109 9.64765 39.5192 9.36403 39.9478 8.9807C40.7142 8.27735 41.3115 7.40973 41.6951 6.44282C42.0804 5.55257 42.3595 4.68889 42.7448 3.93151C43.1867 2.89622 43.989 2.05634 45.003 1.56765C46.0171 1.07897 47.1739 0.974642 48.259 1.27404C48.8354 1.41933 49.3741 1.6859 49.8393 2.05594C50.3044 2.42599 50.6852 2.89102 50.9564 3.41996C51.39 4.23627 51.5965 5.15404 51.5543 6.07742C51.5377 6.66905 51.4115 7.25247 51.1822 7.79813C51.0294 8.18346 50.9231 8.37613 50.9564 8.40271C50.9896 8.42928 51.149 8.26318 51.3749 7.89778C51.701 7.3528 51.9029 6.74258 51.9662 6.11063C52.0934 5.09968 51.9274 4.07346 51.4879 3.1542C51.2001 2.52884 50.7812 1.97266 50.2596 1.52332C49.7381 1.07399 49.126 0.742013 48.465 0.549886C47.6576 0.314234 46.8078 0.262331 45.9777 0.397987C45.1477 0.533642 44.3586 0.85342 43.6682 1.33384C42.9171 1.89515 42.3149 2.63192 41.9143 3.47975C41.4825 4.31021 41.1769 5.18716 40.7982 6.01762C40.464 6.84506 39.946 7.58567 39.2834 8.18347C38.9811 8.47409 38.6083 8.68086 38.2017 8.78339C37.7951 8.88592 37.3687 8.88064 36.9648 8.7681C36.0933 8.44143 35.3501 7.84273 34.8455 7.06068C34.2675 6.2568 33.8157 5.28018 33.1845 4.33678C32.8635 3.84764 32.4818 3.40117 32.0485 3.00804C31.5919 2.61118 31.0613 2.30862 30.4872 2.11779C29.8948 1.91517 29.2578 1.88068 28.6469 2.01814C28.0271 2.17131 27.4813..." />
                    <path
                      d="M6.5238 6.2697C6.57695 6.13018 5.85945 5.7382 4.77653 5.08712C4.23175 4.76158 3.5873 4.36296 2.89636 3.89126C2.55089 3.65873 2.23199 3.39963 1.83337 3.13388C1.66268 3.0178 1.50459 2.88421 1.36167 2.73527C1.24212 2.61795 1.14726 2.47789 1.08265 2.32336C1.04943 2.19713 1.08265 2.20377 1.08265 2.15726C1.17899 2.06916 1.29914 2.01139 1.42811 1.99117L2.71699 1.64571C3.5408 1.41982 4.27825 1.20058 4.89611 0.981341C6.13183 0.582721 6.88921 0.263819 6.8427 0.124302C6.7962 -0.0152149 5.99897 0.0379361 4.71674 0.250534C4.05237 0.356832 3.32156 0.502993 2.48446 0.675728L1.15572 0.968051C0.816039 1.02987 0.504512 1.19726 0.265472 1.4464C0.117425 1.61431 0.0226135 1.82242 -0.00692081 2.04432C-0.0341129 2.24825 -0.0113082 2.45574 0.0595198 2.6489C0.170868 2.94985 0.347895 3.2222 0.577725 3.44614C0.76497 3.63879 0.974636 3.80831 1.20223 3.95105C1.58756 4.23009 1.97953 4.47591 2.35157 4.70179C3.0155 5.09883 3.70842 5.44528 4.42442 5.7382C5.66014 6.25641 6.47065 6.40257 6.5238 6.2697Z"
                      fill="#034833"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3795_207">
                      <rect
                        width="52"
                        height="9.86585"
                        fill="white"
                        transform="matrix(-1 0 0 1 52 0.0664062)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Coaching support
                <svg
                  width="52"
                  height="10"
                  viewBox="0 0 52 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3795_103)">
                    <path d="M47.2095 2.14437C46.4096 2.36766 45.5874 2.50135 44.758 2.54299L38.0745 3.26714C36.5625 3.43986 35.0713 3.76256 33.6232 4.23048C32.834 4.49614 32.0748 4.84349 31.3577 5.2669C30.5815 5.78994 29.7739 6.26475 28.9394 6.68864C28.4366 6.92402 27.8868 7.04215 27.3317 7.03411C26.7204 6.99856 26.1425 6.7438 25.704 6.3166C24.8602 5.44628 24.6277 4.38993 24.0763 3.71228C23.8482 3.37951 23.505 3.14288 23.1129 3.04791C22.6926 2.95474 22.2543 2.98472 21.8506 3.13427C20.9442 3.46398 20.1839 4.10423 19.7047 4.94135C19.1267 5.79839 18.675 6.775 18.0172 7.69183C17.3771 8.67698 16.4285 9.42226 15.3199 9.81116C14.738 9.97733 14.1213 9.97733 13.5394 9.81116C12.9881 9.64765 12.4799 9.36403 12.0512 8.9807C11.2848 8.27735 10.6875 7.40973 10.3039 6.44282C9.91861 5.55257 9.63957 4.68889 9.25423 3.93151C8.81236 2.89622 8.01001 2.05634 6.99598 1.56765C5.98195 1.07897 4.82509 0.974642 3.74 1.27404C3.16364 1.41933 2.62491 1.6859 2.15977 2.05594C1.69463 2.42599 1.3138 2.89102 1.04267 3.41996C0.609026 4.23627 0.40251 5.15404 0.444721 6.07742C0.461366 6.66905 0.587529 7.25247 0.816785 7.79813C0.969589 8.18346 1.07589 8.37613 1.04267 8.40271C1.00945 8.42928 0.849998 8.26318 0.624113 7.89778C0.297997 7.3528 0.0960956 6.74258 0.0328167 6.11063C-0.094422 5.09968 0.0716196 4.07346 0.511162 3.1542C0.798973 2.52884 1.21785 1.97266 1.73939 1.52332C2.26094 1.07399 2.87299 0.742013 3.53404 0.549886C4.3414 0.314234 5.19125 0.262331 6.02128 0.397987C6.85131 0.533642 7.64045 0.85342 8.33077 1.33384C9.08192 1.89515 9.6841 2.63192 10.0847 3.47975C10.5165 4.31021 10.8221 5.18716 11.2008 6.01762C11.535 6.84506 12.053 7.58567 12.7156 8.18347C13.0179 8.47409 13.3907 8.68086 13.7973 8.78339C14.204 8.88592 14.6303 8.88064 15.0342 8.7681C15.9058 8.44143 16.6489 7.84273 17.1536 7.06068C17.7316 6.2568 18.1833 5.28018 18.8145 4.33678C19.1355 3.84764 19.5172 3.40117 19.9505 3.00804C20.4071 2.61118 20.9377 2.30862 21.5118 2.11779C22.1043 1.91517 22.7412 1.88068 23.3521 2.01814C23.971..." />
                    <path
                      d="M45.4762 6.2697C45.4231 6.13018 46.1406 5.7382 47.2235 5.08712C47.7683 4.76158 48.4127 4.36296 49.1036 3.89126C49.4491 3.65873 49.768 3.39963 50.1666 3.13388C50.3373 3.0178 50.4954 2.88421 50.6383 2.73527C50.7579 2.61795 50.8527 2.47789 50.9173 2.32336C50.9506 2.19713 50.9173 2.20377 50.9173 2.15726C50.821 2.06916 50.7009 2.01139 50.5719 1.99117L49.283 1.64571C48.4592 1.41982 47.7218 1.20058 47.1039 0.981341C45.8682 0.582721 45.1108 0.263819 45.1573 0.124302C45.2038 -0.0152149 46.001 0.0379361 47.2833 0.250534C47.9476 0.356832 48.6784 0.502993 49.5155 0.675728L50.8443 0.968051C51.184 1.02987 51.4955 1.19726 51.7345 1.4464C51.8826 1.61431 51.9774 1.82242 52.0069 2.04432C52.0341 2.24825 52.0113 2.45574 51.9405 2.6489C51.8291 2.94985 51.6521 3.2222 51.4223 3.44614C51.235 3.63879 51.0254 3.80831 50.7978 3.95105C50.4124 4.23009 50.0205 4.47591 49.6484 4.70179C48.9845 5.09883 48.2916 5.44528 47.5756 5.7382C46.3399 6.25641 45.5294 6.40257 45.4762 6.2697Z"
                      fill="#034833"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3795_103">
                      <rect
                        width="52"
                        height="9.86585"
                        fill="white"
                        transform="translate(0 0.0664062)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </h6>
              <h2
                className="section__title-wrapper-title wow fadeInLeft animated"
                data-wow-delay=".8s"
              >
                Nature&apos;s Playground <br /> Exploring the Great{" "}
              </h2>
            </div>
          </div>
          <div className="row mb-minus-30">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div
                className="coaching__item mb-30 d-flex align-items-center wow fadeInLeft animated"
                data-wow-delay=".2s"
              >
                <div className="coaching__item-midea">
                  <img
                    className="img-fluid"
                    src="/assets/imgs/coaching/coaching-card-img1.png"
                    alt="img not found"
                    data-tilt
                  />
                </div>
                <div className="coaching__item-content">
                  <h4 className="coaching__item-content-title mb-20">
                    Dualugo Coaching
                  </h4>
                  <p>There are many variati of passages of engineer</p>
                  <Link href="/coaching-details">
                    Read More
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div
                className="coaching__item mb-30 d-flex align-items-center wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                <div className="coaching__item-midea">
                  <img
                    className="img-fluid"
                    src="/assets/imgs/coaching/coaching-card-img2.png"
                    alt="img not found"
                    data-tilt
                  />
                </div>
                <div className="coaching__item-content">
                  <h4 className="coaching__item-content-title mb-20">
                    IELTS Coaching
                  </h4>
                  <p>There are many variati of passages of engineer</p>
                  <Link href="/coaching-details">
                    Read More
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div
                className="coaching__item mb-30 d-flex align-items-center wow fadeInLeft animated"
                data-wow-delay=".4s"
              >
                <div className="coaching__item-midea">
                  <img
                    className="img-fluid"
                    src="/assets/imgs/coaching/coaching-card-img3.png"
                    alt="img not found"
                    data-tilt
                  />
                </div>
                <div className="coaching__item-content">
                  <h4 className="coaching__item-content-title mb-20">
                    TOFEL Coaching
                  </h4>
                  <p>There are many variati of passages of engineer</p>
                  <Link href="/coaching-details">
                    Read More
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div
                className="coaching__item mb-30 d-flex align-items-center wow fadeInLeft animated"
                data-wow-delay=".5s"
              >
                <div className="coaching__item-midea">
                  <img
                    className="img-fluid"
                    src="/assets/imgs/coaching/coaching-card-img4.png"
                    alt="img not found"
                    data-tilt
                  />
                </div>
                <div className="coaching__item-content">
                  <h4 className="coaching__item-content-title mb-20">
                    IELTS Listing
                  </h4>
                  <p>There are many variati of passages of engineer</p>
                  <Link href="/coaching-details">
                    Read More
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div
                className="coaching__item mb-30 d-flex align-items-center wow fadeInLeft animated"
                data-wow-delay=".6s"
              >
                <div className="coaching__item-midea">
                  <img
                    className="img-fluid"
                    src="/assets/imgs/coaching/coaching-card-img5.png"
                    alt="img not found"
                    data-tilt
                  />
                </div>
                <div className="coaching__item-content">
                  <h4 className="coaching__item-content-title mb-20">
                    OET Coaching
                  </h4>
                  <p>There are many variati of passages of engineer</p>
                  <Link href="/coaching-details">
                    Read More
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div
                className="coaching__item mb-30 d-flex align-items-center wow fadeInLeft animated"
                data-wow-delay=".7s"
              >
                <div className="coaching__item-midea">
                  <img
                    className="img-fluid"
                    src="/assets/imgs/coaching/coaching-card-img6.png"
                    alt="img not found"
                    data-tilt
                  />
                </div>
                <div className="coaching__item-content">
                  <h4 className="coaching__item-content-title mb-20">
                    Language Coahing
                  </h4>
                  <p>There are many variati of passages of engineer</p>
                  <Link href="/coaching-details">
                    Read More
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="coaching__bottom-btn">
              <Link href="/coaching" className="rr-btn">
                All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coaching;
