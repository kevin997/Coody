'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AntiCheatConfig {
  assessmentId: string;
  enabled: boolean;
  onViolation?: (type: string, count: number, isDisqualified: boolean) => void;
  onDisqualified?: () => void;
}

export function useAntiCheat({ assessmentId, enabled, onViolation, onDisqualified }: AntiCheatConfig) {
  const violationCount = useRef(0);

  const logViolation = useCallback(
    async (type: string, details?: Record<string, any>) => {
      if (!enabled) return;

      try {
        const res = await fetch(`/api/assessments/${assessmentId}/violations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, details }),
        });

        if (res.ok) {
          const data = await res.json();
          violationCount.current = data.violationsCount;
          onViolation?.(type, data.violationsCount, data.isDisqualified);

          if (data.isDisqualified) {
            onDisqualified?.();
          }
        }
      } catch (error) {
        console.error('Failed to log violation:', error);
      }
    },
    [assessmentId, enabled, onViolation, onDisqualified]
  );

  useEffect(() => {
    if (!enabled) return;

    // 1. Tab/Window visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('TAB_SWITCH', { away_at: new Date().toISOString() });
      }
    };

    // 2. Window blur (switching windows)
    const handleBlur = () => {
      logViolation('WINDOW_BLUR', { timestamp: new Date().toISOString() });
    };

    // 3. Copy/Paste prevention (except in code editor)
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.code-editor-area')) {
        e.preventDefault();
        logViolation('COPY_PASTE', { action: 'copy' });
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.code-editor-area')) {
        e.preventDefault();
        logViolation('COPY_PASTE', { action: 'paste' });
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.code-editor-area')) {
        e.preventDefault();
        logViolation('COPY_PASTE', { action: 'cut' });
      }
    };

    // 4. Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.code-editor-area')) {
        e.preventDefault();
        logViolation('RIGHT_CLICK');
      }
    };

    // 5. Dev tools detection
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        logViolation('DEV_TOOLS', { key: 'F12' });
        return;
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        logViolation('DEV_TOOLS', { key: `Ctrl+Shift+${e.key.toUpperCase()}` });
        return;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault();
        logViolation('DEV_TOOLS', { key: 'Ctrl+U' });
        return;
      }
    };

    // 6. Fullscreen exit detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation('FULLSCREEN_EXIT');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enabled, logViolation]);

  const requestFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {
      // Fullscreen may be blocked by browser
    });
  }, []);

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen?.().catch(() => {});
  }, []);

  return {
    violationCount: violationCount.current,
    requestFullscreen,
    exitFullscreen,
    logViolation,
  };
}
