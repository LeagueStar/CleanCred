/* ==========================================================================
   GREEN KARMA — ENVIRONMENTAL IMPACT DASHBOARD
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

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem;">
              <span>🌍</span> Planetary Impact Telemetry
            </div>
            <h2>Your Environmental Footprint Saved</h2>
            <p>Every segregated kilogram of waste logged on Green Karma directly avoids greenhouse emissions.</p>
          </div>

          <button class="btn btn-primary" onclick="window.ImpactDashboardView.generateImpactBadge()">
            <span>🏆</span> Share Impact Certificate
          </button>
        </div>

        <!-- 4 Top Ecological Impact Counters -->
        <div class="grid-cols-4" style="margin-bottom: 2.5rem;">
          
          <div class="glass-card glass-card-emerald" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #DCFCE7;">Total Waste Diverted</span>
              <span style="font-size: 1.5rem;">♻️</span>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: #FFFFFF; line-height: 1;">
              ${user.lifetimeWasteKg} <span style="font-size: 1rem; font-weight: 600;">KG</span>
            </div>
            <p style="font-size: 0.8rem; color: #DCFCE7; margin-top: 0.5rem;">Prevented from municipal dump yards</p>
          </div>

          <div class="glass-card" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">CO₂ Emissions Avoided</span>
              <span style="font-size: 1.5rem;">☁️</span>
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
                <strong style="color: var(--waste-wet); font-size: 1.1rem;">🟢 Organic Wet Waste</strong>
                <span class="badge" style="background: var(--waste-wet); color: #FFFFFF;">48 KG (38%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-navy); margin-bottom: 0.75rem;">Converted into 16 KG of organic compost fertilizer for city parks.</p>
              <div style="font-size: 0.75rem; color: var(--color-primary-dark); font-weight: 700;">Methane Gas Avoided: ~32.4 kg</div>
            </div>

            <div style="background: var(--waste-dry-bg); border: 1.5px solid var(--waste-dry-border); padding: 1.5rem; border-radius: var(--radius-lg);">
              <div class="flex-between" style="margin-bottom: 0.5rem;">
                <strong style="color: var(--waste-dry); font-size: 1.1rem;">🔵 Clean Recyclables</strong>
                <span class="badge" style="background: var(--waste-dry); color: #FFFFFF;">65 KG (52%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-navy); margin-bottom: 0.75rem;">Reprocessed into industrial pellets, corrugated boxes, and recycled fiber.</p>
              <div style="font-size: 0.75rem; color: #1E40AF; font-weight: 700;">Landfill Space Saved: 0.42 m³</div>
            </div>

            <div style="background: var(--waste-harmful-bg); border: 1.5px solid var(--waste-harmful-border); padding: 1.5rem; border-radius: var(--radius-lg);">
              <div class="flex-between" style="margin-bottom: 0.5rem;">
                <strong style="color: var(--waste-harmful); font-size: 1.1rem;">🔴 Hazardous & E-Waste</strong>
                <span class="badge" style="background: var(--waste-harmful); color: #FFFFFF;">12 KG (10%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-navy); margin-bottom: 0.75rem;">Safely extracted in authorized CPCB smelters, preventing groundwater toxic leeching.</p>
              <div style="font-size: 0.75rem; color: #991B1B; font-weight: 700;">Groundwater Protected: ~4,200 L</div>
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
          <h2 style="color: var(--color-navy); margin: 0.75rem 0;">Shivansh Prajapati</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Has diverted <strong>125 KG of segregated waste</strong> and avoided <strong>84.5 KG of CO₂ emissions</strong> under the Green Karma Municipal Sustainability Program.
          </p>

          <div style="background: #ECFDF5; border: 1.5px solid #A7F3D0; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <strong style="color: var(--color-primary-dark); font-size: 1.1rem;">Rank #12 Mumbai Eco Citizen &bull; 8-Day Green Streak 🔥</strong>
          </div>

          <button class="btn btn-primary btn-block" onclick="window.print()">
            🖨️ Download Certificate
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
