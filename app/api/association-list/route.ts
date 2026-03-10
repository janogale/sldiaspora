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
  <title>Association List | Somaliland Diaspora</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="icon" type="image/svg+xml" href="/assets/imgs/logo/favicon.svg" />
  <meta name="theme-color" content="#0f766e" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #edf5f1;
      --surface: #ffffff;
      --surface-soft: #f7fbf9;
      --ink: #0f172a;
      --muted: #56706b;
      --line: #d4e4de;
      --head: #0f5e48;
      --accent: #116149;
      --accent-2: #0f766e;
      --accent-soft: #e6f4ee;
      --table-head: #ecf5f1;
      --font-body: "Plus Jakarta Sans", "Segoe UI", sans-serif;
      --font-head: "Manrope", "Plus Jakarta Sans", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--font-body);
      color: var(--ink);
      min-height: 100vh;
      padding: 20px 14px;
      background:
        radial-gradient(1100px 500px at -10% -5%, #d7eee3 0%, transparent 55%),
        radial-gradient(900px 420px at 110% 0%, #d4e9df 0%, transparent 52%),
        linear-gradient(180deg, #f2f8f5 0%, #eef5f2 100%);
      position: relative;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image: url('/assets/imgs/logo/logo.png');
      background-repeat: no-repeat;
      background-position: center 65%;
      background-size: min(42vw, 360px);
      opacity: 0.045;
      pointer-events: none;
      z-index: 0;
    }
    .wrap {
      max-width: 1260px;
      margin: 0 auto;
      border: 1px solid var(--line);
      border-radius: 20px;
      overflow: hidden;
      background: var(--surface);
      box-shadow: 0 22px 44px rgba(19, 83, 62, 0.14);
      position: relative;
      z-index: 1;
    }
    .head {
      padding: 26px 24px 18px;
      border-bottom: 1px solid var(--line);
      background:
        linear-gradient(120deg, rgba(24, 113, 81, 0.08) 0%, transparent 50%),
        linear-gradient(180deg, #fcfefd 0%, #f8fcfa 100%);
    }
    .head h1 {
      margin: 0;
      font-family: var(--font-head);
      font-size: clamp(1.28rem, 2.1vw, 1.95rem);
      line-height: 1.2;
      letter-spacing: 0.1px;
      color: #0f4f39;
    }
    .head p {
      margin: 9px 0 0;
      color: var(--muted);
      font-size: 0.98rem;
      max-width: 820px;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-top: 14px;
    }
    .chip {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.25px;
      text-transform: uppercase;
      color: #0f5c42;
      background: #e6f4ed;
      border: 1px solid #c8e2d6;
      padding: 6px 10px;
      border-radius: 999px;
    }
    .controls {
      display: grid;
      grid-template-columns: minmax(260px, 2fr) 1fr 1fr auto;
      gap: 12px;
      align-items: end;
      padding: 16px 24px 18px;
      border-bottom: 1px solid var(--line);
      background: var(--surface-soft);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .field label {
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #54706a;
    }
    input, select, button {
      font: inherit;
      min-height: 45px;
      border-radius: 12px;
      border: 1px solid #cfe0d8;
      background: #ffffff;
      padding: 10px 12px;
    }
    input::placeholder { color: #849790; }
    input:focus, select:focus {
      outline: 2px solid #d2ede1;
      border-color: #94c9b2;
      box-shadow: 0 0 0 3px rgba(17, 97, 73, 0.12);
    }
    .btn-soft {
      border: 1px solid #b8dbc9;
      background: linear-gradient(180deg, #f0faf5 0%, #e5f4ec 100%);
      color: #11563e;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-soft:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 16px rgba(17, 97, 73, 0.14);
    }
    .summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 24px;
      font-size: 0.9rem;
      color: #516963;
      font-weight: 600;
      background: #fbfefd;
      border-bottom: 1px solid #e5efea;
    }
    .summary strong {
      color: #0f513a;
      font-weight: 800;
    }
    .table-wrap {
      overflow: auto;
      max-height: min(72vh, 900px);
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 910px;
    }
    thead th {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--table-head);
      color: #19483a;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      font-weight: 800;
      text-align: left;
      padding: 12px 12px;
      border-bottom: 1px solid #d8e8e0;
    }
    tbody td {
      padding: 13px 12px;
      border-bottom: 1px solid #e7f0ec;
      font-size: 0.93rem;
      color: #1f2937;
      vertical-align: top;
    }
    tbody tr { transition: background-color 0.16s ease; }
    tbody tr:nth-child(even) { background: #fbfefc; }
    tbody tr:hover { background: #edf7f2; }
    tbody td:first-child {
      width: 56px;
      font-weight: 700;
      color: #355c4e;
    }
    a {
      color: var(--accent-2);
      font-weight: 600;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
    .empty {
      padding: 28px 24px;
      color: #69817b;
      font-weight: 600;
    }
    .no-results {
      display: none;
      text-align: center;
      color: #60756f;
      padding: 18px 16px;
      font-weight: 700;
      border-top: 1px solid #e5efea;
      background: #fafdfb;
    }
    @media (max-width: 1024px) {
      .controls { grid-template-columns: 1fr 1fr; }
      .controls .field:first-child { grid-column: 1 / -1; }
    }
    @media (max-width: 700px) {
      body { padding: 8px; }
      .wrap { border-radius: 14px; }
      .head,
      .controls,
      .summary { padding-left: 12px; padding-right: 12px; }
      .controls { grid-template-columns: 1fr; }
      .summary { flex-direction: column; align-items: flex-start; gap: 4px; }
      .table-wrap { max-height: none; }
      table { min-width: 760px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1>Association List of Somaliland Diaspora Communities</h1>
      <p>Explore verified diaspora association contacts by country and city. Verification code values stay hidden in this public list.</p>
      <div class="meta">
        <span class="chip">${codes.length} Associations</span>
        <span class="chip">${countryOptions.length} Countries</span>
        <span class="chip">${cityOptions.length} Cities</span>
      </div>
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
        </div>
        <div class="summary">
          <div id="summaryLine"></div>
          <div><strong>Live Filtering Enabled</strong></div>
        </div>
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
            const summaryLine = document.getElementById("summaryLine");
            const noResults = document.getElementById("noResults");
            const table = document.getElementById("directoryTable");
            const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
            const total = bodyRows.length;

            const cityMap = bodyRows.reduce((acc, row) => {
              const country = (row.dataset.country || "").trim();
              const city = (row.dataset.city || "").trim();
              if (!city) return acc;
              const key = country || "__all__";
              if (!acc[key]) acc[key] = new Set();
              acc[key].add(city);
              return acc;
            }, {});

            const allCities = Array.from(new Set(bodyRows.map((row) => (row.dataset.city || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));

            const rebuildCityOptions = () => {
              const selectedCountry = (countryFilter.value || "").trim();
              const previousCity = cityFilter.value;

              const cities = selectedCountry
                ? Array.from(cityMap[selectedCountry] || []).sort((a, b) => a.localeCompare(b))
                : allCities;

              const options = ['<option value="">All Cities</option>']
                .concat(cities.map((city) => '<option value="' + city + '">' + city + '</option>'))
                .join('');

              cityFilter.innerHTML = options;
              if (cities.includes(previousCity)) {
                cityFilter.value = previousCity;
              }
            };

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

              let counter = 0;
              bodyRows.forEach((row) => {
                if (row.style.display === "none") return;
                counter += 1;
                const firstCell = row.querySelector("td");
                if (firstCell) firstCell.textContent = String(counter);
              });

              summaryLine.textContent = "Showing " + visible + " of " + total + " associations";
              noResults.style.display = visible === 0 ? "block" : "none";
            };

            resetBtn.addEventListener("click", () => {
              searchInput.value = "";
              countryFilter.value = "";
              rebuildCityOptions();
              cityFilter.value = "";
              applyFilters();
            });

            searchInput.addEventListener("input", applyFilters);
            countryFilter.addEventListener("change", () => {
              rebuildCityOptions();
              applyFilters();
            });
            cityFilter.addEventListener("change", applyFilters);

            rebuildCityOptions();
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
