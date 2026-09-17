/* ==========================================================================
   CLEANCRED — BULK GENERATORS & INSTITUTIONAL PORTAL
   Tactile Neumorphism + Civic Technology
   Schools, Colleges, Hospitals, Corporate Offices, Residential Societies
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

export const InstitutionPortalView = {
  selectedType: 'schools',

  render() {
    const container = document.getElementById('view-institutions');
    if (!container) return;

    container.innerHTML = `
      <div class="app-container institution-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="building-2" class="lucide-icon-sm"></i>
              <span>Institutional Bulk Generator Framework</span>
            </div>
            <h2 class="institution-title" style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">
              <span class="title-full">Institutional Waste Management</span>
              <span class="title-short">Institution Portal</span>
            </h2>
            <p class="institution-subtitle" style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">
              <span class="desc-full">Bulk collection logistics, student eco-incentives, biomedical compliance, and corporate ESG reporting.</span>
              <span class="desc-short">Bulk waste &amp; compliance</span>
            </p>
          </div>

          <button class="btn btn-primary institution-header-btn" onclick="window.InstitutionPortalView.downloadCertificate()">
            <i data-lucide="award" class="lucide-icon-sm"></i>
            <span class="btn-text-full">Download Accreditation Certificate</span>
            <span class="btn-text-short">Accreditation</span>
          </button>
        </div>

        <!-- 5 Category Filter Tabs -->
        <div class="institution-tab-grid">
          <button class="btn btn-sm ${this.selectedType === 'schools' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('schools')">
            <i data-lucide="book-open" class="lucide-icon-sm"></i>
            <span class="tab-label-full">Schools &amp; Eco Clubs</span>
            <span class="tab-label-short">Schools</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'colleges' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('colleges')">
            <i data-lucide="graduation-cap" class="lucide-icon-sm"></i>
            <span class="tab-label-full">Colleges &amp; Campuses</span>
            <span class="tab-label-short">Colleges</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'hospitals' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('hospitals')">
            <i data-lucide="hospital" class="lucide-icon-sm"></i>
            <span class="tab-label-full">Hospitals (Biomedical)</span>
            <span class="tab-label-short">Hospitals</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'offices' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('offices')">
            <i data-lucide="briefcase" class="lucide-icon-sm"></i>
            <span class="tab-label-full">Corporate ESG</span>
            <span class="tab-label-short">Corporate</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'societies' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('societies')">
            <i data-lucide="home" class="lucide-icon-sm"></i>
            <span class="tab-label-full">Housing Societies (RWAs)</span>
            <span class="tab-label-short">Societies</span>
          </button>
        </div>

        <!-- Active Selected Institution Showcase -->
        ${this.renderInstitutionContent()}

      </div>

      <!-- Printable Certificate Modal -->
      <div class="modal-overlay" id="certificate-modal">
        <div class="modal-content neu-card neu-card-raised institution-cert-card">
          <div class="modal-close-btn" onclick="document.getElementById('certificate-modal').classList.remove('active')">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);">
            <i data-lucide="award" class="lucide-icon-lg"></i>
          </div>
          <div style="font-size: 0.8rem; font-weight: 800; color: var(--color-primary-dark); letter-spacing: 0.15em; text-transform: uppercase;">
            MUNICIPAL CORPORATION OF GREATER MUMBAI & CLEANCRED
          </div>
          <h2 style="color: var(--color-navy); font-size: 1.6rem; margin: 0.5rem 0 0.75rem 0;">Certificate of Sustainability Excellence</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5;">
            This certifies that <strong>Delhi Public School Green Club</strong> has achieved a <strong>94/100 Municipal Sustainability Index</strong> by diverting <strong>1,840 KG of waste</strong> with zero landfill contamination.
          </p>

          <div class="institution-modal-metrics">
            <div>
              <div style="font-size: 1.25rem; font-weight: 900; color: var(--color-primary-dark);">1,840 KG</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Waste Diverted</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #2563EB;">1,240 KG</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">CO₂ Avoided</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #F59E0B;">94 / 100</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Eco Rating</div>
            </div>
          </div>

          <div class="flex-between" style="border-top: 1px dashed var(--color-border); padding-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
            <span>Authorized: Municipal Commissioner</span>
            <span>Accredited: SBM Urban 2.0</span>
          </div>

          <button class="btn btn-primary btn-block" style="margin-top: 1.5rem;" onclick="window.print()">
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

  renderInstitutionContent() {
    switch (this.selectedType) {
      case 'schools':
        return `
          <div class="neu-card neu-card-raised institution-showcase-card">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Rank #1 School Eco Club</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Delhi Public School — Green Brigade</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Student Body: 1,420 Active Recyclers &bull; Sustainability Score: 94/100</p>
              </div>
              <div class="badge badge-points" style="font-size: 1rem; padding: 0.5rem 1rem;">19,500 Total GC</div>
            </div>

            <div class="institution-feature-grid">
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Student Rewards</strong>
                <p class="institution-feature-desc">Students earn Green Credits for bringing segregated paper and e-waste from home.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Classroom Battles</strong>
                <p class="institution-feature-desc">Grade 9A leads inter-class recycling championship with 340 kg paper recovered.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Daily Bulk Van</strong>
                <p class="institution-feature-desc">Designated municipal electric van collects cafeteria & dry waste daily at 3 PM.</p>
              </div>
            </div>

            <button class="btn btn-primary institution-action-btn" onclick="window.AppRouter.showToast('School onboarding consultation scheduled.')">
              <i data-lucide="plus-circle" class="lucide-icon-sm"></i>
              <span>Register New School / Club</span>
            </button>
          </div>
        `;

      case 'colleges':
        return `
          <div class="neu-card neu-card-raised institution-showcase-card">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Higher Education Campus</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">IIT Bombay — Campus Eco Cell</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Hostel Waste Decentralization & Tech-Driven Composting &bull; Score: 98/100</p>
              </div>
              <div class="badge badge-points" style="font-size: 1rem; padding: 0.5rem 1rem;">38,400 Total GC</div>
            </div>

            <div class="institution-feature-grid">
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Hostel Waste Auditing</strong>
                <p class="institution-feature-desc">Real-time weight sensors in 16 campus hostel messes tracking organic diversion.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Student Innovation Grants</strong>
                <p class="institution-feature-desc">CleanCred grants funded 3 student research prototypes on plastic pyrolysis.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Fest Waste Zero-Target</strong>
                <p class="institution-feature-desc">100% waste recovery during campus cultural festivals.</p>
              </div>
            </div>

            <button class="btn btn-primary institution-action-btn" onclick="window.AppRouter.showToast('College onboarding inquiry dispatched.')">
              <i data-lucide="graduation-cap" class="lucide-icon-sm"></i>
              <span>Partner With Your College</span>
            </button>
          </div>
        `;

      case 'hospitals':
        return `
          <div class="neu-card neu-card-raised institution-showcase-card" style="border-top: 4px solid #DC2626;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge" style="background: #FEE2E2; color: #991B1B; margin-bottom: 0.35rem;">Biomedical Compliance</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Max Super Speciality Hospital Network</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Color-Coded Bio-Hazard Barcode Tracking & CPCB Compliance</p>
              </div>
              <div class="badge badge-green">100% CPCB Compliant ✓</div>
            </div>

            <div class="institution-feature-grid">
              <div class="neu-card-flat institution-feature-item" style="border-left: 3px solid #DC2626;">
                <strong style="color: #991B1B; font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Red / Yellow Bag Segregation</strong>
                <p class="institution-feature-desc">
                  <span class="desc-full">Strict tracking of anatomical, soiled, and chemical medical waste with unique QR tags.</span>
                  <span class="desc-short">QR-tagged biomedical waste tracking.</span>
                </p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Authorized Incineration</strong>
                <p class="institution-feature-desc">
                  <span class="desc-full">Dedicated GPS-monitored fleet routes directly to CPCB-authorized high-temperature incinerator units.</span>
                  <span class="desc-short">GPS-monitored hazardous disposal.</span>
                </p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Pollution Control Audit</strong>
                <p class="institution-feature-desc">One-click automated regulatory compliance reports for SPCB.</p>
              </div>
            </div>

            <button class="btn btn-primary institution-action-btn" onclick="window.AppRouter.showToast('Hospital Biomedical protocol requested.')">
              <i data-lucide="hospital" class="lucide-icon-sm"></i>
              <span>Request Hospital Compliance Setup</span>
            </button>
          </div>
        `;

      case 'offices':
        return `
          <div class="neu-card neu-card-raised institution-showcase-card">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-navy" style="margin-bottom: 0.35rem;">Corporate ESG Platform</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Infosys Technology Park — ESG Hub</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Corporate Scope 3 Waste Analytics & Employee Green Leaderboards</p>
              </div>
              <div class="badge badge-green">ESG Gold Certified ✓</div>
            </div>

            <div class="institution-feature-grid">
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Smart Recycling Hubs</strong>
                <p class="institution-feature-desc">Contactless dry paper & beverage can stations on all floors.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Corporate BRSR Reports</strong>
                <p class="institution-feature-desc">
                  <span class="desc-full">Automated Scope 3 emissions data, diverted tonnages, and BRSR core format exports for SEBI filings.</span>
                  <span class="desc-short">SEBI-aligned sustainability reporting.</span>
                </p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Employee Green Perks</strong>
                <p class="institution-feature-desc">Top eco-performing teams receive company-matched gift cards and perks.</p>
              </div>
            </div>

            <button class="btn btn-primary institution-action-btn" onclick="window.AppRouter.showToast('Corporate ESG onboarding initiated.')">
              <i data-lucide="briefcase" class="lucide-icon-sm"></i>
              <span>Setup Corporate Waste Solution</span>
            </button>
          </div>
        `;

      case 'societies':
        return `
          <div class="neu-card neu-card-raised institution-showcase-card">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Residential RWA Network</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Greenwood Heights Residential Society</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">240 Families &bull; 100% Door-to-Door Wet Waste Composting</p>
              </div>
              <div class="badge badge-points">₹12,400 Society Corpus Saved</div>
            </div>

            <div class="institution-feature-grid">
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Wing Leaderboard</strong>
                <p class="institution-feature-desc">Wing A vs Wing B monthly segregation accuracy contest.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Municipal Tax Rebate</strong>
                <p class="institution-feature-desc">5% municipal property tax rebate from BMC.</p>
              </div>
              <div class="neu-card-flat institution-feature-item">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Community Compost</strong>
                <p class="institution-feature-desc">Onsite compost powers rooftop organic gardens.</p>
              </div>
            </div>

            <button class="btn btn-primary institution-action-btn" onclick="window.AppRouter.showToast('Society RWA consultation registered.')">
              <i data-lucide="home" class="lucide-icon-sm"></i>
              <span>Register Your Housing Society</span>
            </button>
          </div>
        `;
    }
  },

  selectType(type) {
    SoundFX.playClick();
    this.selectedType = type;
    this.render();
  },

  downloadCertificate() {
    SoundFX.playClick();
    Confetti.trigger(100);
    document.getElementById('certificate-modal').classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }
};

window.InstitutionPortalView = InstitutionPortalView;
