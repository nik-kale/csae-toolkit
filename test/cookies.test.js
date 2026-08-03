import { describe, it, expect } from 'vitest';
import { cookieRemovalUrl, isFromExtensionPage } from '../src/lib/cookies.js';

describe('cookieRemovalUrl', () => {
  it('strips the leading dot from domain cookies', () => {
    expect(cookieRemovalUrl({ domain: '.example.com', path: '/', secure: true })).toBe(
      'https://example.com/'
    );
  });

  it('uses http for non-secure cookies and keeps the path', () => {
    expect(cookieRemovalUrl({ domain: 'example.com', path: '/app', secure: false })).toBe(
      'http://example.com/app'
    );
  });

  it('defaults an empty path to /', () => {
    expect(cookieRemovalUrl({ domain: 'example.com', secure: true })).toBe('https://example.com/');
  });
});

describe('isFromExtensionPage', () => {
  it('accepts messages from the extension pages (no tab)', () => {
    expect(isFromExtensionPage({ id: 'abc' }, 'abc')).toBe(true);
  });

  it('rejects messages that carry a tab (content scripts / web pages)', () => {
    expect(isFromExtensionPage({ id: 'abc', tab: { id: 1 } }, 'abc')).toBe(false);
  });

  it('rejects messages from a different extension id', () => {
    expect(isFromExtensionPage({ id: 'evil' }, 'abc')).toBe(false);
  });

  it('rejects a missing sender', () => {
    expect(isFromExtensionPage(undefined, 'abc')).toBe(false);
  });
});
