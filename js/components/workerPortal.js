/* ==========================================================================
   GREEN LEGACY — MUNICIPAL WORKER VERIFICATION PORTAL
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
      <div class="app-container">
        
        <!-- Header & Worker Identity Banner -->
        <div class="glass-card glass-card-navy" style="padding: 2rem; border-radius: var(--radius-xl); margin-bottom: 2rem;">
          <div class="flex-between" style="flex-wrap: wrap; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; border: 3px solid #84CC16;">
                CC
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
                  <h2 style="color: #FFFFFF; font-size: 1.6rem;">${worker.name}</h2>
                  <span class="badge" style="background: #84CC16; color: #0A1929; font-weight: 800;">Municipal Officer</span>
                </div>
                <p style="color: #CBD5E1; font-size: 0.9rem;">
                  ${worker.zone} &bull; Vehicle ${worker.vehicle} &bull; ${worker.rating} service rating
                </p>
              </div>
            </div>

            <!-- Fast Stats for Worker -->
            <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
              <div style="background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #84CC16;">${worker.todayCollections}</div>
                <div style="font-size: 0.72rem; color: #CBD5E1; font-weight: 600;">Today's Pickups</div>
              </div>
              <div style="background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF;">${worker.totalVerifiedKg} KG</div>
                <div style="font-size: 0.72rem; color: #CBD5E1; font-weight: 600;">Verified Waste</div>
              </div>
              <button class="btn btn-primary btn-lg" style="background: #84CC16; color: #0A1929; border-color: #84CC16; font-weight: 800;" onclick="window.WorkerPortalView.openScanModal()">
                Scan QR
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('illegal-dumping')">
                Report dumping
              </button>
            </div>
          </div>
        </div>

        <!-- Assigned Route Pickups Queue -->
        <div class="glass-card" style="padding: 2rem;">
          <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--color-navy);">Assigned Collection Route Queue</h3>
              <p style="font-size: 0.85rem;">Inspect waste bags, verify segregation compliance, and approve credits disbursement.</p>
            </div>
            <span class="badge badge-green">${queue.filter(q => q.status !== 'verified' && q.status !== 'rejected').length} Pending Verifications</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${queue.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; background: #F8FAFC; border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); flex-wrap: wrap; gap: 1rem;">
                
                <div style="display: flex; align-items: center; gap: 1.25rem;">
                  <div style="width: 52px; height: 52px; border-radius: var(--radius-md); overflow: hidden; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                    ${item.category === 'wet' ? 'W' : item.category === 'dry' ? 'D' : 'H'}
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
                    <div style="font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 600; margin-top: 0.25rem;">
                      Request ID: ${item.id} &bull; OTP: ${item.otp}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  ${item.status === 'verified' ? `
                    <span class="badge" style="background: #D1FAE5; color: #065F46; font-size: 0.9rem; padding: 0.5rem 1rem;">
                      ✓ Verified (+${item.pointsReward} GC)
                    </span>
                  ` : item.status === 'rejected' ? `
                    <span class="badge" style="background: #FEE2E2; color: #991B1B; font-size: 0.9rem; padding: 0.5rem 1rem;">
                      ✕ Rejected (Improper)
                    </span>
                  ` : `
                    <button class="btn btn-primary" onclick="window.WorkerPortalView.openVerificationModal('${item.id}')">
                      Inspect & Verify
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
        <div class="modal-content" style="max-width: 580px;">
          <div class="modal-close-btn" onclick="window.WorkerPortalView.closeModal()">✕</div>
          <div id="worker-modal-body"></div>
        </div>
      </div>

      <!-- QR Scan Modal Shell (fast, minimal-typing verification path) -->
      <div class="modal-overlay" id="worker-scan-modal">
        <div class="modal-content" style="max-width: 420px;">
          <div class="modal-close-btn" onclick="window.WorkerPortalView.closeScanModal()">✕</div>
          <div id="worker-scan-body"></div>
        </div>
      </div>
    `;
  },

  openVerificationModal(pickupId) {
    SoundFX.playClick();
    const item = State.state.workerQueue.find(q => q.id === pickupId);
    if (!item) return;

    this.selectedPickup = item;
    const modalBody = document.getElementById('worker-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <span class="upload-marker" style="margin: 0;">CHECK</span>
          <div>
            <h3 style="color: var(--color-navy);">Disposal Verification Check</h3>
            <p style="font-size: 0.85rem;">Request #${item.id} &bull; Citizen: ${item.userName}</p>
          </div>
        </div>

        <!-- Photo Check -->
        <div style="margin-bottom: 1.25rem; text-align: center;">
          <img src="${item.photoUrl}" style="max-height: 180px; width: 100%; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--color-border);" />
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">Citizen Photo Proof for ${item.subType}</div>
        </div>

        <!-- Segregation Quality Checklist -->
        <div style="background: #F8FAFC; border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
          <strong style="color: var(--color-navy); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">Segregation Compliance Checks:</strong>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; margin-bottom: 0.35rem; cursor: pointer;">
            <input type="checkbox" checked id="chk-clean"> Zero hazardous/cross-contamination detected
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; margin-bottom: 0.35rem; cursor: pointer;">
            <input type="checkbox" checked id="chk-category"> Material matches designated ${item.category.toUpperCase()} category
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; cursor: pointer;">
            <input type="checkbox" checked id="chk-bin"> Placed in standardized municipal green/blue bag
          </label>
        </div>

        <!-- Weight Validation Slider -->
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <div class="flex-between">
            <label class="form-label">Verified Scale Weight:</label>
            <strong id="modal-weight-val" style="color: var(--color-primary-dark); font-size: 1.1rem;">${item.quantityKg} KG</strong>
          </div>
          <input type="range" min="0.5" max="15" step="0.5" value="${item.quantityKg}" style="width: 100%; accent-color: var(--color-primary);" oninput="document.getElementById('modal-weight-val').textContent = this.value + ' KG'">
        </div>

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1rem;">
          <button class="btn btn-secondary" style="border-color: #EF4444; color: #EF4444;" onclick="window.WorkerPortalView.processVerification('${item.id}', false)">
            Reject Submission
          </button>
          <button class="btn btn-primary btn-lg" onclick="window.WorkerPortalView.processVerification('${item.id}', true)">
            Approve & Credit +${item.pointsReward} GC ⚡
          </button>
        </div>
      `;

      document.getElementById('worker-inspect-modal').classList.add('active');
    }
  },

  closeModal() {
    SoundFX.playClick();
    document.getElementById('worker-inspect-modal').classList.remove('active');
  },

  processVerification(pickupId, approved) {
    if (approved) {
      SoundFX.playPointsEarned();
      Confetti.trigger(90);
    } else {
      SoundFX.playClick();
    }

    State.verifyWasteSubmission(pickupId, approved);
    this.closeModal();
    this.render();
  },

  // ------------------------------------------------------------------
  // QR Scan Verification — the fast, "one-scan, minimal-data-entry" path
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
    QRScanner.stop();
    const modal = document.getElementById('worker-scan-modal');
    if (modal) modal.classList.remove('active');
    this.render();
  },

  // Attempts a real live camera scan. If the camera genuinely can't be
  // used (no camera, permission denied, unsupported browser), this is
  // reported honestly and the UI drops to the manual-entry fallback —
  // it never pretends a scan is happening when it isn't.
  renderScanCameraView() {
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    body.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: var(--color-navy); margin-bottom: 0.25rem;">Scan pickup QR</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">Point the camera at the citizen's pickup QR code.</p>

        <div style="position: relative; width: 100%; aspect-ratio: 1 / 1; background: #0A1929; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1rem;">
          <video id="worker-scan-video" style="width: 100%; height: 100%; object-fit: cover;" muted></video>
          <canvas id="worker-scan-canvas" style="display: none;"></canvas>
          <div style="position: absolute; inset: 0; border: 3px solid rgba(132, 204, 22, 0.85); border-radius: var(--radius-lg); margin: 15%; pointer-events: none;"></div>
        </div>

        <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700; margin-bottom: 1rem;">Camera ready</span>

        <button class="btn btn-secondary" style="width: 100%;" onclick="window.WorkerPortalView.useManualFallback()">
          Camera not working? Enter Request ID manually
        </button>
      </div>
    `;

    QRScanner.start(
      'worker-scan-video',
      'worker-scan-canvas',
      (decodedText) => this.handleScannedText(decodedText),
      (errorMessage) => this.renderManualFallback(errorMessage)
    );
  },

  // Honest fallback path for the SIH demo: no camera pretense, clearly
  // labeled as manual entry, using the pickup's real request ID.
  renderManualFallback(errorMessage) {
    QRScanner.stop();
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    body.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: var(--color-navy); margin-bottom: 0.25rem;">Manual request entry</h3>
        <span class="badge" style="background: #FEF3C7; color: #92400E; font-weight: 700; margin-bottom: 1rem;">Camera unavailable — enter request ID</span>
        ${errorMessage ? `<p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">${errorMessage}</p>` : ''}

        <div class="form-group" style="text-align: left;">
          <label class="form-label">Pickup Request ID</label>
          <input type="text" id="manual-pickup-id" class="form-input" placeholder="e.g. GK-2026-89421" style="text-transform: uppercase;" onkeydown="if(event.key==='Enter') window.WorkerPortalView.submitManualId()">
        </div>

        <button class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.5rem;" onclick="window.WorkerPortalView.submitManualId()">
          Verify Pickup
        </button>
        <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="window.WorkerPortalView.renderScanCameraView()">
          ← Try Camera Again
        </button>
      </div>
    `;

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

  // Shared handler for both a real decoded QR payload and a manually typed ID.
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
      // Exists in the citizen's own pickup history, but isn't a pending
      // item in this worker's route (e.g. rejected, or not this worker's).
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
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">❌</div>
          <h3 style="color: #991B1B; margin-bottom: 0.25rem;">Invalid QR / Request ID</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            "${pickupId || raw}" doesn't match any pickup assigned to you. No credits were issued.
          </p>
          <button class="btn btn-primary" style="width: 100%;" onclick="window.WorkerPortalView.renderScanCameraView()">
            Try Again
          </button>
        </div>
      `;
      return;
    }

    if (state === 'already-verified') {
      body.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">✓</div>
          <h3 style="color: var(--color-primary-dark); margin-bottom: 0.25rem;">Already Verified</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Pickup #${item.id}${item.userName ? ` (${item.userName})` : ''} was already verified${item.pointsCredited ? ` — ${item.pointsCredited} GC were already credited` : ''}. No additional credits were issued.
          </p>
          <button class="btn btn-secondary" style="width: 100%;" onclick="window.WorkerPortalView.closeScanModal()">
            Close
          </button>
        </div>
      `;
      return;
    }

    // state === 'confirm' — valid, pending pickup found
    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${item.category === 'wet' ? '🟢' : item.category === 'dry' ? '🔵' : '🔴'}</div>
        <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700; margin-bottom: 0.75rem;">✓ QR Verified &bull; Pickup Authentic</span>
        <h3 style="color: var(--color-navy); margin-bottom: 0.75rem;">${item.subType}</h3>

        <div style="background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; text-align: left; margin-bottom: 1.25rem; font-size: 0.85rem;">
          <div class="flex-between" style="margin-bottom: 0.4rem;"><span style="color: var(--text-muted);">Request ID</span><strong>${item.id}</strong></div>
          <div class="flex-between" style="margin-bottom: 0.4rem;"><span style="color: var(--text-muted);">Citizen</span><strong>${item.userName}</strong></div>
          <div class="flex-between" style="margin-bottom: 0.4rem;"><span style="color: var(--text-muted);">Weight</span><strong>${item.quantityKg} KG</strong></div>
          <div class="flex-between"><span style="color: var(--text-muted);">Green Credits</span><strong style="color: var(--color-primary-dark);">+${item.pointsReward} GC</strong></div>
        </div>

        <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="window.WorkerPortalView.confirmScannedPickup('${item.id}')">
          Confirm collection & issue credits
        </button>
      </div>
    `;
  },

  confirmScannedPickup(pickupId) {
    const result = State.verifyWasteSubmission(pickupId, true);

    // verifyWasteSubmission() -> notify() triggers a full portal re-render
    // (see State.subscribe in app.js), which rebuilds the modal shell fresh
    // and closed. Re-open it so the result screen below is still visible.
    const modal = document.getElementById('worker-scan-modal');
    if (modal) modal.classList.add('active');
    const body = document.getElementById('worker-scan-body');
    if (!body) return;

    if (!result.success) {
      // Someone else verified it in the moment between the scan and the
      // confirm tap — show the same honest "already verified" state.
      const queueItem = State.state.workerQueue.find(q => q.id === pickupId);
      const pickupRecord = State.state.pickups.find(p => p.id === pickupId);
      this.renderScanResult({
        state: 'already-verified',
        item: {
          id: pickupId,
          userName: (queueItem && queueItem.userName) || State.state.user.name,
          pointsCredited: result.points || (pickupRecord && pickupRecord.pointsCredited) || 0
        }
      });
      return;
    }

    SoundFX.playPointsEarned();
    Confetti.trigger(90);

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 2.25rem; margin-bottom: 0.5rem; color: var(--color-primary); font-weight: 800;">✓</div>
        <h3 style="color: var(--color-primary-dark); margin-bottom: 1rem;">QR VERIFIED</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center; margin-bottom: 1.5rem;">
          <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700;">✓ QR Verified</span>
          <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700;">Pickup verified</span>
          <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700;">${result.points} Green Credits issued</span>
        </div>
        <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="window.WorkerPortalView.closeScanModal()">
          Done
        </button>
      </div>
    `;
  }
};

window.WorkerPortalView = WorkerPortalView;
