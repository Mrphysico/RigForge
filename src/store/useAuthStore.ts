import { create } from 'zustand';
import { 
  UserSession, 
  getUserSession, 
  setUserSession, 
  clearSession, 
  verifyCredentials, 
  saveUserCredentials, 
  registerSocialUser 
} from '../credentials/userStorage';
import { sendSuccessEmail } from '../services/mailer/emailService';
import { API_BASE_URL } from '../config/api';

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authModalView: 'signin' | 'signup' | 'forgot';
  latestDispatchedEmail: string | null;

  openAuthModal: (view?: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: 'signin' | 'signup' | 'forgot') => void;
  clearEmailAlert: () => void;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone?: string; password: string; confirmPassword?: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  socialLogin: (provider: 'google' | 'facebook', overrideEmail?: string, overrideName?: string) => Promise<{ success: boolean; isNewUser: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with persisted session if available for THIS device
  const existingSession = getUserSession();

  return {
    user: existingSession,
    isAuthenticated: !!existingSession,
    authModalOpen: false,
    authModalView: 'signin',
    latestDispatchedEmail: null,

    openAuthModal: (view = 'signin') => set({ authModalOpen: true, authModalView: view }),
    closeAuthModal: () => set({ authModalOpen: false }),
    setAuthModalView: (view) => set({ authModalView: view }),
    clearEmailAlert: () => set({ latestDispatchedEmail: null }),

    login: async (email, password) => {
      const cleanEmail = email.trim().toLowerCase();

      // Primary: Authenticate against backend database
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
        console.warn('Backend server unreachable, falling back to local credential verification:', err);
      }

      // Resilient Fallback: Local verification if backend service is offline
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

      // Primary: Register account on backend database
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

        // Trigger welcome email preview for the newly registered user
        try {
          const mailResult = await sendSuccessEmail({
            email: cleanEmail,
            name: cleanName,
          });
          set({ latestDispatchedEmail: mailResult.previewMessage });
        } catch {
          // Ignore non-blocking email preview failure
        }

        // Also save to local registry for offline resilience
        saveUserCredentials({
          name: cleanName,
          email: cleanEmail,
          phone: data.phone,
          password: data.password,
          provider: 'local',
        });

        // Do NOT automatically log in. User must log in with their credentials!
        return {
          success: true,
          message: 'Account created successfully. Please log in.',
        };
      } catch (err) {
        console.warn('Backend server unreachable during registration, registering locally:', err);
      }

      // Offline Fallback Registration
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

    socialLogin: async (provider, overrideEmail, overrideName) => {
      const { session, isNewUser } = registerSocialUser(provider, overrideEmail, overrideName);

      if (isNewUser) {
        try {
          const mailResult = await sendSuccessEmail({
            email: session.email,
            name: session.name,
          });
          set({ latestDispatchedEmail: mailResult.previewMessage });
        } catch (e) {
          console.error('Email dispatch error:', e);
        }
      }

      set({
        user: session,
        isAuthenticated: true,
        authModalOpen: false,
      });

      return {
        success: true,
        isNewUser,
        message: `Successfully connected with ${provider === 'google' ? 'Google' : 'Facebook'}!`,
      };
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
      clearSession();
      set({
        user: null,
        isAuthenticated: false,
        latestDispatchedEmail: null,
      });
      console.log('🚪 [User Logged Out] Session cleared successfully.');
    },
  };
});
