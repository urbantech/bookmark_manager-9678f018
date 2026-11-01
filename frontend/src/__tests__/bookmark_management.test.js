import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('BookmarkManagement Component', () => {
  const mockBookmarks = [
    { id: 1, url: 'https://example.com', title: 'Example', tags: ['test'] },
    { id: 2, url: 'https://another-example.com', title: 'Another Example', tags: ['sample'] }
  ];

  const mockFetch = (data, status = 200) => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(data),
      ok: status >= 200 && status < 300,
      status
    });
  };

  test('renders correctly', async () => {
    mockFetch(mockBookmarks);
    render(<BookmarkManagement />);
    await waitFor(() => expect(screen.getByTestId('bookmark_management-container')).toBeInTheDocument());
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('Another Example')).toBeInTheDocument();
  });

  test('handles user interactions to add a bookmark', async () => {
    mockFetch(mockBookmarks);
    mockFetch({ success: true }, 201);
    render(<BookmarkManagement />);
    await waitFor(() => expect(screen.getByTestId('bookmark_management-container')).toBeInTheDocument());
    userEvent.type(screen.getByPlaceholderText('Enter URL'), 'https://new-example.com');
    userEvent.type(screen.getByPlaceholderText('Enter Title'), 'New Example');
    userEvent.click(screen.getByText('Add Bookmark'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.ainative.studio/api/v1/bookmarks',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ url: 'https://new-example.com', title: 'New Example', tags: [] })
      })
    );
  });

  test('shows loading state while fetching bookmarks', async () => {
    global.fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<BookmarkManagement />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });

  test('handles API errors when fetching bookmarks', async () => {
    mockFetch({ message: 'Error fetching bookmarks' }, 500);
    render(<BookmarkManagement />);
    await waitFor(() => expect(screen.getByText('Failed to load bookmarks')).toBeInTheDocument());
  });

  test('is accessible', async () => {
    mockFetch(mockBookmarks);
    render(<BookmarkManagement />);
    await waitFor(() => expect(screen.getByTestId('bookmark_management-container')).toBeInTheDocument());
    expect(await screen.findByText('Example')).toHaveAttribute('role', 'link');
    expect(screen.getByText('Another Example')).toHaveAttribute('role', 'link');
    expect(screen.getByPlaceholderText('Enter URL')).toBeAccessible();
    expect(screen.getByPlaceholderText('Enter Title')).toBeAccessible();
    expect(screen.getByText('Add Bookmark')).toBeAccessible();
  });
});