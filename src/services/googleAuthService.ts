/**
 * AURIS Sovereign Google OAuth 2.0 Integration Service
 * Uses official Google Identity Services (GIS) Web SDK.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: any) => void;
            prompt?: string;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

export interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}

export interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

// Retrieve Google Client ID from environment variables or stored override
export const getGoogleClientId = (): string => {
  const env = (import.meta as any).env || {};
  const candidates = [
    env.VITE_GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_ID,
    env.VITE_CLIENT_ID,
    env.CLIENT_ID
  ];

  for (const raw of candidates) {
    if (raw && typeof raw === 'string') {
      const cleaned = raw.replace(/^["']|["']$/g, '').trim();
      if (cleaned && !cleaned.includes('your_google_client_id') && !cleaned.includes('your_client_id')) {
        return cleaned;
      }
    }
  }

  const customSaved = localStorage.getItem('auris_custom_google_client_id');
  if (customSaved && customSaved.trim()) {
    return customSaved.replace(/^["']|["']$/g, '').trim();
  }

  return '';
};

export const saveCustomGoogleClientId = (clientId: string) => {
  const cleaned = clientId.replace(/^["']|["']$/g, '').trim();
  localStorage.setItem('auris_custom_google_client_id', cleaned);
};

/**
 * Ensures Google Identity Services (GIS) script is loaded
 */
export const ensureGisLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      return resolve();
    }
    const existing = document.querySelector('script[src*="gsi/client"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    } else {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (window.google?.accounts?.oauth2 || count > 20) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }
  });
};

/**
 * Executes Real Google OAuth 2.0 Popup Authentication
 */
export const triggerRealGoogleOAuth = async (
  customClientId?: string
): Promise<{ profile: GoogleUserProfile; accessToken: string }> => {
  await ensureGisLoaded();

  const clientId = (customClientId || getGoogleClientId()).trim();

  if (!clientId) {
    throw new Error('MISSING_CLIENT_ID');
  }

  return new Promise((resolve, reject) => {
    // If GIS Token Client is available, use official Google Identity Services
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          prompt: 'select_account',
          callback: async (tokenResponse: GoogleTokenResponse) => {
            if (tokenResponse.error) {
              return reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }

            if (!tokenResponse.access_token) {
              return reject(new Error('No access token returned from Google OAuth'));
            }

            try {
              // Fetch real user profile from Google's userinfo endpoint
              const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });

              if (!response.ok) {
                throw new Error(`Google UserInfo response error: ${response.statusText}`);
              }

              const profile: GoogleUserProfile = await response.json();
              resolve({
                profile,
                accessToken: tokenResponse.access_token
              });
            } catch (err: any) {
              reject(new Error(`Failed to fetch user profile from Google: ${err.message}`));
            }
          },
          error_callback: (err) => {
            reject(new Error(err?.message || 'Google OAuth prompt closed or failed.'));
          }
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err: any) {
        console.warn('GIS initTokenClient error, falling back to OAuth window:', err);
      }
    }

    // Direct Google OAuth 2.0 popup window fallback
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const redirectUri = window.location.origin;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;

    const popup = window.open(
      googleAuthUrl,
      'GoogleSignIn',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      return reject(new Error('POPUP_BLOCKED'));
    }

    // Poll for OAuth token returned in URL hash from popup
    const pollTimer = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(pollTimer);
          return reject(new Error('Google Sign-In window was closed.'));
        }

        if (popup.location.href.includes(window.location.origin)) {
          const hash = popup.location.hash;
          if (hash && hash.includes('access_token')) {
            clearInterval(pollTimer);
            popup.close();

            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');

            if (!accessToken) {
              return reject(new Error('No access token in redirect URL'));
            }

            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!response.ok) {
              throw new Error(`Google UserInfo API error: ${response.statusText}`);
            }

            const profile: GoogleUserProfile = await response.json();
            resolve({ profile, accessToken });
          }
        }
      } catch {
        // Cross-origin access while on accounts.google.com is expected, continue polling
      }
    }, 400);
  });
};
