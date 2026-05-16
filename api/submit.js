const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const data = req.body;
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    const row = [
      now,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.instagram || '',
      data.location || '',
      data.timezone || '',
      data.role || '',
      data.experience || '',
      data.offers || '',
      data.kpi || '',
      data.availability || '',
      data.loom || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Sheets error:', err);
    return res.status(500).json({ error: 'Failed to submit' });
  }
};
