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

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authModalView: 'signin' | 'signup';
  latestDispatchedEmail: string | null;

  openAuthModal: (view?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: 'signin' | 'signup') => void;
  clearEmailAlert: () => void;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<{ success: boolean; isNewUser: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with persisted session if available
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
      const result = verifyCredentials(email, password);
      if (!result.success || !result.user) {
        return { success: false, error: result.error || 'Authentication failed' };
      }

      const session = setUserSession(result.user);

      // Synchronize with backend API on port 5000
      try {
        const backendRes = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const backendData = await backendRes.json();
        if (backendData.token) {
          session.token = backendData.token;
        }
      } catch {
        // Backend offline or unreachable
      }

      set({
        user: session,
        isAuthenticated: true,
        authModalOpen: false,
      });

      return { success: true };
    },

    signup: async (data) => {
      const result = saveUserCredentials({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        provider: 'local',
      });

      if (!result.success || !result.user) {
        return { success: false, error: result.error || 'Registration failed' };
      }

      // Establish session
      const session = setUserSession(result.user);

      // Synchronize with backend API on port 5000 (MongoDB & Nodemailer)
      try {
        const backendRes = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
          }),
        });
        const backendData = await backendRes.json();
        if (backendData.token) {
          session.token = backendData.token;
        }
      } catch {
        // Backend offline or unreachable
      }

      // Automated Welcome Email Trigger immediately after sign-up
      try {
        const mailResult = await sendSuccessEmail({
          email: result.user.email,
          name: result.user.name,
        });

        set({
          user: session,
          isAuthenticated: true,
          authModalOpen: false,
          latestDispatchedEmail: mailResult.previewMessage,
        });
      } catch (e) {
        console.error('Email dispatch error:', e);
        set({
          user: session,
          isAuthenticated: true,
          authModalOpen: false,
        });
      }

      return { success: true };
    },

    socialLogin: async (provider) => {
      const { session, isNewUser } = registerSocialUser(provider);

      // If new social user, trigger confirmation email
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

    logout: () => {
      clearSession();
      set({
        user: null,
        isAuthenticated: false,
      });
    },
  };
});
