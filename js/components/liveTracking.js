/* ==========================================================================
   CLEANCRED — LIVE PICKUP TRACKING COMPONENT
   Tactile Neumorphism + Civic Technology
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
      <div class="app-container" style="max-width: 1150px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="navigation" class="lucide-icon-sm"></i>
              <span>Simulated Fleet Telemetry Route &bull; Ward 4B</span>
            </div>
            <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Live Pickup Tracking</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Trace collection van dispatch from depot departure to doorstep verification.</p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button class="btn btn-secondary btn-sm" onclick="window.LiveTrackingView.simulateWorkerMove()">
              <i data-lucide="refresh-cw" class="lucide-icon-sm"></i>
              <span>Simulate Route Step</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.LiveTrackingView.fastForwardPickup('${pickup.id}')">
              <i data-lucide="check-circle" class="lucide-icon-sm"></i>
              <span>Complete Verification</span>
            </button>
          </div>
        </div>

        <!-- 2-Column Layout: Map (Left) & Status Timeline + Worker Card (Right) -->
        <div class="hero-grid" style="gap: 1.75rem;">
          
          <!-- Left Column: Map -->
          <div class="neu-card neu-card-raised" style="padding: 1.25rem; overflow: hidden; border-radius: var(--radius-xl);">
            <div id="live-tracking-map" style="height: 520px; width: 100%; border-radius: var(--radius-lg); border: 1.5px solid #CBD5E1; box-shadow: inset 0 2px 6px rgba(0,0,0,0.06);"></div>
            
            <div class="flex-between" style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted); border: 1px solid var(--color-border); flex-wrap: wrap; gap: 0.6rem;">
              <span style="display: flex; align-items: center; gap: 0.35rem; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <i data-lucide="map-pin" class="lucide-icon-sm" style="color: var(--color-primary-dark);"></i>
                <span title="${pickup.address}">Pickup: ${pickup.address || 'Flat 402, Ward 4B'}</span>
              </span>
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                <i data-lucide="truck" class="lucide-icon-sm" style="color: #2563EB;"></i>
                <span>Electric Van: ${pickup.vehicleNo || 'MH-02-GK-4091'}</span>
              </span>
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                <i data-lucide="activity" class="lucide-icon-sm" style="color: var(--color-primary);"></i>
                <span>Telemetry: Live Sync</span>
              </span>
            </div>
          </div>

          <!-- Right Column: Status Timeline & Driver Card -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Worker Info Card -->
            <div class="neu-card neu-card-raised" style="padding: 1.5rem; border-radius: var(--radius-xl);">
              <div class="flex-between" style="margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.2);">
                    <i data-lucide="user-check" class="lucide-icon-md"></i>
                  </div>
                  <div>
                    <strong style="color: var(--color-navy); font-size: 1rem; display: block;">${pickup.workerName || 'Ramesh Kumar'}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">Municipal Sanitation Officer &bull; 4.9 Rating</div>
                  </div>
                </div>
                <span class="badge badge-green" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                  <i data-lucide="shield-check" class="lucide-icon-sm"></i>
                  <span>Verified Staff</span>
                </span>
              </div>

              <div class="neu-card-inset" style="padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <div class="flex-between" style="margin-bottom: 0.35rem; font-size: 0.85rem;">
                  <span style="color: var(--text-muted); font-weight: 600;">Assigned Vehicle</span>
                  <strong style="color: var(--color-navy);">${pickup.vehicleNo || 'Electric Van MH-02-GK-4091'}</strong>
                </div>
                <div class="flex-between" style="font-size: 0.85rem;">
                  <span style="color: var(--text-muted); font-weight: 600;">Pickup Handshake OTP</span>
                  <strong style="color: var(--color-primary-dark); font-size: 1.2rem; letter-spacing: 0.12em; font-family: var(--font-mono);">${pickup.otp || '8492'}</strong>
                </div>
              </div>

              ${pickup.status !== 'verified' ? `
              <div class="neu-card-flat" style="padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                  Present this QR to Ramesh Kumar on arrival
                </div>
                <div id="live-tracking-qr" style="display: flex; justify-content: center;"></div>
              </div>
              ` : `
              <div class="neu-card-flat" style="padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; text-align: center; background: #DCFCE7; border-color: #86EFAC;">
                <div style="color: var(--color-primary-dark); font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                  <i data-lucide="check-circle-2" class="lucide-icon-sm"></i>
                  <span>Pickup Completed & Verified</span>
                </div>
              </div>
              `}

              <div class="card-actions-grid-2col">
                <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.showToast('Calling Ramesh Kumar at ${pickup.workerPhone || '+91 98111 22334'}...')">
                  <i data-lucide="phone" class="lucide-icon-sm"></i>
                  <span>Call Worker</span>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.showToast('Message sent: Please buzz Flat 402 upon arrival.')">
                  <i data-lucide="message-square" class="lucide-icon-sm"></i>
                  <span>Message</span>
                </button>
              </div>
            </div>

            <!-- Milestone Progress Timeline -->
            <div class="neu-card neu-card-raised" style="padding: 1.75rem; flex: 1; border-radius: var(--radius-xl);">
              <h4 style="color: var(--color-navy); margin-bottom: 1.25rem; font-weight: 800; font-size: 1.05rem;">Chain of Custody Timeline</h4>

              <div class="timeline-list">
                
                <!-- 1. Created -->
                <div class="timeline-item done">
                  <div class="timeline-dot">
                    <i data-lucide="check" style="width: 12px; height: 12px;"></i>
                  </div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Request Created</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Pickup #${pickup.id} registered on ledger</div>
                </div>

                <!-- 2. Assigned -->
                <div class="timeline-item done">
                  <div class="timeline-dot">
                    <i data-lucide="check" style="width: 12px; height: 12px;"></i>
                  </div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Worker Assigned</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Ramesh Kumar accepted Ward 4B route</div>
                </div>

                <!-- 3. On The Way -->
                <div class="timeline-item ${pickup.status === 'on_the_way' ? 'active' : pickup.status === 'verified' || pickup.status === 'collected' ? 'done' : ''}">
                  <div class="timeline-dot">
                    <i data-lucide="${pickup.status === 'verified' || pickup.status === 'collected' ? 'check' : 'truck'}" style="width: 12px; height: 12px;"></i>
                  </div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Pickup On The Way</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">
                    ${pickup.status === 'verified' || pickup.status === 'collected' ? 'Reached location' : `Approaching doorstep (~${pickup.etaMinutes || 12} mins away)`}
                  </div>
                </div>

                <!-- 4. Collected -->
                <div class="timeline-item ${pickup.status === 'collected' ? 'active' : pickup.status === 'verified' ? 'done' : ''}">
                  <div class="timeline-dot">
                    <i data-lucide="${pickup.status === 'verified' ? 'check' : 'package-check'}" style="width: 12px; height: 12px;"></i>
                  </div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Waste Collected</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Loaded into segregated compartment</div>
                </div>

                <!-- 5. Verified -->
                <div class="timeline-item ${pickup.status === 'verified' ? 'done' : ''}">
                  <div class="timeline-dot">
                    <i data-lucide="${pickup.status === 'verified' ? 'check' : 'scale'}" style="width: 12px; height: 12px;"></i>
                  </div>
                  <strong style="font-size: 0.875rem; color: var(--color-navy);">Purity Verified & Weighed</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Segregation purity approved by worker</div>
                </div>

                <!-- 6. Points Credited -->
                <div class="timeline-item ${pickup.status === 'verified' ? 'done' : ''}">
                  <div class="timeline-dot">
                    <i data-lucide="${pickup.status === 'verified' ? 'coins' : 'circle'}" style="width: 12px; height: 12px;"></i>
                  </div>
                  <strong style="font-size: 0.875rem; color: var(--color-primary-dark);">Green Credits Credited</strong>
                  <div style="font-size: 0.75rem; color: var(--color-primary-dark); font-weight: 700;">+${pickup.pointsReward} GC awarded to your wallet</div>
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
    if (window.lucide) {
      window.lucide.createIcons();
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
    const homePin = MapHelper.createCustomPin('H', 'Shivansh (Home)', '#16A34A');
    window.L.marker(userCoord, { icon: homePin }).addTo(this.mapInstance);

    // Van Pin
    const vanPin = MapHelper.createCustomPin('V', 'Waste Van (ETA 12m)', '#2563EB');
    this.truckMarker = window.L.marker(vanCoord, { icon: vanPin }).addTo(this.mapInstance);

    // MRF Facility Pin
    const mrfPin = MapHelper.createCustomPin('M', 'Municipal MRF Hub', '#102A43');
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
      opacity: 0.85,
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
        title: 'Van Location Updated',
        message: 'Ramesh Kumar is now entering Green Park Avenue (~8 mins away).',
        type: 'pickup'
      });
      window.AppRouter.showToast('Telemetry updated: Ramesh is ~8 mins away.');
    }
  },

  fastForwardPickup(pickupId) {
    const result = State.awardCredits(pickupId, 4.5);
    if (result.alreadyVerified) {
      SoundFX.playClick();
      window.AppRouter.showToast('Pickup was already verified — credits are on record.');
      return;
    }
    SoundFX.playPointsEarned();
    Confetti.trigger(100);
    window.AppRouter.showToast(`Verified! +${result.points} Green Credits credited.`);
    this.render();
  }
};

window.LiveTrackingView = LiveTrackingView;
