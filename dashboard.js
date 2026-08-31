/* ==========================================================================
   GREEN LEGACY — CITIZEN DASHBOARD COMPONENT
   Profile: Shivansh Prajapati | 1,250 GC = ₹125
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';

export const DashboardView = {
  render() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const user = State.state.user;
    const activePickup = State.state.pickups.find(p => p.status === 'on_the_way' || p.status === 'assigned' || p.status === 'created');
    const inrValue = Formatters.gpToInr(user.greenPoints);

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Dashboard Top Header Greeting -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.5rem;">
              <span>🌱</span> Citizen Eco Hub &bull; Ward 4B Mumbai
            </div>
            <h2>Good morning, ${user.name.split(' ')[0]} 👋</h2>
            <p>Ready to make a greener impact today? You have an active pickup in progress.</p>
          </div>

          <div style="display: flex; gap: 0.85rem; align-items: center;">
            <button class="btn btn-primary" onclick="window.AppRouter.navigate('report-waste')">
              <span>♻️</span> Report Waste (+10 GC)
            </button>
            <button class="btn btn-secondary" onclick="window.AppRouter.navigate('rewards')">
              <span>💳</span> Green Wallet
            </button>
          </div>
        </div>

        <!-- Active Live Pickup Tracking Banner (If any active pickup) -->
        ${activePickup ? `
          <div class="glass-card" style="background: linear-gradient(135deg, #102A43, #0B5D3B); color: #FFFFFF; padding: 1.5rem 1.75rem; margin-bottom: 2rem; border: 1.5px solid rgba(132, 204, 22, 0.4);">
            <div class="flex-between" style="flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 1.25rem;">
                <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(22, 163, 74, 0.35); border: 2px solid #84CC16; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;" class="animate-pulse-glow">
                  🚚
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
                    <span class="badge" style="background: #84CC16; color: #0A1929; font-weight: 800;">LIVE PICKUP</span>
                    <strong style="color: #FFFFFF; font-size: 0.95rem;">Request #${activePickup.id}</strong>
                  </div>
                  <div style="font-size: 0.85rem; color: #CBD5E1;">
                    ${activePickup.categoryName} &bull; Worker <strong>${activePickup.workerName || 'Assigned Worker'}</strong> is on the way (ETA: ~${activePickup.etaMinutes || 12} mins)
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="background: rgba(255,255,255,0.12); padding: 0.4rem 0.85rem; border-radius: var(--radius-md); text-align: center;">
                  <div style="font-size: 0.7rem; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Pickup OTP</div>
                  <div style="font-size: 1.15rem; font-weight: 800; color: #84CC16; letter-spacing: 0.1em;">${activePickup.otp || '8492'}</div>
                </div>
                <button class="btn btn-primary" onclick="window.AppRouter.navigate('live-tracking')">
                  <span>📍</span> Live Track Map
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Top 4 Metrics Summary Grid -->
        <div class="grid-cols-4" style="margin-bottom: 2rem;">
          
          <!-- Green Credits & Rupee Valuation -->
          <div class="glass-card glass-card-emerald" style="padding: 1.5rem; cursor: pointer;" onclick="window.AppRouter.navigate('rewards')">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #DCFCE7;">Green Wallet</span>
              <span style="font-size: 1.25rem;">🌱</span>
            </div>
            <div style="font-size: 2.1rem; font-weight: 900; color: #FFFFFF; line-height: 1;">
              ${Formatters.formatNumber(user.greenPoints)} <span style="font-size: 1rem; font-weight: 600;">GC</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #DCFCE7; font-weight: 600;">
              ≈ ${Formatters.formatCurrency(inrValue)} Real Value (100 GC = ₹10)
            </div>
          </div>

          <!-- Total Waste Diverted -->
          <div class="glass-card" style="padding: 1.5rem;">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Waste Diverted</span>
              <span style="font-size: 1.25rem;">♻️</span>
            </div>
            <div style="font-size: 2.1rem; font-weight: 800; color: var(--color-navy); line-height: 1;">
              ${user.lifetimeWasteKg} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">KG</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.825rem; color: var(--color-primary); font-weight: 600;">
              ${user.pickupsCompleted} Verified Pickups
            </div>
          </div>

          <!-- CO2 Impact & Trees -->
          <div class="glass-card" style="padding: 1.5rem;">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Carbon Avoided</span>
              <span style="font-size: 1.25rem;">🌍</span>
            </div>
            <div style="font-size: 2.1rem; font-weight: 800; color: var(--color-navy); line-height: 1;">
              ${user.co2SavedKg} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">KG CO₂</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.825rem; color: var(--text-muted);">
              🌳 ${user.treesEquivalent} Trees Equivalent
            </div>
          </div>

          <!-- City Rank & Green Streak -->
          <div class="glass-card" style="padding: 1.5rem;">
            <div class="flex-between" style="margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Leaderboard Rank</span>
              <span style="font-size: 1.25rem;">🏆</span>
            </div>
            <div style="font-size: 2.1rem; font-weight: 800; color: var(--color-navy); line-height: 1;">
              #${user.rank} <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">/ Mumbai</span>
            </div>
            <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.35rem; font-size: 0.825rem; font-weight: 700; color: #EA580C;">
              <span class="animate-flame">🔥</span> ${user.greenStreakDays} Days Green Streak
            </div>
          </div>

        </div>

        <!-- Main Dashboard Split: Left Column (Quick Segregate + Challenges) | Right Column (Recent Pickups & Wallet Ledger) -->
        <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 2rem;" class="hero-grid">
          
          <!-- Left Column -->
          <div>
            
            <!-- Quick Segregate Cards -->
            <div class="glass-card" style="padding: 1.75rem; margin-bottom: 2rem;">
              <div class="flex-between" style="margin-bottom: 1.25rem;">
                <div>
                  <h3 style="color: var(--color-navy);">Quick Waste Disposal</h3>
                  <p style="font-size: 0.85rem;">Select category to create instant pickup request.</p>
                </div>
                <span class="badge badge-green">Instant Dispatch</span>
              </div>

              <div class="grid-cols-3">
                <div class="glass-card-interactive" style="background: var(--waste-wet-bg); border: 1.5px solid var(--waste-wet-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: center;" onclick="window.AppRouter.navigate('report-waste', { category: 'wet' })">
                  <div style="font-size: 2rem; margin-bottom: 0.4rem;">🟢</div>
                  <strong style="color: var(--waste-wet); display: block; font-size: 0.95rem;">Wet Waste</strong>
                  <span class="badge" style="background: #16A34A; color: #FFFFFF; margin-top: 0.5rem; font-size: 0.72rem;">+10 GC</span>
                </div>

                <div class="glass-card-interactive" style="background: var(--waste-dry-bg); border: 1.5px solid var(--waste-dry-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: center;" onclick="window.AppRouter.navigate('report-waste', { category: 'dry' })">
                  <div style="font-size: 2rem; margin-bottom: 0.4rem;">🔵</div>
                  <strong style="color: var(--waste-dry); display: block; font-size: 0.95rem;">Dry Waste</strong>
                  <span class="badge" style="background: #2563EB; color: #FFFFFF; margin-top: 0.5rem; font-size: 0.72rem;">+7 GC</span>
                </div>

                <div class="glass-card-interactive" style="background: var(--waste-harmful-bg); border: 1.5px solid var(--waste-harmful-border); padding: 1.25rem; border-radius: var(--radius-lg); text-align: center;" onclick="window.AppRouter.navigate('report-waste', { category: 'harmful' })">
                  <div style="font-size: 2rem; margin-bottom: 0.4rem;">🔴</div>
                  <strong style="color: var(--waste-harmful); display: block; font-size: 0.95rem;">Harmful Waste</strong>
                  <span class="badge" style="background: #EF4444; color: #FFFFFF; margin-top: 0.5rem; font-size: 0.72rem;">+5 GC</span>
                </div>
              </div>
            </div>

            <!-- Active Gamification Challenges -->
            <div class="glass-card" style="padding: 1.75rem;">
              <div class="flex-between" style="margin-bottom: 1.25rem;">
                <div>
                  <h3 style="color: var(--color-navy);">Weekly Eco Challenges</h3>
                  <p style="font-size: 0.85rem;">Complete challenges to earn bonus credits and rank multipliers.</p>
                </div>
                <button class="btn btn-sm btn-emerald-outline" onclick="window.AppRouter.navigate('leaderboard')">
                  View All
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                ${State.state.challenges.slice(0, 2).map(ch => `
                  <div style="background: #F8FAFC; border: 1px solid var(--color-border); padding: 1.15rem; border-radius: var(--radius-md);">
                    <div class="flex-between" style="margin-bottom: 0.5rem;">
                      <strong style="font-size: 0.92rem; color: var(--color-navy);">${ch.title}</strong>
                      <span class="badge badge-points">+${ch.rewardGp} GC</span>
                    </div>
                    <p style="font-size: 0.82rem; margin-bottom: 0.75rem;">${ch.description}</p>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
                      <span>Progress (${ch.current}/${ch.target})</span>
                      <span>${Math.round((ch.current / ch.target) * 100)}%</span>
                    </div>
                    <div style="height: 7px; background: #E2E8F0; border-radius: var(--radius-full); overflow: hidden;">
                      <div style="height: 100%; width: ${(ch.current / ch.target) * 100}%; background: linear-gradient(90deg, #16A34A, #84CC16); border-radius: var(--radius-full);"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Right Column: Recent Pickups & Fast Wallet Redeem -->
          <div>
            
            <!-- Green Wallet Quick Recharge Widget -->
            <div class="glass-card" style="padding: 1.75rem; margin-bottom: 2rem;">
              <div class="flex-between" style="margin-bottom: 1rem;">
                <h3 style="color: var(--color-navy);">Redeem Rewards</h3>
                <span style="font-size: 0.8rem; color: var(--color-primary-dark); font-weight: 700;">Balance: ${user.greenPoints} GC</span>
              </div>
              <p style="font-size: 0.85rem; margin-bottom: 1.25rem;">Instant one-click utility redemption with your Green Credits.</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
                <button class="btn btn-secondary" style="padding: 0.85rem; display: flex; flex-direction: column; gap: 0.25rem;" onclick="window.RewardsWallet.openRechargeModal()">
                  <span style="font-size: 1.4rem;">📱</span>
                  <span style="font-weight: 700; font-size: 0.85rem;">Mobile Recharge</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">From 100 GC (₹10)</span>
                </button>

                <button class="btn btn-secondary" style="padding: 0.85rem; display: flex; flex-direction: column; gap: 0.25rem;" onclick="window.RewardsWallet.openBillsModal()">
                  <span style="font-size: 1.4rem;">💡</span>
                  <span style="font-weight: 700; font-size: 0.85rem;">Utility Bills</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">Power / Water / Gas</span>
                </button>
              </div>
            </div>

            <!-- Recent Pickup Request History -->
            <div class="glass-card" style="padding: 1.75rem;">
              <div class="flex-between" style="margin-bottom: 1.25rem;">
                <h3 style="color: var(--color-navy);">Recent Waste Pickups</h3>
                <button class="btn btn-sm btn-emerald-outline" onclick="window.AppRouter.navigate('live-tracking')">
                  Track All
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${State.state.pickups.map(p => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <div style="font-size: 1.4rem;">
                        ${p.category === 'wet' ? '🟢' : p.category === 'dry' ? '🔵' : '🔴'}
                      </div>
                      <div>
                        <div style="font-size: 0.875rem; font-weight: 700; color: var(--color-navy);">${p.subType}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${Formatters.formatRelativeTime(p.createdAt)} &bull; ${p.quantityKg} kg</div>
                      </div>
                    </div>

                    <div style="text-align: right;">
                      ${p.status === 'verified' ? `
                        <span class="badge" style="background: #D1FAE5; color: #065F46;">+${p.pointsReward} GC ✓</span>
                      ` : p.status === 'on_the_way' ? `
                        <span class="badge" style="background: #FEF3C7; color: #92400E;">On Way 🚚</span>
                      ` : `
                        <span class="badge" style="background: #E2E8F0; color: #475569;">Assigned</span>
                      `}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  }
};

window.DashboardView = DashboardView;
