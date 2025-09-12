import React from 'react';
import Link from 'next/link';

const ChooseUs = () => {
  return (
    <section className="choose-us2__area choose-us bottom-160 p-relative gray-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-6">
            <div className="choose-us2__thumb position-relative">
              <div className="choose-us2__thumb-media">
                <div className="choose-us2__thumb-media-border"></div>
                <img src="/assets/imgs/choose-us/choose-home-2/home-2-choose-img.png" alt="img not found" data-tilt />
              </div>
              <div className="choose-us__text choose-us2__text" data-parallax='{"y": -160, "smoothness": 15}'>
                <h3 className="counter__item-title"><span className="odometer" data-count="25">0</span></h3>
                <p>Years Of <br /> Experience</p>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="choose-us2__content mt-lg-40 mt-md-40 mt-sm-40 mt-xs-40">
              <div className="section__title-wrapper mb-20">
                <h6 className="section__title-wrapper-black-subtitle mb-10 wow fadeInLeft animated" data-wow-delay=".2s">Why Choose Us
                  <svg width="52" height="10" viewBox="0 0 52 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3795_96)">
                      <path d="M47.2095 2.14437C46.4096 2.36766 45.5874 2.50135 44.758 2.54299L38.0745 3.26714C36.5625 3.43986 35.0713 3.76256 33.6232 4.23048C32.834 4.49614 32.0748 4.84349 31.3577 5.2669C30.5815 5.78994 29.7739 6.26475 28.9394 6.68864C28.4366 6.92402 27.8868 7.04215 27.3317 7.03411C26.7204 6.99856 26.1425 6.7438 25.704 6.3166C24.8602 5.44628 24.6277 4.38993 24.0763 3.71228C23.8482 3.37951 23.505 3.14288 23.1129 3.04791C22.6926 2.95474 22.2543 2.98472 21.8506 3.13427C20.9442 3.46398 20.1839 4.10423 19.7047 4.94135C19.1267 5.79839 18.675 6.775 18.0172 7.69183C17.3771 8.67698 16.4285 9.42226 15.3199 9.81116C14.738 9.97733 14.1213 9.97733 13.5394 9.81116C12.9881 9.64765 12.4799 9.36403 12.0512 8.9807C11.2848 8.27735 10.6875 7.40973 10.3039 6.44282C9.91861 5.55257 9.63957 4.68889 9.25423 3.93151C8.81236 2.89622 8.01001 2.05634 6.99598 1.56765C5.98195 1.07897 4.82509 0.974642 3.74 1.27404C3.16364 1.41933 2.62491 1.6859 2.15977 2.05594C1.69463 2.42599 1.3138 2.89102 1.04267 3.41996C0.609026 4.23627 0.40251 5.15404 0.444721 6.07742C0.461366 6.66905 0.587529 7.25247 0.816785 7.79813C0.969589 8.18346 1.07589 8.37613 1.04267 8.40271C1.00945 8.42928 0.849998 8.26318 0.624113 7.89778C0.297997 7.3528 0.0960956 6.74258 0.0328167 6.11063C-0.094422 5.09968 0.0716196 4.07346 0.511162 3.1542C0.798973 2.52884 1.21785 1.97266 1.73939 1.52332C2.26094 1.07399 2.87299 0.742013 3.53404 0.549886C4.3414 0.314234 5.19125 0.262331 6.02128 0.397987C6.85131 0.533642 7.64045 0.85342 8.33077 1.33384C9.08192 1.89515 9.6841 2.63192 10.0847 3.47975C10.5165 4.31021 10.8221 5.18716 11.2008 6.01762C11.535 6.84506 12.053 7.58567 12.7156 8.18347C13.0179 8.47409 13.3907 8.68086 13.7973 8.78339C14.204 8.88592 14.6303 8.88064 15.0342 8.7681C15.9058 8.44143 16.6489 7.84273 17.1536 7.06068C17.7316 6.2568 18.1833 5.28018 18.8145 4.33678C19.1355 3.84764 19.5172 3.40117 19.9505 3.00804C20.4071 2.61118 20.9377 2.30862 21.5118 2.11779C22.1043 1.91517 22.7412 1.88068 23.3521 2.01814C23.971..."/>
                      <path d="M45.4762 6.2697C45.4231 6.13018 46.1406 5.7382 47.2235 5.08712C47.7683 4.76158 48.4127 4.36296 49.1036 3.89126C49.4491 3.65873 49.768 3.39963 50.1666 3.13388C50.3373 3.0178 50.4954 2.88421 50.6383 2.73527C50.7579 2.61795 50.8527 2.47789 50.9173 2.32336C50.9506 2.19713 50.9173 2.20377 50.9173 2.15726C50.821 2.06916 50.7009 2.01139 50.5719 1.99117L49.283 1.64571C48.4592 1.41982 47.7218 1.20058 47.1039 0.981341C45.8682 0.582721 45.1108 0.263819 45.1573 0.124302C45.2038 -0.0152149 46.001 0.0379361 47.2833 0.250534C47.9476 0.356832 48.6784 0.502993 49.5155 0.675728L50.8443 0.968051C51.184 1.02987 51.4955 1.19726 51.7345 1.4464C51.8826 1.61431 51.9774 1.82242 52.0069 2.04432C52.0341 2.24825 52.0113 2.45574 51.9405 2.6489C51.8291 2.94985 51.6521 3.2222 51.4223 3.44614C51.235 3.63879 51.0254 3.80831 50.7978 3.95105C50.4124 4.23009 50.0205 4.47591 49.6484 4.70179C48.9845 5.09883 48.2916 5.44528 47.5756 5.7382C46.3399 6.25641 45.5294 6.40257 45.4762 6.2697Z" fill="#034833"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3795_96">
                        <rect width="52" height="9.86585" fill="white" transform="translate(0 0.0664062)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </h6>
                <h2 className="section__title-wrapper-title wow fadeInLeft animated" data-wow-delay=".3s">Experiencing Traditions  Cultural Immersion </h2>
              </div>
            </div>
            <div className="choose-us2__list wow fadeInLeft animated" data-wow-delay=".4s">
              <div className="choose-us2__list-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="choose-us2__list-text">
                <h4>Marketing Services</h4>
                <p>Et purus duis sollicitudin dignissim habitant. Egestas nulla quis <br /> venenatis cras sed eu massa loren ipsum</p>
              </div>
            </div>
            <div className="choose-us2__list mt-15 wow fadeInLeft animated" data-wow-delay=".5s">
              <div className="choose-us2__list-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="choose-us2__list-text">
                <h4>IT Maintenance</h4>
                <p>Et purus duis sollicitudin dignissim habitant. Egestas nulla quis <br /> venenatis cras sed eu massa loren ipsum</p>
              </div>
            </div>
            <div className="choose-us__button choose-us__button-2 mt-35">
              <div className="choose-us__button-btn wow fadeInLeft animated" data-wow-delay=".6s">
                <Link href="/story-details" className="choose-us__button-btn-2">Read More <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
              <div className="choose-us__button-text wow fadeInLeft animated" data-wow-delay=".7s">
                <div className="choose-us__button-text-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="choose-us__button-text-number">
                  <h6>Need help?</h6>
                  <a href="tel:8085550111">(808) 555-0111</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;