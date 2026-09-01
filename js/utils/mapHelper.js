/* ==========================================================================
   GREEN LEGACY — GOOGLE MAPS API HELPER
   Interactive Geolocation, Vehicle Tracking, and City Hotspots
   ========================================================================== */

export const MapHelper = {
  /**
   * Create custom HTML Marker Pin with icon and theme color
   */
  createCustomPin(iconEmoji, label, colorHex = '#16A34A') {
    const el = document.createElement('div');
    el.innerHTML = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -100%);
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
    `;
    return el.firstElementChild;
  },

  /**
   * Initialize a standard Google Map on an element ID
   */
  initMap(elementId, center = [19.0760, 72.8777], zoom = 14) {
    if (!window.google) return null;
    const container = document.getElementById(elementId);
    if (!container) return null;

    const map = new window.google.maps.Map(container, {
      center: { lat: center[0], lng: center[1] },
      zoom: zoom,
      mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
      disableDefaultUI: false,
    });

    return map;
  },

  /**
   * Add a marker to the map
   */
  addMarker(map, position, content, options = {}) {
    if (!window.google || !window.google.maps.marker) return null;
    return new window.google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: { lat: position[0], lng: position[1] },
      content: content,
      ...options
    });
  },

  /**
   * Add a polyline to the map
   */
  addPolyline(map, coords, options = {}) {
    if (!window.google) return null;
    const path = coords.map(c => ({ lat: c[0], lng: c[1] }));
    const polyline = new window.google.maps.Polyline({
      path,
      map,
      ...options
    });
    return polyline;
  }
};
