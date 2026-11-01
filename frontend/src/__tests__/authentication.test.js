import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('node-fetch', () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Authentication Component', () => {
  test('renders correctly', () => {
    render(<Authentication />);
    expect(screen.getByTestId('authentication-container')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<Authentication />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.ainative.studio/api/v1/auth',
      expect.anything()
    );
  });

  test('shows loading state during API call', async () => {
    global.fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));
    const user = userEvent.setup();
    render(<Authentication />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument());
  });

  test('handles API errors', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API request failed'))
    );
    const user = userEvent.setup();
    render(<Authentication />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getByText(/api request failed/i)).toBeInTheDocument());
  });

  test('is accessible', () => {
    const { container } = render(<Authentication />);
    expect(container).toHaveAccessibleName(/authentication/i);
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
  });
});