// Copyright 2026 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

export type ScreenShareResolution = '480p' | '720p' | '1080p' | 'source';
export type ScreenShareFps = 15 | 30 | 60;
export type ScreenShareMode = 'motion' | 'detail';

export type ScreenShareSettings = {
  resolution: ScreenShareResolution;
  framerate: ScreenShareFps;
  mode: ScreenShareMode;
};

export const DEFAULT_SCREEN_SHARE_SETTINGS: ScreenShareSettings = {
  resolution: '720p',
  framerate: 30,
  mode: 'motion',
};

const STORAGE_KEY = 'signal-screen-share-settings';

let currentSettings: ScreenShareSettings = { ...DEFAULT_SCREEN_SHARE_SETTINGS };

export function loadScreenShareSettings(): ScreenShareSettings {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      currentSettings = { ...DEFAULT_SCREEN_SHARE_SETTINGS, ...parsed };
      return currentSettings;
    }
  } catch {
    // Ignore storage errors
  }
  return currentSettings;
}

export function saveScreenShareSettings(settings: ScreenShareSettings): void {
  currentSettings = { ...settings };
  try {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  } catch {
    // Ignore storage errors
  }
}

export function getScreenShareSettings(): ScreenShareSettings {
  return currentSettings;
}

export function getResolutionDimensions(resolution: ScreenShareResolution): {
  width: number;
  height: number;
} {
  switch (resolution) {
    case '480p':
      return { width: 854, height: 480 };
    case '720p':
      return { width: 1280, height: 720 };
    case '1080p':
      return { width: 1920, height: 1080 };
    case 'source':
    default:
      return { width: 2880, height: 1800 };
  }
}
