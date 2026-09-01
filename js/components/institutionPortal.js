/* ==========================================================================
   GREEN LEGACY — INSTITUTION SERVICES & DASHBOARD
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
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem;">
              Institutional sustainability service
            </div>
            <h2>Institutional waste management</h2>
            <p>Custom bulk collection frameworks, student eco-incentives, biomedical compliance, and ESG reporting.</p>
          </div>

          <button class="btn btn-primary" onclick="window.InstitutionPortalView.downloadCertificate()">
            <span>📜</span> Download Green Certificate
          </button>
        </div>

        <!-- 5 Category Filter Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 2.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
          <button class="btn btn-sm ${this.selectedType === 'schools' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('schools')">
            Schools & Green Clubs
          </button>
          <button class="btn btn-sm ${this.selectedType === 'colleges' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('colleges')">
            🎓 Colleges & Campuses
          </button>
          <button class="btn btn-sm ${this.selectedType === 'hospitals' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('hospitals')">
            🏥 Hospitals (Medical Waste)
          </button>
          <button class="btn btn-sm ${this.selectedType === 'offices' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('offices')">
            🏢 Corporate Offices (ESG)
          </button>
          <button class="btn btn-sm ${this.selectedType === 'societies' ? 'btn-primary' : 'btn-secondary'}" onclick="window.InstitutionPortalView.selectType('societies')">
            Residential Societies (RWAs)
          </button>
        </div>

        <!-- Active Selected Institution Showcase -->
        ${this.renderInstitutionContent()}

      </div>

      <!-- Printable Certificate Modal -->
      <div class="modal-overlay" id="certificate-modal">
        <div class="modal-content" style="max-width: 640px; text-align: center; border: 4px double #16A34A; padding: 2.5rem;">
          <div class="modal-close-btn" onclick="document.getElementById('certificate-modal').classList.remove('active')">✕</div>
          
          <div class="certificate-mark">CC</div>
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--color-primary-dark); letter-spacing: 0.15em; text-transform: uppercase;">
            MUNICIPAL CORPORATION OF GREATER MUMBAI & CLEANCRED
          </div>
          <h2 style="color: var(--color-navy); margin: 0.75rem 0;">Certificate of Sustainability Excellence</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            This certifies that <strong>Delhi Public School Green Club</strong> has achieved a <strong>94/100 Sustainability Index</strong> by diverting <strong>1,840 KG of waste</strong> with zero landfill contamination.
          </p>

          <div style="display: flex; justify-content: space-around; background: #F8FAFC; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary-dark);">1,840 KG</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Waste Diverted</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #2563EB;">1,240 KG</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">CO₂ Avoided</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #F59E0B;">94 / 100</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Eco Rating</div>
            </div>
          </div>

          <div class="flex-between" style="border-top: 1px dashed var(--color-border); padding-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
            <span>Authorized Officer: Municipal Commissioner</span>
            <span>Date: 31 Aug 2026</span>
          </div>

          <button class="btn btn-primary btn-block" style="margin-top: 1.5rem;" onclick="window.print()">
            Print / Save as PDF
          </button>
        </div>
      </div>
    `;
  },

  renderInstitutionContent() {
    switch (this.selectedType) {
      case 'schools':
        return `
          <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2rem;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Rank #1 School Eco Club</span>
                <h3 style="color: var(--color-navy);">Delhi Public School — Green Brigade</h3>
                <p style="font-size: 0.85rem;">Student Body: 1,420 Active Recyclers &bull; Sustainability Score: 94/100</p>
              </div>
              <div class="badge badge-points" style="font-size: 1rem; padding: 0.5rem 1rem;">19,500 Total GC</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem;">
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Student Rewards</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Students earn Green Credits for bringing segregated paper and e-waste from home.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Classroom Battles</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Grade 9A leads the inter-class recycling championship with 340 kg paper recycled.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Daily Bulk Van</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Designated municipal electric van collects segregated cafeteria & dry waste daily at 3 PM.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="alert('Demo Request Sent: Delhi Public School Green Club consultation initiated.')">
              Register New School / Club 🚀
            </button>
          </div>
        `;

      case 'colleges':
        return `
          <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2rem;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Higher Education Hub</span>
                <h3 style="color: var(--color-navy);">IIT Bombay — Campus Eco Cell</h3>
                <p style="font-size: 0.85rem;">Hostel Waste Decentralization & Tech-Driven Composting &bull; Score: 98/100</p>
              </div>
              <div class="badge badge-points" style="font-size: 1rem; padding: 0.5rem 1rem;">38,400 Total GC</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem;">
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Hostel Waste Auditing</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Real-time weight sensors in 16 campus hostel messes tracking organic diversion.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Student Innovation Grants</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">CleanCred grants funded 3 student research prototypes on plastic pyrolysis.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Event Waste Zero-Target</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">100% waste recovery during cultural festivals (Mood Indigo & Techfest).</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="alert('Demo: College onboarding wizard initiated.')">
              Partner With Your College 🎓
            </button>
          </div>
        `;

      case 'hospitals':
        return `
          <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2rem; border-top: 4px solid #EF4444;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge" style="background: #FEE2E2; color: #991B1B; margin-bottom: 0.35rem;">Biomedical Compliance</span>
                <h3 style="color: var(--color-navy);">Max Super Speciality Hospital Network</h3>
                <p style="font-size: 0.85rem;">Color-Coded Bio-Hazard Barcode Tracking & CPCB Compliance</p>
              </div>
              <div class="badge badge-green">100% CPCB Compliant ✓</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem;">
              <div style="background: #FEF2F2; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #FECACA;">
                <strong style="color: #991B1B; font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">🔴 Red / Yellow Bag Segregation</strong>
                <p style="font-size: 0.8rem; color: #7F1D1D;">Strict tracking of anatomical, soiled, and chemical medical waste bags with unique QR tags.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Authorized Incineration</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Dedicated GPS-monitored hazardous disposal vehicles with digital manifest sign-off.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Pollution Control Audit</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Instant one-click automated regulatory compliance report for State Pollution Control Board.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="alert('Demo: Hospital Medical Waste onboarding requested.')">
              Request Hospital Compliance Setup 🏥
            </button>
          </div>
        `;

      case 'offices':
        return `
          <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2rem;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-navy" style="margin-bottom: 0.35rem;">Corporate ESG Platform</span>
                <h3 style="color: var(--color-navy);">Infosys Technology Park — ESG Hub</h3>
                <p style="font-size: 0.85rem;">Corporate Scope 3 Waste Analytics & Employee Green Leaderboards</p>
              </div>
              <div class="badge badge-green">ESG Gold Certified ✓</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem;">
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Desk & Pantry Bins</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Smart contactless dry paper & beverage can recycling stations on all 8 floors.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Corporate BRSR Reports</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Direct SEBI-aligned Business Responsibility and Sustainability data export.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Employee Green Perks</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Top eco-performing teams receive company-matched gift cards and public accolades.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="alert('Demo: Corporate ESG demo initiated.')">
              Setup Corporate Waste Solution 🏢
            </button>
          </div>
        `;

      case 'societies':
        return `
          <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2rem;">
            <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-green" style="margin-bottom: 0.35rem;">Residential RWA Network</span>
                <h3 style="color: var(--color-navy);">Greenwood Heights Residential Society</h3>
                <p style="font-size: 0.85rem;">240 Families &bull; 100% Door-to-Door Wet Waste Composting</p>
              </div>
              <div class="badge badge-points">₹12,400 Society Corpus Saved</div>
            </div>

            <div class="grid-cols-3" style="margin-bottom: 2rem;">
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Wing Leaderboard</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Wing A vs Wing B vs Wing C monthly segregation accuracy competition.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Municipal Tax Rebate</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">100% segregating societies receive a 5% municipal property tax rebate from BMC.</p>
              </div>
              <div style="background: #F8FAFC; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <strong style="color: var(--color-navy); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">Community Organic Garden</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Onsite compost powers a community organic vegetable and rooftop garden.</p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="alert('Demo: Society onboarding initiated.')">
              Register Your Housing Society
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
    SoundFX.playPointsEarned();
    Confetti.trigger(100);
    document.getElementById('certificate-modal').classList.add('active');
  }
};

window.InstitutionPortalView = InstitutionPortalView;
