import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// Strict 30 minutes inactivity timeout: 30 * 60 * 1000 ms
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'rigforge_last_active_timestamp';

export function useAutoLogout(timeoutMs: number = INACTIVITY_TIMEOUT_MS) {
  const { isAuthenticated, logout, openAuthModal } = useAuthStore();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const performLogoutDueToInactivity = useCallback(() => {
    if (useAuthStore.getState().isAuthenticated) {
      console.warn('[Auto-Logout] Session expired due to 30 minutes of inactivity.');
      logout();
      setIsTimedOut(true);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    }
  }, [logout]);

  const updateActivity = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (useAuthStore.getState().isAuthenticated) {
      timerRef.current = setTimeout(() => {
        performLogoutDueToInactivity();
      }, timeoutMs);
    }
  }, [timeoutMs, performLogoutDueToInactivity]);

  // Check past elapsed inactivity on mount or storage events (multi-tab sync)
  const checkStoredInactivity = useCallback(() => {
    if (!useAuthStore.getState().isAuthenticated) return;

    const storedTimestampStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    const now = Date.now();

    if (storedTimestampStr) {
      const lastActive = parseInt(storedTimestampStr, 10);
      if (!isNaN(lastActive) && now - lastActive >= timeoutMs) {
        performLogoutDueToInactivity();
        return;
      }
    }

    updateActivity();
  }, [timeoutMs, performLogoutDueToInactivity, updateActivity]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Set initial activity check
    checkStoredInactivity();

    // User activity listeners
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const;

    // Throttled event listener to avoid unnecessary execution
    let throttleTimeout: NodeJS.Timeout | null = null;
    const handleUserInteraction = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          updateActivity();
          throttleTimeout = null;
        }, 1000); // Throttled to max once per second
      }
    };

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleUserInteraction, { passive: true });
    });

    // Handle cross-tab storage synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY) {
        checkStoredInactivity();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserInteraction);
      });
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, checkStoredInactivity, updateActivity]);

  const dismissTimeoutModal = useCallback(() => {
    setIsTimedOut(false);
  }, []);

  const handleSignInAgain = useCallback(() => {
    setIsTimedOut(false);
    openAuthModal('signin');
  }, [openAuthModal]);

  return {
    isTimedOut,
    dismissTimeoutModal,
    handleSignInAgain,
  };
}
