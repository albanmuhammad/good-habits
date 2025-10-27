import { NextRequest, NextResponse } from 'next/server';

// --- Ambil Kredensial SFMC dari Environment Variables ---
// (Lihat Bagian 4 di bawah untuk cara setting ini)
const SFMC_CLIENT_ID = process.env.SFMC_CLIENT_ID;
const SFMC_CLIENT_SECRET = process.env.SFMC_CLIENT_SECRET;
const SFMC_AUTH_URL = process.env.SFMC_AUTH_URL; // misal: 'https://xxxx.auth.marketingcloudapis.com/v2/token'
const SFMC_API_URL_BASE = process.env.SFMC_API_URL_BASE; // misal: 'https://xxxx.rest.marketingcloudapis.com'
const SFMC_DE_KEY = process.env.SFMC_DE_KEY;
const SFMC_DE_PK_FIELD = process.env.SFMC_DE_PRIMARY_KEY_FIELD; // misal: 'EmailAddress'

// Fungsi Helper untuk mendapatkan Access Token SFMC
async function getSfmAccessToken() {
  if (!SFMC_AUTH_URL || !SFMC_CLIENT_ID || !SFMC_CLIENT_SECRET) {
    throw new Error('Missing SFMC auth environment variables');
  }

  const response = await fetch(SFMC_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SFMC_CLIENT_ID,
      client_secret: SFMC_CLIENT_SECRET
    })
  });

  if (!response.ok) {
    console.error('SFMC Auth Error:', await response.text());
    throw new Error('Gagal otentikasi dengan SFMC.');
  }

  const data = await response.json();
  return data.access_token;
}

// Handler untuk POST request
export async function POST(req: NextRequest) {
  if (!SFMC_DE_KEY || !SFMC_API_URL_BASE || !SFMC_DE_PK_FIELD) {
    return NextResponse.json({ error: 'Konfigurasi server SFMC tidak lengkap.' }, { status: 500 });
  }

  try {
    // 1. Baca data (email & name) dari body request
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email diperlukan' }, { status: 400 });
    }

    // 2. Dapatkan Access Token SFMC
    const accessToken = await getSfmAccessToken();

    // 3. Siapkan payload untuk SFMC (Upsert ke Data Extension)
    // 3. Siapkan payload untuk SFMC (Upsert ke Data Extension)
    const sfmcPayload = {
      "items": [ // <--- Bungkus dengan objek "items"
        {
      
            EmailAddress: email,
            FirstName: name || ''

        }
      ] // <--- Tutup array
    }; // <--- Tutup objek

    // 4. Panggil SFMC REST API (Async Upsert)
    const apiUrl = `${SFMC_API_URL_BASE}/data/v1/async/dataextensions/key:${SFMC_DE_KEY}/rows`;

    console.log('DE Key:', SFMC_DE_KEY);
    console.log('DE Primary Key Field:', SFMC_DE_PK_FIELD);
    
    const sfmcResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sfmcPayload)
    });

    if (!sfmcResponse.ok) {
      console.error('SFMC API Error:', await sfmcResponse.text());
      throw new Error('Gagal mengirim data ke SFMC.');
    }

    const sfmcData = await sfmcResponse.json();

    // 5. Kirim respon sukses
    return NextResponse.json({ success: true, requestId: sfmcData.requestId });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Terjadi kesalahan server' }, { status: 500 });
  }
}