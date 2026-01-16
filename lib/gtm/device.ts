/**
 * Device and browser information collection
 */

export interface DeviceInfo {
  screen_resolution: string;
  viewport_size: string;
  encoding: string;
  language: string;
  colors: string;
}

export function getDeviceInfo(): DeviceInfo {
  return {
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    encoding: document.characterSet || 'UTF-8',
    language: navigator.language,
    colors: `${window.screen.colorDepth}-bit`,
  };
}

export interface PageInfo {
  title: string;
  raw_referrer: string;
  url: string;
  path: string;
}

export function getPageInfo(): PageInfo {
  return {
    title: document.title,
    raw_referrer: document.referrer,
    url: window.location.href,
    path: window.location.pathname,
  };
}
