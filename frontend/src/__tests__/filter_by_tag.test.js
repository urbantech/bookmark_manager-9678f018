import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

const mockTags = ['React', 'JavaScript', 'Testing'];

const mockedFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockedFetch;
  mockedFetch.mockClear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FilterByTag Component', () => {
  it('renders correctly', async () => {
    mockedFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockTags) });
    render(<FilterByTag />);
    await waitFor(() => expect(screen.getByText('Filter by Tag')).toBeInTheDocument());
    expect(screen.getByTestId('filter_by_tag-container')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    mockedFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockTags) });
    render(<FilterByTag />);
    await waitFor(() => expect(screen.getAllByRole('button').length).toBeGreaterThan(0));
    const firstTagButton = screen.getAllByRole('button')[0];
    userEvent.click(firstTagButton);
    expect(firstTagButton).toHaveClass('active');
  });

  it('shows loading state', async () => {
    mockedFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 2000)));
    render(<FilterByTag />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it('handles API errors', async () => {
    mockedFetch.mockRejectedValue(new Error('API error'));
    render(<FilterByTag />);
    await waitFor(() => expect(screen.getByText(/error loading tags/i)).toBeInTheDocument());
  });

  it('is accessible', async () => {
    mockedFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockTags) });
    render(<FilterByTag />);
    await waitFor(() => expect(screen.getAllByRole('button').length).toBeGreaterThan(0));
    const firstTagButton = screen.getAllByRole('button')[0];
    expect(firstTagButton).toHaveAttribute('aria-label', `Filter by ${firstTagButton.textContent}`);
  });
});