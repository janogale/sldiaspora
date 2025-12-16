"use client";
import Link from "next/link";
import { useState } from "react";
import { menuList } from "../data/menu";
interface Props {
  logo?: string;
}
const Header = ({ logo }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="fix">
        <div
          className={`offcanvas__area ${isMobileMenuOpen ? "info-open" : ""}`}
        >
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    {logo ? (
                      <img src={logo} alt="logo not found" />
                    ) : (
                      <img src={logo} alt="logo not found" />
                    )}
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button
                    onClick={toggleMobileMenu}
                    className="offcanvas-close-icon animation--flip"
                  >
                    <span className="offcanvas-m-lines">
                      <span className="offcanvas-m-line line--1"></span>
                      <span className="offcanvas-m-line line--2"></span>
                      <span className="offcanvas-m-line line--3"></span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="mobile-menu fix">
                {/* The meanmenu plugin would populate this, for now, we can duplicate the menu */}
                <div className="main-menu">
                  <nav>
                    <ul>
                      {menuList.map((item, idx) => (
                        <li
                          key={item.label + idx}
                          className="has-dropdown has-dropdown-2"
                        >
                          {item.children ? (
                            <>
                              <a href={item.path}>{item.label}</a>
                              <ul className="submenu">
                                {item.children.map((sub, subIdx) => (
                                  <li key={sub.label + subIdx}>
                                    <Link href={sub.path}>{sub.label}</Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <Link href={item.path}>{item.label}</Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
              {/* <div className="offcanvas__social">
                <h3 className="offcanvas__title mb-20">Subscribe & Follow</h3>
                <ul>
                  <li>
                    <a href="https://www.facebook.com/">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://pinterest.com/">
                      <i className="fa-brands fa-pinterest-p"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://youtube.com/">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://linkedin.com/">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="offcanvas__btn d-sm-none">
                <div className="header__btn-wrap">
                  <Link className="rr-btn btn-hover-white" href="/contact">
                    Purchase Now
                    <span>
                      <i className="fa-regular fa-angle-right"></i>
                    </span>
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay ${
          isMobileMenuOpen ? "overlay-open" : ""
        }`}
        onClick={toggleMobileMenu}
      ></div>
      <div className="offcanvas__overlay-white"></div>
      <header>
        <div id="header-sticky" className="header__area header-1">
          <div className="header-container">
            <div className="mega__menu-wrapper p-relative">
              <div className="header__main">
                <div className="header__left">
                  <div className="header__logo">
                    <a href="index.html">
                      <div className="logo">
                        <img
                          src="assets/imgs/logo/logo.png"
                          alt="logo not found"
                        />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="header__middle">
                  <div className="mean__menu-wrapper d-none d-xl-block">
                    <div className="main-menu">
                      <nav id="mobile-menu">
                        <ul>
                          {" "}
                          {menuList.map((item, idx) => {
                            const isActive =
                              typeof window !== "undefined" &&
                              window.location.pathname === item.path;
                            return (
                              <li
                                key={item.label + idx}
                                className={`${
                                  item.children
                                    ? " has-dropdown has-dropdown-2"
                                    : ""
                                }${isActive ? " active" : ""}`}
                              >
                                {item.children ? (
                                  <>
                                    <Link
                                      href={item.path}
                                      className={isActive ? "active" : ""}
                                    >
                                      {item.label}
                                    </Link>
                                    <ul className="submenu">
                                      {item.children.map((sub, subIdx) => {
                                        const isSubActive =
                                          typeof window !== "undefined" &&
                                          window.location.pathname === sub.path;
                                        return (
                                          <li
                                            key={sub.label + subIdx}
                                            className={
                                              isSubActive ? "active" : ""
                                            }
                                          >
                                            <Link
                                              href={sub.path}
                                              className={
                                                isSubActive ? "active" : ""
                                              }
                                            >
                                              {sub.label}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </>
                                ) : (
                                  <Link
                                    href={item.path}
                                    className={isActive ? "active" : ""}
                                  >
                                    {item.label}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="header__right">
                  <div className="header__action d-flex align-items-center">
                    <div className="header__btn-wrap d-none d-sm-inline-flex">
                      <Link
                        href="/register"
                        className="rr-btn"
                        style={{ background: "red" }}
                      >
                        <span>Become a Member</span>{" "}
                        <i
                          className="fa-solid fa-arrow-right"
                          style={{ marginTop: "0.2rem" }}
                        ></i>
                      </Link>
                    </div>
                    <div className="header__hamburger ml-20 d-xl-none">
                      <div className="sidebar__toggle">
                        <button onClick={toggleMobileMenu} className="bar-icon">
                          <span></span>
                          <span></span>
                          <span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
