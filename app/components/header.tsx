"use client";
import Link from "next/link";
import { useState } from "react";
import { menuList } from "../data/menu";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Offcanvas area start */}
      <div className="fix">
        <div
          className={`offcanvas__area ${isMobileMenuOpen ? "info-open" : ""}`}
        >
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top d-flex justify-content-between align-items-center mb-40">
                <div className="offcanvas__logo">
                  <Link href="/" onClick={toggleMobileMenu}>
                    <img
                      src="/assets/imgs/logo/logo.png"
                      alt="logo"
                      style={{ maxWidth: "180px", height: "auto" }}
                    />
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
              <div className="mobile-menu fix mb-30">
                <div className="maisn-menu">
                  <nav>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {menuList.map((item, idx) => (
                        <li
                          key={item.label + idx}
                          className={item.children ? "has-dropdown" : ""}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                            padding: "0",
                          }}
                        >
                          {item.children ? (
                            <>
                              <Link
                                href={item.path}
                                onClick={toggleMobileMenu}
                                style={{
                                  display: "block",
                                  padding: "15px 0",
                                  color: "#ffffff",
                                  textDecoration: "none",
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  transition: "color 0.3s",
                                }}
                              >
                                {item.label}
                              </Link>
                              <ul
                                className="submenu"
                                style={{
                                  listStyle: "none",
                                  padding: "0 0 10px 20px",
                                  margin: 0,
                                  background: "rgba(255,255,255,0.05)",
                                }}
                              >
                                {item.children.map((sub, subIdx) => (
                                  <li
                                    key={sub.label + subIdx}
                                    style={{ padding: 0 }}
                                  >
                                    <Link
                                      href={sub.path}
                                      onClick={toggleMobileMenu}
                                      style={{
                                        display: "block",
                                        padding: "10px 0",
                                        color: "#cccccc",
                                        textDecoration: "none",
                                        fontSize: "15px",
                                        transition: "color 0.3s",
                                      }}
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <Link
                              href={item.path}
                              onClick={toggleMobileMenu}
                              style={{
                                display: "block",
                                padding: "15px 0",
                                color: "#ffffff",
                                textDecoration: "none",
                                fontSize: "16px",
                                fontWeight: "500",
                                transition: "color 0.3s",
                              }}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="d-grid gap-2 p-6">
                <Link
                  href="https://admin.sldiaspora.org/admin/register"
                  onClick={toggleMobileMenu}
                  className="btn btn-lg cta-register-btn d-flex align-items-center justify-content-center gap-2 shadow-lg"
                >
                  <span className="fw-bold text-uppercase ls-1 h-20">
                    Become a Member
                  </span>
                  <i className="fa-solid fa-arrow-right animate-arrow"></i>
                </Link>
              </div>
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
      {/* Offcanvas area end */}

      {/* Header area start */}
      <header>
        <div id="header-sticky" className="header__area header2 rs-sticky-2">
          <div className="container">
            <div className="mega__menu-wrapper header2__bg p-relative">
              <div className="header__main header2__main">
                <div className="header__left header2__left">
                  <div className="header__logo">
                    <Link href="/">
                      <div className="logo">
                        <img
                          src="/assets/imgs/logo/logo.png"
                          alt="logo not found"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="header__middle">
                  <div className="mean__menu-wrapper d-none d-xl-block">
                    <div className="main-menu  header2__menu">
                      <nav id="mobile-menu">
                        <ul>
                          {" "}
                          {menuList.map((item, idx) => {
                            const isActive = pathname === item.path;
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
                                          pathname === sub.path;
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
                <div className="header__right header2__right">
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

      <div id="popup-search-box">
        <div className="box-inner-wrap d-flex align-items-center">
          <form id="form" action="#" method="get" role="search">
            <input
              id="popup-search"
              type="text"
              name="s"
              placeholder="Type keywords here..."
            />
          </form>
          <div className="search-close">
            <i className="fa-sharp fa-regular fa-xmark"></i>
          </div>
        </div>
      </div>
      {/* Header area end */}
    </>
  );
};

export default Header;
