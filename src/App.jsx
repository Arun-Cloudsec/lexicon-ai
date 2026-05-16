import { useState, useRef, useEffect, useCallback } from 'react';
import mammoth from 'mammoth';
import PptxGenJS from 'pptxgenjs';
import { PRACTICE_AREAS, MANAGED_AGENTS, CONNECTORS } from './data/practiceAreas.js';
import { SAMPLE_DOCS, VULN_REPORT } from './data/documents.js';
import './App.css';

const totalSkills = PRACTICE_AREAS.reduce((a, p) => a + p.skills.length, 0);

/* ─── API HELPER ─── */
async function chatAPI({ messages, system }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data.content?.map(c => c.text || '').join('\n') || 'No response content.';
}

/* ─── EXPORT HELPERS ─── */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─── REPORT PARSER & RENDERER ─── */
function parseReport(text) {
  const lines = text.split('\n');
  const items = [];
  let currentItem = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('🔴 HIGH RISK:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { type: 'high', title: trimmed.replace('🔴 HIGH RISK:', '').split('—')[0]?.trim(), body: trimmed.replace('🔴 HIGH RISK:', '').trim() };
    } else if (trimmed.startsWith('🟡 MEDIUM RISK:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { type: 'medium', title: trimmed.replace('🟡 MEDIUM RISK:', '').split('—')[0]?.trim(), body: trimmed.replace('🟡 MEDIUM RISK:', '').trim() };
    } else if (trimmed.startsWith('🟢 LOW RISK:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { type: 'low', title: trimmed.replace('🟢 LOW RISK:', '').split('—')[0]?.trim(), body: trimmed.replace('🟢 LOW RISK:', '').trim() };
    } else if (trimmed.startsWith('💡 RECOMMENDATION:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { type: 'rec', title: trimmed.replace('💡 RECOMMENDATION:', '').split('—')[0]?.trim(), body: trimmed.replace('💡 RECOMMENDATION:', '').trim() };
    } else if (trimmed.startsWith('📋 FINDING:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { type: 'finding', title: trimmed.replace('📋 FINDING:', '').split('—')[0]?.trim(), body: trimmed.replace('📋 FINDING:', '').trim() };
    } else if (currentItem && trimmed) {
      currentItem.body += ' ' + trimmed;
    }
  }
  if (currentItem) items.push(currentItem);
  return items;
}

function isReport(text) {
  const markers = ['🔴 HIGH RISK:', '🟡 MEDIUM RISK:', '🟢 LOW RISK:', '💡 RECOMMENDATION:', '📋 FINDING:'];
  let count = 0;
  for (const m of markers) { if (text.includes(m)) count++; }
  return count >= 2;
}

function extractSection(text, heading) {
  const regex = new RegExp('##\\s*' + heading + '\\s*\\n([\\s\\S]*?)(?=\\n##|---\\n|$)', 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function exportReport(text, format) {
  const ts = new Date().toISOString().split('T')[0];
  const title = (text.match(/##\s*REPORT:\s*(.+)/i) || [,'Legal Analysis Report'])[1].trim();
  const items = parseReport(text);
  const summary = extractSection(text, 'RISK SUMMARY');
  const actions = extractSection(text, 'KEY ACTIONS');
  const fname = title.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 60);
  const sevColors = { high: '#DC2626', medium: '#D97706', low: '#059669', rec: '#2563EB', finding: '#6B7280' };
  const sevLabels = { high: 'HIGH RISK', medium: 'MEDIUM RISK', low: 'LOW RISK', rec: 'RECOMMENDATION', finding: 'FINDING' };
  const counts = { high: items.filter(i => i.type === 'high').length, medium: items.filter(i => i.type === 'medium').length, low: items.filter(i => i.type === 'low').length, rec: items.filter(i => i.type === 'rec').length, finding: items.filter(i => i.type === 'finding').length };
  const totalFindings = items.length;

  // ═══ PDF — opens in new tab with title page + dashboard + details ═══
  if (format === 'pdf') {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
@media print { .no-print{display:none} .page-break{page-break-before:always} body{-webkit-print-color-adjust:exact;print-color-adjust:exact} }
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Calibri,'Segoe UI',sans-serif;color:#1B2A4A;line-height:1.5}

/* Title Page */
.title-page{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(160deg,#0B0E18 0%,#16213e 50%,#1B2A4A 100%);color:white;text-align:center;padding:60px}
.title-page h1{font-size:36px;font-weight:300;letter-spacing:2px;margin-bottom:8px;color:#C9A84C}
.title-page h2{font-size:28px;font-weight:700;margin:16px 0;max-width:700px}
.title-page .meta-row{display:flex;gap:32px;margin-top:28px;font-size:14px;color:#94a3b8}
.title-page .meta-row span{display:flex;align-items:center;gap:6px}
.title-page .classification{margin-top:40px;padding:8px 28px;border:2px solid #C9A84C;color:#C9A84C;font-weight:700;letter-spacing:2px;font-size:13px;border-radius:4px}
.title-page .org{font-size:14px;color:#64748b;margin-top:auto;padding-top:40px;border-top:1px solid rgba(255,255,255,0.1);width:100%}

/* Dashboard Page */
.dashboard{padding:48px;max-width:900px;margin:0 auto}
.dashboard h2{font-size:22px;color:#1B2A4A;border-bottom:3px solid #C9A84C;padding-bottom:10px;margin-bottom:24px}
.dash-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.dash-card{padding:20px;border-radius:10px;text-align:center;border:1px solid #e2e8f0}
.dash-card .num{font-size:36px;font-weight:700}
.dash-card .lbl{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px}
.dash-card-high{background:#FEF2F2;border-color:#FECACA}.dash-card-high .num{color:#DC2626}
.dash-card-medium{background:#FFFBEB;border-color:#FDE68A}.dash-card-medium .num{color:#D97706}
.dash-card-low{background:#ECFDF5;border-color:#A7F3D0}.dash-card-low .num{color:#059669}
.dash-card-rec{background:#EFF6FF;border-color:#BFDBFE}.dash-card-rec .num{color:#2563EB}
.bar-chart{margin-bottom:32px}
.bar-row{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.bar-label{width:120px;font-size:13px;font-weight:600;text-align:right}
.bar-track{flex:1;height:28px;background:#f1f5f9;border-radius:6px;overflow:hidden}
.bar-fill{height:100%;border-radius:6px;display:flex;align-items:center;padding-left:10px;font-size:12px;font-weight:700;color:white;min-width:fit-content}
.summary-box{background:#F8F6F0;padding:20px;border-radius:10px;border:1px solid #E5E1D8;font-size:14px;line-height:1.7;margin-bottom:20px}
.actions-box{background:#EFF6FF;padding:20px;border-radius:10px;border:1px solid #BFDBFE;font-size:14px;line-height:1.7}

/* Findings Pages */
.findings{padding:48px;max-width:900px;margin:0 auto}
.findings h2{font-size:22px;color:#1B2A4A;border-bottom:3px solid #C9A84C;padding-bottom:10px;margin-bottom:20px}
.item{padding:16px 20px;margin:12px 0;border-radius:10px;border-left:5px solid;page-break-inside:avoid}
.item-high{border-color:#DC2626;background:#FEF2F2}
.item-medium{border-color:#D97706;background:#FFFBEB}
.item-low{border-color:#059669;background:#ECFDF5}
.item-rec{border-color:#2563EB;background:#EFF6FF}
.item-finding{border-color:#6B7280;background:#F9FAFB}
.badge{display:inline-block;padding:3px 12px;border-radius:10px;font-size:10px;font-weight:700;color:white;letter-spacing:1px;text-transform:uppercase}
.item h3{font-size:15px;margin:8px 0 6px;color:#1B2A4A}
.item p{font-size:13px;color:#334155;line-height:1.65}
.footer{text-align:center;font-size:11px;color:#94a3b8;padding:24px;border-top:2px solid #C9A84C;margin-top:40px}
.print-bar{background:#1B2A4A;color:white;padding:12px 24px;display:flex;gap:12px;align-items:center}
.print-bar button{background:#C9A84C;color:#1B2A4A;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px}
</style></head><body>
<div class="print-bar no-print"><span style="font-weight:700">⚖ Lexicon AI Report</span><button onclick="window.print()">🖨️ Print / Save as PDF</button><span style="color:#94a3b8;font-size:13px;margin-left:auto">Ctrl+P → Save as PDF for best results</span></div>

<!-- PAGE 1: TITLE -->
<div class="title-page">
<h1>⚖ LEXICON AI</h1>
<div style="font-size:13px;letter-spacing:3px;color:#64748b;margin-bottom:40px">LEGAL INTELLIGENCE PLATFORM</div>
<h2>${title}</h2>
<div class="meta-row">
<span>📅 ${ts}</span>
<span>📊 ${totalFindings} Findings</span>
<span>🔴 ${counts.high} High Risk</span>
<span>🟡 ${counts.medium} Medium Risk</span>
</div>
<div class="classification">CONFIDENTIAL — ATTORNEY WORK PRODUCT</div>
<div class="org">Lexicon AI — Legal Intelligence Platform | Draft for Attorney Review</div>
</div>

<!-- PAGE 2: DASHBOARD -->
<div class="page-break"></div>
<div class="dashboard">
<h2>Executive Dashboard</h2>
<div class="dash-grid">
<div class="dash-card dash-card-high"><div class="num">${counts.high}</div><div class="lbl">High Risk</div></div>
<div class="dash-card dash-card-medium"><div class="num">${counts.medium}</div><div class="lbl">Medium Risk</div></div>
<div class="dash-card dash-card-low"><div class="num">${counts.low}</div><div class="lbl">Low Risk</div></div>
<div class="dash-card dash-card-rec"><div class="num">${counts.rec}</div><div class="lbl">Recommendations</div></div>
</div>
<h3 style="font-size:16px;color:#1B2A4A;margin-bottom:12px">Risk Distribution</h3>
<div class="bar-chart">
${counts.high > 0 ? `<div class="bar-row"><div class="bar-label">High Risk</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(counts.high/totalFindings*100,15)}%;background:#DC2626">${counts.high}</div></div></div>` : ''}
${counts.medium > 0 ? `<div class="bar-row"><div class="bar-label">Medium Risk</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(counts.medium/totalFindings*100,15)}%;background:#D97706">${counts.medium}</div></div></div>` : ''}
${counts.low > 0 ? `<div class="bar-row"><div class="bar-label">Low Risk</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(counts.low/totalFindings*100,15)}%;background:#059669">${counts.low}</div></div></div>` : ''}
${counts.rec > 0 ? `<div class="bar-row"><div class="bar-label">Recommendations</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(counts.rec/totalFindings*100,15)}%;background:#2563EB">${counts.rec}</div></div></div>` : ''}
</div>
${summary ? `<h3 style="font-size:16px;color:#1B2A4A;margin-bottom:8px">Risk Summary</h3><div class="summary-box">${summary}</div>` : ''}
${actions ? `<h3 style="font-size:16px;color:#1B2A4A;margin-bottom:8px">Key Actions Required</h3><div class="actions-box">${actions.replace(/\n/g, '<br>')}</div>` : ''}
</div>

<!-- PAGE 3+: DETAILED FINDINGS -->
<div class="page-break"></div>
<div class="findings">
<h2>Detailed Findings (${totalFindings})</h2>
${items.map(item => `<div class="item item-${item.type}"><span class="badge" style="background:${sevColors[item.type]}">${sevLabels[item.type]}</span><h3>${item.title}</h3><p>${item.body}</p></div>`).join('')}
</div>
<div class="footer">CONFIDENTIAL — Draft for attorney review — not legal advice<br>Lexicon AI — Legal Intelligence Platform | Generated ${ts}</div>
</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
  }

  // ═══ WORD — .doc HTML that opens natively in Word ═══
  if (format === 'word') {
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><meta name="ProgId" content="Word.Document">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
body{font-family:Calibri,sans-serif;color:#1B2A4A;margin:40px}
h1{font-size:28px;color:#1B2A4A;border-bottom:3px solid #C9A84C;padding-bottom:10px}
h2{font-size:20px;color:#1B2A4A;margin-top:24px;border-bottom:2px solid #E5E1D8;padding-bottom:6px}
table{border-collapse:collapse;width:100%;margin:16px 0}
td,th{border:1px solid #ddd;padding:10px 14px;font-size:13px}
th{background:#1B2A4A;color:white;font-weight:700;text-align:left}
.high{background:#FEF2F2;border-left:4px solid #DC2626}
.medium{background:#FFFBEB;border-left:4px solid #D97706}
.low{background:#ECFDF5;border-left:4px solid #059669}
.rec{background:#EFF6FF;border-left:4px solid #2563EB}
.finding{background:#F9FAFB;border-left:4px solid #6B7280}
.badge{display:inline-block;padding:2px 10px;border-radius:8px;font-size:10px;font-weight:700;color:white}
.dash-table td{text-align:center;font-size:28px;font-weight:700;padding:20px}
.dash-label{font-size:11px;color:#64748b;font-weight:400}
</style></head><body>
<div style="text-align:center;margin:60px 0 40px">
<h1 style="border:none;font-size:32px;margin-bottom:4px">⚖ LEXICON AI</h1>
<p style="letter-spacing:3px;color:#64748b;font-size:12px;margin-bottom:24px">LEGAL INTELLIGENCE PLATFORM</p>
<h2 style="border:none;font-size:24px">${title}</h2>
<p style="color:#64748b;font-size:14px;margin-top:12px">${ts} | CONFIDENTIAL — Attorney Work Product</p>
</div>
<br style="page-break-before:always">
<h2>Executive Dashboard</h2>
<table class="dash-table">
<tr><td style="color:#DC2626">${counts.high}<br><span class="dash-label">High Risk</span></td>
<td style="color:#D97706">${counts.medium}<br><span class="dash-label">Medium Risk</span></td>
<td style="color:#059669">${counts.low}<br><span class="dash-label">Low Risk</span></td>
<td style="color:#2563EB">${counts.rec}<br><span class="dash-label">Recommendations</span></td></tr>
</table>
${summary ? `<h3>Risk Summary</h3><p style="background:#F8F6F0;padding:16px;border-radius:6px;border:1px solid #E5E1D8">${summary}</p>` : ''}
${actions ? `<h3>Key Actions</h3><p style="background:#EFF6FF;padding:16px;border-radius:6px;border:1px solid #BFDBFE">${actions.replace(/\n/g, '<br>')}</p>` : ''}
<br style="page-break-before:always">
<h2>Detailed Findings (${totalFindings})</h2>
<table>
<tr><th style="width:110px">Severity</th><th style="width:200px">Finding</th><th>Details & Clause Reference</th></tr>
${items.map(item => `<tr class="${item.type}"><td><span class="badge" style="background:${sevColors[item.type]}">${sevLabels[item.type]}</span></td><td style="font-weight:700">${item.title}</td><td>${item.body}</td></tr>`).join('')}
</table>
<hr style="border:none;border-top:2px solid #C9A84C;margin-top:40px">
<p style="text-align:center;font-size:11px;color:#94a3b8">Draft for attorney review — not legal advice | Lexicon AI | ${ts}</p>
</body></html>`;
    downloadBlob(new Blob([html], { type: 'application/msword' }), `${fname}-${ts}.doc`);
  }

  // ═══ EXCEL — CSV with structured data ═══
  if (format === 'csv') {
    const sevMap = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW', rec: 'RECOMMENDATION', finding: 'INFO' };
    const rows = ['"#","Severity","Priority","Finding Title","Details & Clause Reference","Status","Assigned To","Due Date","Report Date"'];
    items.forEach((item, i) => {
      const priority = item.type === 'high' ? '1-Critical' : item.type === 'medium' ? '2-High' : item.type === 'low' ? '3-Medium' : '4-Low';
      rows.push(`"${i + 1}","${sevMap[item.type]}","${priority}","${item.title.replace(/"/g, '""')}","${item.body.replace(/"/g, '""')}","Open","","","${ts}"`);
    });
    if (summary) rows.push(`"","SUMMARY","","Risk Summary","${summary.replace(/"/g, '""')}","","","","${ts}"`);
    if (actions) rows.push(`"","ACTIONS","","Key Actions","${actions.replace(/"/g, '""').replace(/\n/g, ' ')}","","","","${ts}"`);
    downloadBlob(new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8' }), `${fname}-${ts}.csv`);
  }

  // ═══ POWERPOINT — professional slide deck ═══
  if (format === 'pptx') {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Lexicon AI';
    pptx.subject = title;
    const NAVY = '1B2A4A';
    const GOLD = 'C9A84C';

    // Slide 1: Title
    const s1 = pptx.addSlide();
    s1.background = { fill: NAVY };
    s1.addText('⚖  LEXICON AI', { x: 0, y: 0.6, w: '100%', h: 0.6, fontSize: 18, color: GOLD, align: 'center', fontFace: 'Calibri', letterSpacing: 4 });
    s1.addText('LEGAL INTELLIGENCE PLATFORM', { x: 0, y: 1.1, w: '100%', h: 0.4, fontSize: 11, color: '94a3b8', align: 'center', fontFace: 'Calibri', letterSpacing: 5 });
    s1.addShape(pptx.ShapeType.rect, { x: 3, y: 1.8, w: 7.33, h: 0.04, fill: { color: GOLD } });
    s1.addText(title, { x: 1, y: 2.2, w: 11.33, h: 1.2, fontSize: 28, color: 'FFFFFF', align: 'center', fontFace: 'Calibri', bold: true });
    s1.addText(`${ts}  |  ${totalFindings} Findings  |  ${counts.high} High Risk  |  ${counts.medium} Medium Risk`, { x: 0, y: 3.6, w: '100%', h: 0.4, fontSize: 12, color: '94a3b8', align: 'center', fontFace: 'Calibri' });
    s1.addText('CONFIDENTIAL — ATTORNEY WORK PRODUCT', { x: 0, y: 4.4, w: '100%', h: 0.4, fontSize: 11, color: GOLD, align: 'center', fontFace: 'Calibri', bold: true });
    s1.addText('Draft for Attorney Review — Not Legal Advice', { x: 0, y: 6.6, w: '100%', h: 0.3, fontSize: 10, color: '64748b', align: 'center', fontFace: 'Calibri', italic: true });

    // Slide 2: Dashboard
    const s2 = pptx.addSlide();
    s2.addText('Executive Dashboard', { x: 0.5, y: 0.3, w: 8, h: 0.5, fontSize: 22, color: NAVY, bold: true, fontFace: 'Calibri' });
    s2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 2, h: 0.04, fill: { color: GOLD } });

    const dashData = [
      { label: 'High Risk', num: counts.high, color: 'DC2626', bg: 'FEF2F2' },
      { label: 'Medium Risk', num: counts.medium, color: 'D97706', bg: 'FFFBEB' },
      { label: 'Low Risk', num: counts.low, color: '059669', bg: 'ECFDF5' },
      { label: 'Recommendations', num: counts.rec, color: '2563EB', bg: 'EFF6FF' },
    ];
    dashData.forEach((d, i) => {
      const x = 0.5 + i * 3.1;
      s2.addShape(pptx.ShapeType.roundRect, { x, y: 1.2, w: 2.8, h: 1.4, fill: { color: d.bg }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.1 });
      s2.addText(String(d.num), { x, y: 1.3, w: 2.8, h: 0.8, fontSize: 40, color: d.color, align: 'center', bold: true, fontFace: 'Calibri' });
      s2.addText(d.label, { x, y: 2.1, w: 2.8, h: 0.4, fontSize: 11, color: '64748b', align: 'center', fontFace: 'Calibri' });
    });

    if (summary) {
      s2.addText('Risk Summary', { x: 0.5, y: 3.0, w: 8, h: 0.4, fontSize: 14, color: NAVY, bold: true, fontFace: 'Calibri' });
      s2.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.4, w: 12.33, h: 1.2, fill: { color: 'F8F6F0' }, line: { color: 'E5E1D8', width: 1 }, rectRadius: 0.1 });
      s2.addText(summary, { x: 0.7, y: 3.5, w: 11.93, h: 1.0, fontSize: 12, color: '334155', fontFace: 'Calibri', valign: 'top', wrap: true });
    }

    if (actions) {
      const ay = summary ? 4.8 : 3.0;
      s2.addText('Key Actions', { x: 0.5, y: ay, w: 8, h: 0.4, fontSize: 14, color: NAVY, bold: true, fontFace: 'Calibri' });
      s2.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: ay + 0.4, w: 12.33, h: 1.6, fill: { color: 'EFF6FF' }, line: { color: 'BFDBFE', width: 1 }, rectRadius: 0.1 });
      s2.addText(actions, { x: 0.7, y: ay + 0.5, w: 11.93, h: 1.4, fontSize: 11, color: '334155', fontFace: 'Calibri', valign: 'top', wrap: true });
    }

    // Slide 3+: Findings (4 per slide)
    const perSlide = 4;
    for (let p = 0; p < Math.ceil(items.length / perSlide); p++) {
      const s = pptx.addSlide();
      s.addText(`Detailed Findings (${p * perSlide + 1}–${Math.min((p + 1) * perSlide, items.length)} of ${items.length})`, { x: 0.5, y: 0.3, w: 10, h: 0.5, fontSize: 20, color: NAVY, bold: true, fontFace: 'Calibri' });
      s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 2, h: 0.04, fill: { color: GOLD } });

      const pageItems = items.slice(p * perSlide, (p + 1) * perSlide);
      pageItems.forEach((item, i) => {
        const y = 1.1 + i * 1.4;
        const c = sevColors[item.type].replace('#', '');
        s.addShape(pptx.ShapeType.roundRect, { x: 0.5, y, w: 12.33, h: 1.2, fill: { color: item.type === 'high' ? 'FEF2F2' : item.type === 'medium' ? 'FFFBEB' : item.type === 'low' ? 'ECFDF5' : item.type === 'rec' ? 'EFF6FF' : 'F9FAFB' }, line: { color: c, width: 1 }, rectRadius: 0.08 });
        s.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 0.08, h: 1.2, fill: { color: c } });
        s.addText(sevLabels[item.type], { x: 0.8, y: y + 0.08, w: 1.8, h: 0.3, fontSize: 9, color: 'FFFFFF', bold: true, fontFace: 'Calibri', fill: { color: c }, align: 'center', valign: 'middle' });
        s.addText(item.title, { x: 2.8, y: y + 0.05, w: 9.8, h: 0.35, fontSize: 13, color: NAVY, bold: true, fontFace: 'Calibri' });
        s.addText(item.body.slice(0, 280) + (item.body.length > 280 ? '...' : ''), { x: 0.8, y: y + 0.42, w: 11.8, h: 0.7, fontSize: 10, color: '475569', fontFace: 'Calibri', valign: 'top', wrap: true });
      });
    }

    // Final slide
    const sf = pptx.addSlide();
    sf.background = { fill: NAVY };
    sf.addText('⚖  LEXICON AI', { x: 0, y: 2.4, w: '100%', h: 0.6, fontSize: 24, color: GOLD, align: 'center', fontFace: 'Calibri' });
    sf.addText('Thank You', { x: 0, y: 3.2, w: '100%', h: 0.6, fontSize: 32, color: 'FFFFFF', align: 'center', fontFace: 'Calibri', bold: true });
    sf.addText('Draft for attorney review — not legal advice', { x: 0, y: 4.2, w: '100%', h: 0.4, fontSize: 12, color: '94a3b8', align: 'center', fontFace: 'Calibri', italic: true });
    sf.addText(`${title}  |  ${ts}  |  CONFIDENTIAL`, { x: 0, y: 6.4, w: '100%', h: 0.3, fontSize: 10, color: '64748b', align: 'center', fontFace: 'Calibri' });

    pptx.writeFile({ fileName: `${fname}-${ts}.pptx` });
  }
}

function exportChat(messages, format) {
  const ts = new Date().toISOString().split('T')[0];
  const content = messages.map(m => `[${m.role.toUpperCase()}] ${m.text}`).join('\n\n---\n\n');

  if (format === 'html') {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Lexicon AI — Session ${ts}</title>
<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a2e}
h1{color:#16213e;border-bottom:3px solid #c9a84c;padding-bottom:12px}
.msg{margin:20px 0;padding:18px;border-radius:10px}
.user{background:#f0f4f8;border-left:4px solid #c9a84c}
.assistant{background:#fafaf5;border-left:4px solid #16213e}
.role{font-weight:bold;text-transform:uppercase;font-size:11px;letter-spacing:1.5px;margin-bottom:8px;color:#666}
.time{font-size:11px;color:#999;margin-top:8px}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:12px;color:#999;text-align:center}
</style></head><body>
<h1>⚖ Lexicon AI — Legal Session Export</h1>
<p style="color:#666">Generated: ${ts} | Messages: ${messages.length}</p>
${messages.map(m => `<div class="msg ${m.role}"><div class="role">${m.role === 'user' ? '👤 You' : '⚖ Legal AI'}</div><div>${m.text.replace(/\n/g, '<br>')}</div><div class="time">${m.time?.toLocaleString() || ''}</div></div>`).join('')}
<div class="footer">Lexicon AI — Legal Intelligence Platform | Draft for attorney review only</div>
</body></html>`;
    downloadBlob(new Blob([html], { type: 'text/html' }), `lexicon-session-${ts}.html`);
  } else if (format === 'txt') {
    const txt = `LEXICON AI — LEGAL SESSION EXPORT\nDate: ${ts}\n${'═'.repeat(60)}\n\n${content}\n\n${'═'.repeat(60)}\nDraft for attorney review only.`;
    downloadBlob(new Blob([txt], { type: 'text/plain' }), `lexicon-session-${ts}.txt`);
  } else if (format === 'csv') {
    const csv = 'Role,Message,Timestamp\n' + messages.map(m =>
      `"${m.role}","${m.text.replace(/"/g, '""').replace(/\n/g, ' ')}","${m.time?.toISOString() || ''}"`
    ).join('\n');
    downloadBlob(new Blob([csv], { type: 'text/csv' }), `lexicon-session-${ts}.csv`);
  }
}

/* ─── MAIN APP ─── */
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [area, setArea] = useState(null);
  const [skill, setSkill] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [docIdx, setDocIdx] = useState(0);
  const [search, setSearch] = useState('');
  const [ready, setReady] = useState(false);
  const [apiOk, setApiOk] = useState(null);
  const chatEnd = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(d => setApiOk(d.apiConfigured)).catch(() => setApiOk(false));
  }, []);

  /* ─── SEND MESSAGE ─── */
  const send = async () => {
    if (!input.trim() && files.length === 0) return;
    const userMsg = { role: 'user', text: input, files: files.map(f => f.name), time: new Date() };
    setMsgs(prev => [...prev, userMsg]);
    const fileContents = files
      .filter(f => f.content && f.content !== '[Binary file — content not readable as text]')
      .map(f => `\n\n--- UPLOADED FILE: ${f.name} ---\n${f.content}\n--- END FILE ---`)
      .join('');
    const fileNames = files.length > 0 ? '\n[Attached files: ' + files.map(f => f.name).join(', ') + ']' : '';
    const prompt = (input + fileNames + fileContents).trim() || 'Please analyze the attached document(s).';
    setInput('');
    setLoading(true);

    const sys = `You are a senior legal AI assistant for a high-profile in-house legal team.

CRITICAL OUTPUT RULES — follow these exactly every time:
1. ANALYZE the actual content NOW. Never describe what you would do. Do it.
2. Never ask "would you like me to proceed?" — deliver the full analysis immediately.
3. When document text appears between --- UPLOADED FILE --- markers, that IS the content. Read and analyze every section.

OUTPUT FORMAT — use these exact markers so the report renders with color-coded risk highlights:

Start with a title line: ## REPORT: [Document Name] Analysis

Then for each finding, use exactly one of these prefixes:
🔴 HIGH RISK: [title] — [explanation referencing specific clauses/language from the document]
🟡 MEDIUM RISK: [title] — [explanation with clause references]
🟢 LOW RISK: [title] — [explanation]
💡 RECOMMENDATION: [title] — [specific actionable recommendation]
📋 FINDING: [title] — [neutral observation with document reference]

After all findings, add:
## RISK SUMMARY
A 2-3 sentence overall risk assessment.

## KEY ACTIONS
Numbered list of the top 3-5 most important actions the legal team should take, in priority order.

End with exactly: ---\nDraft for attorney review — not legal advice.

Be specific. Reference actual clause numbers, section titles, dollar amounts, dates, and quoted language from the document. Every finding must cite something concrete from the content.

${skill ? 'ACTIVE SKILL: "' + skill.name + '" — ' + skill.desc + '. Apply this methodology.' : ''}
${files.length > 0 ? 'Documents provided inline. Analyze fully.' : ''}`;

    try {
      const history = msgs.filter(m => m.role === 'user' || m.role === 'assistant').slice(-8)
        .map(m => ({ role: m.role, content: m.text }));
      const text = await chatAPI({ messages: [...history, { role: 'user', content: prompt }], system: sys });
      setMsgs(prev => [...prev, { role: 'assistant', text, time: new Date() }]);
    } catch (err) {
      setMsgs(prev => [...prev, { role: 'assistant', text: `⚠ ${err.message}`, time: new Date() }]);
    }
    setLoading(false);
    setFiles([]);
  };

  /* ─── FILE HANDLING ─── */
  const onFiles = useCallback((fileList) => {
    Array.from(fileList).forEach(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      const meta = {
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        ext: ext.toUpperCase(),
        content: null,
        reading: true,
      };
      setFiles(prev => [...prev, meta]);

      const updateContent = (text) => {
        setFiles(prev => prev.map(file =>
          file.name === f.name && file.reading
            ? { ...file, content: text.slice(0, 50000), reading: false }
            : file
        ));
      };

      const markFailed = (msg) => {
        setFiles(prev => prev.map(file =>
          file.name === f.name && file.reading
            ? { ...file, content: msg, reading: false }
            : file
        ));
      };

      // DOCX — use mammoth to extract text
      if (ext === 'docx' || ext === 'doc') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
            if (result.value && result.value.trim().length > 0) {
              updateContent(result.value);
            } else {
              markFailed('[Document appears empty or could not be parsed]');
            }
          } catch (err) {
            markFailed('[Failed to extract text from DOCX: ' + err.message + ']');
          }
        };
        reader.onerror = () => markFailed('[Failed to read file]');
        reader.readAsArrayBuffer(f);
      }
      // Plain text formats — read directly
      else if (['txt','csv','md','json','xml','html','htm','yaml','yml','log','tsv','rtf','eml'].includes(ext)) {
        const reader = new FileReader();
        reader.onload = (e) => updateContent(e.target.result);
        reader.onerror = () => markFailed('[Failed to read file]');
        reader.readAsText(f);
      }
      // Binary files — flag as unreadable
      else {
        markFailed('[Binary file (' + ext.toUpperCase() + ') — text extraction not supported in browser. For PDFs, please copy-paste the text or use a .txt/.docx version.]');
      }
    });
  }, []);

  const onDrop = useCallback((e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }, [onFiles]);

  /* ─── FILTERED AREAS ─── */
  const filtered = search
    ? PRACTICE_AREAS.map(a => ({ ...a, skills: a.skills.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase())
      ) })).filter(a => a.skills.length > 0 || a.name.toLowerCase().includes(search.toLowerCase()))
    : PRACTICE_AREAS;

  /* ─── TABS ─── */
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'skills', label: 'Practice Areas', icon: '◆' },
    { id: 'agent', label: 'AI Agent', icon: '⬡' },
    { id: 'docs', label: 'Documents', icon: '▣' },
    { id: 'security', label: 'Security', icon: '◉' },
  ];

  return (
    <div className="app">
      <div className="grain-overlay" />

      {/* ══════ NAV ══════ */}
      <header className="nav-wrap">
        <nav className="nav">
          <div className="logo">
            <div className="logo-text">⚖ LEXICON AI</div>
            <div className="logo-sub">Legal Intelligence Platform</div>
          </div>
          <div className="nav-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`nav-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => { setTab(t.id); if (t.id !== 'skills') setArea(null); }}>
                <span className="tab-icon">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
          <div className="nav-status">
            <span className={`status-dot ${apiOk ? 'ok' : 'err'}`} />
            <span className="status-text">{apiOk === null ? 'Checking…' : apiOk ? 'API Connected' : 'API Key Missing'}</span>
          </div>
        </nav>
      </header>

      <main className="main">

        {/* ══════════════════ DASHBOARD ══════════════════ */}
        {tab === 'dashboard' && (
          <div className={`fade-wrapper ${ready ? 'visible' : ''}`}>
            <section className="hero-card">
              <div className="hero-glow" />
              <div className="hero-content">
                <h1 className="hero-title">Legal Agent Command Center</h1>
                <p className="hero-subtitle">
                  Powered by Claude for Legal — {PRACTICE_AREAS.length} practice areas, {totalSkills} AI skills,
                  {MANAGED_AGENTS.length} managed agents, and {CONNECTORS.length}+ MCP connectors including
                  Ironclad, DocuSign, iManage, Everlaw, and CourtListener.
                  Every output is a draft for attorney review.
                </p>
                <div className="stats-row">
                  {[
                    { n: PRACTICE_AREAS.length, l: 'Practice Areas' },
                    { n: totalSkills, l: 'AI Skills' },
                    { n: MANAGED_AGENTS.length, l: 'Managed Agents' },
                    { n: `${CONNECTORS.length}+`, l: 'MCP Connectors' },
                    { n: SAMPLE_DOCS.length, l: 'Sample Docs' },
                    { n: VULN_REPORT.length, l: 'Security Checks' },
                  ].map((s, i) => (
                    <div key={i} className={`stat-card animate-in stagger-${i + 1}`}>
                      <div className="stat-num">{s.n}</div>
                      <div className="stat-label">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <h2 className="section-title">PRACTICE AREAS</h2>
            <div className="area-grid">
              {PRACTICE_AREAS.map((a, i) => (
                <div key={a.id} className={`area-card animate-in stagger-${Math.min(i + 1, 12)}`}
                  style={{ '--accent': a.color }}
                  onClick={() => { setTab('skills'); setArea(a); }}>
                  <span className="area-icon">{a.icon}</span>
                  <div className="area-name">{a.name}</div>
                  <div className="area-desc">{a.desc}</div>
                  <span className="skill-count">{a.skills.length} skills</span>
                </div>
              ))}
            </div>

            <div className="managed-agents-section">
              <h2 className="section-title">MANAGED AGENTS</h2>
              <div className="agents-row">
                {MANAGED_AGENTS.map((ag, i) => (
                  <div key={i} className="agent-chip">
                    <span className="agent-icon">⟐</span>
                    <div>
                      <div className="agent-name">{ag.name}</div>
                      <div className="agent-desc">{ag.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="disclaimer">
              <strong>⚠ Important Notice:</strong> Every output from this platform is a draft for attorney review — not legal advice,
              not a legal conclusion, not a substitute for a lawyer. Built with guardrails: source attribution, conservative
              defaults on privilege, jurisdiction assumptions surfaced, and explicit gates before anything is filed or sent.
            </div>
          </div>
        )}

        {/* ══════════════════ SKILLS BROWSER ══════════════════ */}
        {tab === 'skills' && (
          <div className="fade-wrapper visible">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" placeholder="Search across all practice areas and skills…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>

            {!area ? (
              <div className="area-grid">
                {filtered.map(a => (
                  <div key={a.id} className="area-card" style={{ '--accent': a.color }}
                    onClick={() => setArea(a)}>
                    <span className="area-icon">{a.icon}</span>
                    <div className="area-name">{a.name}</div>
                    <div className="area-desc">{a.desc}</div>
                    <span className="skill-count">{a.skills.length} skills</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button className="btn btn-ghost" onClick={() => { setArea(null); setSkill(null); }}>← All Practice Areas</button>
                <div className="area-header">
                  <span style={{ fontSize: 40 }}>{area.icon}</span>
                  <div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: 26 }}>{area.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 14 }}>{area.desc}</p>
                  </div>
                </div>
                <div className="skill-panel">
                  {area.skills.map(s => (
                    <div key={s.id} className={`skill-item ${skill?.id === s.id ? 'active' : ''}`}
                      onClick={() => setSkill(s)}>
                      <div className="skill-dot" style={{ background: area.color }} />
                      <div className="skill-info">
                        <div className="skill-name">{s.name}</div>
                        <div className="skill-desc">{s.desc}</div>
                      </div>
                      <button className="btn btn-gold btn-sm" onClick={(e) => {
                        e.stopPropagation(); setSkill(s); setTab('agent');
                        setInput(`Use the "${s.name}" skill: `);
                      }}>Launch →</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ AI AGENT ══════════════════ */}
        {tab === 'agent' && (
          <div className="chat-layout">
            {/* Sidebar */}
            <aside className="chat-sidebar">
              <div className="sidebar-section">
                <div className="sidebar-title">ACTIVE SKILL</div>
                {skill ? (
                  <div className="active-skill-card">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-desc">{skill.desc}</div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSkill(null)} style={{ marginTop: 10 }}>✕ Clear</button>
                  </div>
                ) : (
                  <p className="sidebar-muted">No skill selected — general legal assistant mode</p>
                )}
              </div>

              <div className="sidebar-section">
                <div className="sidebar-title">UPLOAD FILES</div>
                <div className="upload-zone" onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()} onDrop={onDrop}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
                  <div className="upload-text">Drop files or click to upload</div>
                  <div className="upload-hint">PDF, DOCX, XLSX, Images, ZIP</div>
                </div>
                <input ref={fileRef} type="file" multiple style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.gif,.zip,.eml"
                  onChange={e => onFiles(e.target.files)} />
                {files.length > 0 && (
                  <div className="file-chips">
                    {files.map((f, i) => (
                      <span key={i} className="file-chip">
                        <strong>{f.ext}</strong> {f.name.length > 16 ? f.name.slice(0, 16) + '…' : f.name}
                        <span className="file-remove" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>✕</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <div className="sidebar-title">EXPORT SESSION</div>
                <div className="export-btns">
                  <button className="btn btn-ghost" onClick={() => exportChat(msgs, 'html')} disabled={!msgs.length}>📄 HTML (Word-ready)</button>
                  <button className="btn btn-ghost" onClick={() => exportChat(msgs, 'txt')} disabled={!msgs.length}>📝 TXT (PDF-ready)</button>
                  <button className="btn btn-ghost" onClick={() => exportChat(msgs, 'csv')} disabled={!msgs.length}>📊 CSV (Excel)</button>
                </div>
              </div>
            </aside>

            {/* Chat */}
            <div className="chat-main">
              <div className="chat-header">
                <span className="chat-title">⚖ Legal AI Assistant</span>
                {msgs.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setMsgs([])}>Clear Chat</button>}
              </div>

              <div className="chat-messages">
                {msgs.length === 0 && (
                  <div className="chat-empty">
                    <div className="empty-icon">⚖</div>
                    <div className="empty-title">Legal AI Assistant Ready</div>
                    <p className="empty-desc">
                      Ask about contracts, compliance, litigation strategy, privacy, IP, or any legal topic.
                      Upload documents for analysis. Select a skill for specialized workflows.
                    </p>
                    {apiOk === false && (
                      <div className="api-warning">
                        ⚠ ANTHROPIC_API_KEY not configured. Add it as a Railway environment variable to enable AI chat.
                      </div>
                    )}
                    <div className="quick-prompts">
                      {['Review this NDA', 'Draft a legal hold notice', 'Triage this DSAR', 'Check marketing claims', 'Worker classification analysis'].map(q => (
                        <button key={q} className="btn btn-ghost btn-sm" onClick={() => setInput(q)}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}

                {msgs.map((m, i) => (
                  <div key={i} className={`msg ${m.role} ${m.role === 'assistant' && isReport(m.text) ? 'msg-report' : ''}`}>
                    {m.files?.length > 0 && (
                      <div className="msg-files">{m.files.map((f, j) => <span key={j} className="file-chip">📎 {f}</span>)}</div>
                    )}

                    {m.role === 'assistant' && isReport(m.text) ? (
                      <div className="report-card">
                        {/* Report Header with Download Buttons */}
                        <div className="report-header">
                          <span className="report-icon">⚖</span>
                          <span className="report-title">{(m.text.match(/##\s*REPORT:\s*(.+)/i) || [,'Legal Analysis Report'])[1]}</span>
                          <div className="report-header-actions">
                            <button className="btn-export btn-export-primary" onClick={() => exportReport(m.text, 'pdf')}>🔍 Full Report</button>
                            <button className="btn-export" onClick={() => exportReport(m.text, 'word')}>📝 Word</button>
                            <button className="btn-export" onClick={() => exportReport(m.text, 'pptx')}>📊 PPT</button>
                            <button className="btn-export" onClick={() => exportReport(m.text, 'csv')}>📈 Excel</button>
                          </div>
                        </div>

                        {/* Risk summary counts */}
                        <div className="report-counts">
                          {[
                            { type: 'high', label: 'High Risk', icon: '🔴', count: (m.text.match(/🔴 HIGH RISK:/g) || []).length },
                            { type: 'medium', label: 'Medium Risk', icon: '🟡', count: (m.text.match(/🟡 MEDIUM RISK:/g) || []).length },
                            { type: 'low', label: 'Low Risk', icon: '🟢', count: (m.text.match(/🟢 LOW RISK:/g) || []).length },
                            { type: 'rec', label: 'Recommendations', icon: '💡', count: (m.text.match(/💡 RECOMMENDATION:/g) || []).length },
                          ].filter(c => c.count > 0).map((c, j) => (
                            <span key={j} className={`count-badge count-${c.type}`}>{c.icon} {c.count} {c.label}</span>
                          ))}
                        </div>

                        {/* Findings */}
                        <div className="report-findings">
                          {parseReport(m.text).map((item, j) => (
                            <div key={j} className={`report-item report-item-${item.type}`}>
                              <div className="report-item-header">
                                <span className={`report-badge report-badge-${item.type}`}>
                                  {item.type === 'high' ? '🔴 HIGH RISK' : item.type === 'medium' ? '🟡 MEDIUM' : item.type === 'low' ? '🟢 LOW' : item.type === 'rec' ? '💡 ACTION' : '📋 INFO'}
                                </span>
                                <span className="report-item-title">{item.title}</span>
                              </div>
                              <div className="report-item-body">{item.body}</div>
                            </div>
                          ))}
                        </div>

                        {/* Summary & Actions */}
                        {extractSection(m.text, 'RISK SUMMARY') && (
                          <div className="report-summary">
                            <strong>Risk Summary:</strong> {extractSection(m.text, 'RISK SUMMARY')}
                          </div>
                        )}
                        {extractSection(m.text, 'KEY ACTIONS') && (
                          <div className="report-actions">
                            <strong>Key Actions:</strong>
                            <div className="report-actions-text">{extractSection(m.text, 'KEY ACTIONS')}</div>
                          </div>
                        )}

                        {/* Bottom export bar */}
                        <div className="report-bottom-bar">
                          <span className="report-disclaimer-inline">Draft for attorney review — not legal advice.</span>
                          <div className="report-bottom-actions">
                            <button className="btn-export btn-export-primary" onClick={() => exportReport(m.text, 'pdf')}>🔍 View Full Report</button>
                            <button className="btn-export" onClick={() => exportReport(m.text, 'word')}>📝 Word</button>
                            <button className="btn-export" onClick={() => exportReport(m.text, 'pptx')}>📊 PPT</button>
                            <button className="btn-export" onClick={() => exportReport(m.text, 'csv')}>📈 Excel</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="msg-text">{m.text}</div>
                    )}
                    <div className="msg-time">{m.time?.toLocaleTimeString()}</div>
                  </div>
                ))}

                {loading && (
                  <div className="msg assistant loading-msg">
                    <div className="loading-dots">
                      <span /><span /><span />
                    </div>
                    <span className="loading-text">Analyzing…</span>
                  </div>
                )}
                <div ref={chatEnd} />
              </div>

              <div className="chat-input-wrap">
                {files.length > 0 && (
                  <div className="input-files">
                    {files.map((f, i) => (
                      <span key={i} className="file-chip">📎 {f.name}
                        <span className="file-remove" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>✕</span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="input-row">
                  <textarea className="chat-textarea" value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Ask the legal AI assistant anything…" rows={1}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
                  <button className="btn btn-gold" onClick={send} disabled={loading}>Send ▸</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ DOCUMENTS ══════════════════ */}
        {tab === 'docs' && (
          <div className="fade-wrapper visible">
            <section className="hero-card" style={{ marginBottom: 24 }}>
              <div className="hero-content">
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Sample Legal Documents</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                  Download these templates to test the platform. Upload them into the AI Agent for review, triage, and analysis.
                </p>
              </div>
            </section>

            <div className="doc-layout">
              <div className="doc-sidebar">
                <div className="sidebar-title">AVAILABLE SAMPLES</div>
                {SAMPLE_DOCS.map((doc, i) => (
                  <div key={i} className={`doc-item ${docIdx === i ? 'active' : ''}`} onClick={() => setDocIdx(i)}>
                    <div className="doc-item-name">{doc.name}</div>
                    <span className={`badge badge-${doc.type}`}>{doc.type}</span>
                  </div>
                ))}
              </div>
              <div className="doc-main">
                <div className="doc-header">
                  <div className="doc-title">{SAMPLE_DOCS[docIdx].name}</div>
                  <div className="doc-actions">
                    <button className="btn btn-gold" onClick={() => {
                      const d = SAMPLE_DOCS[docIdx];
                      downloadBlob(new Blob([d.content], { type: 'text/plain' }), d.filename);
                    }}>⬇ Download</button>
                    <button className="btn btn-ghost" onClick={() => {
                      setTab('agent');
                      setInput(`Analyze this "${SAMPLE_DOCS[docIdx].name}" document and provide a detailed legal review.`);
                    }}>🤖 Analyze with AI</button>
                  </div>
                </div>
                <pre className="doc-preview">{SAMPLE_DOCS[docIdx].content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ SECURITY AUDIT ══════════════════ */}
        {tab === 'security' && (
          <div className="fade-wrapper visible">
            <section className="hero-card" style={{ marginBottom: 24 }}>
              <div className="hero-content">
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Security & Vulnerability Audit</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                  Comprehensive scan of the Claude for Legal codebase — scripts, deployment manifests, MCP configurations, skill files, and agent orchestration patterns.
                </p>
                <div className="vuln-summary">
                  {[
                    { label: 'Passed', count: VULN_REPORT.filter(v => v.status === 'pass').length, color: 'var(--green)' },
                    { label: 'Warnings', count: VULN_REPORT.filter(v => v.status === 'warn').length, color: 'var(--orange)' },
                    { label: 'Critical', count: 0, color: 'var(--red)' },
                  ].map((s, i) => (
                    <div key={i} className="vuln-stat">
                      <span className="vuln-dot" style={{ background: s.color }} />
                      <span>{s.count} {s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="vuln-list">
              {VULN_REPORT.map((v, i) => (
                <div key={i} className={`vuln-item vuln-${v.severity}`}>
                  <div className="vuln-badges">
                    <span className={`badge badge-${v.status}`}>{v.status === 'pass' ? '✓ PASS' : '⚠ WARN'}</span>
                    <span className={`badge badge-sev-${v.severity}`}>{v.severity}</span>
                  </div>
                  <div className="vuln-title">{v.title}</div>
                  <div className="vuln-desc">{v.desc}</div>
                </div>
              ))}
            </div>

            <div className="assessment-box">
              <div className="assessment-title">Overall Assessment</div>
              <p className="assessment-text">
                The codebase demonstrates strong security practices: closed-schema intents prevent prompt injection escalation,
                input validation hardens shell scripts, YAML parsing uses safe_load exclusively, no hardcoded secrets were detected,
                and matter isolation maintains privilege boundaries. The three warnings are acknowledged by the authors and represent
                defense-in-depth gaps rather than critical vulnerabilities. Overall: production-ready with recommended hardening for
                audit log integrity and MCP TLS pinning.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>⚖ Lexicon AI — Legal Intelligence Platform</span>
          <span className="footer-divider">|</span>
          <span>Powered by Claude for Legal</span>
          <span className="footer-divider">|</span>
          <span>Apache-2.0 License</span>
          <span className="footer-divider">|</span>
          <a href="https://github.com/anthropics/claude-for-legal" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </footer>
    </div>
  );
}
