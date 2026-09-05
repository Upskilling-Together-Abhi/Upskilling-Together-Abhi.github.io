(() => {
  const config = window.ABC_POSTHOG_CONFIG;
  const anonymousIdKey = 'abc-tutoring-posthog-anonymous-id';
  const sessionIdKey = 'abc-tutoring-posthog-session-id';
  const attributionKey = 'abc-tutoring-posthog-attribution';

  const createId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const readOrCreate = (storage, key) => {
    try {
      const existing = storage.getItem(key);
      if (existing) return existing;
      const value = createId();
      storage.setItem(key, value);
      return value;
    } catch {
      return createId();
    }
  };

  const getAttribution = () => {
    const params = new URLSearchParams(window.location.search);
    const hasCampaign = ['utm_source', 'utm_medium', 'utm_campaign'].some((key) => params.has(key));
    const referrerDomain = document.referrer ? new URL(document.referrer).hostname : '';
    const isExternalReferrer = referrerDomain && referrerDomain !== window.location.hostname;

    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(attributionKey) || '{}');
    } catch {
      stored = {};
    }

    if (hasCampaign || isExternalReferrer || !stored.source) {
      stored = {
        source: params.get('utm_source') || referrerDomain || 'direct',
        medium: params.get('utm_medium') || (isExternalReferrer ? 'referral' : 'direct'),
        campaign: params.get('utm_campaign') || '',
      };

      try {
        localStorage.setItem(attributionKey, JSON.stringify(stored));
      } catch {
        // Attribution remains available for this page even when storage is blocked.
      }
    }

    return {
      acquisition_source: stored.source,
      acquisition_medium: stored.medium,
      acquisition_campaign: stored.campaign || undefined,
    };
  };

  const anonymousId = readOrCreate(localStorage, anonymousIdKey);
  const sessionId = readOrCreate(sessionStorage, sessionIdKey);
  const endpoint = config?.host ? `${config.host.replace(/\/$/, '')}/i/v0/e/` : '';

  window.abcTrack = (event, properties = {}) => {
    if (!config?.key || !endpoint) return;

    const payload = {
      api_key: config.key,
      event,
      distinct_id: anonymousId,
      properties: {
        $process_person_profile: false,
        $current_url: window.location.href,
        $referrer: document.referrer || undefined,
        $session_id: sessionId,
        ...getAttribution(),
        ...properties,
      },
    };

    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: 'application/json' });

    if (!navigator.sendBeacon || !navigator.sendBeacon(endpoint, blob)) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // Analytics must never interfere with booking or navigation.
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.abcTrack('page_viewed', {
      page_type: document.body.classList.contains('booking-page')
        ? 'booking'
        : document.body.classList.contains('tutors-page')
          ? 'tutors'
          : 'home',
    });
  });
})();
