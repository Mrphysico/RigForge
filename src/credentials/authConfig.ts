/**
 * RigForge Authentication & Social Provider Credentials Configuration
 * Isolates third-party API keys and OAuth Client IDs.
 */

export interface AuthProviderConfig {
  clientId: string;
  enabled: boolean;
  scopes: string[];
}

export const AUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1048291048291-rigforge-dev-client.apps.googleusercontent.com',
    enabled: true,
    scopes: ['profile', 'email'],
  } as AuthProviderConfig,

  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '987654321098765-rigforge-fb-dev',
    enabled: true,
    scopes: ['public_profile', 'email'],
  } as AuthProviderConfig,

  session: {
    cookieExpiryDays: 30,
    storagePrefix: 'rigforge_',
  },
};
