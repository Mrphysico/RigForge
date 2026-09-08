/**
 * RigForge Secure User Storage & Session Management
 * Isolates user credential registry, authentication validation, and session tokens.
 */

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  provider: 'local' | 'google' | 'facebook';
  avatar?: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: 'local' | 'google' | 'facebook';
  token: string;
  loginAt: string;
  avatar?: string;
}

const USERS_STORAGE_KEY = 'rigforge_users';
const SESSION_STORAGE_KEY = 'rigforge_active_session';

/**
 * Fetch all registered users from local persistence
 */
export function getRegisteredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read registered users:', error);
    return [];
  }
}

/**
 * Persists a new user account into credentials storage
 */
export function saveUserCredentials(user: Omit<UserAccount, 'id' | 'createdAt'>): { success: boolean; user?: UserAccount; error?: string } {
  try {
    const existingUsers = getRegisteredUsers();
    
    // Check if email is already taken
    const normalizedEmail = user.email.toLowerCase().trim();
    if (existingUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: UserAccount = {
      ...user,
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));

    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error saving user credentials:', error);
    return { success: false, error: 'Failed to save account credentials.' };
  }
}

/**
 * Verifies email & password against stored credentials
 */
export function verifyCredentials(email: string, password: string): { success: boolean; user?: UserAccount; error?: string } {
  try {
    const existingUsers = getRegisteredUsers();
    const normalizedEmail = email.toLowerCase().trim();

    const matchedUser = existingUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!matchedUser) {
      return { success: false, error: 'No account registered with this email.' };
    }

    if (matchedUser.provider !== 'local') {
      return {
        success: false,
        error: `This account was registered via ${matchedUser.provider.toUpperCase()}. Please use the social login button.`,
      };
    }

    if (matchedUser.password !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    return { success: true, user: matchedUser };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return { success: false, error: 'Authentication verification error.' };
  }
}

/**
 * Creates and stores an active authenticated session
 */
export function setUserSession(user: UserAccount): UserSession {
  const session: UserSession = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    provider: user.provider,
    token: 'jwt_rf_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
    loginAt: new Date().toISOString(),
    avatar: user.avatar,
  };

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to write active session:', error);
  }

  return session;
}

/**
 * Retrieves current active session from storage
 */
export function getUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read session:', error);
    return null;
  }
}

/**
 * Clears active session (Logout)
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Simulates a Social OAuth registration or login (Google / Facebook)
 */
export function registerSocialUser(provider: 'google' | 'facebook'): { session: UserSession; isNewUser: boolean } {
  const existingUsers = getRegisteredUsers();

  const mockSocialData = provider === 'google' 
    ? {
        name: 'Arth Jadav',
        email: 'jadavarth07@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      }
    : {
        name: 'Arth Jadav',
        email: 'jadavarth07@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      };

  let user = existingUsers.find((u) => u.email === mockSocialData.email);
  let isNewUser = false;

  if (!user) {
    user = {
      id: 'usr_' + provider + '_' + Math.random().toString(36).substring(2, 7),
      name: mockSocialData.name,
      email: mockSocialData.email,
      provider,
      avatar: mockSocialData.avatar,
      createdAt: new Date().toISOString(),
    };
    existingUsers.push(user);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
    isNewUser = true;
  }

  const session = setUserSession(user);
  return { session, isNewUser };
}
