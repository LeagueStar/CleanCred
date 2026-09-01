/* ==========================================================================
   GREEN LEGACY — LEAFLET MAP HELPER
   Interactive Geolocation, Vehicle Tracking, and City Hotspots
   ========================================================================== */

export const MapHelper = {
  /**
   * Create custom HTML Marker Pin with icon and theme color
   */
  createCustomPin(iconEmoji, label, colorHex = '#16A34A') {
    if (!window.L) return null;
    return window.L.divIcon({
      className: 'custom-map-marker-container',
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
        ">
          <div style="
            background: ${colorHex};
            color: #FFFFFF;
            font-size: 1.15rem;
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            border: 2px solid #FFFFFF;
          ">
            <span style="transform: rotate(45deg);">${iconEmoji}</span>
          </div>
          ${label ? `
            <div style="
              margin-top: 4px;
              background: rgba(16, 42, 67, 0.9);
              color: #FFFFFF;
              font-size: 0.72rem;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            ">${label}</div>
          ` : ''}
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38]
    });
  },

  /**
   * Initialize a standard Leaflet Map on an element ID
   */
  initMap(elementId, center = [19.0760, 72.8777], zoom = 14) {
    if (!window.L) return null;
    const container = document.getElementById(elementId);
    if (!container) return null;

    // Remove existing map if already initialized
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    const map = window.L.map(elementId, {
      center: center,
      zoom: zoom,
      zoomControl: true
    });

// Standard OpenStreetMap tiles (No API Key Required)
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    return map;
  }
};
