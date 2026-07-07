import { render, screen } from '@testing-library/react';
import App from './App';

// Basic render test for app shell.
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
