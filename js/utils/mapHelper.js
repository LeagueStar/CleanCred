/* ==========================================================================
   GREEN LEGACY — MAPS API HELPER
   Interactive Geolocation, Vehicle Tracking, and City Hotspots
   Now using Open-Source Leaflet & OpenStreetMap (No API Key Required)
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
    `;
    return el.firstElementChild;
  },

  /**
   * Initialize a standard Leaflet Map on an element ID
   */
  initMap(elementId, center = [19.0760, 72.8777], zoom = 14) {
    if (!window.L) return null;
    const container = document.getElementById(elementId);
    if (!container) return null;

    // Destroy map if it already exists on this container
    if (container._leaflet_id) {
       container.innerHTML = '';
       container._leaflet_id = null;
    }

    const map = window.L.map(container, { zoomControl: false }).setView(center, zoom);
    
    // Add default Leaflet zoom controls to bottom right
    window.L.control.zoom({ position: 'bottomright' }).addTo(map);

    window.L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=6kEsfjusNCieuJjsU7Uu', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      crossOrigin: true,
      attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
    }).addTo(map);

    // Polyfill for Google Maps map.setCenter()
    map.setCenter = function(c) {
      this.setView([c.lat, c.lng], this.getZoom());
    };

    return map;
  },

  /**
   * Add a marker to the map
   */
  addMarker(map, position, content, options = {}) {
    if (!window.L) return null;

    const icon = window.L.divIcon({
      html: typeof content === 'string' ? content : content.outerHTML,
      className: '', // prevent default Leaflet divIcon styles
      iconSize: [0, 0], // CSS will handle dimensions via the transform
      iconAnchor: [0, 0] // the transform: translate(-50%, -100%) inside custom HTML anchors it
    });

    const isDraggable = options.gmpDraggable === true || options.draggable === true;
    
    const marker = window.L.marker(position, { 
      icon, 
      draggable: isDraggable
    }).addTo(map);

    // Polyfill marker.position for Google Maps compatibility
    Object.defineProperty(marker, 'position', {
      set: function(val) {
        this.setLatLng([val.lat, val.lng]);
      },
      get: function() {
        const ll = this.getLatLng();
        return { lat: ll.lat, lng: ll.lng };
      }
    });

    // Polyfill marker.addListener for Google Maps compatibility
    marker.addListener = function(event, callback) {
      if (event === 'dragend') {
        this.on('dragend', callback);
      } else {
        this.on(event, callback);
      }
    };

    return marker;
  },

  /**
   * Add a polyline to the map
   */
  addPolyline(map, coords, options = {}) {
    if (!window.L) return null;
    const polyline = window.L.polyline(coords, {
      color: options.strokeColor || '#16A34A',
      weight: options.strokeWeight || 5,
      opacity: options.strokeOpacity || 0.8
    }).addTo(map);
    return polyline;
  }
};
