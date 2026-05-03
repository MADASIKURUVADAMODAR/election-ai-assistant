import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTruthGuardian } from '../hooks/useTruthGuardian';
import * as verifyRumorAction from '@/app/actions/verifyRumor';

vi.mock('@/app/actions/verifyRumor', () => ({
  verifyRumor: vi.fn(),
}));

describe('useTruthGuardian', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTruthGuardian());
    expect(result.current.rumorQuery).toBe('');
    expect(result.current.isVerifying).toBe(false);
    expect(result.current.verificationResult).toBe(null);
  });

  it('should handle rumor verification success', async () => {
    const mockResult = {
      status: 'FACT',
      explanation: 'Test explanation',
      reliabilityScore: 95,
      link: 'https://test.com',
    };
    
    (verifyRumorAction.verifyRumor as any).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useTruthGuardian());
    
    // Set query
    act(() => {
      result.current.setRumorQuery('Test rumor');
    });

    // Call verify
    let success;
    await act(async () => {
      success = await result.current.handleVerifyRumor();
    });

    expect(success).toBe(true);
    expect(verifyRumorAction.verifyRumor).toHaveBeenCalledWith('Test rumor');
    expect(result.current.verificationResult).toEqual(mockResult);
    expect(result.current.isVerifying).toBe(false);
  });

  it('should handle verification failure', async () => {
    (verifyRumorAction.verifyRumor as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTruthGuardian());
    
    act(() => {
      result.current.setRumorQuery('Test rumor');
    });

    let success;
    await act(async () => {
      success = await result.current.handleVerifyRumor();
    });

    expect(success).toBe(false);
    expect(result.current.verificationResult).toBe(null);
    expect(result.current.isVerifying).toBe(false);
  });

  it('should not verify if query is empty', async () => {
    const { result } = renderHook(() => useTruthGuardian());
    
    await act(async () => {
      await result.current.handleVerifyRumor();
    });

    expect(verifyRumorAction.verifyRumor).not.toHaveBeenCalled();
  });
});
