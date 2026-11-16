import { money, gradeFromScore, feeStatus, studentName, teacherName, schoolLogoUrl } from "./store.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function byId(list, id) {
  return (list || []).find((item) => item.id === id);
}

function absoluteLogoUrl(settings) {
  const src = schoolLogoUrl(settings);
  if (!src) return "";
  if (src.startsWith("data:") || /^https?:\/\//i.test(src)) return src;
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

function schoolHeader(settings) {
  const logoSrc = absoluteLogoUrl(settings);
  const logo = logoSrc
    ? `<img class="print-logo" src="${logoSrc}" alt="School logo" />`
    : `<div class="print-logo-fallback">BC</div>`;

  return `
    <header class="print-header">
      ${logo}
      <div>
        <h1>${escapeHtml(settings.schoolName || "Brothers College")}</h1>
        <p>${escapeHtml(settings.schoolTagline || "")}</p>
        <p class="print-meta">${escapeHtml(settings.address || "")}${settings.phone ? " · " + escapeHtml(settings.phone) : ""}</p>
      </div>
    </header>
  `;
}

function openPrintWindow(title, bodyHtml) {
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!win) {
    alert("Please allow pop-ups to print documents.");
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, sans-serif;
      color: #142033;
      background: #fff;
      padding: 28px;
    }
    .print-header {
      display: flex;
      gap: 16px;
      align-items: center;
      border-bottom: 3px solid #0c2340;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .print-header h1 {
      margin: 0;
      font-size: 1.6rem;
      color: #0c2340;
    }
    .print-header p { margin: 0.2rem 0 0; color: #5a6b7d; }
    .print-meta { font-size: 0.85rem; }
    .print-logo {
      width: 72px;
      height: 72px;
      object-fit: contain;
      border-radius: 10px;
    }
    .print-logo-fallback {
      width: 72px;
      height: 72px;
      border-radius: 10px;
      background: #1a6b4f;
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 1.3rem;
    }
    h2 {
      margin: 0 0 0.4rem;
      color: #0c2340;
      font-size: 1.25rem;
    }
    .sub { color: #5a6b7d; margin: 0 0 1rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.8rem 0 1.2rem;
    }
    th, td {
      border: 1px solid #d7e0ea;
      padding: 8px 10px;
      text-align: left;
      font-size: 0.92rem;
    }
    th { background: #f3f6f9; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 18px;
      margin-bottom: 1rem;
    }
    .grid div { font-size: 0.92rem; }
    .grid strong { display: inline-block; min-width: 110px; color: #5a6b7d; font-weight: 600; }
    .totals {
      margin-top: 0.5rem;
      padding: 12px;
      background: #f3f6f9;
      border-radius: 8px;
    }
    .sign-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 48px;
    }
    .sign-line {
      border-top: 1px solid #94a3b8;
      padding-top: 8px;
      color: #5a6b7d;
      font-size: 0.85rem;
    }
    .actions {
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
    }
    .actions button {
      border: none;
      background: #1a6b4f;
      color: #fff;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }
    .actions button.secondary {
      background: #0c2340;
    }
    @media print {
      .actions { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="actions">
    <button onclick="window.print()">Print</button>
    <button class="secondary" onclick="window.close()">Close</button>
  </div>
  ${bodyHtml}
</body>
</html>`);
  win.document.close();
}

export function printFeeReceipt(data, feeId) {
  const fee = byId(data.fees, feeId);
  if (!fee) return;
  const student = byId(data.students, fee.studentId);
  const cls = student ? byId(data.classes, student.classId) : null;
  const currency = data.settings.currency;
  const balance = Math.max(0, Number(fee.amountDue) - Number(fee.amountPaid));
  const status = feeStatus(fee);

  const html = `
    ${schoolHeader(data.settings)}
    <h2>Fee Receipt</h2>
    <p class="sub">Receipt No: <strong>${escapeHtml(fee.receiptNo || fee.id)}</strong></p>
    <div class="grid">
      <div><strong>Student</strong> ${escapeHtml(studentName(student))}</div>
      <div><strong>Admission</strong> ${escapeHtml(student?.admissionNo || "—")}</div>
      <div><strong>Class</strong> ${escapeHtml(cls?.name || "—")}</div>
      <div><strong>Term</strong> ${escapeHtml(fee.term)}</div>
      <div><strong>Date</strong> ${escapeHtml(fee.date || "—")}</div>
      <div><strong>Method</strong> ${escapeHtml(fee.method || "—")}</div>
    </div>
    <table>
      <thead>
        <tr><th>Description</th><th>Amount due</th><th>Amount paid</th><th>Balance</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>School fees${fee.note ? ` — ${escapeHtml(fee.note)}` : ""}</td>
          <td>${money(fee.amountDue, currency)}</td>
          <td>${money(fee.amountPaid, currency)}</td>
          <td>${money(balance, currency)}</td>
        </tr>
      </tbody>
    </table>
    <div class="totals">
      <strong>Status:</strong> ${escapeHtml(status)}
    </div>
    <div class="sign-row">
      <div class="sign-line">Received by</div>
      <div class="sign-line">Parent / Guardian</div>
    </div>
  `;

  openPrintWindow(`Fee Receipt — ${studentName(student)}`, html);
}

export function printReportCard(data, studentId, term) {
  const student = byId(data.students, studentId);
  if (!student) return;
  const cls = byId(data.classes, student.classId);
  const teacher = cls ? byId(data.teachers, cls.teacherId) : null;
  const marks = data.results.filter(
    (r) => r.studentId === studentId && (!term || r.term === term)
  );

  const avg =
    marks.length > 0
      ? marks.reduce((s, r) => s + (Number(r.score) / Number(r.maxScore || 100)) * 100, 0) / marks.length
      : 0;

  const rows = marks.length
    ? marks
        .map((r) => {
          const g = gradeFromScore(r.score, r.maxScore);
          return `<tr>
            <td>${escapeHtml(r.subject)}</td>
            <td>${r.score}</td>
            <td>${r.maxScore}</td>
            <td>${((Number(r.score) / Number(r.maxScore || 100)) * 100).toFixed(1)}%</td>
            <td>${g}</td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="5">No results recorded for this term.</td></tr>`;

  const html = `
    ${schoolHeader(data.settings)}
    <h2>Student Report Card</h2>
    <p class="sub">${escapeHtml(term || data.settings.currentTerm)}</p>
    <div class="grid">
      <div><strong>Student</strong> ${escapeHtml(studentName(student))}</div>
      <div><strong>Admission</strong> ${escapeHtml(student.admissionNo)}</div>
      <div><strong>Class</strong> ${escapeHtml(cls?.name || "—")}</div>
      <div><strong>Class teacher</strong> ${escapeHtml(teacherName(teacher))}</div>
    </div>
    <table>
      <thead>
        <tr><th>Subject</th><th>Score</th><th>Max</th><th>%</th><th>Grade</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <strong>Average:</strong> ${avg.toFixed(1)}% &nbsp;·&nbsp;
      <strong>Overall grade:</strong> ${gradeFromScore(avg, 100)}
    </div>
    <div class="sign-row">
      <div class="sign-line">Class teacher</div>
      <div class="sign-line">Head / Deputy</div>
    </div>
  `;

  openPrintWindow(`Report Card — ${studentName(student)}`, html);
}
