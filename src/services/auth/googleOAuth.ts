/**
 * RigForge Google OAuth & Account Chooser Service
 * Implements prompt='select_account' to ensure modern Google account selection.
 * Prevents silent reuse of previous Google accounts on shared computers/devices.
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
