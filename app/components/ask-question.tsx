const AskQuestion = () => {
  return (
    <section className="ask-question__area section-space gray-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="ask-question__media d-flex">
              <div className="ask-question__media-thumb">
                <div
                  className="ask-question__media-thumb-img wow fadeInLeft animated"
                  data-wow-delay=".2s"
                >
                  <img
                    src="/assets/imgs/ask-qustion/ask-qustion-left-img.png"
                    alt="img not found"
                  />
                </div>
                <div
                  className="ask-question__text mt-30 wow fadeInLeft animated"
                  data-wow-delay=".3s"
                >
                  <div className="ask-question__text-icon">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_3800_183)">
                        <path d="M35.3072 23.9574C36.623 20.0798 36.5882 15.8711 35.2084 12.0158C33.8286 8.16051 31.1851 4.88547 27.7077 2.72333C24.2303 0.561187 20.1237 -0.360844 16.0558 0.107201C11.9879 0.575246 8.19801 2.40583 5.30255 5.30122C2.40708 8.1966 0.576392 11.9864 0.108235 16.0543C-0.359922 20.1222 0.561996 24.2289 2.72404 27.7063C4.88608 31.1837 8.16106 33.8274 12.0163 35.2073C15.8715 36.5872 20.0802 36.6221 23.9579 35.3064C24.556 36.5083 25.4315 37.5506 26.512 38.3474C27.5925 39.1442 28.847 39.6725 30.172 39.8888C31.497 40.1051 32.8544 40.0031 34.1321 39.5912C35.4099 39.1794 36.5714 38.4696 37.5207 37.5203C38.47 36.571 39.1799 35.4095 39.5918 34.1318C40.0036 32.854 40.1057 31.4966 39.8894 30.1716C39.6732 28.8466 39.1449 27.5921 38.3482 26.5116C37.5514 25.4311 36.5091 24.5556 35.3072 23.9574ZM34.2969 23.5324C32.2171 22.8112 29.9378 22.9314 27.9454 23.8674L28.7469 22.4683C28.7943 22.3855 28.8192 22.2918 28.8191 22.1964V19.6105L30.5185 17.8624C30.6178 17.7603 30.6733 17.6235 30.6732 17.4811V15.2564C30.6732 15.137 30.6341 15.0209 30.5618 14.9258C30.4896 14.8307 30.3882 14.7619 30.2732 14.7299L27.2732 13.8936L26.1638 11.723C26.1245 11.6462 26.0676 11.5798 25.9978 11.5292C25.9279 11.4786 25.8471 11.4452 25.7619 11.4317L21.5088 10.7627V10.3452L27.25 9.07454L29.3954 11.2183C29.498 11.3208 29.6371 11.3785 29.7822 11.3786H33.776C35.441 15.2269 35.6265 19.5544 34.2969 23.5311V23.5324ZM33.2529 10.2861H30.0085L27.8125 8.08923C27.7475 8.02429 27.6672 7.97675 27.5791 7.95097C27.4909 7.9252 27.3976 7.92202 27.3079 7.94173L20.8438 9.37204C20.7223 9.39898 20.6136 9.46654 20.5356 9.56358C20.4577 9.66062 20.4152 9.78133 20.415 9.90579V11.2302C20.4151 11.3604 20.4617 11.4864 20.5463 11.5854C20.631 11.6844 20.7482 11.7499 20.8769 11.7702L25.3166 12.4683L26.4082 14.6045C26.4425 14.6718 26.4905 14.7313 26.549 14.7791C26.6076 14.8269 26.6754 14.8621 26.7482 14.8824L29.5794 15.6714V17.2589L27.88 19.007C27.7808 19.1092 27.7254 19.2459 27.7254 19.3883V22.0505L25...." />
                        <path
                          d="M37.3885 28.444L36.6932 27.7484C36.354 27.4093 35.894 27.2188 35.4144 27.2188C34.9348 27.2188 34.4748 27.4093 34.1357 27.7484L32.6769 29.2069L30.1894 28.6309C29.8556 28.5526 29.5073 28.561 29.1778 28.6554C28.8482 28.7498 28.5482 28.9271 28.3066 29.1703L27.7319 29.7453C27.6689 29.8082 27.6222 29.8856 27.5958 29.9707C27.5695 30.0557 27.5644 30.146 27.5809 30.2335C27.5974 30.321 27.6351 30.4032 27.6906 30.4728C27.7461 30.5425 27.8178 30.5975 27.8994 30.6331L30.2322 31.6519L29.3135 32.5703L27.1288 32.7728C27.0019 32.7841 26.883 32.8393 26.7925 32.929L25.6775 34.0437C25.6102 34.1112 25.5617 34.195 25.5367 34.2869C25.5117 34.3789 25.5112 34.4757 25.5352 34.5679C25.5591 34.6602 25.6067 34.7445 25.6733 34.8127C25.7399 34.8808 25.8231 34.9304 25.9147 34.9565L28.6435 35.7328C29.1694 35.8824 29.7256 35.8888 30.2548 35.7515C30.7841 35.6141 31.267 35.338 31.6538 34.9515L37.3885 29.2169C37.4393 29.1661 37.4796 29.1059 37.5071 29.0395C37.5346 28.9732 37.5488 28.9021 37.5488 28.8303C37.5488 28.7585 37.5346 28.6874 37.5071 28.6211C37.4796 28.5547 37.4393 28.4948 37.3885 28.444ZM30.8803 34.1784C30.6315 34.4272 30.3207 34.6051 29.98 34.6936C29.6394 34.7821 29.2814 34.7781 28.9428 34.6819L27.1097 34.1606L27.4266 33.8437L29.6113 33.6409C29.7382 33.6298 29.8572 33.5745 29.9475 33.4847L31.5725 31.8597C31.6355 31.7967 31.6821 31.7194 31.7084 31.6343C31.7346 31.5492 31.7397 31.459 31.7232 31.3716C31.7066 31.2841 31.669 31.202 31.6135 31.1324C31.558 31.0628 31.4863 31.0078 31.4047 30.9722L29.0722 29.9531L29.0803 29.945C29.1909 29.8335 29.3283 29.7522 29.4792 29.709C29.6302 29.6658 29.7897 29.662 29.9425 29.6981L32.726 30.3425C32.8163 30.3634 32.9106 30.361 32.9998 30.3354C33.0889 30.3098 33.1701 30.2619 33.2357 30.1962L34.9091 28.5234C35.0451 28.3932 35.2261 28.3205 35.4144 28.3205C35.6027 28.3205 35.7837 28.3932 35.9197 28.5234L36.2285 28.8322L30.8803 34.1784Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3800_183">
                          <rect width="40" height="40" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="ask-question__text-title">
                    <h5>Daily Activity</h5>
                    <p>Loream is ispam</p>
                  </div>
                </div>
              </div>
              <div className="ask-question__media-img">
                <div
                  className="ask-question__media-img-img1 wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <img
                    src="/assets/imgs/ask-qustion/ask-qustion-right-top-img.png"
                    alt="img not found"
                  />
                </div>
                <div
                  className="ask-question__media-img-img2 wow fadeInLeft animated"
                  data-wow-delay=".5s"
                >
                  <img
                    src="/assets/imgs/ask-qustion/ask-qustion-right-bottom-img.png"
                    alt="img not found"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="section__title-wrapper mb-40">
              <h6
                className="section__title-wrapper-black-subtitle mb-10 wow fadeInLeft animated"
                data-wow-delay=".2s"
              >
                Ask Question
                <svg
                  width="52"
                  height="10"
                  viewBox="0 0 52 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3795_113)">
                    <path d="M47.2095 2.14437C46.4096 2.36766 45.5874 2.50135 44.758 2.54299L38.0745 3.26714C36.5625 3.43986 35.0713 3.76256 33.6232 4.23048C32.834 4.49614 32.0748 4.84349 31.3577 5.2669C30.5815 5.78994 29.7739 6.26475 28.9394 6.68864C28.4366 6.92402 27.8868 7.04215 27.3317 7.03411C26.7204 6.99856 26.1425 6.7438 25.704 6.3166C24.8602 5.44628 24.6277 4.38993 24.0763 3.71228C23.8482 3.37951 23.505 3.14288 23.1129 3.04791C22.6926 2.95474 22.2543 2.98472 21.8506 3.13427C20.9442 3.46398 20.1839 4.10423 19.7047 4.94135C19.1267 5.79839 18.675 6.775 18.0172 7.69183C17.3771 8.67698 16.4285 9.42226 15.3199 9.81116C14.738 9.97733 14.1213 9.97733 13.5394 9.81116C12.9881 9.64765 12.4799 9.36403 12.0512 8.9807C11.2848 8.27735 10.6875 7.40973 10.3039 6.44282C9.91861 5.55257 9.63957 4.68889 9.25423 3.93151C8.81236 2.89622 8.01001 2.05634 6.99598 1.56765C5.98195 1.07897 4.82509 0.974642 3.74 1.27404C3.16364 1.41933 2.62491 1.6859 2.15977 2.05594C1.69463 2.42599 1.3138 2.89102 1.04267 3.41996C0.609026 4.23627 0.40251 5.15404 0.444721 6.07742C0.461366 6.66905 0.587529 7.25247 0.816785 7.79813C0.969589 8.18346 1.07589 8.37613 1.04267 8.40271C1.00945 8.42928 0.849998 8.26318 0.624113 7.89778C0.297997 7.3528 0.0960956 6.74258 0.0328167 6.11063C-0.094422 5.09968 0.0716196 4.07346 0.511162 3.1542C0.798973 2.52884 1.21785 1.97266 1.73939 1.52332C2.26094 1.07399 2.87299 0.742013 3.53404 0.549886C4.3414 0.314234 5.19125 0.262331 6.02128 0.397987C6.85131 0.533642 7.64045 0.85342 8.33077 1.33384C9.08192 1.89515 9.6841 2.63192 10.0847 3.47975C10.5165 4.31021 10.8221 5.18716 11.2008 6.01762C11.535 6.84506 12.053 7.58567 12.7156 8.18347C13.0179 8.47409 13.3907 8.68086 13.7973 8.78339C14.204 8.88592 14.6303 8.88064 15.0342 8.7681C15.9058 8.44143 16.6489 7.84273 17.1536 7.06068C17.7316 6.2568 18.1833 5.28018 18.8145 4.33678C19.1355 3.84764 19.5172 3.40117 19.9505 3.00804C20.4071 2.61118 20.9377 2.30862 21.5118 2.11779C22.1043 1.91517 22.7412 1.88068 23.3521 2.01814C23.9719 2..." />
                    <path
                      d="M45.4762 6.2697C45.4231 6.13018 46.1406 5.7382 47.2235 5.08712C47.7683 4.76158 48.4127 4.36296 49.1036 3.89126C49.4491 3.65873 49.768 3.39963 50.1666 3.13388C50.3373 3.0178 50.4954 2.88421 50.6383 2.73527C50.7579 2.61795 50.8527 2.47789 50.9173 2.32336C50.9506 2.19713 50.9173 2.20377 50.9173 2.15726C50.821 2.06916 50.7009 2.01139 50.5719 1.99117L49.283 1.64571C48.4592 1.41982 47.7218 1.20058 47.1039 0.981341C45.8682 0.582721 45.1108 0.263819 45.1573 0.124302C45.2038 -0.0152149 46.001 0.0379361 47.2833 0.250534C47.9476 0.356832 48.6784 0.502993 49.5155 0.675728L50.8443 0.968051C51.184 1.02987 51.4955 1.19726 51.7345 1.4464C51.8826 1.61431 51.9774 1.82242 52.0069 2.04432C52.0341 2.24825 52.0113 2.45574 51.9405 2.6489C51.8291 2.94985 51.6521 3.2222 51.4223 3.44614C51.235 3.63879 51.0254 3.80831 50.7978 3.95105C50.4124 4.23009 50.0205 4.47591 49.6484 4.70179C48.9845 5.09883 48.2916 5.44528 47.5756 5.7382C46.3399 6.25641 45.5294 6.40257 45.4762 6.2697Z"
                      fill="#034833"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3795_113">
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
                data-wow-delay=".3s"
              >
                Wanderlust Chronicles <br /> Tales from Around
              </h2>
            </div>
            <div className="ask-question__faq">
              <div className="accordion" id="accordionExample">
                <div
                  className="accordion-item ask-question__faq-item wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <h5 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="true"
                      aria-controls="collapseThree"
                    >
                      What services do you offer?
                    </button>
                  </h5>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        Lorem Ipsum is simply dummy text the printing and typese{" "}
                        <br /> Lorem Ipsum has been the industry&apos;s standard
                        dummy text ever
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="accordion-item ask-question__faq-item wow fadeInLeft animated"
                  data-wow-delay=".5s"
                >
                  <h5 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      How long does it take for you to complete a project?
                    </button>
                  </h5>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        Lorem Ipsum is simply dummy text the printing and typese{" "}
                        <br /> Lorem Ipsum has been the industry&apos;s standard
                        dummy text ever
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="accordion-item ask-question__faq-item wow fadeInLeft animated"
                  data-wow-delay=".6s"
                >
                  <h5 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapse"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
                    >
                      How much does it cost to work with your agency?
                    </button>
                  </h5>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        Lorem Ipsum is simply dummy text the printing and typese{" "}
                        <br /> Lorem Ipsum has been the industry&apos;s standard
                        dummy text ever
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskQuestion;
