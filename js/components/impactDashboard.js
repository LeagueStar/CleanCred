/* ==========================================================================
   GREEN LEGACY — ENVIRONMENTAL IMPACT DASHBOARD
   Carbon Offset Calculator, Water Conservation, Trees, and Green Score
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

export const ImpactDashboardView = {
  render() {
    const container = document.getElementById('view-impact');
    if (!container) return;

    const user = State.state.user;

    // Derive the composition breakdown from user.wasteByCategoryKg, which
    // is kept in sync with lifetimeWasteKg (see State.verifyWasteSubmission)
    // instead of being a separate, independently-hardcoded dataset.
    const cat = user.wasteByCategoryKg;
    const catTotal = cat.wet + cat.dry + cat.harmful;
    const wetPct = catTotal > 0 ? Math.round((cat.wet / catTotal) * 100) : 0;
    const dryPct = catTotal > 0 ? Math.round((cat.dry / catTotal) * 100) : 0;
    const harmfulPct = catTotal > 0 ? Math.max(0, 100 - wetPct - dryPct) : 0;

    // Secondary impact figures, derived from each category's weight using
    // the same fixed conversion factors the original mockup implied
    // (e.g. 48kg wet -> 16kg compost was a 1/3 ratio; 12kg harmful ->
    // 4,200L groundwater protected was a *350 ratio).
    const compostKg = Math.round((cat.wet / 3) * 10) / 10;
    const methaneAvoidedKg = Math.round(cat.wet * 0.675 * 10) / 10;
    const landfillSpaceSavedM3 = Math.round(cat.dry * 0.006462 * 100) / 100;
    const groundwaterProtectedL = Math.round(cat.harmful * 350);

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem;">
              Verified collection impact
            </div>
            <h2>Your measurable impact</h2>
            <p>Every verified collection contributes to responsible recovery and reduced emissions.</p>
          </div>

          <button class="btn btn-primary" onclick="window.ImpactDashboardView.generateImpactBadge()">
            View impact certificate
          </button>
        </div>

        <!-- 4 Top Ecological Impact Counters -->
        <div class="grid-cols-4" style="margin-bottom: 2.5rem;">
          
          <div class="glass-card glass-card-emerald" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #DCFCE7;">Total Waste Diverted</span>
              <span class="account-marker">KG</span>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: #FFFFFF; line-height: 1;">
              ${user.lifetimeWasteKg} <span style="font-size: 1rem; font-weight: 600;">KG</span>
            </div>
            <p style="font-size: 0.8rem; color: #DCFCE7; margin-top: 0.5rem;">Prevented from municipal dump yards</p>
          </div>

          <div class="glass-card" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">CO₂ Emissions Avoided</span>
              <span class="account-marker">CO₂</span>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: var(--color-navy); line-height: 1;">
              ${user.co2SavedKg} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">KG</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-primary); font-weight: 600; margin-top: 0.5rem;">≈ 420 KM Car Travel Offset</p>
          </div>

          <div class="glass-card" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Trees Equivalent</span>
              <span style="font-size: 1.5rem;">🌳</span>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: var(--color-navy); line-height: 1;">
              ${user.treesEquivalent} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">Trees</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">Annual carbon absorption equivalent</p>
          </div>

          <div class="glass-card" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Water Conserved</span>
              <span style="font-size: 1.5rem;">💧</span>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: #2563EB; line-height: 1;">
              ${user.waterSavedLitres} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">L</span>
            </div>
            <p style="font-size: 0.8rem; color: #2563EB; font-weight: 600; margin-top: 0.5rem;">Through recycled paper & plastics</p>
          </div>

        </div>

        <!-- Waste Composition Breakdown -->
        <div class="glass-card" style="padding: 2rem; margin-bottom: 2.5rem;">
          <h3 style="color: var(--color-navy); margin-bottom: 1.25rem;">Your Segregated Material Breakdown</h3>

          <div class="grid-cols-3">
            <div style="background: var(--waste-wet-bg); border: 1.5px solid var(--waste-wet-border); padding: 1.5rem; border-radius: var(--radius-lg);">
              <div class="flex-between" style="margin-bottom: 0.5rem;">
                <strong style="color: var(--waste-wet); font-size: 1.1rem;">Organic wet waste</strong>
                <span class="badge" style="background: var(--waste-wet); color: #FFFFFF;">${cat.wet} KG (${wetPct}%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-navy); margin-bottom: 0.75rem;">Converted into ${compostKg} KG of organic compost fertilizer for city parks.</p>
              <div style="font-size: 0.75rem; color: var(--color-primary-dark); font-weight: 700;">Methane Gas Avoided: ~${methaneAvoidedKg} kg</div>
            </div>

            <div style="background: var(--waste-dry-bg); border: 1.5px solid var(--waste-dry-border); padding: 1.5rem; border-radius: var(--radius-lg);">
              <div class="flex-between" style="margin-bottom: 0.5rem;">
                <strong style="color: var(--waste-dry); font-size: 1.1rem;">Clean recyclables</strong>
                <span class="badge" style="background: var(--waste-dry); color: #FFFFFF;">${cat.dry} KG (${dryPct}%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-navy); margin-bottom: 0.75rem;">Reprocessed into industrial pellets, corrugated boxes, and recycled fiber.</p>
              <div style="font-size: 0.75rem; color: #1E40AF; font-weight: 700;">Landfill Space Saved: ${landfillSpaceSavedM3} m³</div>
            </div>

            <div style="background: var(--waste-harmful-bg); border: 1.5px solid var(--waste-harmful-border); padding: 1.5rem; border-radius: var(--radius-lg);">
              <div class="flex-between" style="margin-bottom: 0.5rem;">
                <strong style="color: var(--waste-harmful); font-size: 1.1rem;">Hazardous & E-waste</strong>
                <span class="badge" style="background: var(--waste-harmful); color: #FFFFFF;">${cat.harmful} KG (${harmfulPct}%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-navy); margin-bottom: 0.75rem;">Safely extracted in authorized CPCB smelters, preventing groundwater toxic leeching.</p>
              <div style="font-size: 0.75rem; color: #991B1B; font-weight: 700;">Groundwater Protected: ~${Formatters.formatNumber(groundwaterProtectedL)} L</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Impact Certificate Modal -->
      <div class="modal-overlay" id="impact-cert-modal">
        <div class="modal-content" style="max-width: 600px; text-align: center; border: 4px double #16A34A; padding: 2.5rem;">
          <div class="modal-close-btn" onclick="document.getElementById('impact-cert-modal').classList.remove('active')">✕</div>
          
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌍 📜</div>
          <div style="font-size: 0.8rem; font-weight: 800; color: var(--color-primary-dark); letter-spacing: 0.15em; text-transform: uppercase;">
            OFFICIAL CITIZEN IMPACT CERTIFICATE
          </div>
          <h2 style="color: var(--color-navy); margin: 0.75rem 0;">${user.name}</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Has diverted <strong>${user.lifetimeWasteKg} KG of segregated waste</strong> and avoided <strong>${user.co2SavedKg} KG of CO₂ emissions</strong> through the CleanCred Municipal Sustainability Program.
          </p>

          <div style="background: #ECFDF5; border: 1.5px solid #A7F3D0; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <strong style="color: var(--color-primary-dark); font-size: 1.1rem;">Rank #${user.rank} Mumbai Eco Citizen &bull; ${user.greenStreakDays}-Day Green Streak 🔥</strong>
          </div>

          <button class="btn btn-primary btn-block" onclick="window.print()">
            Download Certificate
          </button>
        </div>
      </div>
    `;
  },

  generateImpactBadge() {
    SoundFX.playPointsEarned();
    Confetti.trigger(90);
    document.getElementById('impact-cert-modal').classList.add('active');
  }
};

window.ImpactDashboardView = ImpactDashboardView;
