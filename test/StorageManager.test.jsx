import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StorageManager from '../src/StorageManager.jsx';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('StorageManager', () => {
  it('loads local storage through executeScript and renders it as editable rows', async () => {
    chrome.tabs.query.mockImplementation((_query, cb) => cb([{ id: 1 }]));
    chrome.scripting.executeScript.mockImplementation((_opts, cb) =>
      cb([{ result: JSON.stringify({ token: 'abc' }) }])
    );

    render(<StorageManager />);
    fireEvent.click(screen.getByText('Load Storage Data'));

    await waitFor(() => expect(screen.getByText('token')).toBeInTheDocument());
    expect(screen.getByText('abc')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('filters rendered storage keys by the search box', async () => {
    chrome.tabs.query.mockImplementation((_query, cb) => cb([{ id: 1 }]));
    chrome.scripting.executeScript.mockImplementation((_opts, cb) =>
      cb([{ result: JSON.stringify({ token: 'abc', theme: 'dark' }) }])
    );

    render(<StorageManager />);
    fireEvent.click(screen.getByText('Load Storage Data'));
    await waitFor(() => expect(screen.getByText('token')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Search keys and values:'), {
      target: { value: 'theme' },
    });

    expect(screen.getByText('theme')).toBeInTheDocument();
    expect(screen.queryByText('token')).not.toBeInTheDocument();
  });

  it('surfaces an error when local storage cannot be read', async () => {
    chrome.tabs.query.mockImplementation((_query, cb) => cb([{ id: 1 }]));
    chrome.scripting.executeScript.mockImplementation((_opts, cb) => cb(null));

    render(<StorageManager />);
    fireEvent.click(screen.getByText('Load Storage Data'));

    await waitFor(() =>
      expect(screen.getByText(/Failed to load local storage/)).toBeInTheDocument()
    );
  });

  it('requires confirmation before clearing cookies', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    chrome.runtime.sendMessage.mockImplementation((_msg, cb) =>
      cb({ success: true, scope: 'example.com', removed: 3 })
    );

    render(<StorageManager />);
    fireEvent.click(screen.getByText('Clear Cookies'));

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() =>
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
        { action: 'clearCookies' },
        expect.any(Function)
      )
    );
    confirmSpy.mockRestore();
  });

  it('does not clear cookies when confirmation is declined', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<StorageManager />);
    fireEvent.click(screen.getByText('Clear Cookies'));

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
