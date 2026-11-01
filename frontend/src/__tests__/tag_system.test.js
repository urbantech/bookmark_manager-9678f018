import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('https://api.ainative.studio', () => ({
  fetchTags: jest.fn(),
}));

import { fetchTags } from 'https://api.ainative.studio';
import TagSystem from '../components/TagSystem';

describe('TagSystem Component', () => {
  beforeEach(() => {
    fetchTags.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    fetchTags.mockResolvedValue({ tags: ['React', 'Testing', 'Library'] });
    render(<TagSystem />);
    await waitFor(() => expect(screen.getByTestId('tag_system-container')).toBeInTheDocument());
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Library/i)).toBeInTheDocument();
  });

  test('handles user interactions', async () => {
    fetchTags.mockResolvedValue({ tags: ['React', 'Testing', 'Library'] });
    render(<TagSystem />);
    const input = await screen.findByRole('textbox');
    userEvent.type(input, 'NewTag');
    expect(input.value).toBe('NewTag');
    const button = screen.getByRole('button', { name: /Add Tag/i });
    userEvent.click(button);
    expect(screen.getByText(/NewTag/i)).toBeInTheDocument();
  });

  test('shows loading state', async () => {
    fetchTags.mockImplementation(() => new Promise(() => {}));
    render(<TagSystem />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('handles API errors', async () => {
    fetchTags.mockRejectedValue(new Error('API Error'));
    render(<TagSystem />);
    await waitFor(() => expect(screen.getByText(/Failed to load tags/i)).toBeInTheDocument());
  });

  test('is accessible', async () => {
    fetchTags.mockResolvedValue({ tags: ['React', 'Testing', 'Library'] });
    render(<TagSystem />);
    expect(screen.getByRole('heading', { name: /Tags/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAccessibleName(/Add new tag/i);
    expect(screen.getByRole('button', { name: /Add Tag/i })).toBeEnabled();
  });
});