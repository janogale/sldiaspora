"use client";

export default function DepartmentHierarchy() {
  return (
    <section className="department-hierarchy-section ">
      <div className="container">
        <div className="department-hierarchy-wrap">
          {/* Modern SVG org-chart for larger screens */}
          <svg
            className="desktop-only"
            viewBox="0 0 900 360"
            width="100%"
            height="auto"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Department structure hierarchy"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodOpacity="0.12"
                />
              </filter>
              <linearGradient id="greenGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#1db35a" />
                <stop offset="100%" stopColor="#0fa04a" />
              </linearGradient>
            </defs>

            {/* Top box */}
            <rect
              className="top-box"
              x="300"
              y="10"
              rx="20"
              ry="20"
              width="300"
              height="56"
              fill="url(#greenGrad)"
              filter="url(#shadow)"
            />
            <g>
              <text
                x="450"
                y="38"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="18"
                fill="#fff"
                textAnchor="middle"
                fontWeight="700"
              >
                Department Director
              </text>
            </g>

            {/* Connectors (junction + arms) */}
            <line
              x1="450"
              y1="66"
              x2="450"
              y2="120"
              stroke="#0f9a54"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="450"
              y1="120"
              x2="210"
              y2="120"
              stroke="#0f9a54"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="450"
              y1="120"
              x2="690"
              y2="120"
              stroke="#0f9a54"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Middle boxes */}
            <rect
              className="mid-box"
              x="90"
              y="140"
              rx="14"
              ry="14"
              width="240"
              height="48"
              fill="#fff"
              stroke="#e9e9e9"
            />
            <text
              x="210"
              y="170"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="15"
              fill="#333"
              textAnchor="middle"
            >
              Deputy
            </text>

            <rect
              className="mid-box"
              x="570"
              y="140"
              rx="14"
              ry="14"
              width="240"
              height="48"
              fill="#fff"
              stroke="#e9e9e9"
            />
            <text
              x="690"
              y="170"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="15"
              fill="#333"
              textAnchor="middle"
            >
              Technical Advisor
            </text>

            {/* Lower junction */}
            <line
              x1="450"
              y1="120"
              x2="450"
              y2="200"
              stroke="#33a77a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="150"
              y1="200"
              x2="750"
              y2="200"
              stroke="#33a77a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="150"
              y1="200"
              x2="150"
              y2="220"
              stroke="#33a77a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="450"
              y1="200"
              x2="450"
              y2="220"
              stroke="#33a77a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="750"
              y1="200"
              x2="750"
              y2="220"
              stroke="#33a77a"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Bottom boxes */}
            <rect
              className="bottom-box"
              x="30"
              y="220"
              rx="12"
              ry="12"
              width="240"
              height="64"
              fill="#fff"
              stroke="#f0f0f0"
              filter="url(#shadow)"
            />
            <text
              x="150"
              y="258"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="14"
              fill="#444"
              textAnchor="middle"
            >
              Diaspora Engagement
            </text>
            <text
              x="150"
              y="276"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="12"
              fill="#777"
              textAnchor="middle"
            >
              Section
            </text>

            <rect
              className="bottom-box"
              x="330"
              y="220"
              rx="12"
              ry="12"
              width="240"
              height="64"
              fill="#fff"
              stroke="#f0f0f0"
              filter="url(#shadow)"
            />
            <text
              x="450"
              y="258"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="14"
              fill="#444"
              textAnchor="middle"
            >
              Community Development
            </text>
            <text
              x="450"
              y="276"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="12"
              fill="#777"
              textAnchor="middle"
            >
              Section
            </text>

            <rect
              className="bottom-box"
              x="630"
              y="220"
              rx="12"
              ry="12"
              width="240"
              height="64"
              fill="#fff"
              stroke="#f0f0f0"
              filter="url(#shadow)"
            />
            <text
              x="750"
              y="258"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="14"
              fill="#444"
              textAnchor="middle"
            >
              Digital Outreach & Research
            </text>
            <text
              x="750"
              y="276"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="12"
              fill="#777"
              textAnchor="middle"
            >
              Section
            </text>
          </svg>

          {/* Mobile-friendly stacked layout (visible on small screens) */}
          <div className="mobile-only">
            <div className="mobile-card top">
              <div className="label">Department Director</div>
            </div>
            <div className="mobile-connector" />
            <div className="mobile-row">
              <div className="mobile-card">Deputy</div>
              <div className="mobile-card">Technical Advisor</div>
            </div>
            <div className="mobile-connector" />
            <div className="mobile-col">
              <div className="mobile-card">Diaspora Engagement Section</div>
              <div className="mobile-card">Community Development Section</div>
              <div className="mobile-card">
                Digital Outreach & Research Section
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .department-hierarchy-section {
            padding: 3rem 0;
          }
          .department-hierarchy-wrap {
            max-width: 1100px;
            margin: 0 auto;
          }

          /* desktop SVG styles */
          .desktop-only {
            display: block;
          }
          .top-box {
            transition: transform 200ms ease, box-shadow 200ms ease;
          }
          .mid-box,
          .bottom-box {
            transition: transform 180ms ease, box-shadow 180ms ease;
          }
          .top-box:hover,
          .mid-box:hover,
          .bottom-box:hover {
            transform: translateY(-4px) scale(1.01);
          }

          /* mobile fallback hidden by default */
          .mobile-only {
            display: none;
          }

          /* mobile card styles */
          .mobile-card {
            background: #fff;
            border-radius: 12px;
            padding: 0.9rem 1rem;
            margin: 0.6rem 0;
            box-shadow: 0 6px 18px rgba(18, 18, 18, 0.06);
            text-align: center;
            font-family: Inter, Arial, sans-serif;
            color: #1f2937;
            font-weight: 600;
          }
          .mobile-card.top {
            background: linear-gradient(90deg, #1db35a, #0fa04a);
            color: #fff;
          }
          .mobile-row {
            display: flex;
            gap: 0.75rem;
          }
          .mobile-row .mobile-card {
            flex: 1;
          }
          .mobile-col {
            display: flex;
            flex-direction: column;
          }
          .mobile-connector {
            height: 16px;
            width: 4px;
            background: linear-gradient(#dbeadf, #dbeadf);
            margin: 8px auto;
            border-radius: 3px;
          }

          /* Responsive behavior */
          @media (max-width: 880px) {
            .desktop-only {
              display: none;
            }
            .mobile-only {
              display: block;
            }
          }

          @media (max-width: 420px) {
            .mobile-row {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
