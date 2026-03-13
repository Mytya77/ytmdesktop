import { BrowserView } from "electron";
import log from "electron-log";

import IIntegration from "../integration";

/**
 * Network-level ad blocker for YouTube Music.
 *
 * Uses Electron's session.webRequest.onBeforeRequest to intercept and cancel
 * requests matching known ad/tracking URL patterns before they reach the network.
 */

// Domains to block entirely
const BLOCKED_DOMAINS = [
  "doubleclick.net",
  "googleadservices.com",
  "googlesyndication.com",
  "adservice.google.com",
  "pagead2.googlesyndication.com",
  "www.googletagmanager.com",
  "static.doubleclick.net",
  "googleads.g.doubleclick.net",
  "tpc.googlesyndication.com",
  "ad.doubleclick.net",
  "ads.youtube.com",
  "ade.googlesyndication.com",
  "se.service.gvt1.com"
];

// URL path patterns to block (matched against the full URL)
const BLOCKED_PATH_PATTERNS: RegExp[] = [
  // YouTube ad-related API endpoints
  /\/pagead\//,
  /\/ptracking/,
  /\/api\/stats\/ads/,
  /\/get_midroll_info/,
  /\/youtubei\/v1\/player\/ad/,
  /\/api\/stats\/qoe\?.*adformat/,

  // Google ad tracking pixels and scripts
  /\/pagead\/conversion/,
  /\/pagead\/viewthroughconversion/,
  /\/pagead\/adview/,

  // DoubleClick ad serving
  /\/ddm\/trackimp/,
  /\/ddm\/trackclk/,
  /\/ddm\/ad\//,

  // YouTube ad video metadata
  /\/api\/stats\/watchtime\?.*ad_docid/,
  /generate_204\?.*ad/,

  // Pre-roll/mid-roll ad markers
  /\/ad_break/,
  /\/get_video_info\?.*ad/
];

// Patterns that must NOT be blocked (music playback streams)
const ALLOWED_PATTERNS: RegExp[] = [
  // Actual music/video streams from googlevideo.com
  /^https?:\/\/[a-z0-9-]+\.googlevideo\.com\/videoplayback/
];

function shouldBlockRequest(url: string): boolean {
  // Never block allowed patterns (music playback)
  for (const pattern of ALLOWED_PATTERNS) {
    if (pattern.test(url)) {
      return false;
    }
  }

  // Check domain blocks
  try {
    const urlObj = new URL(url);
    for (const domain of BLOCKED_DOMAINS) {
      if (urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)) {
        return true;
      }
    }
  } catch {
    // Invalid URL, don't block
    return false;
  }

  // Check path pattern blocks
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }

  return false;
}

export default class Adblocker implements IIntegration {
  private ytmView: BrowserView = null;
  private enabled = false;

  provide(ytmView: BrowserView): void {
    this.ytmView = ytmView;
  }

  enable(): void {
    if (!this.ytmView) {
      log.warn("Adblocker: Cannot enable, no ytmView provided");
      return;
    }

    const ytmSession = this.ytmView.webContents.session;

    ytmSession.webRequest.onBeforeRequest((details, callback) => {
      if (shouldBlockRequest(details.url)) {
        log.info(`Adblocker: Blocked ${details.url.substring(0, 120)}`);
        callback({ cancel: true });
        return;
      }

      callback({ cancel: false });
    });

    this.enabled = true;
    log.info("Adblocker: Enabled");
  }

  disable(): void {
    if (this.ytmView) {
      const ytmSession = this.ytmView.webContents.session;
      ytmSession.webRequest.onBeforeRequest(null);
    }

    this.enabled = false;
    log.info("Adblocker: Disabled");
  }

  getYTMScripts(): { name: string; script: string }[] {
    return [];
  }
}
