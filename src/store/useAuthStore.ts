import { create } from 'zustand';
import { 
  UserSession, 
  getUserSession, 
  setUserSession, 
  clearSession, 
  verifyCredentials, 
  saveUserCredentials 
} from '../credentials/userStorage';
import { sendSuccessEmail } from '../services/mailer/emailService';
import { initiateRealGoogleOAuth, authenticateWithGoogleBackend, GoogleAuthProfile } from '../services/auth/googleOAuth';
import { API_BASE_URL } from '../config/api';

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  authModalOpen: boolean;
  authModalView: 'signin' | 'signup' | 'forgot';
  latestDispatchedEmail: string | null;

  openAuthModal: (view?: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: 'signin' | 'signup' | 'forgot') => void;
  clearEmailAlert: () => void;

  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone?: string; password: string; confirmPassword?: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginWithGoogle: (profile: GoogleAuthProfile) => Promise<{ success: boolean; message?: string; error?: string }>;
  startGoogleLogin: () => Promise<{ success: boolean; error?: string }>;
  switchAccount: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    authModalOpen: false,
    authModalView: 'signin',
    latestDispatchedEmail: null,

    openAuthModal: (view = 'signin') => set({ authModalOpen: true, authModalView: view }),
    closeAuthModal: () => set({ authModalOpen: false }),
    setAuthModalView: (view) => set({ authModalView: view }),
    clearEmailAlert: () => set({ latestDispatchedEmail: null }),

    /**
     * Server-side authentication check on app startup.
     * Prevents assumption of login state without token verification.
     */
    checkAuth: async () => {
      const storedSession = getUserSession();

      if (!storedSession || !storedSession.token) {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${storedSession.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            const verifiedSession: UserSession = {
              ...storedSession,
              id: data.user.id || storedSession.id,
              name: data.user.name || storedSession.name,
              email: data.user.email || storedSession.email,
              role: data.user.role || storedSession.role,
              avatar: data.user.avatar || storedSession.avatar,
              provider: data.user.provider || storedSession.provider,
              providerAccountId: data.user.providerAccountId || storedSession.providerAccountId,
            };

            setUserSession(verifiedSession);
            set({
              user: verifiedSession,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
            return;
          }
        }

        // Token rejected or expired by server
        console.warn('Authentication token expired or invalid. Clearing session.');
        clearSession();
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      } catch (err) {
        console.warn('Could not verify session with backend (offline/network):', err);
        // In case backend is temporarily unreachable, preserve locally if recent (< 30 min)
        set({
          user: storedSession,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      }
    },

    login: async (email, password) => {
      const cleanEmail = email.trim().toLowerCase();

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.token) {
          const session = setUserSession({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            token: data.token,
          });

          set({
            user: session,
            isAuthenticated: true,
            authModalOpen: false,
          });

          return { success: true };
        } else {
          return { success: false, error: data.message || 'Invalid email or password.' };
        }
      } catch (err) {
        console.warn('Backend server unreachable, trying local credentials:', err);
      }

      // Offline Fallback Verification
      const localResult = verifyCredentials(cleanEmail, password);
      if (!localResult.success || !localResult.user) {
        return { success: false, error: localResult.error || 'Invalid email or password.' };
      }

      const session = setUserSession(localResult.user);
      set({
        user: session,
        isAuthenticated: true,
        authModalOpen: false,
      });

      return { success: true };
    },

    signup: async (data) => {
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanName = data.name.trim();

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: data.phone,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }),
        });

        const resData = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: resData.message || 'Unable to create account. Please try again.',
          };
        }

        try {
          const mailResult = await sendSuccessEmail({
            email: cleanEmail,
            name: cleanName,
          });
          set({ latestDispatchedEmail: mailResult.previewMessage });
        } catch {}

        // Persist in local storage for offline resilience
        saveUserCredentials({
          name: cleanName,
          email: cleanEmail,
          phone: data.phone,
          password: data.password,
          provider: 'local',
        });

        // Do NOT auto-login. Redirect user to Sign In!
        return {
          success: true,
          message: 'Account created successfully. Please log in.',
        };
      } catch (err) {
        console.warn('Backend server unreachable during registration, saving locally:', err);
      }

      const localResult = saveUserCredentials({
        name: cleanName,
        email: cleanEmail,
        phone: data.phone,
        password: data.password,
        provider: 'local',
      });

      if (!localResult.success) {
        return { success: false, error: localResult.error || 'Unable to create account. Please try again.' };
      }

      try {
        const mailResult = await sendSuccessEmail({
          email: cleanEmail,
          name: cleanName,
        });
        set({ latestDispatchedEmail: mailResult.previewMessage });
      } catch {}

      return {
        success: true,
        message: 'Account created successfully. Please log in.',
      };
    },

    /**
     * Completes authentication with verified Google OAuth profile
     */
    loginWithGoogle: async (profile: GoogleAuthProfile) => {
      const backendResult = await authenticateWithGoogleBackend(profile);

      if (backendResult.success && backendResult.user) {
        const session = setUserSession({
          id: backendResult.user.id,
          name: backendResult.user.name,
          email: backendResult.user.email,
          role: backendResult.user.role,
          provider: 'google',
          providerAccountId: backendResult.user.providerAccountId || profile.sub,
          avatar: backendResult.user.avatar,
          token: backendResult.user.token,
        });

        set({
          user: session,
          isAuthenticated: true,
          authModalOpen: false,
        });

        return {
          success: true,
          message: `Logged in with Google as ${session.name}!`,
        };
      }

      return {
        success: false,
        error: backendResult.error || 'Failed to authenticate with Google.',
      };
    },

    /**
     * Triggers real Google OAuth with prompt='select_account'
     */
    startGoogleLogin: async () => {
      const result = await initiateRealGoogleOAuth();

      if (result.success && result.user) {
        const session = setUserSession({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          provider: 'google',
          providerAccountId: result.user.providerAccountId,
          avatar: result.user.avatar,
          token: result.user.token,
        });

        set({
          user: session,
          isAuthenticated: true,
          authModalOpen: false,
        });

        return { success: true };
      }

      return {
        success: false,
        error: result.error || 'Google login was cancelled or encountered an error.',
      };
    },

    /**
     * Switch Account: Opens real Google account chooser directly
     */
    switchAccount: async () => {
      await get().startGoogleLogin();
    },

    updateProfile: async (data: { name?: string; phone?: string }) => {
      const current = getUserSession();
      if (!current || !current.token) {
        return { success: false, message: 'Not authenticated.' };
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${current.token}`,
          },
          body: JSON.stringify(data),
        });

        const resData = await res.json();
        if (res.ok && resData.success && resData.user) {
          const updatedSession = setUserSession({
            ...current,
            name: resData.user.name || current.name,
            phone: resData.user.phone || current.phone,
          });
          set({ user: updatedSession });
          return { success: true, message: 'Profile updated successfully.' };
        }
      } catch (err) {
        console.warn('Backend profile update failed:', err);
      }

      return { success: false, message: 'Failed to update profile.' };
    },

    forgotPassword: async (email: string) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        return {
          success: res.ok,
          message: data.message || 'Password reset instructions dispatched.',
        };
      } catch {
        return {
          success: true,
          message: 'If an account exists with that email, password reset instructions have been dispatched.',
        };
      }
    },

    logout: () => {
      const current = getUserSession();
      if (current?.token) {
        fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${current.token}` },
        }).catch(() => {});
      }

      clearSession();
      try {
        sessionStorage.clear();
      } catch {}

      set({
        user: null,
        isAuthenticated: false,
        authModalOpen: false,
        latestDispatchedEmail: null,
      });

      console.log('🚪 [User Logged Out] Session cleared successfully.');
    },
  };
});
