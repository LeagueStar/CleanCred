/* ==========================================================================
   GREEN LEGACY — GOVERNMENT & MUNICIPAL ADMIN COMMAND CENTER
   Connected to Municipal Waste Database & Smart City GIS Grid
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { MapHelper } from '../utils/mapHelper.js';
import { SoundFX } from '../utils/audio.js';

export const AdminDashboardView = {
  charts: {},
  mapInstance: null,

  render() {
    const container = document.getElementById('view-admin');
    if (!container) return;

    const stats = State.state.cityStats;

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-navy" style="margin-bottom: 0.35rem;">
              Municipal operations &bull; City command
            </div>
            <h2>City waste operations</h2>
            <p>Real-time municipal telemetry, ward-wise segregation indices, and recycling efficiency.</p>
          </div>

          <!-- Connected DB Status Pill -->
          <div style="background: #ECFDF5; border: 1.5px solid #10B981; padding: 0.6rem 1.2rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.6rem;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981; animation: pulseGlow 1.5s infinite;"></span>
            <strong style="color: #065F46; font-size: 0.85rem; letter-spacing: 0.04em;">MUNICIPAL DATABASE CONNECTED ✓</strong>
          </div>
        </div>

        <!-- 5 Top Key Performance Statistics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Waste Collected</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--color-navy); margin: 0.25rem 0;">
              ${Formatters.formatNumber(stats.totalWasteTons)} <span style="font-size: 0.9rem; color: var(--text-muted);">Tons</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--color-primary); font-weight: 700;">↑ 14% vs last quarter</div>
          </div>

          <div class="glass-card" style="padding: 1.5rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Recycled / Recovered</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--color-primary-dark); margin: 0.25rem 0;">
              ${stats.recycledPercentage}%
            </div>
            <div style="font-size: 0.78rem; color: var(--color-primary); font-weight: 700;">Zero-landfill target: 80%</div>
          </div>

          <div class="glass-card" style="padding: 1.5rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Active Citizens</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--color-navy); margin: 0.25rem 0;">
              ${Formatters.formatNumber(stats.activeCitizens)}
            </div>
            <div style="font-size: 0.78rem; color: #2563EB; font-weight: 700;">Across 42 City Wards</div>
          </div>

          <div class="glass-card" style="padding: 1.5rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Verified Pickups</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--color-navy); margin: 0.25rem 0;">
              ${Formatters.formatNumber(stats.verifiedPickups)}
            </div>
            <div style="font-size: 0.78rem; color: #16A34A; font-weight: 700;">99.4% Purity Verified</div>
          </div>

          <div class="glass-card" style="padding: 1.5rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Waste Diversion Rate</div>
            <div style="font-size: 2rem; font-weight: 800; color: #EA580C; margin: 0.25rem 0;">
              ${stats.wasteDiversionRate}%
            </div>
            <div style="font-size: 0.78rem; color: #EA580C; font-weight: 700;">Saved from Dump Yards</div>
          </div>

        </div>

        <!-- Dedicated Section: "Connected to Your City" Municipal Systems -->
        <div class="glass-card" style="padding: 1.75rem; margin-bottom: 2.5rem; background: linear-gradient(135deg, #102A43, #0A1929); color: #FFFFFF;">
          <div class="flex-between" style="margin-bottom: 1.25rem;">
            <div>
              <h3 style="color: #FFFFFF;">Municipal systems overview</h3>
              <p style="color: #CBD5E1; font-size: 0.85rem;">Integrated back-office endpoints for municipal databases, worker dispatch, and material recovery facilities.</p>
            </div>
            <span class="badge" style="background: rgba(132, 204, 22, 0.2); color: #84CC16; border: 1px solid #84CC16;">
              4 / 4 Nodes Active
            </span>
          </div>

          <div class="grid-cols-4">
            ${stats.connectedDatabases.map(db => `
              <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 1.15rem; border-radius: var(--radius-md);">
                <div class="flex-between" style="margin-bottom: 0.5rem;">
                  <strong style="color: #FFFFFF; font-size: 0.85rem;">${db.name}</strong>
                  <span class="badge" style="background: #16A34A; color: #FFFFFF; font-size: 0.65rem; padding: 2px 6px;">${db.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94A3B8; margin-top: 0.5rem;">
                  <span>Latency: <strong style="color: #84CC16;">${db.ping}</strong></span>
                  <span>Sync: <strong style="color: #FFFFFF;">${db.records}</strong></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2-Column Analytics Charts -->
        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; margin-bottom: 2.5rem;" class="hero-grid">
          
          <!-- Chart 1: Monthly Waste Collection Trends -->
          <div class="glass-card" style="padding: 1.75rem;">
            <div class="flex-between" style="margin-bottom: 1.25rem;">
              <h4 style="color: var(--color-navy);">Monthly Waste Influx (Tons)</h4>
              <span class="badge badge-green">Last 6 Months</span>
            </div>
            <div style="height: 280px; position: relative;">
              <canvas id="chart-monthly-trends"></canvas>
            </div>
          </div>

          <!-- Chart 2: Waste Breakdown (Wet vs Dry vs Harmful) -->
          <div class="glass-card" style="padding: 1.75rem;">
            <div class="flex-between" style="margin-bottom: 1.25rem;">
              <h4 style="color: var(--color-navy);">Segregation Ratio</h4>
              <span class="badge badge-navy">Citywide Total</span>
            </div>
            <div style="height: 280px; position: relative;">
              <canvas id="chart-waste-ratio"></canvas>
            </div>
          </div>

        </div>

        <!-- Chart 3: Ward-Wise Collection & Interactive City Hotspot Heatmap -->
        <div style="display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 2rem; margin-bottom: 2.5rem;" class="hero-grid">
          
          <!-- Ward Bar Chart -->
          <div class="glass-card" style="padding: 1.75rem;">
            <h4 style="color: var(--color-navy); margin-bottom: 1.25rem;">Ward-Wise Collection Efficiency</h4>
            <div style="height: 320px; position: relative;">
              <canvas id="chart-ward-efficiency"></canvas>
            </div>
          </div>

          <!-- Smart City Garbage Hotspot Heatmap -->
          <div class="glass-card" style="padding: 1.75rem; display: flex; flex-direction: column;">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <div>
                <h4 style="color: var(--color-navy);">Garbage Hotspots & Fleet Heatmap</h4>
                <p style="font-size: 0.8rem;">Live GPS telemetry of dumping complaints and collection vehicles.</p>
              </div>
              <button class="btn btn-sm btn-emerald-outline" onclick="window.AdminDashboardView.simulateHotspotRefresh()">
                Refresh Map
              </button>
            </div>

            <div id="admin-city-map" style="height: 320px; width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--color-border);"></div>
          </div>

        </div>

      </div>
    `;

    setTimeout(() => {
      this.initCharts();
      this.initCityMap();
    }, 150);
  },

  initCharts() {
    if (!window.Chart) return;

    // Destroy existing charts to prevent duplication on re-render
    Object.values(this.charts).forEach(c => c.destroy());
    this.charts = {};

    // 1. Monthly Trends Line Chart — kept as static historical figures.
    // The state model has no monthly time-series data to derive this from
    // (only running totals), so connecting it to live state would mean
    // inventing a monthly breakdown that isn't backed by real data.
    const ctxMonthly = document.getElementById('chart-monthly-trends');
    if (ctxMonthly) {
      this.charts.monthly = new window.Chart(ctxMonthly, {
        type: 'line',
        data: {
          labels: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
          datasets: [
            {
              label: 'Total Collected (Tons)',
              data: [3200, 3650, 4100, 4350, 4700, 4850],
              borderColor: '#0B5D3B',
              backgroundColor: 'rgba(11, 93, 59, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Recycled / Diverted (Tons)',
              data: [1950, 2300, 2750, 2980, 3200, 3300],
              borderColor: '#16A34A',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: false } }
        }
      });
    }

    // 2. Waste Breakdown Doughnut — derived from cityStats.wasteByCategoryTons,
    // which is seeded from the city's total waste and incremented whenever a
    // worker verifies a pickup (see State.verifyWasteSubmission), so demo
    // actions nudge this chart instead of it being a frozen mockup.
    const ctxRatio = document.getElementById('chart-waste-ratio');
    if (ctxRatio) {
      const catTons = State.state.cityStats.wasteByCategoryTons;
      const catTotal = catTons.wet + catTons.dry + catTons.harmful;
      const wetPct = catTotal > 0 ? Math.round((catTons.wet / catTotal) * 100) : 0;
      const dryPct = catTotal > 0 ? Math.round((catTons.dry / catTotal) * 100) : 0;
      const harmfulPct = catTotal > 0 ? Math.max(0, 100 - wetPct - dryPct) : 0;

      this.charts.ratio = new window.Chart(ctxRatio, {
        type: 'doughnut',
        data: {
          labels: [`🟢 Wet Waste (${wetPct}%)`, `🔵 Dry Waste (${dryPct}%)`, `🔴 Harmful Waste (${harmfulPct}%)`],
          datasets: [{
            data: [wetPct, dryPct, harmfulPct],
            backgroundColor: ['#16A34A', '#2563EB', '#EF4444'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 3. Ward Efficiency Bar Chart — kept as static figures. The state
    // model has no per-ward dataset (pickups aren't tagged by ward), so
    // this is left as illustrative rather than manufactured live data.
    const ctxWard = document.getElementById('chart-ward-efficiency');
    if (ctxWard) {
      this.charts.ward = new window.Chart(ctxWard, {
        type: 'bar',
        data: {
          labels: ['Ward 1A', 'Ward 2B', 'Ward 3C', 'Ward 4B (Bandra)', 'Ward 5A', 'Ward 6D'],
          datasets: [{
            label: 'Segregation Score (%)',
            data: [78, 85, 72, 94, 68, 81],
            backgroundColor: ['#16A34A', '#16A34A', '#16A34A', '#84CC16', '#16A34A', '#16A34A'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { min: 50, max: 100 } }
        }
      });
    }
  },

  initCityMap() {
    const mapElement = document.getElementById('admin-city-map');
    if (!mapElement || !window.L) return;

    this.mapInstance = MapHelper.initMap('admin-city-map', [19.0760, 72.8777], 13);
    if (!this.mapInstance) return;

    // Hotspot 1 (Red Warning)
    const hot1 = MapHelper.createCustomPin('⚠️', 'Hotspot Link Rd', '#EF4444');
    window.L.marker([19.0820, 72.8620], { icon: hot1 }).addTo(this.mapInstance);

    // Hotspot 2 (Amber Resolving)
    const hot2 = MapHelper.createCustomPin('🟡', 'Sector 9 Tank', '#F59E0B');
    window.L.marker([19.0680, 72.8890], { icon: hot2 }).addTo(this.mapInstance);

    // Fleet Vans
    const van1 = MapHelper.createCustomPin('🚚', 'Van #4091', '#2563EB');
    window.L.marker([19.0650, 72.8550], { icon: van1 }).addTo(this.mapInstance);

    const van2 = MapHelper.createCustomPin('🚚', 'Van #2210', '#2563EB');
    window.L.marker([19.0910, 72.8730], { icon: van2 }).addTo(this.mapInstance);
  },

  simulateHotspotRefresh() {
    SoundFX.playClick();
    State.addNotification({
      title: '🛰️ Municipal GIS Sync',
      message: 'Ward 4B telemetry refreshed. 12 garbage collection routes synchronized.',
      type: 'info'
    });
  }
};

window.AdminDashboardView = AdminDashboardView;
