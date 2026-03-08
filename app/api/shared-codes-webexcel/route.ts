import { NextResponse } from "next/server";
import { listSharedCodes } from "@/lib/member-directus";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const parseLabel = (label: string) => {
  const withoutCodePrefix = label.includes("—")
    ? label.split("—").slice(1).join("—").trim()
    : "";

  const parts = withoutCodePrefix
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);

  const association = parts[0] || "-";
  const country = parts[1] || "-";
  const contact = (parts[2] || "-").replace(/^assigned officer:\s*/i, "");

  return { association, country, contact };
};

export async function GET() {
  try {
    const codes = await listSharedCodes();

    const rows = codes
      .map((item, index) => {
        const parsed = parseLabel(item.label);
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(parsed.country)}</td>
            <td>${escapeHtml(parsed.association)}</td>
            <td>${escapeHtml(parsed.contact)}</td>
          </tr>
        `;
      })
      .join("");

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Shared Codes Directory</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f7faf9; color: #0f172a; }
    .wrap { max-width: 1200px; margin: 20px auto; background: #fff; border: 1px solid #d8e5de; border-radius: 12px; overflow: hidden; }
    .head { padding: 16px 20px; border-bottom: 1px solid #d8e5de; background: #eef8f2; }
    .head h1 { margin: 0; font-size: 20px; color: #006d21; }
    .head p { margin: 6px 0 0; color: #475569; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e2e8f0; padding: 10px 12px; font-size: 14px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; }
    tr:nth-child(even) { background: #fcfefe; }
    .empty { padding: 18px; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1>Contact Directory of Somaliland Diaspora Community Associations</h1>
      <p>Association directory view. Code values are hidden in this public list.</p>
    </div>
    ${codes.length > 0
      ? `<table>
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Association</th>
              <th>Contact Person</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`
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
