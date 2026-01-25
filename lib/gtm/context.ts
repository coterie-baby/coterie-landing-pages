/**
 * GTM Context - builds the enriched data layer payload
 */

import { getMarketingCookies, getClickIds } from './cookies';
import { getDeviceInfo, getPageInfo } from './device';
import { getUserProperties } from './session';

export interface GTMContext {
  user_properties: {
    session_id: string;
    user_id: string;
    coterie_lp_id: string;
  };
  device: {
    screen_resolution: string;
    viewport_size: string;
    encoding: string;
    language: string;
    colors: string;
  };
  page: {
    title: string;
    raw_referrer: string;
    url: string;
    path: string;
  };
  marketing: Record<string, unknown>;
}

export function buildGTMContext(): GTMContext {
  const userProperties = getUserProperties();
  const marketingCookies = getMarketingCookies();
  const clickIds = getClickIds();

  return {
    user_properties: userProperties,
    device: getDeviceInfo(),
    page: getPageInfo(),
    marketing: {
      ...marketingCookies,
      ...clickIds,
      referrer: document.referrer,
      user_id: userProperties.user_id,
      session_id: userProperties.session_id,
      coterie_lp_id: userProperties.coterie_lp_id,
      consent_v2: {
        ad_storage: { default: true },
        ad_user_data: { default: true },
        ad_personalization: { default: true },
        analytics_storage: { default: true },
        functionality_storage: { default: true },
        personalization_storage: { default: true },
        security_storage: { default: true },
      },
    },
  };
}
