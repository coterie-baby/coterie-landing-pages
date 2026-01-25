/**
 * Session and user tracking utilities
 */

import { getCookie, setCookie } from './cookies';

const ELEVAR_USER_ID_KEY = '___ELEVAR_GTM_SUITE--userId';
const COTERIE_LP_COOKIE = '_coterie_lp_id';
const COOKIE_DOMAIN = '.coterie.com';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getUserId(): string {
  try {
    // Try Elevar first (user has visited main site before)
    const elevarId = localStorage.getItem(ELEVAR_USER_ID_KEY);
    if (elevarId) return elevarId;

    // Generate new ID and store in Elevar key so main site uses the same ID
    const newId = generateUUID();
    localStorage.setItem(ELEVAR_USER_ID_KEY, newId);
    return newId;
  } catch {
    return generateUUID();
  }
}

/**
 * Get or create the landing page identifier cookie.
 * This cookie is set on .coterie.com so it persists across subdomains,
 * allowing the data team to tie landing page sessions to main site sessions.
 */
function getCoterieLpId(): string {
  // Check for existing cookie
  const existingId = getCookie(COTERIE_LP_COOKIE);
  if (existingId) return existingId;

  // Generate new ID and set cookie on parent domain
  const newId = generateUUID();
  setCookie(COTERIE_LP_COOKIE, newId, { domain: COOKIE_DOMAIN });
  return newId;
}

export interface UserProperties {
  session_id: string;
  user_id: string;
  coterie_lp_id: string;
}

export function getUserProperties(): UserProperties {
  return {
    session_id: Date.now().toString(),
    user_id: getUserId(),
    coterie_lp_id: getCoterieLpId(),
  };
}
