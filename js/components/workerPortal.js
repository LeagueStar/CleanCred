/* ==========================================================================
   CLEANCRED — MUNICIPAL WORKER VERIFICATION PORTAL
   Smart India Hackathon 2026 // Team GreenLegacy
   Tactile Neumorphism + Civic Technology
   Role: Ramesh Kumar | Zone 4 - Ward 4B | Electric Van MH-02-GK-4091
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';
import { QRCode } from '../utils/qrCode.js';
import { QRScanner } from '../utils/qrScanner.js';

export const WorkerPortalView = {
  selectedPickup: null,

  render() {
    const container = document.getElementById('view-worker');
    if (!container) return;

    const worker = State.state.worker;
    const queue = State.state.workerQueue;

    container.innerHTML = `
      <div class="app-container" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header & Worker Identity Banner -->
        <div class="neu-card neu-card-navy" style="padding: 2rem; border-radius: var(--radius-xl); margin-bottom: 2rem; color: #FFFFFF;">
          <div class="flex-between" style="flex-wrap: wrap; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; border: 3px solid #84CC16; box-shadow: 0 4px 14px rgba(0,0,0,0.25);">
                <i data-lucide="truck" class="lucide-icon-lg"></i>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
                  <h2 style="color: #FFFFFF; font-size: 1.6rem; font-weight: 800; margin: 0;">${worker.name}</h2>
                  <span class="badge" style="background: #84CC16; color: #0A1929; font-weight: 800;">Municipal Officer</span>
                </div>
                <p style="color: #CBD5E1; font-size: 0.88rem; margin: 0;">
                  ${worker.zone} &bull; Vehicle: ${worker.vehicle} &bull; ${worker.rating} service rating
                </p>
              </div>
            </div>

            <!-- Fast Stats for Worker -->
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <div style="background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); text-align: center; border: 1px solid rgba(255,255,255,0.12);">
                <div style="font-size: 1.4rem; font-weight: 800; color: #84CC16;">${worker.todayCollections}</div>
                <div style="font-size: 0.72rem; color: #CBD5E1; font-weight: 600;">Today's Pickups</div>
              </div>
              <div style="background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); text-align: center; border: 1px solid rgba(255,255,255,0.12);">
                <div style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF;">${worker.totalVerifiedKg} KG</div>
                <div style="font-size: 0.72rem; color: #CBD5E1; font-weight: 600;">Verified Waste</div>
              </div>
              <button class="btn btn-primary btn-lg" style="background: #84CC16; color: #0A1929; border-color: #84CC16; font-weight: 800;" onclick="window.WorkerPortalView.openScanModal()">
                <i data-lucide="qr-code" class="lucide-icon-sm"></i>
                <span>Scan Handover QR</span>
              </button>
              <button class="btn btn-secondary btn-sm" style="background: rgba(255,255,255,0.15); color: #FFFFFF; border-color: rgba(255,255,255,0.25);" onclick="window.AppRouter.navigate('illegal-dumping')">
                <i data-lucide="shield-alert" class="lucide-icon-sm"></i>
                <span>Report Hotspot</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Assigned Route Pickups Queue -->
        <div class="neu-card neu-card-raised" style="padding: 2rem; border-radius: var(--radius-xl);">
          <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--color-navy); font-size: 1.3rem; font-weight: 800; margin: 0 0 0.25rem 0;">Assigned Route Collection Queue</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Inspect waste bags, confirm segregation purity, and disburse Green Credits upon physical weighing.</p>
            </div>
            <span class="badge badge-green">${queue.filter(q => q.status !== 'verified' && q.status !== 'rejected').length} Pending Verifications</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${queue.map(item => `
              <div class="neu-card-flat" style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-radius: var(--radius-lg); flex-wrap: wrap; gap: 1rem;">
                
                <div style="display: flex; align-items: center; gap: 1.25rem;">
                  <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: ${item.category === 'wet' ? 'var(--waste-wet-bg)' : item.category === 'dry' ? 'var(--waste-dry-bg)' : 'var(--waste-harmful-bg)'}; color: ${item.category === 'wet' ? 'var(--waste-wet)' : item.category === 'dry' ? 'var(--waste-dry)' : 'var(--waste-harmful)'}; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="${item.category === 'wet' ? 'apple' : item.category === 'dry' ? 'package' : 'battery-charging'}" class="lucide-icon-md"></i>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <strong style="color: var(--color-navy); font-size: 1.05rem;">${item.subType}</strong>
                      <span class="badge" style="background: ${item.category === 'wet' ? 'var(--waste-wet-bg)' : item.category === 'dry' ? 'var(--waste-dry-bg)' : 'var(--waste-harmful-bg)'}; color: ${item.category === 'wet' ? 'var(--waste-wet)' : item.category === 'dry' ? 'var(--waste-dry)' : 'var(--waste-harmful)'}; font-weight: 700;">
                        ${item.quantityKg} KG
                      </span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                      Citizen: <strong>${item.userName}</strong> &bull; ${item.address}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 700; margin-top: 0.25rem;">
                      Request ID: ${item.id} &bull; OTP: <span style="font-family: var(--font-mono);">${item.otp}</span> &bull; Status: <span class="badge" style="text-transform: capitalize; font-size: 0.72rem; padding: 2px 6px;">${item.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  ${item.status === 'verified' ? `
                    <span class="badge" style="background: #D1FAE5; color: #065F46; font-size: 0.88rem; padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.35rem;">
                      <i data-lucide="check-circle-2" class="lucide-icon-sm"></i>
                      <span>Verified (${item.purity_score ? item.purity_score + '% Purity • ' : ''}+${item.pointsReward} GC)</span>
                    </span>
                  ` : item.status === 'rejected' ? `
                    <span class="badge" style="background: #FEE2E2; color: #991B1B; font-size: 0.88rem; padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.35rem;">
                      <i data-lucide="x-circle" class="lucide-icon-sm"></i>
                      <span>Rejected</span>
                    </span>
                  ` : item.status === 'created' ? `
                    <button class="btn btn-secondary btn-sm" onclick="window.WorkerPortalView.advanceStatus('${item.id}', 'assigned')">
                      <i data-lucide="check" class="lucide-icon-sm"></i>
                      <span>Accept Route</span>
                    </button>
                  ` : item.status === 'assigned' ? `
                    <button class="btn btn-secondary btn-sm" onclick="window.WorkerPortalView.advanceStatus('${item.id}', 'on_the_way')">
                      <i data-lucide="truck" class="lucide-icon-sm"></i>
                      <span>Start Route</span>
                    </button>
                  ` : item.status === 'on_the_way' ? `
                    <button class="btn btn-primary btn-sm" onclick="window.WorkerPortalView.advanceStatus('${item.id}', 'collected')">
                      <i data-lucide="package-check" class="lucide-icon-sm"></i>
                      <span>Mark Collected</span>
                    </button>
                  ` : `
                    <button class="btn btn-primary" onclick="window.WorkerPortalView.openVerificationModal('${item.id}')">
                      <i data-lucide="scale" class="lucide-icon-sm"></i>
                      <span>Inspect &amp; Verify</span>
                    </button>
                  `}
                </div>

              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Worker Inspection Modal Shell -->
      <div class="modal-overlay" id="worker-inspect-modal">
        <div class="modal-content neu-card neu-card-raised" style="max-width: 560px;">
          <div class="modal-close-btn" onclick="window.WorkerPortalView.closeModal()">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          <div id="worker-modal-body"></div>
        </div>
      </div>

      <!-- QR Scan Modal Shell -->
      <div class="modal-overlay" id="worker-scan-modal">
        <div class="modal-content neu-card neu-card-raised" style="max-width: 440px;">
          <div class="modal-close-btn" onclick="window.WorkerPortalView.closeScanModal()">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          <div id="worker-scan-body"></div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  advanceStatus(pickupId, newStatus) {
    SoundFX.playClick();
    const res = State.updatePickupStatus(pickupId, newStatus);
    if (res && res.success) {
      window.AppRouter.showToast(`Status updated to: ${newStatus.replace(/_/g, ' ')}`);
      this.render();
    } else {
      window.AppRouter.showToast(res && res.message ? res.message : 'Could not update status');
    }
  },

  openVerificationModal(pickupId) {
    SoundFX.playClick();
    const item = State.state.workerQueue.find(q => q.id === pickupId);
    if (!item) return;

    if (item.status !== 'collected') {
      window.AppRouter.showToast('Pickup must be collected before verification.');
      return;
    }

    this.selectedPickup = item;
    const modalBody = document.getElementById('worker-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="scale" class="lucide-icon-md"></i>
          </div>
          <div>
            <h3 style="color: var(--color-navy); margin: 0; font-size: 1.25rem;">Scale Verification &amp; Inspection</h3>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">Request #${item.id} &bull; Citizen: ${item.userName}</p>
          </div>
        </div>

        <!-- Photo Check -->
        <div style="margin-bottom: 1.25rem; text-align: center;">
          <img src="${item.photoUrl}" style="max-height: 180px; width: 100%; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--color-border);" />
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">Citizen Photo Proof for ${item.subType}</div>
        </div>

        <!-- Segregation Quality Checklist -->
        <div class="neu-card-inset" style="padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
          <strong style="color: var(--color-navy); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Physical Segregation Checklist:</strong>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; margin-bottom: 0.35rem; cursor: pointer;">
            <input type="checkbox" checked id="chk-clean" style="accent-color: var(--color-primary);"> Zero hazardous / non-biodegradable cross-contamination
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; margin-bottom: 0.35rem; cursor: pointer;">
            <input type="checkbox" checked id="chk-category" style="accent-color: var(--color-primary);"> Material matches designated ${item.category.toUpperCase()} category
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; cursor: pointer;">
            <input type="checkbox" checked id="chk-bin" style="accent-color: var(--color-primary);"> Packed in standardized municipal color-coded bag
          </label>
        </div>

        <!-- Weight Validation Slider -->
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <div class="flex-between">
            <label class="form-label">Scale Verified Weight:</label>
            <strong id="modal-weight-val" style="color: var(--color-primary-dark); font-size: 1.15rem;">${item.quantityKg} KG</strong>
          </div>
          <input type="range" id="modal-weight-slider" min="0.5" max="15" step="0.5" value="${item.quantityKg}" style="width: 100%; accent-color: var(--color-primary);" oninput="document.getElementById('modal-weight-val').textContent = this.value + ' KG'">
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions-grid">
          <button class="btn btn-secondary" style="border-color: #EF4444; color: #EF4444;" onclick="window.WorkerPortalView.processVerification('${item.id}', false)">
            <i data-lucide="x-circle" class="lucide-icon-sm"></i>
            <span>Reject Waste</span>
          </button>
          <button class="btn btn-primary btn-lg" onclick="window.WorkerPortalView.processVerification('${item.id}', true)">
            <i data-lucide="check-circle-2" class="lucide-icon-sm"></i>
            <span>Approve &amp; Release Credits</span>
          </button>
        </div>
      `;

      document.getElementById('worker-inspect-modal').classList.add('active');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  closeModal() {
    SoundFX.playClick();
    document.getElementById('worker-inspect-modal').classList.remove('active');
  },

  processVerification(pickupId, approved) {
    if (approved) {
      const slider = document.getElementById('modal-weight-slider');
      const verifiedWeight = slider ? parseFloat(slider.value) : undefined;
      const res = State.awardCredits(pickupId, verifiedWeight);

      if (res && res.alreadyVerified) {
        SoundFX.playClick();
        window.AppRouter.showToast('Pickup already verified — credits are on record.');
      } else if (res && res.success && (res.points > 0 || res.awardedPoints > 0)) {
        SoundFX.playPointsEarned();
        Confetti.trigger(90);
        const purityText = res.purity_score ? ` (Purity: ${res.purity_score}%)` : '';
        window.AppRouter.showToast(`Pickup verified!${purityText} +${res.points || res.awardedPoints} Green Credits released.`);
      } else {
        SoundFX.playClick();
        window.AppRouter.showToast(res && res.message ? res.message : 'Verification could not be completed.');
      }
    } else {
      SoundFX.playClick();
      State.updatePickupStatus(pickupId, 'rejected');
      window.AppRouter.showToast('Pickup marked as rejected.');
    }

    this.closeModal();
    this.render();
  },

  // ------------------------------------------------------------------
  // QR Scan Verification
  // ------------------------------------------------------------------
  openScanModal() {
    SoundFX.playClick();
    const modal = document.getElementById('worker-scan-modal');
    if (!modal) return;
    modal.classList.add('active');
    this.renderScanCameraView();
  },

  closeScanModal() {
    SoundFX.playClick();
    if (window.QRScanner && typeof window.QRScanner.stop === 'function') {
      window.QRScanner.stop();
    }
    const modal = document.getElementById('worker-scan-modal');
    if (modal) modal.classList.remove('active');
    this.render();
  },

  renderScanCameraView() {
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    body.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: var(--color-navy); margin-bottom: 0.25rem;">Scan Citizen Pickup QR</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">Align citizen QR code inside the camera viewfinder.</p>

        <div style="position: relative; width: 100%; aspect-ratio: 1 / 1; background: #0A1929; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1rem;">
          <video id="worker-scan-video" style="width: 100%; height: 100%; object-fit: cover;" muted></video>
          <canvas id="worker-scan-canvas" style="display: none;"></canvas>
          <div style="position: absolute; inset: 0; border: 3px solid rgba(132, 204, 22, 0.85); border-radius: var(--radius-lg); margin: 15%; pointer-events: none;"></div>
        </div>

        <span class="badge badge-green" style="margin-bottom: 1rem;">Camera Active</span>

        <button class="btn btn-secondary btn-block" onclick="window.WorkerPortalView.useManualFallback()">
          <i data-lucide="keyboard" class="lucide-icon-sm"></i>
          <span>Enter Request ID Manually</span>
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    QRScanner.start(
      'worker-scan-video',
      'worker-scan-canvas',
      (decodedText) => this.handleScannedText(decodedText),
      (errorMessage) => this.renderManualFallback(errorMessage)
    );
  },

  renderManualFallback(errorMessage) {
    QRScanner.stop();
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    body.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: var(--color-navy); margin-bottom: 0.25rem;">Manual Request Verification</h3>
        <span class="badge" style="background: #FEF3C7; color: #92400E; font-weight: 700; margin-bottom: 1rem;">Enter Request ID</span>
        ${errorMessage ? `<p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">${errorMessage}</p>` : ''}

        <div class="form-group" style="text-align: left;">
          <label class="form-label">Pickup Request ID</label>
          <input type="text" id="manual-pickup-id" class="form-input neu-input" placeholder="e.g. GK-2026-89421" style="text-transform: uppercase;" onkeydown="if(event.key==='Enter') window.WorkerPortalView.submitManualId()">
        </div>

        <button class="btn btn-primary btn-lg btn-block" style="margin-top: 0.5rem;" onclick="window.WorkerPortalView.submitManualId()">
          <i data-lucide="check" class="lucide-icon-sm"></i>
          <span>Verify Pickup</span>
        </button>
        <button class="btn btn-secondary btn-block" style="margin-top: 0.5rem;" onclick="window.WorkerPortalView.renderScanCameraView()">
          <i data-lucide="camera" class="lucide-icon-sm"></i>
          <span>Try Camera Again</span>
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => document.getElementById('manual-pickup-id')?.focus(), 50);
  },

  useManualFallback() {
    SoundFX.playClick();
    this.renderManualFallback(null);
  },

  submitManualId() {
    const input = document.getElementById('manual-pickup-id');
    if (!input || !input.value.trim()) return;
    this.handleScannedText(input.value.trim());
  },

  handleScannedText(rawText) {
    SoundFX.playClick();
    const pickupId = QRCode.extractPickupId(rawText);

    if (!pickupId) {
      this.renderScanResult({ state: 'invalid', raw: rawText });
      return;
    }

    const queueItem = State.state.workerQueue.find(q => q.id === pickupId);
    const pickupRecord = State.state.pickups.find(p => p.id === pickupId);

    if (!queueItem && !pickupRecord) {
      this.renderScanResult({ state: 'invalid', raw: rawText, pickupId });
      return;
    }

    const isVerified = (queueItem && queueItem.status === 'verified') || (pickupRecord && pickupRecord.status === 'verified');
    if (isVerified) {
      this.renderScanResult({
        state: 'already-verified',
        item: {
          id: pickupId,
          userName: (queueItem && queueItem.userName) || State.state.user.name,
          pointsCredited: (pickupRecord && pickupRecord.pointsCredited) || (queueItem && queueItem.pointsReward) || 0
        }
      });
      return;
    }

    if (!queueItem) {
      this.renderScanResult({ state: 'invalid', raw: rawText, pickupId });
      return;
    }

    this.renderScanResult({ state: 'confirm', item: queueItem });
  },

  renderScanResult({ state, item, raw, pickupId }) {
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    if (state === 'invalid') {
      body.innerHTML = `
        <div style="text-align: center;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
            <i data-lucide="x-circle" class="lucide-icon-lg"></i>
          </div>
          <h3 style="color: #991B1B; margin-bottom: 0.25rem;">Invalid QR / Request ID</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            "${pickupId || raw}" doesn't match any pickup assigned to you.
          </p>
          <button class="btn btn-primary btn-block" onclick="window.WorkerPortalView.renderScanCameraView()">
            Try Again
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    if (state === 'already-verified') {
      body.innerHTML = `
        <div style="text-align: center;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
            <i data-lucide="check-circle-2" class="lucide-icon-lg"></i>
          </div>
          <h3 style="color: var(--color-primary-dark); margin-bottom: 0.25rem;">Already Verified</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Pickup #${item.id}${item.userName ? ` (${item.userName})` : ''} was already verified${item.pointsCredited ? ` — ${item.pointsCredited} GC were already credited` : ''}. No duplicate points awarded.
          </p>
          <button class="btn btn-secondary btn-block" onclick="window.WorkerPortalView.closeScanModal()">
            Close
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // state === 'confirm'
    body.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
          <i data-lucide="qr-code" class="lucide-icon-lg"></i>
        </div>
        <span class="badge badge-green" style="margin-bottom: 0.75rem;">QR Verified &bull; Authentic Request</span>
        <h3 style="color: var(--color-navy); margin-bottom: 0.75rem;">${item.subType}</h3>

        <div class="neu-card-inset" style="padding: 1rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 1.25rem; font-size: 0.85rem;">
          <div class="flex-between" style="margin-bottom: 0.4rem;"><span style="color: var(--text-muted);">Request ID:</span><strong>${item.id}</strong></div>
          <div class="flex-between" style="margin-bottom: 0.4rem;"><span style="color: var(--text-muted);">Citizen:</span><strong>${item.userName}</strong></div>
          <div class="flex-between" style="margin-bottom: 0.4rem;"><span style="color: var(--text-muted);">Declared Weight:</span><strong>${item.quantityKg} KG</strong></div>
          <div class="flex-between"><span style="color: var(--text-muted);">Points Reward:</span><strong style="color: var(--color-primary-dark);">+${item.pointsReward} GC</strong></div>
        </div>

        <button class="btn btn-primary btn-lg btn-block" onclick="window.WorkerPortalView.confirmScannedPickup('${item.id}')">
          <i data-lucide="check" class="lucide-icon-sm"></i>
          <span>Confirm Collection &amp; Issue Credits</span>
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  confirmScannedPickup(pickupId) {
    const pickup = State.state.pickups.find(p => p.id === pickupId);
    if (pickup && pickup.status !== 'collected' && pickup.status !== 'verified' && pickup.status !== 'rejected') {
      if (pickup.status === 'created') State.updatePickupStatus(pickupId, 'assigned');
      if (pickup.status === 'assigned') State.updatePickupStatus(pickupId, 'on_the_way');
      if (pickup.status === 'on_the_way') State.updatePickupStatus(pickupId, 'collected');
    }
    const result = State.awardCredits(pickupId);

    const modal = document.getElementById('worker-scan-modal');
    if (modal) modal.classList.add('active');
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    if (!result || !result.success || result.alreadyVerified || !(result.points > 0)) {
      const queueItem = State.state.workerQueue.find(q => q.id === pickupId);
      const pickupRecord = State.state.pickups.find(p => p.id === pickupId);
      this.renderScanResult({
        state: 'already-verified',
        item: {
          id: pickupId,
          userName: (queueItem && queueItem.userName) || State.state.user.name,
          pointsCredited: (result && result.points) || (pickupRecord && pickupRecord.pointsCredited) || 0
        }
      });
      return;
    }

    SoundFX.playPointsEarned();
    Confetti.trigger(90);

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
          <i data-lucide="check-circle-2" class="lucide-icon-lg"></i>
        </div>
        <h3 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Collection Verified</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          +${result.points} Green Credits disbursed to citizen. Lifecycle status updated to Verified.
        </p>
        <button class="btn btn-primary btn-lg btn-block" onclick="window.WorkerPortalView.closeScanModal()">
          Done
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  cleanup() {
    if (window.QRScanner && typeof window.QRScanner.stop === 'function') {
      window.QRScanner.stop();
    }
    const inspectModal = document.getElementById('worker-inspect-modal');
    if (inspectModal) inspectModal.classList.remove('active');
    const scanModal = document.getElementById('worker-scan-modal');
    if (scanModal) scanModal.classList.remove('active');
  }
};

window.WorkerPortalView = WorkerPortalView;
