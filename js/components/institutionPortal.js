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
      <div class="app-container" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="building-2" class="lucide-icon-sm"></i>
              <span>Institutional Bulk Generator Framework</span>
            </div>
            <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Institutional Waste Management</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Bulk collection logistics, student eco-incentives, biomedical compliance, and corporate ESG reporting.</p>
          </div>

          <button class="btn btn-primary" onclick="window.InstitutionPortalView.downloadCertificate()">
            <i data-lucide="award" class="lucide-icon-sm"></i>
            <span>Download Accreditation Certificate</span>
          </button>
        </div>

        <!-- 5 Category Filter Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem;">
          <button class="btn btn-sm ${this.selectedType === 'schools' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('schools')">
            <i data-lucide="book-open" class="lucide-icon-sm"></i>
            <span>Schools & Eco Clubs</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'colleges' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('colleges')">
            <i data-lucide="graduation-cap" class="lucide-icon-sm"></i>
            <span>Colleges & Campuses</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'hospitals' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('hospitals')">
            <i data-lucide="hospital" class="lucide-icon-sm"></i>
            <span>Hospitals (Biomedical)</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'offices' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('offices')">
            <i data-lucide="briefcase" class="lucide-icon-sm"></i>
            <span>Corporate ESG</span>
          </button>
          <button class="btn btn-sm ${this.selectedType === 'societies' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('societies')">
            <i data-lucide="home" class="lucide-icon-sm"></i>
            <span>Housing Societies (RWAs)</span>
          </button>
        </div>

        <!-- Active Selected Institution Showcase -->
        ${this.renderInstitutionContent()}

      </div>

      <!-- Printable Certificate Modal -->
      <div class="modal-overlay" id="certificate-modal">
        <div class="modal-content neu-card neu-card-raised" style="max-width: 640px; text-align: center; border: 3px double #16A34A; padding: 2.5rem; border-radius: var(--radius-xl);">
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

          <div style="display: flex; justify-content: space-around; background: var(--bg-surface-subtle); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--color-border);">
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
          <div class="neu-card neu-card-raised" style="padding: 2.25rem; margin-bottom: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Rank #1 School Eco Club</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Delhi Public School — Green Brigade</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Student Body: 1,420 Active Recyclers &bull; Sustainability Score: 94/100</p>
              </div>
              <div class="badge badge-points" style="font-size: 1rem; padding: 0.5rem 1rem;">19,500 Total GC</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem; gap: 1.25rem;">
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Student Rewards</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Students earn Green Credits for bringing segregated paper and e-waste from home.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Classroom Battles</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Grade 9A leads inter-class recycling championship with 340 kg paper recovered.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Daily Bulk Van</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Designated municipal electric van collects segregated cafeteria & dry waste daily at 3 PM.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.AppRouter.showToast('School onboarding consultation scheduled.')">
              <i data-lucide="plus-circle" class="lucide-icon-sm"></i>
              <span>Register New School / Club</span>
            </button>
          </div>
        `;

      case 'colleges':
        return `
          <div class="neu-card neu-card-raised" style="padding: 2.25rem; margin-bottom: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Higher Education Campus</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">IIT Bombay — Campus Eco Cell</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Hostel Waste Decentralization & Tech-Driven Composting &bull; Score: 98/100</p>
              </div>
              <div class="badge badge-points" style="font-size: 1rem; padding: 0.5rem 1rem;">38,400 Total GC</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem; gap: 1.25rem;">
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Hostel Waste Auditing</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Real-time weight sensors in 16 campus hostel messes tracking organic diversion.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Student Innovation Grants</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">CleanCred grants funded 3 student research prototypes on plastic pyrolysis.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Fest Waste Zero-Target</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">100% waste recovery during cultural festivals (Mood Indigo & Techfest).</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.AppRouter.showToast('College onboarding inquiry dispatched.')">
              <i data-lucide="graduation-cap" class="lucide-icon-sm"></i>
              <span>Partner With Your College</span>
            </button>
          </div>
        `;

      case 'hospitals':
        return `
          <div class="neu-card neu-card-raised" style="padding: 2.25rem; margin-bottom: 2rem; border-radius: var(--radius-xl); border-top: 4px solid #DC2626;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge" style="background: #FEE2E2; color: #991B1B; margin-bottom: 0.35rem;">Biomedical Compliance</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Max Super Speciality Hospital Network</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Color-Coded Bio-Hazard Barcode Tracking & CPCB Compliance</p>
              </div>
              <div class="badge badge-green">100% CPCB Compliant ✓</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem; gap: 1.25rem;">
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid #DC2626;">
                <strong style="color: #991B1B; font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Red / Yellow Bag Segregation</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Strict tracking of anatomical, soiled, and chemical medical waste with unique QR tags.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Authorized Incineration</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Dedicated GPS-monitored hazardous disposal vehicles with digital manifest sign-off.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Pollution Control Audit</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Instant one-click automated regulatory compliance report for State Pollution Control Board.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.AppRouter.showToast('Hospital Biomedical protocol requested.')">
              <i data-lucide="hospital" class="lucide-icon-sm"></i>
              <span>Request Hospital Compliance Setup</span>
            </button>
          </div>
        `;

      case 'offices':
        return `
          <div class="neu-card neu-card-raised" style="padding: 2.25rem; margin-bottom: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-navy" style="margin-bottom: 0.35rem;">Corporate ESG Platform</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Infosys Technology Park — ESG Hub</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Corporate Scope 3 Waste Analytics & Employee Green Leaderboards</p>
              </div>
              <div class="badge badge-green">ESG Gold Certified ✓</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem; gap: 1.25rem;">
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Smart Recycling Hubs</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Smart contactless dry paper & beverage can recycling stations on all 8 corporate floors.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Corporate BRSR Reports</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Direct SEBI-aligned Business Responsibility and Sustainability data export.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Employee Green Perks</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Top eco-performing teams receive company-matched gift cards and public accolades.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.AppRouter.showToast('Corporate ESG onboarding initiated.')">
              <i data-lucide="briefcase" class="lucide-icon-sm"></i>
              <span>Setup Corporate Waste Solution</span>
            </button>
          </div>
        `;

      case 'societies':
        return `
          <div class="neu-card neu-card-raised" style="padding: 2.25rem; margin-bottom: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Residential RWA Network</span>
                <h3 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800;">Greenwood Heights Residential Society</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">240 Families &bull; 100% Door-to-Door Wet Waste Composting</p>
              </div>
              <div class="badge badge-points">₹12,400 Society Corpus Saved</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem; gap: 1.25rem;">
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Wing Leaderboard</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Wing A vs Wing B monthly segregation accuracy and organic compost yield competition.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Municipal Tax Rebate</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">100% segregating societies receive a 5% municipal property tax rebate from BMC.</p>
              </div>
              <div class="neu-card-flat" style="padding: 1.25rem; border-radius: var(--radius-md);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Community Compost</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Onsite compost powers community organic vegetable and rooftop garden.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.AppRouter.showToast('Society RWA consultation registered.')">
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
