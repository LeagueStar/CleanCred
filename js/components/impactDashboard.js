/* ==========================================================================
   CLEANCRED — ENVIRONMENTAL IMPACT ANALYTICS
   Tactile Neumorphism + Civic Technology
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

    // Derive composition breakdown from user.wasteByCategoryKg
    const cat = user.wasteByCategoryKg;
    const catTotal = cat.wet + cat.dry + cat.harmful;
    const wetPct = catTotal > 0 ? Math.round((cat.wet / catTotal) * 100) : 0;
    const dryPct = catTotal > 0 ? Math.round((cat.dry / catTotal) * 100) : 0;
    const harmfulPct = catTotal > 0 ? Math.max(0, 100 - wetPct - dryPct) : 0;

    // Secondary impact figures
    const compostKg = Math.round((cat.wet / 3) * 10) / 10;
    const methaneAvoidedKg = Math.round(cat.wet * 0.675 * 10) / 10;
    const landfillSpaceSavedM3 = Math.round(cat.dry * 0.006462 * 100) / 100;
    const groundwaterProtectedL = Math.round(cat.harmful * 350);

    container.innerHTML = `
      <div class="app-container" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="leaf" class="lucide-icon-sm"></i>
              <span>Verified Environmental Footprint</span>
            </div>
            <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Citizen Ecological Ledger</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Quantifiable lifecycle audit of diverted municipal waste, avoided landfill emissions, and resource recovery.</p>
          </div>

          <button class="btn btn-primary" onclick="window.ImpactDashboardView.generateImpactBadge()">
            <i data-lucide="award" class="lucide-icon-sm"></i>
            <span>View Impact Certificate</span>
          </button>
        </div>

        <!-- 4 Top Ecological Impact Counters -->
        <div class="grid-cols-4" style="margin-bottom: 2.5rem; gap: 1.25rem;">
          
          <!-- Diverted (Forest) -->
          <div class="neu-card neu-card-forest" style="padding: 1.75rem; border-radius: var(--radius-xl); color: #FFFFFF;">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #DCFCE7;">Total Waste Diverted</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #047857; border: 1px solid #10B981; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="scale" class="lucide-icon-sm" style="color: #FFFFFF;"></i>
              </div>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; line-height: 1; margin-bottom: 0.35rem;">
              ${user.lifetimeWasteKg} <span style="font-size: 1.1rem; font-weight: 600; opacity: 0.9;">KG</span>
            </div>
            <p style="font-size: 0.78rem; color: #DCFCE7; margin: 0;">Prevented from open municipal dumps</p>
          </div>

          <!-- CO2 Emissions Avoided -->
          <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">CO₂ Emissions Avoided</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="cloud-sun" class="lucide-icon-sm"></i>
              </div>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: var(--color-navy); line-height: 1; margin-bottom: 0.35rem;">
              ${user.co2SavedKg} <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-muted);">KG</span>
            </div>
            <p style="font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 700; margin: 0;">≈ 420 KM of car travel offset</p>
          </div>

          <!-- Trees Equivalent -->
          <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">Trees Equivalent</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="trees" class="lucide-icon-sm"></i>
              </div>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: var(--color-navy); line-height: 1; margin-bottom: 0.35rem;">
              ${user.treesEquivalent} <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-muted);">Trees</span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Annual carbon absorption basis</p>
          </div>

          <!-- Water Conserved -->
          <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">Water Conserved</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #DBEAFE; color: #1E40AF; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="droplets" class="lucide-icon-sm"></i>
              </div>
            </div>
            <div style="font-size: 2.6rem; font-weight: 900; color: #2563EB; line-height: 1; margin-bottom: 0.35rem;">
              ${user.waterSavedLitres} <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-muted);">L</span>
            </div>
            <p style="font-size: 0.78rem; color: #2563EB; font-weight: 700; margin: 0;">Via recycled paper & polymers</p>
          </div>

        </div>

        <!-- Waste Composition Breakdown -->
        <div class="neu-card neu-card-raised" style="padding: 2rem; border-radius: var(--radius-xl); margin-bottom: 2.5rem;">
          <h3 style="color: var(--color-navy); margin-bottom: 1.25rem; font-size: 1.25rem; font-weight: 800;">Segregated Material Lifecycle Breakdown</h3>

          <div class="grid-cols-3" style="gap: 1.25rem;">
            <!-- Wet -->
            <div class="neu-card-flat" style="padding: 1.5rem; border-radius: var(--radius-lg); border-top: 4px solid var(--waste-wet);">
              <div class="flex-between" style="margin-bottom: 0.75rem;">
                <strong style="color: var(--waste-wet); font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="apple" class="lucide-icon-sm"></i>
                  <span>Organic Wet Waste</span>
                </strong>
                <span class="badge" style="background: var(--waste-wet); color: #FFFFFF; font-weight: 700;">${cat.wet} KG (${wetPct}%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
                Converted into ${compostKg} KG of municipal organic compost fertilizer for city public gardens.
              </p>
              <div style="font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 700;">
                Methane Gas Prevented: ~${methaneAvoidedKg} kg
              </div>
            </div>

            <!-- Dry -->
            <div class="neu-card-flat" style="padding: 1.5rem; border-radius: var(--radius-lg); border-top: 4px solid var(--waste-dry);">
              <div class="flex-between" style="margin-bottom: 0.75rem;">
                <strong style="color: var(--waste-dry); font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="package" class="lucide-icon-sm"></i>
                  <span>Clean Recyclables</span>
                </strong>
                <span class="badge" style="background: var(--waste-dry); color: #FFFFFF; font-weight: 700;">${cat.dry} KG (${dryPct}%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
                Reprocessed into industrial pellets, corrugated boxes, and recycled polyester fiber.
              </p>
              <div style="font-size: 0.78rem; color: #1E40AF; font-weight: 700;">
                Landfill Space Saved: ${landfillSpaceSavedM3} m³
              </div>
            </div>

            <!-- Harmful -->
            <div class="neu-card-flat" style="padding: 1.5rem; border-radius: var(--radius-lg); border-top: 4px solid var(--waste-harmful);">
              <div class="flex-between" style="margin-bottom: 0.75rem;">
                <strong style="color: var(--waste-harmful); font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="shield-alert" class="lucide-icon-sm"></i>
                  <span>Hazardous & E-Waste</span>
                </strong>
                <span class="badge" style="background: var(--waste-harmful); color: #FFFFFF; font-weight: 700;">${cat.harmful} KG (${harmfulPct}%)</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
                Safely recovered in authorized CPCB smelters, preventing heavy metal groundwater contamination.
              </p>
              <div style="font-size: 0.78rem; color: #991B1B; font-weight: 700;">
                Groundwater Protected: ~${Formatters.formatNumber(groundwaterProtectedL)} L
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Impact Certificate Modal -->
      <div class="modal-overlay" id="impact-cert-modal">
        <div class="modal-content neu-card neu-card-raised" style="max-width: 580px; text-align: center; padding: 2.5rem; border: 3px double #16A34A; border-radius: var(--radius-xl);">
          <div class="modal-close-btn" onclick="document.getElementById('impact-cert-modal').classList.remove('active')">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);">
            <i data-lucide="award" class="lucide-icon-lg"></i>
          </div>
          <div style="font-size: 0.75rem; font-weight: 800; color: var(--color-primary-dark); letter-spacing: 0.15em; text-transform: uppercase;">
            MUNICIPAL CORPORATION OF GREATER MUMBAI & CLEANCRED
          </div>
          <h2 style="color: var(--color-navy); font-size: 1.6rem; margin: 0.5rem 0 0.75rem 0;">Citizen Impact Certificate</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5;">
            This certifies that <strong>${user.name}</strong> has responsibly diverted <strong>${user.lifetimeWasteKg} KG of segregated waste</strong> and avoided <strong>${user.co2SavedKg} KG of CO₂ emissions</strong> under Ward 4B municipal sustainability monitoring.
          </p>

          <div class="neu-card-inset" style="padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <strong style="color: var(--color-primary-dark); font-size: 1rem;">
              Rank #${user.rank} Ward 4B Citizen &bull; ${user.greenStreakDays}-Day Segregation Streak
            </strong>
          </div>

          <button class="btn btn-primary btn-block" onclick="window.print()">
            <i data-lucide="printer" class="lucide-icon-sm"></i>
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  generateImpactBadge() {
    SoundFX.playClick();
    Confetti.trigger(90);
    document.getElementById('impact-cert-modal').classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }
};

window.ImpactDashboardView = ImpactDashboardView;
