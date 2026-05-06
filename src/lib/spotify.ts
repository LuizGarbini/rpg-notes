/**
 * Spotify OAuth PKCE Flow & API Helpers
 */

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/spotify-callback";

/**
 * Gera uma string aleatória para o code_verifier
 */
export function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

/**
 * Faz o hash SHA-256 do verifier
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

/**
 * Encodação Base64URL
 */
function base64urlencode(a: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Inicia o fluxo de autorização do Spotify
 */
export async function redirectToSpotifyAuth() {
  if (!SPOTIFY_CLIENT_ID) {
    console.error("VITE_SPOTIFY_CLIENT_ID não configurado.");
    return;
  }

  const verifier = generateRandomString(64);
  const hashed = await sha256(verifier);
  const challenge = base64urlencode(hashed);
  const state = generateRandomString(16);

  window.localStorage.setItem('spotify_code_verifier', verifier);
  window.localStorage.setItem('spotify_auth_state', state);

  const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
  
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: REDIRECT_URI,
    state: state,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

/**
 * Troca o código de autorização pelo Access Token
 */
export async function getSpotifyToken(code: string): Promise<any> {
  const verifier = window.localStorage.getItem('spotify_code_verifier');

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier || "",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  return response.json();
}

/**
 * Busca o perfil do usuário
 */
export async function getUserProfile(accessToken: string) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar perfil: ${response.status}`);
  }

  return response.json();
}

/**
 * Busca o estado atual de reprodução (opcional)
 */
export async function getCurrentlyPlaying(accessToken: string) {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  return response.json();
}
