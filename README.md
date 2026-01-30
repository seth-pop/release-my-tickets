# Release My Tickets

Small web app to collect release ticket details and submit them to a Google Sheet.

## Requirements

- Node.js 18+
- A deployed Google Apps Script web app URL
- A Google Sheet ID and sheet name

## Setup

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`

## Build

Creates a static build in `docs/` (useful for GitHub Pages):

`npm run build`

## Usage

Open the app with query params:

`/index.html?appScriptUrl=YOUR_URL&sheetId=YOUR_SHEET_ID&sheetName=YOUR_SHEET_NAME`

Example:

`http://localhost:5173/?appScriptUrl=...&sheetId=...&sheetName=Sheet1`

## Notes

- The sheet must contain the columns expected by the Apps Script handler.
- Multiple tickets are submitted in parallel.
