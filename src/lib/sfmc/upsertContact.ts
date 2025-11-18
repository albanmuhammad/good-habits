const SFMC_CLIENT_ID = process.env.SFMC_CLIENT_ID;
const SFMC_CLIENT_SECRET = process.env.SFMC_CLIENT_SECRET;
const SFMC_AUTH_URL = process.env.SFMC_AUTH_URL; // misal: 'https://xxxx.auth.marketingcloudapis.com/v2/token'
const SFMC_API_URL_BASE = process.env.SFMC_API_URL_BASE; // misal: 'https://xxxx.rest.marketingcloudapis.com'

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

export async function upsertToSfmcContactDE({
  contactKey,
  email,
  name
}: {
  contactKey: string
  email: string
  name?: string
}) {
  const token = await getSfmAccessToken()

  const payload = {
    items: [
      {
        ContactKey: contactKey,
        EmailAddress: email,
        FullName: name ?? '',
        Source: 'Supabase App Signup',
        CreatedFrom: 'Next.js API'
      }
    ]
  }

  const res = await fetch(`${SFMC_API_URL_BASE}/data/v1/async/dataextensions/key:MASTER_CONTACT/upsert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const msg = await res.text()
    console.error('SFMC UPSERT ERROR:', msg)
    throw new Error('Failed saving contact to SFMC')
  }

  return true
}
