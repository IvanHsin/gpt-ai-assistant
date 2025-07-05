// lib/getSheetData.ts
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SHEET_ID = '1nz6qoH-bP1h1nOswoz2PONbZFhCarjsGAz3WFDslhCM'; // 你的 Google Sheet ID
const SHEET_RANGE = '總表!A1:Q'; // 包含標題列與資料列

export async function getSheetRows(): Promise<any[][]> {
  const client = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth: client });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_RANGE,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) throw new Error('找不到資料');

  return rows;
}
