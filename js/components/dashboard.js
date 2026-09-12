/* ==========================================================================
   CLEANCRED — CITIZEN MOBILE HOME VIEW
   Smart India Hackathon 2026 // Team GreenLegacy
   Tactile Neumorphism + Civic Technology
   Strict Workflow: Report → Verify → Collect → Record → Earn
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { SoundFX } from '../utils/audio.js';
import { Confetti } from '../utils/confetti.js';

export const DashboardView = {
  isScanning: false,

  render() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const user = State.state.user;
    const activePickup = State.state.pickups.find(p => ['on_the_way', 'assigned', 'created'].includes(p.status));
    const balance = user.greenPoints || 1250;
    const inrValue = Formatters.gpToInr(balance);
    const nextTierGc = 1500;
    const progressPct = Math.min(100, Math.round((balance / nextTierGc) * 100));

    container.innerHTML = `
      <div class="app-container citizen-dashboard animate-fade-in" style="padding-bottom: 5.5rem;">
        
        <!-- TOP GREETING & STREAK BANNER -->
        <div class="flex-between" style="flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-start;">
          <div>
            <div class="eyebrow" style="color: var(--color-primary-dark); font-weight: 800; display: flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="map-pin" class="lucide-icon-sm"></i>
              <span>Ward 4B &bull; Bandra West, Mumbai</span>
            </div>
            <h1 style="color: var(--color-navy); font-size: clamp(1.8rem, 3.5vw, 2.4rem); margin-top: 0.25rem;">
              Good morning, ${user.name.split(' ')[0]}
            </h1>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">
              ${activePickup ? 'Your municipal collection is in progress. Hand over waste upon arrival to release credits.' : 'Keep your household waste segregated and earn verified Green Credits.'}
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('profile')" title="View Citizen Profile & Settings" style="padding: 0.45rem 0.85rem;">
              <i data-lucide="user" class="lucide-icon-sm"></i>
              <span>${user.name.split(' ')[0]}</span>
            </button>
            <div class="badge badge-amber" style="padding: 0.5rem 0.9rem; font-size: 0.85rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="flame" class="lucide-icon-sm"></i>
              <span>${user.greenStreakDays} Day Streak</span>
            </div>
            <button class="btn btn-primary" onclick="window.AppRouter.navigate('report-waste')" style="font-size: 0.9rem; padding: 0.65rem 1.25rem;">
              <i data-lucide="plus" class="lucide-icon-sm"></i>
              <span>Report Waste</span>
            </button>
          </div>
        </div>

        <!-- 1. GREEN CREDITS HERO BALANCE CARD -->
        <div class="hero-points-card neu-card neu-card-raised">
          <div class="flex-between">
            <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
              Available Green Credits
            </span>
            <span class="badge badge-green" style="display: flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="shield-check" class="lucide-icon-sm"></i>
              <span>Level 4 Eco Citizen</span>
            </span>
          </div>

          <div class="points-oversized-value">
            <span id="citizen-points-balance">${Formatters.formatNumber(balance)}</span>
            <span style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary);">GC</span>
          </div>

          <div style="margin-top: 0.25rem;">
            <div class="flex-between" style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem;">
              <span>Next Reward Tier: ${Formatters.formatNumber(nextTierGc)} GC</span>
              <span style="color: var(--color-primary-dark); font-weight: 800;">${progressPct}% Reached</span>
            </div>
            <div class="progress-track neu-card-inset" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-fill" style="width: ${progressPct}%"></div>
            </div>
          </div>

          <div class="flex-between" style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--color-border); font-size: 0.85rem; font-weight: 700;">
            <span style="color: var(--text-muted);">
              Estimated INR Value: <strong style="color: var(--color-navy);">₹${inrValue}</strong>
            </span>
            <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('rewards')" style="color: var(--color-primary-dark); font-weight: 800;">
              <span>Redeem Rewards & Vouchers</span>
              <i data-lucide="arrow-right" class="lucide-icon-sm"></i>
            </button>
          </div>
        </div>

        <!-- 1b. HERO FEATURE: TACTILE CIRCULAR "SCAN WASTE PRE-CHECK" BUTTON -->
        <div class="hero-scan-circle-container">
          <button class="btn-hero-scan-circular hero-scan-pulse" id="btn-hero-scan" onclick="window.DashboardView.startMockScan()" aria-label="Scan Waste for AI Pre-Check">
            <div class="scan-icon-bubble">
              <i data-lucide="camera" class="lucide-icon-lg"></i>
            </div>
            <span class="scan-btn-label">AI PRE-CHECK</span>
            <span class="scan-btn-sublabel">SCAN & STAGE PICKUP</span>
          </button>
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-align: center; margin-top: 0.9rem;">
            Computer-vision purity pre-check &bull; Credits awarded on physical worker verification
          </div>
        </div>

        <!-- 2. ACTIVE PICKUP CARD (SWIGGY/UBER STYLE) -->
        ${activePickup ? `
          <div class="pickup-status-card neu-card neu-card-raised">
            <div class="pickup-status-info">
              <div class="flex-between" style="margin-bottom: 0.4rem;">
                <span class="badge ${activePickup.category === 'wet' ? 'badge-green' : activePickup.category === 'dry' ? 'badge-blue' : 'badge-red'}">
                  ${activePickup.categoryName || 'Segregated Collection'}
                </span>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-primary-dark); display: flex; align-items: center; gap: 0.3rem;">
                  <i data-lucide="clock" class="lucide-icon-sm"></i>
                  <span>En Route &bull; ETA ${activePickup.etaMinutes || 12} mins</span>
                </span>
              </div>
              <strong style="font-size: 1.15rem; color: var(--color-navy); display: block;">
                Request #${activePickup.id} &bull; ${activePickup.subType || 'Household Waste'}
              </strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Assigned Worker: <strong>${activePickup.workerName || 'Ramesh Kumar'}</strong> (${activePickup.vehicleNo || 'Electric Van MH-02-GK-4091'})
              </p>
            </div>

            <div class="pickup-status-actions">
              <div class="pickup-otp-pill neu-card-inset">
                <div class="pickup-otp-label">Handover OTP</div>
                <div class="pickup-otp-val">${activePickup.otp || '8492'}</div>
              </div>
              <button class="btn btn-primary" onclick="window.AppRouter.navigate('live-tracking')">
                <i data-lucide="navigation" class="lucide-icon-sm"></i>
                <span>Track Live Pickup</span>
              </button>
            </div>
          </div>
        ` : `
          <div class="pickup-status-card neu-card neu-card-raised" style="border-left-color: var(--color-border-strong);">
            <div class="pickup-status-info">
              <div class="eyebrow" style="color: var(--text-muted);">Ready For Collection</div>
              <strong style="font-size: 1.1rem; color: var(--color-navy);">No Active Pickup In Progress</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                Segregate your kitchen organic waste, clean recyclables, or hazardous batteries and schedule a verified pickup.
              </p>
            </div>
            <button class="btn btn-primary" onclick="window.AppRouter.navigate('report-waste')">
              <i data-lucide="plus" class="lucide-icon-sm"></i>
              <span>Report Waste Now</span>
            </button>
          </div>
        `}

        <!-- 3. VERIFIED CITIZEN IMPACT METRICS -->
        <div class="grid-cols-3" style="margin-bottom: 2rem; gap: 1rem;">
          <div class="metric-card neu-card neu-card-flat">
            <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 700;">Landfill Waste Diverted</span>
            <strong style="font-size: 1.8rem; font-weight: 900; color: var(--color-navy); margin: 0.25rem 0;">
              ${user.lifetimeWasteKg} <small style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted);">kg</small>
            </strong>
            <em style="font-style: normal; font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 700;">${user.pickupsCompleted} verified collections</em>
          </div>
          <div class="metric-card neu-card neu-card-flat">
            <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 700;">Emissions Avoided</span>
            <strong style="font-size: 1.8rem; font-weight: 900; color: var(--color-navy); margin: 0.25rem 0;">
              ${user.co2SavedKg} <small style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted);">kg CO₂</small>
            </strong>
            <em style="font-style: normal; font-size: 0.78rem; color: var(--color-primary-dark); font-weight: 700;">Equiv. to ${user.treesEquivalent} urban trees</em>
          </div>
          <div class="metric-card neu-card neu-card-flat">
            <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 700;">Groundwater Protected</span>
            <strong style="font-size: 1.8rem; font-weight: 900; color: #2563EB; margin: 0.25rem 0;">
              ${user.waterSavedLitres || 480} <small style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted);">L</small>
            </strong>
            <em style="font-style: normal; font-size: 0.78rem; color: #2563EB; font-weight: 700;">Safe hazardous extraction</em>
          </div>
        </div>

        <!-- 4. WASTE CATEGORY QUICK LAUNCH CARDS (SIH TAXONOMY) -->
        <div style="margin-bottom: 2rem;">
          <div class="flex-between" style="margin-bottom: 0.75rem;">
            <div>
              <h3 style="color: var(--color-navy); font-size: 1.15rem; font-weight: 800; margin: 0;">Segregated Collection Categories</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">Select your waste category to initiate verified municipal collection.</p>
            </div>
            <span class="badge badge-green">SIH 2026 Taxonomy</span>
          </div>

          <div class="waste-options-grid">
            <!-- Wet Waste -->
            <div class="waste-card-option wet neu-card-flat" onclick="window.AppRouter.navigate('report-waste', { category: 'wet' })">
              <div class="flex-between">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--waste-wet-bg); color: var(--waste-wet); display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="apple" class="lucide-icon-md"></i>
                </div>
                <span class="badge badge-green">+10 GC</span>
              </div>
              <strong style="font-size: 1.05rem; color: var(--color-navy); margin-top: 0.5rem; display: block;">Wet Waste</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0;">Kitchen scraps, vegetable peels, food leftovers, organic florals.</p>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--waste-wet); margin-top: 0.25rem;">
                Daily Morning Route &bull; Biomethanation Bound
              </div>
            </div>

            <!-- Dry Waste -->
            <div class="waste-card-option dry neu-card-flat" onclick="window.AppRouter.navigate('report-waste', { category: 'dry' })">
              <div class="flex-between">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--waste-dry-bg); color: var(--waste-dry); display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="package" class="lucide-icon-md"></i>
                </div>
                <span class="badge badge-blue">+7 GC</span>
              </div>
              <strong style="font-size: 1.05rem; color: var(--color-navy); margin-top: 0.5rem; display: block;">Dry Waste</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0;">Clean cardboard cartons, PET bottles, tins, dry paper, textiles.</p>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--waste-dry); margin-top: 0.25rem;">
                MRF Sorting &bull; Material Recovery Center
              </div>
            </div>

            <!-- Harmful Waste -->
            <div class="waste-card-option harmful neu-card-flat" onclick="window.AppRouter.navigate('report-waste', { category: 'harmful' })">
              <div class="flex-between">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--waste-harmful-bg); color: var(--waste-harmful); display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="battery-charging" class="lucide-icon-md"></i>
                </div>
                <span class="badge badge-red">+5 GC</span>
              </div>
              <strong style="font-size: 1.05rem; color: var(--color-navy); margin-top: 0.5rem; display: block;">Harmful Waste</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0;">Lithium batteries, electronics, circuit boards, CFLs, medicines.</p>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--waste-harmful); margin-top: 0.25rem;">
                Hazardous Protocol &bull; CPCB Authorized
              </div>
            </div>
          </div>
        </div>

        <!-- 5. RECENT ACTIVITY & COLLECTION LEDGER -->
        <div class="neu-card neu-card-raised" style="padding: 1.75rem; margin-bottom: 2rem; border-radius: var(--radius-xl);">
          <div class="flex-between" style="margin-bottom: 1.25rem;">
            <div>
              <h3 style="color: var(--color-navy); font-size: 1.15rem; font-weight: 800; margin: 0;">Recent Collection Ledger</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">Trace your verified submissions and audit status.</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('live-tracking')">
              <i data-lucide="navigation" class="lucide-icon-sm"></i>
              <span>Live Map</span>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${State.state.pickups.slice(0, 4).map(p => `
              <div class="neu-card-flat" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: ${p.category === 'wet' ? 'var(--waste-wet-bg)' : p.category === 'dry' ? 'var(--waste-dry-bg)' : 'var(--waste-harmful-bg)'}; color: ${p.category === 'wet' ? 'var(--waste-wet)' : p.category === 'dry' ? 'var(--waste-dry)' : 'var(--waste-harmful)'}; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="${p.category === 'wet' ? 'apple' : p.category === 'dry' ? 'package' : 'battery-charging'}" class="lucide-icon-sm"></i>
                  </div>
                  <div>
                    <strong style="color: var(--color-navy); font-size: 0.95rem;">${p.subType || p.categoryName}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">
                      Ref: ${p.id} &bull; ${Formatters.formatRelativeTime(p.createdAt)} &bull; ${p.quantityKg} kg
                    </div>
                  </div>
                </div>

                <div>
                  ${p.status === 'verified' ? `
                    <span class="badge badge-green">+${p.pointsCredited || p.pointsReward} GC Verified</span>
                  ` : p.status === 'on_the_way' ? `
                    <span class="badge badge-amber">Collection En Route</span>
                  ` : `
                    <span class="badge badge-navy">Awaiting Handover</span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6. QUICK CIVIC LINKS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 2rem; gap: 1rem;">
          <div class="neu-card neu-card-raised" style="padding: 1.25rem; border-radius: var(--radius-lg); cursor: pointer;" onclick="window.AppRouter.navigate('leaderboard')">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
              <i data-lucide="trophy" class="lucide-icon-sm"></i>
            </div>
            <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">Ward Leaderboard</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Rank #12 in Bandra West &bull; View standings →</p>
          </div>
          <div class="neu-card neu-card-raised" style="padding: 1.25rem; border-radius: var(--radius-lg); cursor: pointer;" onclick="window.AppRouter.navigate('impact')">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
              <i data-lucide="bar-chart-3" class="lucide-icon-sm"></i>
            </div>
            <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">Impact Analytics</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Download official carbon offset certificate →</p>
          </div>
          <div class="neu-card neu-card-raised" style="padding: 1.25rem; border-radius: var(--radius-lg); cursor: pointer;" onclick="window.AppRouter.navigate('illegal-dumping')">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
              <i data-lucide="shield-alert" class="lucide-icon-sm"></i>
            </div>
            <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">Report Dump Site</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Flag civic black spots and earn +20 GC →</p>
          </div>
          <div class="neu-card neu-card-raised" style="padding: 1.25rem; border-radius: var(--radius-lg); cursor: pointer;" onclick="window.AppRouter.navigate('institutions')">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #E0E7FF; color: #4338CA; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
              <i data-lucide="school" class="lucide-icon-sm"></i>
            </div>
            <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">Institutions Portal</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Bulk generators & EPR accreditation →</p>
          </div>
        </div>

      </div>

      <!-- MOBILE BOTTOM DOCK (tactile silicone tray + raised Scan FAB) -->
      <nav class="mobile-bottom-dock" aria-label="Mobile Navigation">
        <button class="dock-item-btn active" onclick="window.AppRouter.navigate('dashboard')">
          <i data-lucide="home" class="lucide-icon-md"></i>
          <span>Home</span>
        </button>
        <button class="dock-item-btn" onclick="window.AppRouter.navigate('report-waste')">
          <i data-lucide="plus-circle" class="lucide-icon-md"></i>
          <span>Report</span>
        </button>
        <button class="dock-scan-btn-center" onclick="window.DashboardView.startMockScan()" aria-label="Scan Waste Pre-Check">
          <i data-lucide="camera" class="lucide-icon-md"></i>
        </button>
        <button class="dock-item-btn" onclick="window.AppRouter.navigate('rewards')">
          <i data-lucide="wallet" class="lucide-icon-md"></i>
          <span>Wallet</span>
        </button>
        <button class="dock-item-btn" onclick="window.AppRouter.navigate('profile')">
          <i data-lucide="user" class="lucide-icon-md"></i>
          <span>Profile</span>
        </button>
      </nav>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================================
  // INTERACTIVE AI SEGREGATION PRE-CHECK (Strict Workflow: Report -> Verify)
  // No instant points awarded; creates a verified staged pickup request
  // ==========================================================================
  startMockScan() {
    if (this.isScanning) return;
    this.isScanning = true;
    SoundFX.playClick();

    const modalContainer = document.getElementById('modal-scan-container');
    if (!modalContainer) return;

    modalContainer.style.display = 'flex';
    modalContainer.className = 'modal-overlay-backdrop';

    // Step 1: simulated camera viewfinder with laser sweep
    modalContainer.innerHTML = `
      <div class="scan-viewfinder-modal neu-card neu-card-raised animate-pop-in" role="dialog" aria-label="AI Waste Scanner">
        <div class="flex-between" style="margin-bottom: 0.85rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="w-3 h-3 rounded-full animate-pulse" style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444; display: inline-block;"></span>
            <strong style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-navy);">AI Waste Segregation Pre-Check</strong>
          </div>
          <button class="modal-close-btn" style="position: static;" onclick="window.DashboardView.closeModal()" aria-label="Close scanner">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </button>
        </div>

        <div class="camera-preview-box">
          <div class="scan-laser-beam"></div>
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800; color: #34D399;">
            <span>HD VIDEO STREAM</span>
            <span>60 FPS &bull; COMPUTER VISION</span>
          </div>
          <div style="border: 2px dashed rgba(52, 211, 153, 0.8); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto 0;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #34D399; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
              <i data-lucide="apple" class="lucide-icon-lg"></i>
            </div>
            <span style="background: #10B981; color: #FFFFFF; font-family: var(--font-heading); font-weight: 900; font-size: 0.7rem; padding: 0.3rem 0.8rem; border-radius: 9999px;">
              POINT AT SEGREGATED BAG
            </span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; font-weight: 700; color: #CBD5E1;">
            <span id="scan-status-text">Analyzing material density, moisture &amp; purity...</span>
            <span style="display: inline-flex; gap: 4px;">
              <span class="bounce-dot-1" style="width: 7px; height: 7px; border-radius: 50%; background: #34D399; display: inline-block;"></span>
              <span class="bounce-dot-2" style="width: 7px; height: 7px; border-radius: 50%; background: #34D399; display: inline-block;"></span>
              <span class="bounce-dot-3" style="width: 7px; height: 7px; border-radius: 50%; background: #34D399; display: inline-block;"></span>
            </span>
          </div>
        </div>

        <div style="text-align: center; font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-top: 0.75rem;">
          Keep the segregated bag centered inside the targeting frame
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Step 2: AI analysis progress
    setTimeout(() => {
      const statusText = document.getElementById('scan-status-text');
      if (statusText) {
        statusText.innerHTML = '✨ Match verified: <strong>Wet Waste (Organic)</strong> — 98.4% purity score';
        statusText.style.color = '#34D399';
      }
    }, 1100);

    // Step 3: Staged pickup creation (NO instant credits, creates real request)
    setTimeout(() => {
      this.triggerStagedPickupCreation();
    }, 2200);

    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) this.closeModal();
    };
    if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.closeModal();
    };
    document.addEventListener('keydown', this._escHandler);
  },

  triggerStagedPickupCreation() {
    SoundFX.playPointsEarned();
    Confetti.trigger(60);

    // Create traceable waste request in State without instant point awarding
    const newReq = State.createWasteRequest({
      category: 'wet',
      subType: 'AI-Scanned Organic Kitchen Waste',
      quantity: 3.5,
      address: State.state.user.address,
      notes: 'AI Pre-Check 98.4% Pure',
      photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80'
    });

    const modalContainer = document.getElementById('modal-scan-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="celebration-reward-card neu-card neu-card-raised animate-pop-in" role="dialog" aria-label="Scan pre-check confirmation" style="max-width: 440px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);">
          <i data-lucide="check-circle-2" class="lucide-icon-lg"></i>
        </div>
        
        <div class="badge badge-green" style="margin-bottom: 0.5rem;">AI Purity Pre-Check Passed (98.4%)</div>
        <h3 style="font-size: 1.5rem; font-weight: 900; color: var(--color-navy); margin: 0;">Pickup Staged</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.35rem 0 1rem 0; line-height: 1.4;">
          Request <strong>#${newReq.id}</strong> has been created. A municipal worker will collect your bag and perform scale verification to disburse <strong>+10 Green Credits</strong>.
        </p>

        <!-- Handover OTP Pill -->
        <div class="neu-card-inset" style="margin: 0 auto 1.25rem auto; padding: 0.85rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;">
            Handover OTP for Collector
          </div>
          <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; letter-spacing: 0.15em; color: var(--color-primary-dark); margin: 0.2rem 0;">
            ${newReq.otp}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">
            Worker: <strong>Ramesh Kumar</strong> &bull; ETA: ~18 mins
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          <button class="btn btn-primary btn-block" onclick="window.DashboardView.closeModal(); window.AppRouter.navigate('live-tracking');">
            <i data-lucide="navigation" class="lucide-icon-sm"></i>
            <span>Track Pickup On Live Map</span>
          </button>
          <button class="btn btn-secondary btn-block" onclick="window.DashboardView.closeModal()">
            <span>Done</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  closeModal() {
    this.isScanning = false;
    const modalContainer = document.getElementById('modal-scan-container');
    if (modalContainer) {
      modalContainer.style.display = 'none';
      modalContainer.innerHTML = '';
      modalContainer.onclick = null;
    }
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
    this.render();
  }
};

window.DashboardView = DashboardView;
