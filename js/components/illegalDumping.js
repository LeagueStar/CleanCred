/* ==========================================================================
   CLEANCRED — ILLEGAL DUMPING REPORTING & CIVIC ACTION
   Tactile Neumorphism + Civic Technology
   Citizen-powered Geo-Tagged Hotspot Spotting (+20 GC on Verification)
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

export const IllegalDumpingView = {
  photoPreviewUrl: null,

  render() {
    const container = document.getElementById('view-illegal-dumping');
    if (!container) return;

    const reports = State.state.illegalDumpingReports;

    container.innerHTML = `
      <div class="app-container" style="max-width: 950px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge" style="background: #FEE2E2; color: #991B1B; margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="shield-alert" class="lucide-icon-sm"></i>
              <span>Civic Vigilance & Enforcement Hotline</span>
            </div>
            <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Report Illegal Dumping Hotspot</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Help municipal authorities identify and clear illicit waste piles. Earn +20 GC once resolved.</p>
          </div>

          <div class="badge badge-points" style="font-size: 0.95rem; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="coins" class="lucide-icon-sm"></i>
            <span>+20 Green Credits / Resolved Report</span>
          </div>
        </div>

        <!-- 2-Column: Report Form (Left) & Active Status Tracker (Right) -->
        <div class="hero-grid hero-grid-dumping" style="gap: 1.75rem;">
          
          <!-- Left: Submission Form -->
          <div class="neu-card neu-card-raised" style="padding: 2rem; border-radius: var(--radius-xl);">
            <h3 style="color: var(--color-navy); margin-bottom: 1.25rem; font-size: 1.25rem; font-weight: 800;">Submit Hotspot Report</h3>

            <!-- Photo Upload Dropzone -->
            <div class="form-group">
              <label class="form-label">Photo Evidence of Illegal Dump</label>
              <div class="neu-card-inset" style="border: 2px dashed #94A3B8; border-radius: var(--radius-md); padding: 1.5rem; text-align: center; cursor: pointer;" onclick="document.getElementById('dump-photo-input').click()">
                <input type="file" id="dump-photo-input" accept="image/*" style="display: none;" onchange="window.IllegalDumpingView.handlePhotoUpload(event)">
                <div id="dump-preview-box">
                  ${this.photoPreviewUrl ? `
                    <img src="${this.photoPreviewUrl}" style="max-height: 140px; border-radius: var(--radius-sm); margin-bottom: 0.5rem; object-fit: cover;" />
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
                      <i data-lucide="check-circle-2" class="lucide-icon-sm"></i>
                      <span>Photo Attached with GPS Metadata</span>
                    </div>
                  ` : `
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #E2E8F0; color: #475569; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.5rem auto;">
                      <i data-lucide="camera" class="lucide-icon-md"></i>
                    </div>
                    <strong style="color: var(--color-navy); font-size: 0.9rem; display: block;">Click to Capture or Upload Evidence</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Auto-attaches current ward GPS coordinates</div>
                  `}
                </div>
              </div>
            </div>

            <!-- Location -->
            <div class="form-group">
              <label class="form-label">Location / Landmark</label>
              <input type="text" class="form-input neu-input" id="dump-location" placeholder="e.g. Under Flyover, Link Road, Ward 4B" value="Under Flyover, Link Road, Ward 4B">
            </div>

            <!-- Waste Category -->
            <div class="form-group">
              <label class="form-label">Type of Dumped Waste</label>
              <select class="form-select neu-input" id="dump-type">
                <option value="Construction & Demolition Debris">Construction & Demolition Debris</option>
                <option value="Mixed Plastic Piles & Burning Waste">Mixed Plastic Piles & Burning Waste</option>
                <option value="Abandoned Commercial / Industrial Waste">Abandoned Commercial / Industrial Waste</option>
                <option value="Rotting Food & Organic Carcasses">Rotting Food & Organic Waste</option>
              </select>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Additional Observations</label>
              <textarea class="form-textarea neu-input" id="dump-desc" rows="3" placeholder="Describe blocking pedestrian path, severe foul smell, open fire risk..."></textarea>
            </div>

            <button class="btn btn-primary btn-block btn-lg" style="margin-top: 1rem;" onclick="window.IllegalDumpingView.submitReport()">
              <i data-lucide="send" class="lucide-icon-sm"></i>
              <span>Dispatch Hotspot Report (+20 GC)</span>
            </button>
          </div>

          <!-- Right: Public Resolution Pipeline & History -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
              <h4 style="color: var(--color-navy); margin-bottom: 0.35rem; font-size: 1.05rem; font-weight: 800;">Municipal SLA Pipeline</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">Standard Municipal Response: Actioned within 24 hours of citizen alert.</p>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.825rem;">
                <div class="neu-card-flat" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-md);">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #E2E8F0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem;">1</div>
                  <div><strong>Submitted:</strong> Geotagged to BMC GIS spatial grid</div>
                </div>
                <div class="neu-card-flat" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-md);">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #E2E8F0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem;">2</div>
                  <div><strong>Assigned:</strong> Dispatched to Ward 4B Sanitation Officer</div>
                </div>
                <div class="neu-card-flat" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-md);">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #E2E8F0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem;">3</div>
                  <div><strong>Investigating:</strong> Heavy payload vehicle dispatched</div>
                </div>
                <div class="neu-card-inset" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem;">4</div>
                  <div><strong style="color: var(--color-primary-dark);">Resolved:</strong> Clean site verified & +20 GC released</div>
                </div>
              </div>
            </div>

            <!-- Recent Reports Feed -->
            <div class="neu-card neu-card-raised" style="padding: 1.75rem; flex: 1; border-radius: var(--radius-xl);">
              <h4 style="color: var(--color-navy); margin-bottom: 1rem; font-size: 1.05rem; font-weight: 800;">Recent Ward Alerts</h4>

              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${reports.map(r => `
                  <div class="neu-card-flat" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-md);">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <img src="${r.photoUrl}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--color-border);" />
                      <div>
                        <strong style="font-size: 0.85rem; color: var(--color-navy); display: block;">${r.wasteType}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${r.location}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">${Formatters.formatRelativeTime(r.reportedAt)}</div>
                      </div>
                    </div>

                    <div style="text-align: right;">
                      <span class="badge" style="background: ${r.status === 'Resolved' ? '#D1FAE5' : '#FEF3C7'}; color: ${r.status === 'Resolved' ? '#065F46' : '#92400E'}; font-size: 0.75rem; font-weight: 700;">
                        ${r.status === 'Resolved' ? 'Resolved (+20 GC)' : r.status}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreviewUrl = e.target.result;
        SoundFX.playClick();
        this.render();
      };
      reader.readAsDataURL(file);
    }
  },

  submitReport() {
    const location = document.getElementById('dump-location').value;
    const wasteType = document.getElementById('dump-type').value;

    State.reportIllegalDumping({
      location: location,
      wasteType: wasteType,
      photoUrl: this.photoPreviewUrl
    });

    SoundFX.playPointsEarned();
    Confetti.trigger(80);
    window.AppRouter.showToast('Report submitted! Ward Inspector notified.');
    this.photoPreviewUrl = null;
    this.render();
  }
};

window.IllegalDumpingView = IllegalDumpingView;
