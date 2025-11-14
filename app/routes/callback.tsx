import { json, redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { sessionStorage } from '~/sessions';

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('Callback Route Called'); // Debug
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  console.log('Callback URL:', request.url); // Debug
  console.log('Authorization Code:', code); // Debug
  console.log('Error (if any):', error); // Debug

  if (error) {
    console.error('TikTok OAuth Error:', error);
    return redirect('/login');
  }
  
  if (!code) {
    console.log('No code in callback URL');
    return redirect('/login');
  }

  const clientId = process.env.VITE_TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.VITE_TIKTOK_CLIENT_SECRET;
  const redirectUri = 'http://localhost:5177/callback';
  console.log('Client ID:', clientId); // Debug
  console.log('Client Secret:', clientSecret ? '****' : 'undefined'); // Debug

  if (!clientId || !clientSecret) {
    console.error('Missing VITE_TIKTOK_CLIENT_KEY or VITE_TIKTOK_CLIENT_SECRET in .env');
    return redirect('/login');
  }

  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const codeVerifier = session.get('codeVerifier');
  console.log('Code Verifier:', codeVerifier); // Debug
  if (!codeVerifier) {
    console.error('No code_verifier in session');
    return redirect('/login');
  }

  try {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();
    console.log('Token Response:', data); // Debug
    if (!data.access_token) {
      console.error('No access token in response:', data.error);
      return redirect('/login');
    }

    session.set('tiktokAccessToken', data.access_token);
    console.log('Session set with access token'); // Debug
    return redirect('/', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    console.error('Callback Error:', error);
    return redirect('/login');
  }
}