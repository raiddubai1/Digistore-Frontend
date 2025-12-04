import { useState, useCallback, useEffect } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
  blockDurationMs: number; // Block duration in milliseconds
  storageKey: string;
}

interface RateLimitState {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil: number | null;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  storageKey: 'rate_limit_state',
};

export function useRateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [state, setState] = useState<RateLimitState>(() => {
    if (typeof window === 'undefined') {
      return { attempts: 0, firstAttemptTime: 0, blockedUntil: null };
    }
    
    const stored = localStorage.getItem(finalConfig.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if the block has expired
        if (parsed.blockedUntil && Date.now() > parsed.blockedUntil) {
          return { attempts: 0, firstAttemptTime: 0, blockedUntil: null };
        }
        // Check if the window has expired
        if (parsed.firstAttemptTime && Date.now() - parsed.firstAttemptTime > finalConfig.windowMs) {
          return { attempts: 0, firstAttemptTime: 0, blockedUntil: null };
        }
        return parsed;
      } catch {
        return { attempts: 0, firstAttemptTime: 0, blockedUntil: null };
      }
    }
    return { attempts: 0, firstAttemptTime: 0, blockedUntil: null };
  });

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(finalConfig.storageKey, JSON.stringify(state));
    }
  }, [state, finalConfig.storageKey]);

  // Check if currently blocked
  const isBlocked = useCallback(() => {
    if (!state.blockedUntil) return false;
    return Date.now() < state.blockedUntil;
  }, [state.blockedUntil]);

  // Get remaining block time in seconds
  const getRemainingBlockTime = useCallback(() => {
    if (!state.blockedUntil || Date.now() >= state.blockedUntil) return 0;
    return Math.ceil((state.blockedUntil - Date.now()) / 1000);
  }, [state.blockedUntil]);

  // Get remaining attempts
  const getRemainingAttempts = useCallback(() => {
    if (isBlocked()) return 0;
    return Math.max(0, finalConfig.maxAttempts - state.attempts);
  }, [state.attempts, finalConfig.maxAttempts, isBlocked]);

  // Record an attempt
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    
    setState((prevState) => {
      // If blocked, don't record
      if (prevState.blockedUntil && now < prevState.blockedUntil) {
        return prevState;
      }
      
      // Reset if window expired
      if (prevState.firstAttemptTime && now - prevState.firstAttemptTime > finalConfig.windowMs) {
        return { attempts: 1, firstAttemptTime: now, blockedUntil: null };
      }
      
      const newAttempts = prevState.attempts + 1;
      
      // Block if max attempts reached
      if (newAttempts >= finalConfig.maxAttempts) {
        return {
          attempts: newAttempts,
          firstAttemptTime: prevState.firstAttemptTime || now,
          blockedUntil: now + finalConfig.blockDurationMs,
        };
      }
      
      return {
        attempts: newAttempts,
        firstAttemptTime: prevState.firstAttemptTime || now,
        blockedUntil: null,
      };
    });
  }, [finalConfig.windowMs, finalConfig.maxAttempts, finalConfig.blockDurationMs]);

  // Reset on successful login
  const reset = useCallback(() => {
    setState({ attempts: 0, firstAttemptTime: 0, blockedUntil: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(finalConfig.storageKey);
    }
  }, [finalConfig.storageKey]);

  return {
    isBlocked,
    getRemainingBlockTime,
    getRemainingAttempts,
    recordAttempt,
    reset,
    attempts: state.attempts,
  };
}

