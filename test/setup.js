import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Minimal chrome API surface. Tests override individual method implementations
// with mockImplementation as needed.
globalThis.chrome = {
  runtime: { sendMessage: vi.fn(), lastError: null, id: 'test-ext' },
  tabs: { query: vi.fn(), sendMessage: vi.fn(), create: vi.fn() },
  scripting: { executeScript: vi.fn() },
  cookies: { getAll: vi.fn(), remove: vi.fn() },
  storage: { local: { get: vi.fn(), set: vi.fn() } },
};
