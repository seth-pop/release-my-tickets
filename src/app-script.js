function doPost(e) {
  try {
    const payload = parseBody(e);
    const sheetId = payload.sheetId || payload.sheet_id;
    const sheetName = payload.sheetName || payload.sheet_name;

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!sheet) return respond({ error: `Sheet ${sheetName} not found` }, 400);

    const rows = normalizeRows(payload);
    if (!rows.length) return respond({ error: 'No rows provided' }, 400);

    rows.forEach((row) => sheet.appendRow(row));
    return respond({ ok: true, inserted: rows.length });
  } catch (err) {
    return respond({ error: err.message || String(err) }, 500);
  }
}

function respond(obj, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setResponseCode(status);
}

function doOptions() {
  return respond({ ok: true });
}

function parseBody(e) {
  if (e.postData?.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fall through to form parsing
    }
  }
  return Object.fromEntries(
    Object.entries(e.parameter).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
}

function normalizeRows(payload) {
  let rowsValue = payload?.rows;
  if (typeof rowsValue === 'string') {
    try {
      rowsValue = JSON.parse(rowsValue);
    } catch (err) {
      rowsValue = undefined;
    }
  }

  const candidates = Array.isArray(payload)
    ? payload
    : Array.isArray(rowsValue)
      ? rowsValue
      : [payload];

  return candidates
    .filter(Boolean)
    .map((row) => {
      const ticketLink = row.ticketLink || row.ticket_url || '';
      const ticketKey = ticketLink ? ticketLink.split('/').pop() : '';
      const ticketHyperlink = ticketLink
        ? `=HYPERLINK("${ticketLink}","${ticketKey || ticketLink}")`
        : '';

      return [
        ticketKey,
        row.submittedAt || new Date().toISOString(),
        ticketHyperlink || ticketLink,
        row.ticketDescription || row.description || '',
        row.owner || '',
        row.service || '',
        row.goNoGo || row.go || '',
        row.verifier || row.owner || '',
        row.monitorLink || row.monitor || '',
      ];
    });
}
