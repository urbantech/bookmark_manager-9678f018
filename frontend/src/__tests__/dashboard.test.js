import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

describe('Dashboard Component', () => {
  const mockBookmarks = [
    { id: 1, title: 'Example Bookmark 1', url: 'http://example1.com', tags: ['tag1', 'tag2'] },
    { id: 2, title: 'Example Bookmark 2', url: 'http://example2.com', tags: ['tag2', 'tag3'] }
  ];

  const mockFetch = (data, status = 200) => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(data),
        status: status
      })
    );
  };

  beforeEach(() => {
    global.fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with bookmarks', async () => {
    mockFetch(mockBookmarks);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Example Bookmark 1')).toBeInTheDocument());
    expect(screen.getByText('Example Bookmark 2')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
  });

  test('shows loading state while fetching bookmarks', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    mockFetch({}, 500);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Failed to load bookmarks. Please try again later.')).toBeInTheDocument());
  });

  test('filters bookmarks by tag', async () => {
    mockFetch(mockBookmarks);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Example Bookmark 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Example Bookmark 2')).toBeInTheDocument());

    const tagButton = screen.getByRole('button', { name: /tag2/i });
    userEvent.click(tagButton);

    expect(screen.getByText('Example Bookmark 1')).toBeInTheDocument();
    expect(screen.getByText('Example Bookmark 2')).toBeInTheDocument();

    const anotherTagButton = screen.getByRole('button', { name: /tag1/i });
    userEvent.click(anotherTagButton);

    expect(screen.getByText('Example Bookmark 1')).toBeInTheDocument();
    expect(screen.queryByText('Example Bookmark 2')).not.toBeInTheDocument();
  });

  test('is accessible', async () => {
    mockFetch(mockBookmarks);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Example Bookmark 1')).toBeInTheDocument());
    expect(screen.getByTestId('dashboard-container')).toHaveAttribute('role', 'region');
    expect(screen.getByTestId('dashboard-container')).toHaveAccessibleName('Bookmark Dashboard');
  });
});