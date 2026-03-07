export enum TrayIconStyle {
  Auto = 0,
  White = 1,
  Black = 2
}

export enum ProxyProtocol {
  HTTP = 0,
  HTTPS = 1,
  SOCKS4 = 2,
  SOCKS5 = 3
}

export type StoreSchema = {
  metadata: {
    version: 1;
  };
  general: {
    disableHardwareAcceleration: boolean;
    hideToTrayOnClose: boolean;
    showNotificationOnSongChange: boolean;
    startOnBoot: boolean;
    startMinimized: boolean;
  };
  appearance: {
    alwaysShowVolumeSlider: boolean;
    customCSSEnabled: boolean;
    customCSSPath: string | null;
    zoom: number;
    trayIconStyle: TrayIconStyle;
  };
  playback: {
    continueWhereYouLeftOff: boolean;
    continueWhereYouLeftOffPaused: boolean;
    enableSpeakerFill: boolean;
    progressInTaskbar: boolean;
    ratioVolume: boolean;
  };
  integrations: {
    companionServerEnabled: boolean;
    companionServerAuthTokens: string | null; // array[object] | Encrypted for security
    companionServerCORSWildcardEnabled: boolean;
    discordPresenceEnabled: boolean;
    lastFMEnabled: boolean;
  };
  shortcuts: {
    playPause: string;
    next: string;
    previous: string;
    thumbsUp: string;
    thumbsDown: string;
    volumeUp: string;
    volumeDown: string;
  };
  state: {
    lastUrl: string;
    lastPlaylistId: string;
    lastVideoId: string;
    windowBounds: Electron.Rectangle | null;
    windowMaximized: boolean;
  };
  lastfm: {
    api_key: string;
    secret: string;
    token: string | null;
    sessionKey: string | null;
    scrobblePercent: number;
  };
  developer: {
    enableDevTools: boolean;
  };
  proxy: {
    enabled: boolean;
    protocol: ProxyProtocol;
    host: string;
    port: number;
    requiresAuth: boolean;
    username: string | null; // Encrypted via safeStorage
    password: string | null; // Encrypted via safeStorage
  };
};

export type MemoryStoreSchema = {
  discordPresenceConnectionFailed: boolean;
  shortcutsPlayPauseRegisterFailed: boolean;
  shortcutsNextRegisterFailed: boolean;
  shortcutsPreviousRegisterFailed: boolean;
  shortcutsThumbsUpRegisterFailed: boolean;
  shortcutsThumbsDownRegisterFailed: boolean;
  shortcutsVolumeUpRegisterFailed: boolean;
  shortcutsVolumeDownRegisterFailed: boolean;
  companionServerAuthWindowEnabled: boolean;
  safeStorageAvailable: boolean;
  autoUpdaterDisabled: boolean;
  ytmViewLoadTimedout: boolean;
  ytmViewLoading: boolean;
  ytmViewLoadingError: boolean;
  ytmViewLoadingStatus: string;
  ytmViewUnresponsive: boolean;
  appUpdateAvailable: boolean;
  appUpdateDownloaded: boolean;
};
