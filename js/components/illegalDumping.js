/* ==========================================================================
   GREEN LEGACY — ILLEGAL DUMPING REPORTING & CIVIC ACTION
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
      <div class="app-container" style="max-width: 900px;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge" style="background: #FEE2E2; color: #991B1B; margin-bottom: 0.35rem;">
              Civic vigilance service
            </div>
            <h2>Report an illegal dumping hotspot</h2>
            <p>Help the municipal authority identify and eliminate illegal dumping sites. Earn +20 GC once resolved.</p>
          </div>

          <span class="badge badge-points" style="font-size: 0.95rem; padding: 0.5rem 1rem;">
            +20 Green Credits / Report
          </span>
        </div>

        <!-- 2-Column: Report Form (Left) & Active Status Tracker (Right) -->
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 2rem;" class="hero-grid">
          
          <!-- Left: Submission Form -->
          <div class="glass-card" style="padding: 2rem;">
            <h3 style="color: var(--color-navy); margin-bottom: 1.25rem;">Submit a location report</h3>

            <!-- Photo Upload -->
            <div class="form-group">
              <label class="form-label">Photo Proof of Illegal Dump</label>
              <div style="border: 2px dashed var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; background: #F8FAFC; cursor: pointer;" onclick="document.getElementById('dump-photo-input').click()">
                <input type="file" id="dump-photo-input" accept="image/*" style="display: none;" onchange="window.IllegalDumpingView.handlePhotoUpload(event)">
                <div id="dump-preview-box">
                  ${this.photoPreviewUrl ? `
                    <img src="${this.photoPreviewUrl}" style="max-height: 140px; border-radius: var(--radius-sm); margin-bottom: 0.5rem;" />
                    <div style="font-size: 0.78rem; font-weight: 700; color: var(--color-primary-dark);">Photo Attached ✓</div>
                  ` : `
                    <div style="font-size: 2rem; margin-bottom: 0.25rem;">📷</div>
                    <strong style="color: var(--color-navy); font-size: 0.85rem;">Click to Take or Upload Photo</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Captures GPS coordinates automatically</div>
                  `}
                </div>
              </div>
            </div>

            <!-- Location -->
            <div class="form-group">
              <label class="form-label">Location / Street Landmark</label>
              <input type="text" class="form-input" id="dump-location" placeholder="e.g. Under Flyover, Link Road, Ward 4B" value="Under Flyover, Link Road, Ward 4B">
            </div>

            <!-- Waste Category -->
            <div class="form-group">
              <label class="form-label">Type of Dumped Waste</label>
              <select class="form-select" id="dump-type">
                <option value="Construction & Demolition Debris">Construction & Demolition Debris</option>
                <option value="Mixed Plastic Piles & Burning Waste">Mixed Plastic Piles & Burning Waste</option>
                <option value="Abandoned Commercial / Industrial Waste">Abandoned Commercial / Industrial Waste</option>
                <option value="Rotting Food & Dead Organic Waste">Rotting Food & Dead Organic Waste</option>
              </select>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Additional Description</label>
              <textarea class="form-textarea" id="dump-desc" rows="3" placeholder="Provide details like blocking pedestrian path, foul smell, or recurring dump..."></textarea>
            </div>

            <button class="btn btn-primary btn-block btn-lg" style="margin-top: 1rem;" onclick="window.IllegalDumpingView.submitReport()">
              Submit hotspot report (+20 GC)
            </button>
          </div>

          <!-- Right: Public Resolution Pipeline & History -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <div class="glass-card" style="padding: 1.75rem;">
              <h4 style="color: var(--color-navy); margin-bottom: 0.5rem;">Resolution Lifecycle</h4>
              <p style="font-size: 0.8rem; margin-bottom: 1.25rem;">Municipal response SLA: Under 24 hours for verified citizen alerts.</p>

              <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.8rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; background: #F8FAFC; padding: 0.6rem 0.85rem; border-radius: var(--radius-md);">
                  <span>1️⃣</span> <strong>Submitted</strong> — Geotagged to GIS map
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem; background: #F8FAFC; padding: 0.6rem 0.85rem; border-radius: var(--radius-md);">
                  <span>2️⃣</span> <strong>Assigned</strong> — Dispatched to Ward Inspector
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem; background: #F8FAFC; padding: 0.6rem 0.85rem; border-radius: var(--radius-md);">
                  <span>3️⃣</span> <strong>Investigating</strong> — Heavy vehicle cleanup
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem; background: #ECFDF5; padding: 0.6rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--color-primary);">
                  <span>4️⃣</span> <strong style="color: var(--color-primary-dark);">Resolved</strong> — Clean site photo + 20 GC credited!
                </div>
              </div>
            </div>

            <!-- Recent Reports Feed -->
            <div class="glass-card" style="padding: 1.75rem; flex: 1;">
              <h4 style="color: var(--color-navy); margin-bottom: 1rem;">Recent Civic Reports</h4>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${reports.map(r => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <img src="${r.photoUrl}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;" />
                      <div>
                        <strong style="font-size: 0.85rem; color: var(--color-navy); display: block;">${r.wasteType}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${r.location}</div>
                        <div style="font-size: 0.72rem; color: var(--text-light);">${Formatters.formatRelativeTime(r.reportedAt)}</div>
                      </div>
                    </div>

                    <div style="text-align: right;">
                      <span class="badge" style="background: ${r.status === 'Resolved' ? '#D1FAE5' : '#FEF3C7'}; color: ${r.status === 'Resolved' ? '#065F46' : '#92400E'}; font-size: 0.75rem;">
                        ${r.status === 'Resolved' ? '✓ Resolved (+20 GC)' : '🟡 ' + r.status}
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
    alert('Report submitted successfully! The Municipal Ward Inspector has been notified.');
    this.photoPreviewUrl = null;
    this.render();
  }
};

window.IllegalDumpingView = IllegalDumpingView;
