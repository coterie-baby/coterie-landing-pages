/**
 * Session and user tracking utilities
 */

const ELEVAR_USER_ID_KEY = '___ELEVAR_GTM_SUITE--userId';

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

export interface UserProperties {
  session_id: string;
  user_id: string;
}

export function getUserProperties(): UserProperties {
  return {
    session_id: Date.now().toString(),
    user_id: getUserId(),
  };
}
