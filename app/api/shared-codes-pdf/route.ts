import { NextResponse } from "next/server";
import { listSharedCodes } from "@/lib/member-directus";

const escapePdfText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const buildSimplePdf = (lines: string[]) => {
  const maxLinesPerPage = 40;
  const pages: string[][] = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }

  if (pages.length === 0) pages.push(["No shared codes available."]);

  const objects: string[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];
  const baseObjectCount = 3;

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const pageObjectId = baseObjectCount + pageIndex * 2;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    contentObjectIds.push(contentObjectId);
  }

  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(" ");
  objects.push(`<< /Type /Pages /Count ${pages.length} /Kids [${kids}] >>`);

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const pageObjectId = pageObjectIds[pageIndex];
    const contentObjectId = contentObjectIds[pageIndex];

    objects[pageObjectId - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${baseObjectCount + pages.length * 2} 0 R >> >> /Contents ${contentObjectId} 0 R >>`;

    const pageLines = pages[pageIndex];
    const contentParts = [
      "BT",
      "/F1 12 Tf",
      "50 800 Td",
      ...pageLines.flatMap((line, lineIndex) => {
        const escaped = escapePdfText(line);
        if (lineIndex === 0) {
          return [`(${escaped}) Tj`];
        }
        return ["0 -18 Td", `(${escaped}) Tj`];
      }),
      "ET",
    ];

    const stream = contentParts.join("\n");
    objects[contentObjectId - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  }

  const fontObjectId = baseObjectCount + pages.length * 2;
  objects[fontObjectId - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((objectBody, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objectBody}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
};

export async function GET() {
  try {
    const codes = await listSharedCodes();
    const lines = [
      "Somaliland Diaspora - Shared Codes List",
      "",
      ...codes.map((item, index) => `${index + 1}. ${item.label}`),
    ];

    const pdfBuffer = buildSimplePdf(lines);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="shared-codes-list.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to generate shared codes PDF." },
      { status: 500 }
    );
  }
}
