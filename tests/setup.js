import { beforeEach, vi } from 'vitest';

// jQuery stub — the source files call $(...) for UI toggling only.
// Tests assert logic and CSV output, not UI state, so stubs are sufficient.
global.$ = (selector) => ({
  addClass: vi.fn(),
  removeClass: vi.fn(),
  find: vi.fn(() => ({ remove: vi.fn() })),
  html: vi.fn(() => ''),
  on: vi.fn(),
  ready: vi.fn((fn) => fn()),
  remove: vi.fn(),
  length: 0,
});
global.$.fn = {};

beforeEach(() => {
  // Reset DOM to a clean slate before every test.
  document.body.innerHTML = '';
});
