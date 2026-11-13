/**
 * Thanksgiving Quest — Google Sheets backend
 * Paste this into Extensions → Apps Script of a Google Sheet, then deploy as a Web App.
 * Every finished game adds a row to the "Signups" tab.
 * If someone plays again, their newest row is the one that counts for "who's bringing what".
 */
const SHEET_NAME = 'Signups';
const HEADERS = ['Timestamp', 'Name', 'Bringing', 'Item IDs', 'Write-in', 'Game Plan', 'Times Refused'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Stops things like "=HYPERLINK(...)" from being treated as formulas
function clean_(v, max) {
  let s = String(v == null ? '' : v).slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    getSheet_().appendRow([
      new Date(),
      clean_(d.name, 60),
      clean_((d.itemNames || []).join(', '), 500),
      clean_((d.items || []).join(','), 500),
      clean_(d.writeIn, 120),
      clean_(d.seating, 40),
      Number(d.refusals) || 0
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Returns { claims: { itemId: [names...] } } using each person's latest signup
function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  const latest = {};
  rows.forEach(r => { if (r[1]) latest[String(r[1]).trim().toLowerCase()] = r; });
  const claims = {};
  Object.values(latest).forEach(r => {
    String(r[3]).split(',').map(s => s.trim()).filter(Boolean).forEach(id => {
      (claims[id] = claims[id] || []).push(String(r[1]).replace(/^'/, ''));
    });
  });
  return json_({ claims });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
