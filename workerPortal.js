/* ==========================================================================
   GREEN KARMA — MUNICIPAL WORKER VERIFICATION PORTAL
   Role: Ramesh Kumar | Zone 4 - Ward 4B | Electric Van MH-02-GK-4091
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

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
                👨‍🔧
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
                  <h2 style="color: #FFFFFF; font-size: 1.6rem;">${worker.name}</h2>
                  <span class="badge" style="background: #84CC16; color: #0A1929; font-weight: 800;">Municipal Officer</span>
                </div>
                <p style="color: #CBD5E1; font-size: 0.9rem;">
                  ${worker.zone} &bull; 🚚 ${worker.vehicle} &bull; ⭐ ${worker.rating} Rating
                </p>
              </div>
            </div>

            <!-- Fast Stats for Worker -->
            <div style="display: flex; gap: 1.5rem; align-items: center;">
              <div style="background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #84CC16;">${worker.todayCollections}</div>
                <div style="font-size: 0.72rem; color: #CBD5E1; font-weight: 600;">Today's Pickups</div>
              </div>
              <div style="background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF;">${worker.totalVerifiedKg} KG</div>
                <div style="font-size: 0.72rem; color: #CBD5E1; font-weight: 600;">Verified Waste</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('illegal-dumping')">
                🚨 Report Dumping
              </button>
            </div>
          </div>
        </div>

        <!-- Assigned Route Pickups Queue -->
        <div class="glass-card" style="padding: 2rem;">
          <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--color-navy);">Assigned Collection Route Queue</h3>
              <p style="font-size: 0.85rem;">Inspect waste bags, verify segregation compliance, and approve points disbursement.</p>
            </div>
            <span class="badge badge-green">${queue.filter(q => q.status !== 'verified' && q.status !== 'rejected').length} Pending Verifications</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${queue.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; background: #F8FAFC; border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); flex-wrap: wrap; gap: 1rem;">
                
                <div style="display: flex; align-items: center; gap: 1.25rem;">
                  <div style="width: 52px; height: 52px; border-radius: var(--radius-md); overflow: hidden; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                    ${item.category === 'wet' ? '🟢' : item.category === 'dry' ? '🔵' : '🔴'}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <strong style="color: var(--color-navy); font-size: 1.05rem;">${item.subType}</strong>
                      <span class="badge" style="background: ${item.category === 'wet' ? 'var(--waste-wet-bg)' : item.category === 'dry' ? 'var(--waste-dry-bg)' : 'var(--waste-harmful-bg)'}; color: ${item.category === 'wet' ? 'var(--waste-wet)' : item.category === 'dry' ? 'var(--waste-dry)' : 'var(--waste-harmful)'}; font-weight: 700;">
                        ${item.quantityKg} KG
                      </span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                      Citizen: <strong>${item.userName}</strong> &bull; 📍 ${item.address}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 600; margin-top: 0.25rem;">
                      Request ID: ${item.id} &bull; OTP: ${item.otp}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  ${item.status === 'verified' ? `
                    <span class="badge" style="background: #D1FAE5; color: #065F46; font-size: 0.9rem; padding: 0.5rem 1rem;">
                      ✓ Verified (+${item.pointsReward} GP)
                    </span>
                  ` : item.status === 'rejected' ? `
                    <span class="badge" style="background: #FEE2E2; color: #991B1B; font-size: 0.9rem; padding: 0.5rem 1rem;">
                      ✕ Rejected (Improper)
                    </span>
                  ` : `
                    <button class="btn btn-primary" onclick="window.WorkerPortalView.openVerificationModal('${item.id}')">
                      <span>🔍</span> Inspect & Verify
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
          <span style="font-size: 2rem;">🔍</span>
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
            Approve & Credit +${item.pointsReward} GP ⚡
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
  }
};

window.WorkerPortalView = WorkerPortalView;
