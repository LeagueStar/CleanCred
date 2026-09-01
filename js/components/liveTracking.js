/* ==========================================================================
   GREEN LEGACY — LIVE PICKUP TRACKING COMPONENT
   Swiggy/Uber-Style Interactive Delivery Map & Status Progression
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { MapHelper } from '../utils/mapHelper.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';
import { QRCode } from '../utils/qrCode.js';

export const LiveTrackingView = {
  mapInstance: null,
  truckMarker: null,
  routePolyline: null,
  animationTimer: null,

  render() {
    const container = document.getElementById('view-live-tracking');
    if (!container) return;

    const pickup = State.state.pickups[0] || {
      id: 'GK-2026-89421',
      category: 'wet',
      categoryName: 'Wet Waste (Organic)',
      pointsReward: 10,
      quantityKg: 4.5,
      subType: 'Kitchen Scraps',
      address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
      status: 'on_the_way',
      workerName: 'Ramesh Kumar',
      workerPhone: '+91 98111 22334',
      vehicleNo: 'MH-02-GK-4091',
      otp: '8492',
      etaMinutes: 12
    };

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem;">
              Collection status &bull; Municipal service
            </div>
            <h2>Live Pickup Tracking</h2>
            <p>Follow your pickup from request to verification and recovery.</p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button class="btn btn-secondary" onclick="window.LiveTrackingView.simulateWorkerMove()">
              Refresh status
            </button>
            <button class="btn btn-primary" onclick="window.LiveTrackingView.fastForwardPickup('${pickup.id}')">
              Complete demo pickup
            </button>
          </div>
        </div>

        <!-- 2-Column Layout: Map (Left) & Status Timeline + Worker Card (Right) -->
        <div style="display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 2rem;" class="hero-grid">
          
          <!-- Left Column: Map -->
          <div class="glass-card" style="padding: 1.25rem; overflow: hidden;">
            <div id="live-tracking-map" style="height: 520px; width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--color-border);"></div>
            
            <div class="flex-between" style="margin-top: 1rem; padding: 0.5rem 0.75rem; background: #F8FAFC; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted);">
              <span>Home: Flat 402, Ward 4B</span>
              <span>Collection vehicle: MH-02-GK-4091</span>
              <span>Recovery hub: Bandra West</span>
            </div>
          </div>

          <!-- Right Column: Status Timeline & Driver Card -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Worker Info Card -->
            <div class="glass-card" style="padding: 1.5rem;">
              <div class="flex-between" style="margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">
                    CC
                  </div>
                  <div>
                    <strong style="color: var(--color-navy); font-size: 1rem; display: block;">${pickup.workerName || 'Ramesh Kumar'}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Municipal worker &bull; 4.9 service rating</div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700;">Verified Staff ✓</span>
                </div>
              </div>

              <div style="background: #F8FAFC; border: 1px solid var(--color-border); padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <div class="flex-between" style="margin-bottom: 0.35rem; font-size: 0.85rem;">
                  <span style="color: var(--text-muted);">Vehicle</span>
                  <strong style="color: var(--color-navy);">${pickup.vehicleNo || 'Electric Van MH-02-GK-4091'}</strong>
                </div>
                <div class="flex-between" style="font-size: 0.85rem;">
                  <span style="color: var(--text-muted);">Pickup OTP</span>
                  <strong style="color: var(--color-primary-dark); font-size: 1.15rem; letter-spacing: 0.1em;">${pickup.otp || '8492'}</strong>
                </div>
              </div>

              ${pickup.status !== 'verified' ? `
              <div style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem;">Show this QR to the Collector</div>
                <div id="live-tracking-qr" style="display: flex; justify-content: center;"></div>
              </div>
              ` : ''}


              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <button class="btn btn-secondary btn-sm" onclick="alert('Calling Municipal Worker Ramesh Kumar at ${pickup.workerPhone || '+91 98111 22334'}...')">
                  Call worker
                </button>
                <button class="btn btn-secondary btn-sm" onclick="alert('Messaging Municipal Worker: Please buzz Flat 402 on arrival.')">
                  Message
                </button>
              </div>
            </div>

            <!-- Milestone Progress Timeline -->
            <div class="glass-card" style="padding: 1.75rem; flex: 1;">
              <h4 style="color: var(--color-navy); margin-bottom: 1.25rem;">Collection Progress</h4>

              <div class="timeline-list">
                
                <!-- 1. Created -->
                <div class="timeline-item done">
                  <div class="timeline-dot">✓</div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Request Created</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Pickup #${pickup.id} registered</div>
                </div>

                <!-- 2. Assigned -->
                <div class="timeline-item done">
                  <div class="timeline-dot">✓</div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Worker Assigned</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Ramesh Kumar accepted the route</div>
                </div>

                <!-- 3. On The Way -->
                <div class="timeline-item ${pickup.status === 'on_the_way' ? 'active' : pickup.status === 'verified' || pickup.status === 'collected' ? 'done' : ''}">
                  <div class="timeline-dot">${pickup.status === 'verified' || pickup.status === 'collected' ? '✓' : '●'}</div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Pickup On The Way</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">
                    ${pickup.status === 'verified' || pickup.status === 'collected' ? 'Reached location' : `Approaching doorstep (~${pickup.etaMinutes || 12} mins)`}
                  </div>
                </div>

                <!-- 4. Collected -->
                <div class="timeline-item ${pickup.status === 'collected' ? 'active' : pickup.status === 'verified' ? 'done' : ''}">
                  <div class="timeline-dot">${pickup.status === 'verified' ? '✓' : '○'}</div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Waste Collected</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Loaded into segregated compartment</div>
                </div>

                <!-- 5. Verified -->
                <div class="timeline-item ${pickup.status === 'verified' ? 'done' : ''}">
                  <div class="timeline-dot">${pickup.status === 'verified' ? '✓' : '○'}</div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Verified & Weighed</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Segregation purity approved</div>
                </div>

                <!-- 6. Points Credited -->
                <div class="timeline-item ${pickup.status === 'verified' ? 'done' : ''}">
                  <div class="timeline-dot">${pickup.status === 'verified' ? '✓' : '○'}</div>
                  <strong style="font-size: 0.875rem; color: var(--color-primary-dark);">Green Credits Credited</strong>
                  <div style="font-size: 0.75rem; color: var(--color-primary-dark); font-weight: 700;">+${pickup.pointsReward} GC added to Green Credits</div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    setTimeout(() => this.initMap(), 100);
    if (pickup.status !== 'verified') {
      setTimeout(() => QRCode.renderInto('live-tracking-qr', pickup.id), 50);
    }
  },

  initMap() {
    const mapElement = document.getElementById('live-tracking-map');
    if (!mapElement || !window.L) return;

    const userCoord = [19.0760, 72.8777];
    const vanCoord = [19.0650, 72.8550];
    const mrfCoord = [19.0880, 72.8950];

    this.mapInstance = MapHelper.initMap('live-tracking-map', [19.0720, 72.8650], 14);
    if (!this.mapInstance) return;

    // User Home Pin
    const homePin = MapHelper.createCustomPin('🏠', 'Shivansh (Home)', '#16A34A');
    window.L.marker(userCoord, { icon: homePin }).addTo(this.mapInstance);

    // Van Pin
    const vanPin = MapHelper.createCustomPin('🚚', 'Waste Van (ETA 12m)', '#2563EB');
    this.truckMarker = window.L.marker(vanCoord, { icon: vanPin }).addTo(this.mapInstance);

    // MRF Facility Pin
    const mrfPin = MapHelper.createCustomPin('🏢', 'Municipal MRF Hub', '#102A43');
    window.L.marker(mrfCoord, { icon: mrfPin }).addTo(this.mapInstance);

    // Route Polyline
    const routeCoords = [
      vanCoord,
      [19.0690, 72.8620],
      [19.0730, 72.8710],
      userCoord,
      [19.0810, 72.8840],
      mrfCoord
    ];

    this.routePolyline = window.L.polyline(routeCoords, {
      color: '#16A34A',
      weight: 5,
      opacity: 0.8,
      dashArray: '8, 8'
    }).addTo(this.mapInstance);
  },

  simulateWorkerMove() {
    SoundFX.playClick();
    if (this.truckMarker) {
      const newLat = 19.0710 + (Math.random() - 0.5) * 0.005;
      const newLng = 72.8680 + (Math.random() - 0.5) * 0.005;
      this.truckMarker.setLatLng([newLat, newLng]);
      State.addNotification({
        title: '🚚 Van Location Updated',
        message: 'Ramesh Kumar is now entering Green Park Avenue (~8 mins away).',
        type: 'pickup'
      });
    }
  },

  fastForwardPickup(pickupId) {
    const result = State.verifyWasteSubmission(pickupId, true, 4.5);
    if (result.alreadyVerified) {
      SoundFX.playClick();
      alert('This pickup is already verified — Green Credits were already issued for it.');
      return;
    }
    SoundFX.playPointsEarned();
    Confetti.trigger(100);
    this.render();
  }
};

window.LiveTrackingView = LiveTrackingView;
