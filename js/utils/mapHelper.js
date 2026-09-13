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

  _mapInstances: new Map(),

  /**
   * Safely destroy and remove existing map instance
   */
  destroyMap(elementId) {
    if (this._mapInstances.has(elementId)) {
      try {
        const oldMap = this._mapInstances.get(elementId);
        if (oldMap && typeof oldMap.remove === 'function') {
          oldMap.remove();
        }
      } catch (err) {
        console.warn('MapHelper: error removing map instance:', err);
      }
      this._mapInstances.delete(elementId);
    }
    const container = document.getElementById(elementId);
    if (container && container._leaflet_id) {
      delete container._leaflet_id;
    }
  },

  /**
   * Initialize a standard Leaflet Map on an element ID
   */
  initMap(elementId, center = [19.0760, 72.8777], zoom = 14) {
    if (!window.L) return null;
    const container = document.getElementById(elementId);
    if (!container) return null;

    // Remove existing map instance properly before re-initializing
    this.destroyMap(elementId);

    const map = window.L.map(elementId, {
      center: center,
      zoom: zoom,
      zoomControl: true
    });

    this._mapInstances.set(elementId, map);

    // Clean OpenStreetMap tiles with eco-friendly styling
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    return map;
  },

  /**
   * Request real device coordinates via HTML5 Geolocation API
   */
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        error => {
          let msg = 'Unable to retrieve location.';
          if (error.code === 1) msg = 'Location access permission denied.';
          else if (error.code === 2) msg = 'Position unavailable.';
          else if (error.code === 3) msg = 'Location request timed out.';
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  },

  /**
   * Format latitude and longitude coordinates
   */
  formatCoords(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') return '';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
  }
};
