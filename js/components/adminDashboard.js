/* ==========================================================================
   CLEANCRED — DESKTOP ADMIN & MUNICIPAL COMMAND CENTER
   Smart India Hackathon 2026 // Team GreenLegacy
   Real-Time Citywide Waste Diversion & Green Credit Telemetry
   Tactile Neumorphism + Civic Technology
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { SoundFX } from '../utils/audio.js';

export const AdminDashboardView = {
  charts: {},
  activeTab: 'overview',

  render() {
    const container = document.getElementById('view-admin');
    if (!container) return;

    const stats = State.state.cityStats;
    const pickups = State.state.pickups;
    const totalPointsMinted = (stats.greenPointsIssued / 1000000).toFixed(2); // e.g. 4.85M
    const totalTons = Math.round(stats.totalWasteTons);

    container.innerHTML = `
      <div class="app-container animate-fade-in" style="max-width: 1280px; margin: 0 auto; padding-bottom: 5rem;">
        
        <!-- DESKTOP DUAL-COLUMN LAYOUT -->
        <div class="desktop-dashboard-grid">
          
          <!-- LEFT SIDEBAR: MUNICIPAL COMMAND NAVIGATION -->
          <aside class="admin-sidebar neu-card neu-card-raised">
            
            <!-- City Admin Profile Card -->
            <div style="display: flex; align-items: center; gap: 0.85rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1rem;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-navy); color: #FFFFFF; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="building-2" class="lucide-icon-md"></i>
              </div>
              <div>
                <div class="eyebrow" style="margin: 0; font-size: 0.68rem;">Operations Control</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--color-navy);">Mumbai Central</div>
                <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 0.15rem;">
                  <span class="status-dot green animate-pulse"></span>
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-primary-dark);">42 Wards Active</span>
                </div>
              </div>
            </div>

            <!-- Sidebar Navigation Links -->
            <ul class="admin-sidebar-nav">
              <li>
                <button class="sidebar-nav-link ${this.activeTab === 'overview' ? 'active' : ''}" onclick="window.AdminDashboardView.switchTab('overview')">
                  <i data-lucide="bar-chart-3" class="lucide-icon-sm"></i>
                  <span>Command Overview</span>
                </button>
              </li>
              <li>
                <button class="sidebar-nav-link ${this.activeTab === 'feed' ? 'active' : ''}" onclick="window.AdminDashboardView.switchTab('feed')">
                  <i data-lucide="activity" class="lucide-icon-sm"></i>
                  <span>Live Collection Feed</span>
                </button>
              </li>
              <li>
                <button class="sidebar-nav-link" onclick="window.AppRouter.navigate('worker')">
                  <i data-lucide="truck" class="lucide-icon-sm"></i>
                  <span>Worker Route Portal</span>
                </button>
              </li>
              <li>
                <button class="sidebar-nav-link" onclick="window.AppRouter.navigate('rewards')">
                  <i data-lucide="gift" class="lucide-icon-sm"></i>
                  <span>Green Credit Ledger</span>
                </button>
              </li>
              <li>
                <button class="sidebar-nav-link" onclick="window.AppRouter.navigate('illegal-dumping')">
                  <i data-lucide="shield-alert" class="lucide-icon-sm"></i>
                  <span>Illegal Dump Reports</span>
                </button>
              </li>
              <li>
                <button class="sidebar-nav-link" onclick="window.AppRouter.navigate('institutions')">
                  <i data-lucide="school" class="lucide-icon-sm"></i>
                  <span>Bulk Generators (Institutions)</span>
                </button>
              </li>
            </ul>

            <!-- Quick Action & Standards Badge -->
            <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--color-border);">
              <button class="btn btn-secondary btn-sm btn-full" onclick="window.AdminDashboardView.triggerQuickExport()" style="margin-bottom: 0.75rem;">
                <i data-lucide="download" class="lucide-icon-sm"></i>
                <span>Export SBM Report (PDF)</span>
              </button>
              <div style="text-align: center; font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">
                CleanCred v3.0 &bull; MoHUA / SBM 2.0
              </div>
            </div>
          </aside>

          <!-- RIGHT SIDE: METRICS, CHARTS & LIVE INGESTION -->
          <main style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Welcome Municipal Banner -->
            <div class="neu-card neu-card-raised" style="padding: 1.5rem 1.75rem; border-radius: var(--radius-xl);">
              <div class="flex-between" style="flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="badge badge-green">MUNICIPAL COMMAND ACTIVE</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Telemetry Sync: Live (1s)</span>
                  </div>
                  <h2 style="color: var(--color-navy); font-size: 1.5rem; font-weight: 800; margin: 0;">
                    Municipal Waste Recovery &amp; Green Credit Telemetry
                  </h2>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                    Real-time citizen segregation compliance, decentralized collection verification, and EPR credit issuance.
                  </p>
                </div>

                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <button class="btn btn-secondary btn-sm" onclick="window.AdminDashboardView.render()">
                    <i data-lucide="refresh-cw" class="lucide-icon-sm"></i>
                    <span>Refresh Feed</span>
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="window.AppRouter.switchExperience('citizen')">
                    <i data-lucide="user" class="lucide-icon-sm"></i>
                    <span>View Citizen App</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- ROW 1: 4 TOP METRIC TILES -->
            <div class="admin-metrics-row">
              
              <!-- Card 1: Total Credits Issued -->
              <div class="admin-metric-card neu-card neu-card-raised">
                <div class="flex-between" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
                  <span>TOTAL GREEN CREDITS</span>
                  <i data-lucide="coins" class="lucide-icon-sm" style="color: var(--color-primary-dark);"></i>
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 900; color: var(--color-navy);">
                  ${totalPointsMinted}M <small style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary);">GC</small>
                </div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary-dark); margin-top: 0.25rem;">
                  ↑ 24.8% issued this month
                </div>
              </div>

              <!-- Card 2: Segregation Recovery Rate -->
              <div class="admin-metric-card neu-card neu-card-raised">
                <div class="flex-between" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
                  <span>RECOVERY RATE</span>
                  <i data-lucide="activity" class="lucide-icon-sm" style="color: var(--color-primary);"></i>
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 900; color: var(--color-primary);">
                  84.4%
                </div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary-dark); margin-top: 0.25rem;">
                  Target 80% Exceeded!
                </div>
              </div>

              <!-- Card 3: Verified Pickups -->
              <div class="admin-metric-card neu-card neu-card-raised">
                <div class="flex-between" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
                  <span>VERIFIED COLLECTIONS</span>
                  <i data-lucide="check-circle-2" class="lucide-icon-sm" style="color: var(--waste-dry);"></i>
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 900; color: var(--color-navy);">
                  ${Formatters.formatNumber(stats.verifiedPickups)}
                </div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--waste-dry); margin-top: 0.25rem;">
                  99.2% Source Segregation Pure
                </div>
              </div>

              <!-- Card 4: Landfill Waste Diverted -->
              <div class="admin-metric-card neu-card neu-card-raised">
                <div class="flex-between" style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
                  <span>LANDFILL DIVERSION</span>
                  <i data-lucide="truck" class="lucide-icon-sm" style="color: var(--color-amber);"></i>
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 900; color: var(--color-navy);">
                  ${Formatters.formatNumber(totalTons)} <small style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted);">Tons</small>
                </div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-amber); margin-top: 0.25rem;">
                  42 Wards Reporting Daily
                </div>
              </div>

            </div>

            <!-- ROW 2: DUAL CHARTS (WEEKLY DIVERSION + SEGREGATION TAXONOMY) -->
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.25rem;" class="hero-grid">
              
              <!-- Chart 1: Weekly Trends Line Chart -->
              <div class="neu-card neu-card-raised" style="padding: 1.5rem; border-radius: var(--radius-xl);">
                <div class="flex-between" style="margin-bottom: 1rem;">
                  <div>
                    <h3 style="font-size: 1.05rem; color: var(--color-navy); font-weight: 800; margin: 0;">Weekly Waste Diversion &amp; Credits</h3>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">Decentralized municipal ingestion across 42 wards</p>
                  </div>
                  <span class="badge badge-green">Past 7 Days</span>
                </div>

                <div style="height: 240px; position: relative;">
                  <canvas id="chart-admin-weekly"></canvas>
                </div>
              </div>

              <!-- Chart 2: SIH Waste Taxonomy Doughnut Chart -->
              <div class="neu-card neu-card-raised" style="padding: 1.5rem; border-radius: var(--radius-xl);">
                <div class="flex-between" style="margin-bottom: 1rem;">
                  <div>
                    <h3 style="font-size: 1.05rem; color: var(--color-navy); font-weight: 800; margin: 0;">Segregation Taxonomy</h3>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">Wet vs Dry vs Harmful</p>
                  </div>
                  <span class="badge badge-blue">SIH Standard</span>
                </div>

                <div style="height: 240px; position: relative;">
                  <canvas id="chart-admin-taxonomy"></canvas>
                </div>
              </div>

            </div>

            <!-- ROW 3: LIVE MUNICIPAL INGESTION FEED (REAL PICKUPS) -->
            <div class="neu-card neu-card-raised" style="padding: 1.5rem; border-radius: var(--radius-xl);">
              <div class="flex-between" style="margin-bottom: 1.25rem;">
                <div>
                  <h3 style="font-size: 1.1rem; color: var(--color-navy); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
                    <i data-lucide="activity" class="lucide-icon-sm" style="color: var(--color-primary-dark);"></i>
                    <span>Live Municipal Collection Ingestion Feed</span>
                  </h3>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">
                    Incoming verified pickups from citizen households and field worker inspection scales.
                  </p>
                </div>
                <span class="badge badge-green">Real-time Stream ✓</span>
              </div>

              <!-- Ingestion Table -->
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
                  <thead>
                    <tr style="border-bottom: 1.5px solid var(--color-border); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">
                      <th style="padding: 0.75rem 0.5rem;">Request ID</th>
                      <th style="padding: 0.75rem 0.5rem;">Category</th>
                      <th style="padding: 0.75rem 0.5rem;">Material Sub-Type</th>
                      <th style="padding: 0.75rem 0.5rem;">Citizen / Ward</th>
                      <th style="padding: 0.75rem 0.5rem;">Weight</th>
                      <th style="padding: 0.75rem 0.5rem;">Reward</th>
                      <th style="padding: 0.75rem 0.5rem;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pickups.map(p => `
                      <tr style="border-bottom: 1px solid var(--color-border); transition: background 0.15s ease;">
                        <td style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-navy);">
                          ${p.id}
                        </td>
                        <td style="padding: 0.75rem 0.5rem;">
                          <span class="badge ${p.category === 'wet' ? 'badge-green' : p.category === 'dry' ? 'badge-blue' : 'badge-red'}">
                            ${p.categoryName || p.category.toUpperCase()}
                          </span>
                        </td>
                        <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--color-navy);">
                          ${p.subType || 'General segregated waste'}
                        </td>
                        <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">
                          ${p.address.split(',')[0]} (Ward 4B)
                        </td>
                        <td style="padding: 0.75rem 0.5rem; font-weight: 700; color: var(--color-navy);">
                          ${p.quantityKg} KG
                        </td>
                        <td style="padding: 0.75rem 0.5rem; font-weight: 800; color: var(--color-primary-dark);">
                          +${p.pointsReward} GC
                        </td>
                        <td style="padding: 0.75rem 0.5rem;">
                          ${p.status === 'verified' ? `
                            <span class="badge badge-green">Verified</span>
                          ` : p.status === 'on_the_way' ? `
                            <span class="badge badge-amber">En Route</span>
                          ` : `
                            <span class="badge badge-navy">Created</span>
                          `}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

          </main>

        </div>

      </div>
    `;

    setTimeout(() => {
      this.initCharts();
      if (window.lucide) window.lucide.createIcons();
    }, 50);
  },

  switchTab(tab) {
    SoundFX.playClick();
    this.activeTab = tab;
    this.render();
  },

  triggerQuickExport() {
    SoundFX.playClick();
    window.AppRouter.showToast('Generating Swachh Bharat Mission (Urban) compliance report...');
    setTimeout(() => {
      window.print();
    }, 600);
  },

  initCharts() {
    if (!window.Chart) return;

    // Destroy existing chart instances
    if (this.charts.weekly) this.charts.weekly.destroy();
    if (this.charts.taxonomy) this.charts.taxonomy.destroy();

    // Chart 1: Weekly Trends
    const ctxWeekly = document.getElementById('chart-admin-weekly');
    if (ctxWeekly) {
      this.charts.weekly = new window.Chart(ctxWeekly, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Waste Diverted (Tons)',
              data: [38, 42, 45, 51, 48, 59, 64],
              borderColor: '#16A34A',
              backgroundColor: 'rgba(22, 163, 74, 0.08)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5
            },
            {
              label: 'Green Credits Minted (x1000)',
              data: [28, 31, 35, 39, 37, 46, 52],
              borderColor: '#2563EB',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.35,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(184, 196, 212, 0.25)' },
              ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } }
            }
          }
        }
      });
    }

    // Chart 2: SIH Waste Taxonomy Doughnut
    const ctxTaxonomy = document.getElementById('chart-admin-taxonomy');
    if (ctxTaxonomy) {
      this.charts.taxonomy = new window.Chart(ctxTaxonomy, {
        type: 'doughnut',
        data: {
          labels: ['Wet Waste (Organic)', 'Dry Waste (Recyclable)', 'Harmful (Hazardous)'],
          datasets: [
            {
              data: [52, 36, 12],
              backgroundColor: ['#16A34A', '#2563EB', '#DC2626'],
              borderWidth: 3,
              borderColor: '#FFFFFF'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, font: { family: 'Plus Jakarta Sans', size: 10.5, weight: '600' } }
            }
          }
        }
      });
    }
  }
};

window.AdminDashboardView = AdminDashboardView;
