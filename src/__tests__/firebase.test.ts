import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  isSupported: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => ({})),
}));

describe('Firebase Configuration', () => {
  it('should initialize firebase services', async () => {
    const config = await import('../lib/firebaseConfig');
    expect(config.auth).toBeDefined();
    expect(config.db).toBeDefined();
    expect(config.storage).toBeDefined();
  });
});
