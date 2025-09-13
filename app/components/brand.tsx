
import React from 'react';

const Brand = () => {
    return (
        <section className="main-brand__area gray-bg section-space-bottom-2">
            <div className="brand__area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="swiper brand__active wow fadeIn" data-wow-delay=".3s">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="brand__item text-center  wow fadeIn animated" data-wow-delay=".1s">
                                            <div className="brand__thumb">
                                                <a href="https://segment.com/"><img className="img-fluid" src="/assets/imgs/brands/black-brands/black-brands1.png" alt="image not found" /></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="brand__item text-center  wow fadeIn animated" data-wow-delay=".2s">
                                            <div className="brand__thumb">
                                                <a href="https://www.splunk.com/"><img className="img-fluid" src="/assets/imgs/brands/black-brands/black-brands2.png" alt="image not found" /></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="brand__item text-center  wow fadeIn animated" data-wow-delay=".3s">
                                            <div className="brand__thumb">
                                                <a href="https://www.hubspot.com/"><img className="img-fluid" src="/assets/imgs/brands/black-brands/black-brands3.png" alt="image not found" /></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="brand__item text-center  wow fadeIn animated" data-wow-delay=".4s">
                                            <div className="brand__thumb">
                                                <a href="https://app.asana.com/"><img className="img-fluid" src="/assets/imgs/brands/black-brands/black-brands4.png" alt="image not found" /></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="brand__item text-center  wow fadeIn animated" data-wow-delay=".5s">
                                            <div className="brand__thumb">
                                                <a href="https://www.airtasker.com/"><img className="img-fluid" src="/assets/imgs/brands/black-brands/black-brands5.png" alt="image not found" /></a>
                                            </div>
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

export default Brand;
