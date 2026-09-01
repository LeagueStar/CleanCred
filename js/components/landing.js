/* ==========================================================================
   GREEN LEGACY — LANDING PAGE COMPONENT
   Tagline: EARN. RECYCLE. REWARD.
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';

export const LandingPage = {
  render() {
    const container = document.getElementById('view-landing');
    if (!container) return;

    container.innerHTML = `
      <div class="landing-page-wrapper">
        <!-- Hero Section -->
        <section class="hero-section" style="padding: 2.5rem 0 4rem 0; position: relative;">
          <div class="app-container">
            <div class="hero-grid" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 3.5rem; align-items: center;">
              
              <!-- Left Column: Copy & CTAs -->
              <div class="hero-content">
                <div class="badge badge-green" style="margin-bottom: 1.25rem;">
                  Verified waste recovery for cleaner cities
                </div>
                
                <h1 style="margin-bottom: 1.25rem; font-size: clamp(2.4rem, 4.5vw, 3.8rem); line-height: 1.12;">
                  CleanCred<br/>
                  <span style="color: var(--color-primary-dark);">Verified waste collection for cleaner cities.</span>
                </h1>
                
                <p style="font-size: 1.15rem; margin-bottom: 2rem; max-width: 520px; color: var(--text-muted); line-height: 1.6;">
                  Make responsible waste segregation traceable—from your doorstep to recovery. Green Credits reward verified participation.
                </p>

                <!-- Action Buttons -->
                <div class="hero-buttons" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap;">
                  <button class="btn btn-primary btn-lg" onclick="window.AppRouter.navigate('report-waste')">
                    Report Waste
                  </button>
                  <button class="btn btn-secondary btn-lg" onclick="window.AppRouter.navigate('impact')">
                    See How It Works
                  </button>
                </div>

                <!-- Live Metrics Summary Pill -->
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
                  <div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-navy);">82%</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Waste Diversion Rate</div>
                  </div>
                  <div style="width: 1px; height: 32px; background: var(--color-border);"></div>
                  <div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary-dark);">12,450+</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Active Green Citizens</div>
                  </div>
                  <div style="width: 1px; height: 32px; background: var(--color-border);"></div>
                  <div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-navy);">₹4,85,000+</div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Credits Distributed</div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Traceability workflow -->
              <div class="hero-visual" style="position: relative;">
                
                <!-- Main workflow card -->
                <div class="glass-card glass-card-navy" style="padding: 2.25rem; border-radius: var(--radius-xl); position: relative; overflow: hidden;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: #84CC16; text-transform: uppercase; letter-spacing: 0.08em;">
                      VERIFIED RECOVERY WORKFLOW
                    </div>
                    <div class="badge" style="background: rgba(22, 163, 74, 0.25); color: #84CC16; border: 1px solid #16A34A;">
                      Municipal service
                    </div>
                  </div>

                  <!-- Animated Journey Flow Steps -->
                  <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.08); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
                      <div class="workflow-step-number">1</div>
                      <div style="flex: 1;">
                        <div style="font-size: 0.85rem; font-weight: 700; color: #FFFFFF;">Citizen reports segregated waste</div>
                        <div style="font-size: 0.75rem; color: #94A3B8;">Request details create a traceable record</div>
                      </div>
                      <span style="font-size: 0.8rem; font-weight: 800; color: #84CC16;">STEP 1</span>
                    </div>

                    <div style="text-align: center; color: rgba(255,255,255,0.3); line-height: 0.5;">↓</div>

                    <div style="display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.08); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
                      <div class="workflow-step-number">2</div>
                      <div style="flex: 1;">
                        <div style="font-size: 0.85rem; font-weight: 700; color: #FFFFFF;">Collection is verified</div>
                        <div style="font-size: 0.75rem; color: #94A3B8;">Worker verification confirms the pickup</div>
                      </div>
                      <span style="font-size: 0.8rem; font-weight: 800; color: #84CC16;">STEP 2</span>
                    </div>

                    <div style="text-align: center; color: rgba(255,255,255,0.3); line-height: 0.5;">↓</div>

                    <div style="display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.1); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(132, 204, 22, 0.4);">
                      <div class="workflow-step-number">3</div>
                      <div style="flex: 1;">
                        <div style="font-size: 0.9rem; font-weight: 800; color: #FFFFFF;">Recovery is recorded</div>
                        <div style="font-size: 0.75rem; color: #DCFCE7;">Green Credits are issued after verified collection</div>
                      </div>
                      <span class="badge badge-points">+10 GC</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 5-Step Visual Timeline Section -->
        <section style="padding: 4rem 0; background: #FFFFFF; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
          <div class="app-container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem auto;">
              <div class="badge badge-green" style="margin-bottom: 0.75rem;">HOW CLEANCRED WORKS</div>
              <h2>A clear chain of custody for every collection</h2>
              <p style="margin-top: 0.5rem;">From report to recovery, each step keeps citizens and municipal teams informed.</p>
            </div>

            <!-- 5 Steps Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.5rem;">
              
              <!-- Step 1 -->
              <div class="glass-card" style="padding: 1.75rem 1.25rem; text-align: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
                  <span class="process-step-marker">01</span>
                </div>
                <h4 style="margin-bottom: 0.5rem; color: var(--color-navy);">1. Segregate</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Separate your daily household waste into Wet, Dry, and Harmful bins.</p>
              </div>

              <!-- Step 2 -->
              <div class="glass-card" style="padding: 1.75rem 1.25rem; text-align: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #DBEAFE; color: #1E40AF; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
                  <span class="process-step-marker is-info">02</span>
                </div>
                <h4 style="margin-bottom: 0.5rem; color: var(--color-navy);">2. Report & Request</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Log waste type, approximate weight, location pin, and photo on the app.</p>
              </div>

              <!-- Step 3 -->
              <div class="glass-card" style="padding: 1.75rem 1.25rem; text-align: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #FEF3C7; color: #B45309; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
                  <span class="process-step-marker is-warning">03</span>
                </div>
                <h4 style="margin-bottom: 0.5rem; color: var(--color-navy);">3. Doorstep Pickup</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">A collection worker arrives at your location with real-time GPS tracking.</p>
              </div>

              <!-- Step 4 -->
              <div class="glass-card" style="padding: 1.75rem 1.25rem; text-align: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #EDE9FE; color: #6D28D9; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
                  <span class="process-step-marker">04</span>
                </div>
                <h4 style="margin-bottom: 0.5rem; color: var(--color-navy);">4. Verification</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Worker verifies category purity, weight, and scans disposal confirmation.</p>
              </div>

              <!-- Step 5 -->
              <div class="glass-card" style="padding: 1.75rem 1.25rem; text-align: center; border: 1.5px solid var(--color-primary); background: #F0FDF4;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #16A34A; color: #FFFFFF; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.35);">
                  <span class="process-step-marker is-recovery">05</span>
                </div>
                <h4 style="margin-bottom: 0.5rem; color: var(--color-primary-dark);">5. Earn & Redeem</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Green Credits instantly credited. Redeem for mobile recharges and utility bills.</p>
              </div>

            </div>
          </div>
        </section>

        <!-- Interactive Waste Segregation Section (Wet, Dry, Harmful) -->
        <section style="padding: 4.5rem 0;">
          <div class="app-container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem auto;">
              <div class="badge badge-green" style="margin-bottom: 0.75rem;">WASTE SEGREGATION GUIDE</div>
              <h2>Know Your Waste Categories & Credits</h2>
              <p style="margin-top: 0.5rem;">Select your waste correctly to maximize credits and prevent hazardous contamination.</p>
            </div>

            <!-- 3 Large Category Cards -->
            <div class="grid-cols-3">
              
              <!-- 🟢 WET WASTE -->
              <div class="category-card category-card-wet glass-card">
                <div>
                  <div class="flex-between" style="margin-bottom: 1.5rem;">
                    <div class="category-icon-wrapper">🍏</div>
                    <span class="category-points-tag">+10 CREDITS</span>
                  </div>
                  <h3 style="color: var(--waste-wet); margin-bottom: 0.5rem;">Wet waste</h3>
                  <p style="font-size: 0.875rem; color: var(--color-navy); font-weight: 600; margin-bottom: 1rem;">
                    Organic & Biodegradable Material
                  </p>
                  
                  <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Common Examples:</div>
                    <ul style="font-size: 0.85rem; color: var(--color-navy); padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">
                      <li>Kitchen scraps & food leftovers</li>
                      <li>Vegetable & fruit peels</li>
                      <li>Garden waste & fallen leaves</li>
                      <li>Tea bags & coffee grounds</li>
                      <li>Eggshells & organic florals</li>
                    </ul>
                  </div>
                </div>

                <button class="btn btn-primary btn-block" onclick="window.AppRouter.navigate('report-waste', { category: 'wet' })">
                  Report Wet Waste (+10 GC)
                </button>
              </div>

              <!-- 🔵 DRY WASTE -->
              <div class="category-card category-card-dry glass-card">
                <div>
                  <div class="flex-between" style="margin-bottom: 1.5rem;">
                    <div class="category-icon-wrapper">📦</div>
                    <span class="category-points-tag">+7 CREDITS</span>
                  </div>
                  <h3 style="color: var(--waste-dry); margin-bottom: 0.5rem;">Dry waste</h3>
                  <p style="font-size: 0.875rem; color: var(--color-navy); font-weight: 600; margin-bottom: 1rem;">
                    Clean Recyclable Packaging & Goods
                  </p>
                  
                  <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Common Examples:</div>
                    <ul style="font-size: 0.85rem; color: var(--color-navy); padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">
                      <li>Plastic bottles, containers, boxes</li>
                      <li>Newspapers, magazines, cardboard</li>
                      <li>Metal cans, foil packaging</li>
                      <li>Glass jars and clean bottles</li>
                      <li>Old textiles, clothes, and shoes</li>
                    </ul>
                  </div>
                </div>

                <button class="btn btn-block" style="background: var(--waste-dry); color: #FFFFFF;" onclick="window.AppRouter.navigate('report-waste', { category: 'dry' })">
                  Report Dry Waste (+7 GC)
                </button>
              </div>

              <!-- 🔴 HARMFUL WASTE -->
              <div class="category-card category-card-harmful glass-card">
                <div>
                  <div class="flex-between" style="margin-bottom: 1.5rem;">
                    <div class="category-icon-wrapper">⚠️</div>
                    <span class="category-points-tag">+5 CREDITS</span>
                  </div>
                  <h3 style="color: var(--waste-harmful); margin-bottom: 0.5rem;">Harmful waste</h3>
                  <p style="font-size: 0.875rem; color: var(--color-navy); font-weight: 600; margin-bottom: 1rem;">
                    Hazardous, Biomedical & E-Waste
                  </p>
                  
                  <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Common Examples:</div>
                    <ul style="font-size: 0.85rem; color: var(--color-navy); padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">
                      <li>Old batteries & chargers</li>
                      <li>Expired medicine & syringes</li>
                      <li>Chemicals, paints, aerosols</li>
                      <li>Electronic gadgets & CFL bulbs</li>
                      <li>Sanitary & biohazard items</li>
                    </ul>
                  </div>

                  <div style="background: #FEE2E2; border: 1px solid #FECACA; padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.75rem; color: #991B1B; font-weight: 700; margin-bottom: 1.5rem;">
                    Important: never mix harmful waste with regular household waste.
                  </div>
                </div>

                <button class="btn btn-block" style="background: var(--waste-harmful); color: #FFFFFF;" onclick="window.AppRouter.navigate('report-waste', { category: 'harmful' })">
                  Report Harmful Waste (+5 GC)
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- Interactive Points & Reward Conversion Calculator -->
        <section style="padding: 4rem 0; background: #173A26; color: #FFFFFF;">
          <div class="app-container">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;" class="hero-grid">
              <div>
                <div class="badge" style="background: rgba(132, 204, 22, 0.2); color: #84CC16; border: 1px solid #84CC16; margin-bottom: 1rem;">
                  GREEN CREDITS, SIMPLY EXPLAINED
                </div>
                <h2 style="color: #FFFFFF; margin-bottom: 1rem;">100 Green Credits = ₹10 Real Value</h2>
                <p style="color: #CBD5E1; margin-bottom: 1.5rem;">
                  Green Credits are the incentive layer. The core service is verified, accountable collection and responsible recovery.
                </p>

                <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md);">
                    <span>🟢 500 Green Credits</span>
                    <strong style="color: #84CC16; font-size: 1.1rem;">= ₹50 Direct Credit</strong>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md);">
                    <span>🔵 1,000 Green Credits</span>
                    <strong style="color: #84CC16; font-size: 1.1rem;">= ₹100 Direct Credit</strong>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: var(--radius-md);">
                    <span>⭐ 2,500 Green Credits</span>
                    <strong style="color: #84CC16; font-size: 1.1rem;">= ₹250 Direct Credit</strong>
                  </div>
                </div>
              </div>

              <!-- Interactive Simulator Card -->
              <div class="glass-card" style="background: rgba(255,255,255,0.96); padding: 2.25rem; border-radius: var(--radius-xl); color: var(--text-main);">
                <h3 style="color: var(--color-navy); margin-bottom: 1.25rem;">Estimate Your Monthly Earnings</h3>
                
                <div class="form-group">
                  <div class="flex-between">
                    <label class="form-label" style="margin: 0;">Wet Waste (Pickups / Month):</label>
                    <span id="calc-wet-val" style="font-weight: 800; color: var(--waste-wet);">8 pickups (80 GC)</span>
                  </div>
                  <input type="range" id="calc-wet-slider" min="0" max="30" value="8" style="width: 100%; accent-color: var(--waste-wet);" oninput="window.LandingPage.updateCalculator()">
                </div>

                <div class="form-group">
                  <div class="flex-between">
                    <label class="form-label" style="margin: 0;">Dry Recyclable Waste (Pickups / Month):</label>
                    <span id="calc-dry-val" style="font-weight: 800; color: var(--waste-dry);">6 pickups (42 GC)</span>
                  </div>
                  <input type="range" id="calc-dry-slider" min="0" max="30" value="6" style="width: 100%; accent-color: var(--waste-dry);" oninput="window.LandingPage.updateCalculator()">
                </div>

                <div class="form-group">
                  <div class="flex-between">
                    <label class="form-label" style="margin: 0;">Weekly Streaks & Challenges:</label>
                    <span id="calc-bonus-val" style="font-weight: 800; color: #F59E0B;">+75 GC Bonus</span>
                  </div>
                  <input type="range" id="calc-bonus-slider" min="0" max="200" value="75" step="25" style="width: 100%; accent-color: #F59E0B;" oninput="window.LandingPage.updateCalculator()">
                </div>

                <!-- Estimated Earnings Result Box -->
                <div style="background: var(--waste-wet-bg); border: 1.5px solid var(--waste-wet-border); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin-top: 1.5rem;">
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase;">Estimated Monthly Reward</div>
                  <div style="font-size: 2rem; font-weight: 800; color: var(--color-primary-dark); margin: 0.25rem 0;" id="calc-total-inr">₹19.70 / month</div>
                  <div style="font-size: 0.85rem; color: var(--text-muted);" id="calc-total-gp">(197 Green Credits)</div>
                </div>

                <button class="btn btn-primary btn-block" style="margin-top: 1.5rem;" onclick="window.AppRouter.navigate('report-waste')">
                  Report Waste
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- Final Landing Call To Action -->
        <section style="padding: 5rem 0; text-align: center; background: #FFFFFF;">
          <div class="app-container" style="max-width: 800px;">
            <div class="badge badge-green" style="margin-bottom: 1rem;">CLEANCRED</div>
            <h1 style="margin-bottom: 1.25rem; font-size: clamp(2.2rem, 3.8vw, 3.2rem);">Waste recovery you can verify.</h1>
            <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2rem;">
              Every correctly segregated piece of waste is one step toward a cleaner city and an empowered community.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" onclick="window.AppRouter.navigate('report-waste')">
                Report Waste
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.AppRouter.navigate('dashboard')">
                View dashboard
              </button>
            </div>
            <div style="margin-top: 3rem; font-weight: 800; letter-spacing: 0.18em; color: var(--color-primary-dark); font-size: 0.9rem;">
              CleanCred &bull; Built by Green Legacy
            </div>
          </div>
        </section>

      </div>
    `;
  },

  updateCalculator() {
    const wetSlider = document.getElementById('calc-wet-slider');
    const drySlider = document.getElementById('calc-dry-slider');
    const bonusSlider = document.getElementById('calc-bonus-slider');

    if (!wetSlider || !drySlider || !bonusSlider) return;

    const wetCount = parseInt(wetSlider.value);
    const dryCount = parseInt(drySlider.value);
    const bonusGp = parseInt(bonusSlider.value);

    const wetGp = wetCount * 10;
    const dryGp = dryCount * 7;
    const totalGp = wetGp + dryGp + bonusGp;
    const totalInr = (totalGp / 10).toFixed(2);

    document.getElementById('calc-wet-val').textContent = `${wetCount} pickups (${wetGp} GC)`;
    document.getElementById('calc-dry-val').textContent = `${dryCount} pickups (${dryGp} GC)`;
    document.getElementById('calc-bonus-val').textContent = `+${bonusGp} GC Bonus`;
    document.getElementById('calc-total-inr').textContent = `₹${totalInr} / month`;
    document.getElementById('calc-total-gp').textContent = `(${totalGp} Green Credits)`;
  }
};

window.LandingPage = LandingPage;
