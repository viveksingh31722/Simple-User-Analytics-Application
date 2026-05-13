/**
 * CausalFunnel Simple User Analytics Tracking Script
 * Features client-side dynamic session persistence with a 30-minute inactivity expiration boundary
 * and viewport dimension capture for heatmap layout normalization.
 */
(function () {
  const BACKEND_API_URL = 'https://simple-user-analytics-application-fekh.onrender.com';
  const SESSION_KEY = 'causalfunnel_session_id';
  const ACTIVITY_KEY = 'causalfunnel_last_activity';
  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Helper to get or create session_id stored in localStorage with dynamic timeout enforcement
  function getOrCreateSessionId() {
    const now = Date.now();
    let sessionId = localStorage.getItem(SESSION_KEY);
    const lastActivity = localStorage.getItem(ACTIVITY_KEY);

    // Enforce dynamic server-aligned session timeout boundaries (Expire if inactive for > 30 mins)
    if (sessionId && lastActivity && (now - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT_MS)) {
      console.log('CausalFunnel Tracker: Session expired due to 30 minutes of inactivity. Initializing new session.');
      sessionId = null; // Force regeneration
    }

    if (!sessionId) {
      // Generate a simple robust UUID/random string for session identification
      sessionId = 'sess_' + now + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    // Refresh last activity timestamp
    localStorage.setItem(ACTIVITY_KEY, now.toString());
    return sessionId;
  }

  // Helper to send event payload to the backend
  function sendEvent(eventType, extraData = {}) {
    const payload = {
      sessionId: getOrCreateSessionId(),
      eventType: eventType,
      pageUrl: window.location.href.split('?')[0], // Base URL without query strings to group nicely
      timestamp: new Date().toISOString(),
      ...extraData
    };

    // Use sendBeacon if available for reliable delivery without blocking unload, fallback to fetch
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(BACKEND_API_URL, blob);
      } else {
        fetch(BACKEND_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit',
          keepalive: true
        }).catch(err => console.error('Tracking fetch error:', err));
      }
    } catch (err) {
      console.error('Failed to send tracking event:', err);
    }
  }

  // 1. Track page_view event on script load
  function initTracking() {
    sendEvent('page_view');

    // 2. Track global click events with coordinates and layout bounding metrics
    document.addEventListener('click', function (event) {
      // Capture absolute page coordinates (pageX/pageY account for document scrolling)
      const x = event.pageX;
      const y = event.pageY;

      // Capture viewport/document layout parameters to support responsive layout normalization scaling
      const viewportWidth = document.documentElement.scrollWidth || window.innerWidth;
      const viewportHeight = document.documentElement.scrollHeight || window.innerHeight;

      sendEvent('click', { x, y, viewportWidth, viewportHeight });
    }, true); // Use capturing phase to ensure we log clicks even if stopPropagation is called
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
})();
