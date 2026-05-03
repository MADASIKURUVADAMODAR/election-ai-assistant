import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('VoterPulse Lens UI', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByText(/VoterPulse Lens/i);
    expect(heading).toBeDefined();
  });

  it('renders the upload button/area', () => {
    render(<Home />);
    const uploadArea = screen.getByLabelText(/Upload voter document image/i);
    expect(uploadArea).toBeDefined();
  });

  it('renders the description text', () => {
    render(<Home />);
    const description = screen.getByText(/Upload voter data imagery to extract real-time demographic and profile insights/i);
    expect(description).toBeDefined();
  });
});
