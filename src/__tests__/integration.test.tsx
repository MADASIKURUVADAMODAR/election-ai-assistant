import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../app/page';

// Mock heavy dependencies
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,test',
  }),
}));

vi.mock('@/hooks/useUploadProcessor', () => ({
  useUploadProcessor: () => ({
    isDragging: false,
    uploadedImage: null,
    isScanning: false,
    showResults: false,
    voterData: null,
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    processFile: vi.fn(),
    resetUpload: vi.fn(),
  }),
}));

describe('Home Page Integration', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(screen.getByText(/VoterPulse Lens/i)).toBeInTheDocument();
  });

  it('renders the upload area', () => {
    render(<Home />);
    expect(screen.getByText(/Drag & Drop Image/i)).toBeInTheDocument();
  });

  it('shows readiness score', () => {
    render(<Home />);
    expect(screen.getByLabelText(/Current Voter Readiness Score/i)).toBeInTheDocument();
  });

  it('renders the Truth Guardian section', () => {
    render(<Home />);
    expect(screen.getByText(/The Truth Guardian/i)).toBeInTheDocument();
  });
});
