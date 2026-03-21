import { formatCurrency } from "./currency";
import { formatDisplayDate } from "./date";

function downloadBlob(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function escapePdfText(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfDocument(lines) {
  const content = [
    "BT",
    "/F1 12 Tf",
    "14 TL",
    "50 790 Td",
    ...lines.flatMap((line, index) =>
      index === 0
        ? [`(${escapePdfText(line)}) Tj`]
        : ["T*", `(${escapePdfText(line)}) Tj`]
    ),
    "ET",
  ].join("\n");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return pdf;
}

export function formatStatementPeriod(statement) {
  return `${formatDisplayDate(statement.periodStart)} - ${formatDisplayDate(
    statement.periodEnd
  )}`;
}

export function downloadStatementCsv(statement, account, transactions) {
  const lines = [
    ["Statement", statement.statementName],
    ["Account", account.productName],
    ["Period", `${statement.periodStart} to ${statement.periodEnd}`],
    ["Issue date", statement.issueDate],
    [],
    ["Date", "Description", "Reference", "Type", "Status", "Amount", "Balance"],
    ...transactions.map((transaction) => [
      transaction.date,
      transaction.description,
      transaction.reference,
      transaction.type,
      transaction.status,
      transaction.amount,
      transaction.balance,
    ]),
  ];

  const csv = lines
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  downloadBlob(
    `${account.slug}-${statement.issueDate}.csv`,
    "text/csv;charset=utf-8",
    csv
  );
}

export function downloadStatementPdf(statement, account, transactions) {
  const previewTransactions = transactions.slice(0, 12);
  const lines = [
    "BluLedger Digital Banking Demo",
    statement.statementName,
    `Account: ${account.productName}`,
    `Period: ${formatStatementPeriod(statement)}`,
    `Issue date: ${formatDisplayDate(statement.issueDate)}`,
    `Opening balance: ${formatCurrency(statement.openingBalance)}`,
    `Closing balance: ${formatCurrency(statement.closingBalance)}`,
    `Total credits: ${formatCurrency(statement.totalCredits)}`,
    `Total debits: ${formatCurrency(statement.totalDebits)}`,
    "",
    "Included activity",
    ...previewTransactions.map(
      (transaction) =>
        `${formatDisplayDate(transaction.date)} | ${transaction.description} | ${formatCurrency(
          transaction.amount
        )}`
    ),
  ];

  downloadBlob(
    `${account.slug}-${statement.issueDate}.pdf`,
    "application/pdf",
    buildPdfDocument(lines)
  );
}
