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
  providerAccountId?: string;
  avatar?: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  provider?: 'local' | 'google' | 'facebook';
  providerAccountId?: string;
  token: string;
  loginAt: string;
  avatar?: string;
}

const USERS_STORAGE_KEY = 'rigforge_users';
const SESSION_STORAGE_KEY = 'rigforge_active_session';
const LAST_ACTIVITY_KEY = 'rigforge_last_active_timestamp';

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
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
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
      return { success: false, error: 'Invalid email or password.' };
    }

    if (matchedUser.provider !== 'local') {
      return {
        success: false,
        error: `This account was registered via ${matchedUser.provider.toUpperCase()}. Please use the social login button.`,
      };
    }

    if (matchedUser.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
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
export function setUserSession(user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  provider?: 'local' | 'google' | 'facebook';
  providerAccountId?: string;
  token?: string;
  avatar?: string;
}): UserSession {
  const session: UserSession = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    provider: user.provider || 'local',
    providerAccountId: user.providerAccountId,
    token: user.token || ('jwt_rf_' + Math.random().toString(36).substring(2) + Date.now().toString(36)),
    loginAt: new Date().toISOString(),
    avatar: user.avatar,
  };

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
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
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
