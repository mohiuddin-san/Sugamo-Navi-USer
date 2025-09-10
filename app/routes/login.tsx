import { redirect } from '@remix-run/node';
import { sessionStorage } from '~/sessions';
import TikTokLoginButton from '~/components/TikTokLoginButton';
import { createHash, randomBytes } from 'crypto';

// Helper to generate PKCE code_verifier and code_challenge
function generatePKCE() {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
}

export async function action({ request }) {
  const clientId = process.env.VITE_TIKTOK_CLIENT_KEY;
  const redirectUri = 'http://localhost:5175/callback';
  const scopes = 'user.info.basic,video.list';

  console.log('Login Action: Client ID:', clientId); // Debug
  if (!clientId) {
    console.error('VITE_TIKTOK_CLIENT_KEY is not defined in .env');
    return redirect('/login');
  }

  // Generate PKCE parameters
  const { codeVerifier, codeChallenge } = generatePKCE();
  console.log('Code Verifier:', codeVerifier); // Debug
  console.log('Code Challenge:', codeChallenge); // Debug

  // Store code_verifier in session
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  session.set('codeVerifier', codeVerifier);

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientId}&scope=${scopes}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=some_state&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  return redirect(authUrl, {
    headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
  });
}

export default function Login() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Connect Your TikTok Account</h1>
      <p>Please log in with your TikTok account to view your videos.</p>
      <TikTokLoginButton />
    </div>
  );
}