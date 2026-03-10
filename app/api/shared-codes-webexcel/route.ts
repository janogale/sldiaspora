import { NextResponse } from "next/server";
import { listSharedCodes } from "@/lib/member-directus";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

export async function GET() {
  try {
    const codes = await listSharedCodes();

    const countryOptions = Array.from(
      new Set(
        codes
          .map((item) => item.country.trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))
      )
    );

    const cityOptions = Array.from(
      new Set(
        codes
          .map((item) => item.city.trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))
      )
    );

    const rows = codes
      .map((item, index) => {
        const association = item.association || "-";
        const contactPerson = item.contactPerson || "-";
        const phone = item.phone || "-";
        const email = item.email || "-";
        const country = item.country || "-";
        const city = item.city || "-";

        const searchText = [association, contactPerson, phone, email, country, city]
          .join(" ")
          .toLowerCase();

        return `
          <tr
            data-country="${escapeHtml(country.toLowerCase())}"
            data-city="${escapeHtml(city.toLowerCase())}"
            data-search="${escapeHtml(searchText)}"
          >
            <td>${index + 1}</td>
            <td>${escapeHtml(association)}</td>
            <td>${escapeHtml(contactPerson)}</td>
            <td>${escapeHtml(phone)}</td>
            <td>${email !== "-" ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : "-"}</td>
            <td>${escapeHtml(country)}</td>
            <td>${escapeHtml(city)}</td>
          </tr>
        `;
      })
      .join("");

    const countrySelectOptions = countryOptions
      .map((country) => `<option value="${escapeHtml(country.toLowerCase())}">${escapeHtml(country)}</option>`)
      .join("");

    const citySelectOptions = cityOptions
      .map((city) => `<option value="${escapeHtml(city.toLowerCase())}">${escapeHtml(city)}</option>`)
      .join("");

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Shared Codes Directory</title>
  <style>
    :root {
      --bg: #f2f7f4;
      --surface: #ffffff;
      --muted: #5f6e66;
      --line: #d4e2da;
      --head: #0f5132;
      --accent: #166534;
      --accent-soft: #eaf6ef;
      --table-head: #edf4f0;
      --font: "Poppins", "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      font-family: var(--font);
      margin: 0;
      background:
        radial-gradient(circle at 8% 0%, #dff2e7 0%, transparent 36%),
        radial-gradient(circle at 95% 8%, #d9efe4 0%, transparent 32%),
        var(--bg);
      color: #0f172a;
      min-height: 100vh;
      padding: 20px 12px;
      position: relative;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image: url('/logo-main.png');
      background-repeat: no-repeat;
      background-position: center 68%;
      background-size: min(46vw, 380px);
      opacity: 0.06;
      pointer-events: none;
      z-index: 0;
      filter: saturate(0.85);
    }
    .wrap {
      max-width: 1250px;
      margin: 0 auto;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 35px rgba(15, 81, 50, 0.12);
      position: relative;
      z-index: 1;
    }
    .head {
      padding: 20px;
      border-bottom: 1px solid var(--line);
      background: linear-gradient(135deg, #edf8f1 0%, #ffffff 72%);
    }
    .head h1 {
      margin: 0;
      font-size: clamp(1.15rem, 2vw, 1.7rem);
      color: var(--head);
      letter-spacing: 0.2px;
    }
    .head p {
      margin: 7px 0 0;
      color: var(--muted);
      font-size: 0.96rem;
    }
    .controls {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto auto;
      gap: 10px;
      padding: 14px 20px 16px;
      border-bottom: 1px solid var(--line);
      background: #fbfdfc;
      align-items: end;
    }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label {
      font-size: 0.8rem;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: #526159;
      font-weight: 700;
    }
    input, select, button {
      font: inherit;
      border-radius: 10px;
      border: 1px solid var(--line);
      padding: 10px 12px;
      min-height: 42px;
    }
    input:focus, select:focus {
      outline: 2px solid #c5e7d1;
      border-color: #91c9a8;
    }
    button {
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.16s ease, opacity 0.16s ease;
    }
    button:hover { transform: translateY(-1px); }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-soft { background: var(--accent-soft); color: #0f5132; border: 1px solid #b8dcc7; }
    .summary {
      padding: 0 20px 12px;
      color: #5e6f66;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .table-wrap { overflow: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 900px; }
    th, td {
      border-top: 1px solid #e3ede8;
      padding: 10px 12px;
      font-size: 0.92rem;
      text-align: left;
      vertical-align: top;
    }
    th {
      position: sticky;
      top: 0;
      background: var(--table-head);
      color: #1d3d2f;
      font-weight: 700;
      z-index: 1;
    }
    tbody tr:nth-child(even) { background: #fcfefd; }
    tbody tr:hover { background: #f3faf6; }
    a { color: #166534; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .empty { padding: 22px; color: #64748b; }
    .no-results { display: none; text-align: center; color: #6b7280; padding: 16px; font-weight: 600; }
    @media (max-width: 980px) {
      .controls { grid-template-columns: 1fr 1fr; }
      .controls .field:first-child { grid-column: 1 / -1; }
    }
    @media (max-width: 640px) {
      body { padding: 8px; }
      .controls { grid-template-columns: 1fr; }
      .head, .controls, .summary { padding-left: 12px; padding-right: 12px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1>Contact Directory of Somaliland Diaspora Community Associations</h1>
      <p>Professional public directory view. Code values are hidden in this list.</p>
    </div>
    ${codes.length > 0
      ? `<div class="controls">
          <div class="field">
            <label for="searchInput">Search</label>
            <input id="searchInput" type="text" placeholder="Association, contact, phone, email, country, city" />
          </div>
          <div class="field">
            <label for="countryFilter">Country</label>
            <select id="countryFilter">
              <option value="">All Countries</option>
              ${countrySelectOptions}
            </select>
          </div>
          <div class="field">
            <label for="cityFilter">City</label>
            <select id="cityFilter">
              <option value="">All Cities</option>
              ${citySelectOptions}
            </select>
          </div>
          <button id="resetBtn" class="btn-soft" type="button">Reset</button>
          <button id="exportBtn" class="btn-primary" type="button">Export CSV</button>
        </div>
        <div class="summary" id="summaryLine"></div>
        <div class="table-wrap">
          <table id="directoryTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Association</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Country</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div id="noResults" class="no-results">No matching associations found for the selected filters.</div>
        <script>
          (() => {
            const searchInput = document.getElementById("searchInput");
            const countryFilter = document.getElementById("countryFilter");
            const cityFilter = document.getElementById("cityFilter");
            const resetBtn = document.getElementById("resetBtn");
            const exportBtn = document.getElementById("exportBtn");
            const summaryLine = document.getElementById("summaryLine");
            const noResults = document.getElementById("noResults");
            const table = document.getElementById("directoryTable");
            const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
            const total = bodyRows.length;

            const applyFilters = () => {
              const q = (searchInput.value || "").trim().toLowerCase();
              const country = (countryFilter.value || "").toLowerCase();
              const city = (cityFilter.value || "").toLowerCase();

              let visible = 0;

              bodyRows.forEach((row) => {
                const rowCountry = (row.dataset.country || "").toLowerCase();
                const rowCity = (row.dataset.city || "").toLowerCase();
                const rowSearch = (row.dataset.search || "").toLowerCase();

                const matchesQuery = !q || rowSearch.includes(q);
                const matchesCountry = !country || rowCountry === country;
                const matchesCity = !city || rowCity === city;

                const show = matchesQuery && matchesCountry && matchesCity;
                row.style.display = show ? "" : "none";
                if (show) visible += 1;
              });

              summaryLine.textContent = "Showing " + visible + " of " + total + " associations";
              noResults.style.display = visible === 0 ? "block" : "none";
            };

            resetBtn.addEventListener("click", () => {
              searchInput.value = "";
              countryFilter.value = "";
              cityFilter.value = "";
              applyFilters();
            });

            exportBtn.addEventListener("click", () => {
              const visibleRows = bodyRows.filter((row) => row.style.display !== "none");
              const headers = ["#", "Association", "Contact Person", "Phone", "Email", "Country", "City"];
              const csvRows = [headers.join(",")];

              visibleRows.forEach((row) => {
                const cells = Array.from(row.querySelectorAll("td")).map((cell) => {
                  const value = (cell.textContent || "").trim().replace(/"/g, '""');
                  return '"' + value + '"';
                });
                csvRows.push(cells.join(","));
              });

              const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "somaliland-association-directory.csv";
              link.click();
              URL.revokeObjectURL(link.href);
            });

            searchInput.addEventListener("input", applyFilters);
            countryFilter.addEventListener("change", applyFilters);
            cityFilter.addEventListener("change", applyFilters);

            applyFilters();
          })();
        </script>`
      : `<div class="empty">No codes available yet.</div>`}
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Shared code web excel file not found." },
      { status: 404 }
    );
  }
}
