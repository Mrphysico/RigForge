/**
 * RigForge Real Google OAuth Service
 * Implements real Google Identity Services (GIS) and OAuth 2.0 with prompt='select_account'.
 * Never uses fake, hardcoded, or preset user profiles.
 * Identifies users deterministically by Google's stable unique `sub` identifier.
 */

import { API_BASE_URL } from '../../config/api';

export interface GoogleAuthProfile {
  sub: string;
  email: string;
  name: string;
  avatar?: string;
  idToken?: string;
  accessToken?: string;
}

export interface GoogleAuthResult {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    provider: 'google';
    providerAccountId: string;
    token: string;
  };
  error?: string;
}

declare global {
  interface Window {
    google?: any;
    __rigforge_gis_loaded?: boolean;
  }
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Dynamically loads the official Google Identity Services library
 */
export function loadGoogleGisScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.google?.accounts?.oauth2) return resolve(true);

    const existingScript = document.getElementById('google-gis-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gis-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.__rigforge_gis_loaded = true;
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Google GIS script from accounts.google.com');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

/**
 * Initiates the real Google OAuth flow.
 * Ensures Google presents the "Choose an account" dialog using prompt='select_account'.
 */
export async function initiateRealGoogleOAuth(): Promise<GoogleAuthResult> {
  if (!GOOGLE_CLIENT_ID) {
    return {
      success: false,
      error: 'Google OAuth Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your .env or Render environment variables.',
    };
  }

  const gisLoaded = await loadGoogleGisScript();

  if (gisLoaded && window.google?.accounts?.oauth2) {
    return new Promise((resolve) => {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid profile email',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              resolve({
                success: false,
                error: tokenResponse.error_description || tokenResponse.error || 'Google authentication was cancelled.',
              });
              return;
            }

            if (!tokenResponse.access_token) {
              resolve({
                success: false,
                error: 'No access token received from Google.',
              });
              return;
            }

            try {
              // Fetch verified Google user info directly from Google's API
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!userInfoRes.ok) {
                resolve({
                  success: false,
                  error: 'Failed to fetch verified user profile from Google.',
                });
                return;
              }

              const userInfo = await userInfoRes.json();
              // userInfo contains { sub, name, email, picture, email_verified }
              const authResult = await authenticateWithGoogleBackend({
                sub: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name || userInfo.email.split('@')[0],
                avatar: userInfo.picture,
                accessToken: tokenResponse.access_token,
              });

              resolve(authResult);
            } catch (err: any) {
              resolve({
                success: false,
                error: err.message || 'Error completing Google account verification.',
              });
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        console.warn('GIS Token client error, falling back to OAuth redirect:', err);
        fallbackToGoogleRedirect();
        resolve({ success: false, error: 'Redirecting to Google...' });
      }
    });
  } else {
    // Fallback: Standard Google OAuth 2.0 redirect flow
    fallbackToGoogleRedirect();
    return { success: false, error: 'Redirecting to Google account chooser...' };
  }
}

/**
 * Standard Google OAuth 2.0 redirect flow for browsers where popup/GIS is blocked
 */
export function fallbackToGoogleRedirect(): void {
  const currentOrigin = window.location.origin;
  const redirectUri = `${currentOrigin}/#google-callback`;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('prompt', 'select_account');

  window.location.href = authUrl.toString();
}

/**
 * Parses Google OAuth token from URL hash on redirect callback (#access_token=...)
 */
export async function handleGoogleRedirectCallback(): Promise<GoogleAuthResult | null> {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  if (!hash.includes('access_token')) return null;

  const params = new URLSearchParams(hash.replace(/^#\/?(google-callback)?(\?|&)?/, ''));
  const accessToken = params.get('access_token');

  if (!accessToken) return null;

  try {
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoRes.ok) {
      window.location.hash = '';
      return { success: false, error: 'Failed to verify Google access token.' };
    }

    const userInfo = await userInfoRes.json();
    const result = await authenticateWithGoogleBackend({
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split('@')[0],
      avatar: userInfo.picture,
      accessToken,
    });

    // Clean URL hash
    window.location.hash = '';
    return result;
  } catch (err: any) {
    window.location.hash = '';
    return { success: false, error: err.message || 'Error processing Google callback.' };
  }
}

/**
 * Sends verified Google identity to RigForge backend to link/create independent account
 */
export async function authenticateWithGoogleBackend(profile: GoogleAuthProfile): Promise<GoogleAuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sub: profile.sub,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        idToken: profile.idToken,
        accessToken: profile.accessToken,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.token) {
      return {
        success: true,
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
          role: data.user.role || 'customer',
          provider: 'google',
          providerAccountId: data.user.providerAccountId || profile.sub,
          token: data.token,
        },
      };
    } else {
      return {
        success: false,
        error: data.message || 'Google authentication rejected by server.',
      };
    }
  } catch (err: any) {
    console.warn('Backend server unreachable during Google OAuth:', err);
    return {
      success: false,
      error: 'Cannot reach RigForge authentication server. Please ensure backend is running.',
    };
  }
}
