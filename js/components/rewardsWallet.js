/* ==========================================================================
   CLEANCRED — FINTECH GREEN WALLET & REWARDS STORE
   Tactile Neumorphism + Civic Technology
   Points Conversion: 100 Green Credits = ₹10 INR
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

export const RewardsWallet = {
  currentTab: 'all',

  render() {
    const container = document.getElementById('view-rewards');
    if (!container) return;

    const user = State.state.user;
    const inrValue = Formatters.gpToInr(user.greenPoints);

    // Derive lifetime earnings / redeemed value from ledger
    const lifetimeEarnedGp = State.state.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amountGp, 0);
    const lifetimeEarnedInr = Formatters.gpToInr(lifetimeEarnedGp);
    const avgEarningPerPickupInr = user.pickupsCompleted > 0
      ? Math.round((lifetimeEarnedInr / user.pickupsCompleted) * 100) / 100
      : 0;

    const totalRedeemedGp = State.state.transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amountGp, 0);
    const totalRedeemedInr = Formatters.gpToInr(totalRedeemedGp);

    container.innerHTML = `
      <div class="app-container" style="max-width: 1100px; margin: 0 auto; padding-top: 1rem; padding-bottom: 4rem;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="wallet" class="lucide-icon-sm"></i>
              <span>CleanCred Rewards Account</span>
            </div>
            <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Green Credits Wallet</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Verified recovery balance, municipal credits, and civic redemption catalog.</p>
          </div>

          <!-- Fast Conversion Banner -->
          <div class="neu-card-inset" style="padding: 0.6rem 1rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; color: var(--color-primary-dark); display: inline-flex; align-items: center; gap: 0.5rem; max-width: 100%; box-sizing: border-box;">
            <i data-lucide="scale" class="lucide-icon-sm"></i>
            <span>Standard Rate: 100 GC = ₹10 INR</span>
          </div>
        </div>

        <!-- 3-Card Wallet Overview -->
        <div class="rewards-overview-grid">
          
          <!-- Balance Card (Forest Raised) -->
          <div class="neu-card neu-card-forest rewards-card-primary" style="color: #FFFFFF;">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #DCFCE7;">Available Balance</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #047857; border: 1px solid #10B981; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="coins" class="lucide-icon-sm" style="color: #FFFFFF;"></i>
              </div>
            </div>
            <div class="rewards-card-amount">
              ${Formatters.formatNumber(user.greenPoints)} <span style="font-size: 1.25rem; font-weight: 600; opacity: 0.9;">GC</span>
            </div>
            <div style="font-size: 1rem; font-weight: 700; color: #DCFCE7;">
              ≈ ${Formatters.formatCurrency(inrValue)} real value
            </div>
            <div class="rewards-card-actions">
              <button class="btn btn-secondary btn-sm btn-recharge" onclick="window.RewardsWallet.openRechargeModal()">
                <i data-lucide="smartphone" class="lucide-icon-sm"></i>
                <span style="color: #064E3B;">Recharge</span>
              </button>
              <button class="btn btn-secondary btn-sm btn-paybills" onclick="window.RewardsWallet.openBillsModal()">
                <i data-lucide="file-text" class="lucide-icon-sm"></i>
                <span style="color: #FFFFFF;">Pay Bills</span>
              </button>
            </div>
          </div>

          <!-- Total Earned All-Time (Raised Tactile) -->
          <div class="neu-card neu-card-raised rewards-card-compact">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Lifetime Earnings</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="trending-up" class="lucide-icon-sm"></i>
              </div>
            </div>
            <div class="rewards-card-amount" style="color: var(--color-navy);">
              ${Formatters.formatNumber(lifetimeEarnedGp)} <span style="font-size: 1.25rem; font-weight: 600; color: var(--text-muted);">GC</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--color-primary-dark); font-weight: 700;">
              ≈ ${Formatters.formatCurrency(lifetimeEarnedInr)} via ${user.pickupsCompleted} verified pickups
            </div>
            <p class="rewards-avg-text" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 1rem; line-height: 1.4;">
              Average earning: ${Formatters.formatCurrency(avgEarningPerPickupInr)} per verified collection.
            </p>
          </div>

          <!-- Total Redeemed (Raised Tactile) -->
          <div class="neu-card neu-card-raised rewards-card-compact">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Redeemed Value</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #DBEAFE; color: #1E40AF; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="check-circle-2" class="lucide-icon-sm"></i>
              </div>
            </div>
            <div class="rewards-card-amount" style="color: var(--color-navy);">
              ${Formatters.formatNumber(totalRedeemedGp)} <span style="font-size: 1.25rem; font-weight: 600; color: var(--text-muted);">GC</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
              ${Formatters.formatCurrency(totalRedeemedInr)} redeemed (Recharge & Vouchers)
            </div>
            <div style="margin-top: 1.25rem;">
              <span class="badge badge-green" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <i data-lucide="shield-check" class="lucide-icon-sm"></i>
                <span>Aadhaar KYC Verified</span>
              </span>
            </div>
          </div>

        </div>

        <!-- Reward Store Catalogue Sections -->
        <div style="margin-bottom: 3.5rem;">
          <h3 style="color: var(--color-navy); font-size: 1.35rem; font-weight: 800; margin-bottom: 1.5rem;">Explore Instant Redemptions</h3>

          <!-- Category 1: Mobile Recharge -->
          <div style="margin-bottom: 2.5rem;">
            <div class="flex-between" style="margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="smartphone" class="lucide-icon-sm"></i>
                </div>
                <strong style="font-size: 1.1rem; color: var(--color-navy);">Mobile Prepaid Recharges</strong>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Instant Telecom Credit (Jio, Airtel, Vi)</span>
            </div>

            <div class="rewards-catalog-grid">
              <!-- ₹10 Plan -->
              <div class="neu-card neu-card-raised" style="text-align: center; border-top: 3px solid var(--color-primary);">
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-navy); margin-bottom: 0.25rem;">₹10</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.85rem;">Talktime / Topup</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">100 GC</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Mobile Topup ₹10', 100)">
                  Redeem ₹10
                </button>
              </div>

              <!-- ₹50 Plan -->
              <div class="neu-card neu-card-raised" style="text-align: center; border-top: 3px solid var(--color-primary);">
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-navy); margin-bottom: 0.25rem;">₹50</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.85rem;">Talktime + 5GB Data</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">500 GC</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Mobile Data Pack ₹50', 500)">
                  Redeem ₹50
                </button>
              </div>

              <!-- ₹100 Plan -->
              <div class="neu-card neu-card-raised" style="text-align: center; border-top: 3px solid var(--color-primary);">
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-navy); margin-bottom: 0.25rem;">₹100</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.85rem;">Full Talktime Pack</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">1,000 GC</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Full Talktime Pack ₹100', 1000)">
                  Redeem ₹100
                </button>
              </div>

              <!-- ₹200 Plan -->
              <div class="neu-card neu-card-raised" style="text-align: center; border-top: 3px solid var(--color-primary);">
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-navy); margin-bottom: 0.25rem;">₹200</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.85rem;">Unlimited 28-Day Plan</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">2,000 GC</div>
                <button class="btn btn-secondary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Unlimited 28-Day Plan ₹200', 2000)">
                  Redeem ₹200
                </button>
              </div>
            </div>
          </div>

          <!-- Category 2: Utility Bills & Municipal Fees -->
          <div style="margin-bottom: 2.5rem;">
            <div class="flex-between" style="margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="lightbulb" class="lucide-icon-sm"></i>
                </div>
                <strong style="font-size: 1.1rem; color: var(--color-navy);">Utility Bills &amp; Municipal Services</strong>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Direct Municipal Bill Credit</span>
            </div>

            <div class="rewards-catalog-grid">
              <!-- Electricity -->
              <div class="neu-card neu-card-raised" style="text-align: center;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
                  <i data-lucide="zap" class="lucide-icon-md"></i>
                </div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Electricity Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Tata Power / BESCOM / Adani</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹50 Off (500 GC)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Electricity')">
                  Pay Bill
                </button>
              </div>

              <!-- Water -->
              <div class="neu-card neu-card-raised" style="text-align: center;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #DBEAFE; color: #1E40AF; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
                  <i data-lucide="droplets" class="lucide-icon-md"></i>
                </div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Water Board Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Municipal Corporation Jal Board</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹50 Off (500 GC)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Water')">
                  Pay Bill
                </button>
              </div>

              <!-- Piped Gas -->
              <div class="neu-card neu-card-raised" style="text-align: center;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
                  <i data-lucide="flame" class="lucide-icon-md"></i>
                </div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Piped Gas Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Mahanagar Gas / IGL / Adani</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹50 Off (500 GC)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Gas')">
                  Pay Bill
                </button>
              </div>

              <!-- Broadband -->
              <div class="neu-card neu-card-raised" style="text-align: center;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #EDE9FE; color: #6D28D9; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
                  <i data-lucide="wifi" class="lucide-icon-md"></i>
                </div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Broadband Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Airtel Fiber / JioFiber / ACT</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹100 Off (1,000 GC)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Broadband')">
                  Pay Bill
                </button>
              </div>
            </div>
          </div>

          <!-- Category 3: Eco Shopping & Cafes -->
          <div>
            <div class="flex-between" style="margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="shopping-bag" class="lucide-icon-sm"></i>
                </div>
                <strong style="font-size: 1.1rem; color: var(--color-navy);">Eco-Friendly Brand Vouchers & Cafes</strong>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">EPR Partner Merchant Network</span>
            </div>

            <div class="rewards-catalog-grid">
              <div class="neu-card neu-card-raised">
                <div class="badge badge-green" style="margin-bottom: 0.5rem;">Organic Grocery</div>
                <strong style="color: var(--color-navy); display: block;">BigBasket Organic</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">₹100 Voucher on min ₹500 grocery.</p>
                <div class="flex-between">
                  <span class="badge badge-points">1,000 GC</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('SHOPPING', 'BigBasket Organic ₹100 Voucher', 1000)">
                    Claim
                  </button>
                </div>
              </div>

              <div class="neu-card neu-card-raised">
                <div class="badge" style="background: #FEF3C7; color: #B45309; margin-bottom: 0.5rem;">Sustainable</div>
                <strong style="color: var(--color-navy); display: block;">Bamboo India Store</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">₹50 Gift Card for eco toothbrushes & kits.</p>
                <div class="flex-between">
                  <span class="badge badge-points">500 GC</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('SHOPPING', 'Bamboo India ₹50 Voucher', 500)">
                    Claim
                  </button>
                </div>
              </div>

              <div class="neu-card neu-card-raised">
                <div class="badge badge-navy" style="margin-bottom: 0.5rem;">Cafe Partner</div>
                <strong style="color: var(--color-navy); display: block;">Starbucks Coffee</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">Free reusable bamboo tumbler with refill.</p>
                <div class="flex-between">
                  <span class="badge badge-points">1,200 GC</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('CAFE', 'Starbucks Eco Tumbler Voucher', 1200)">
                    Claim
                  </button>
                </div>
              </div>

              <div class="neu-card neu-card-raised">
                <div class="badge badge-green" style="margin-bottom: 0.5rem;">Healthy Food</div>
                <strong style="color: var(--color-navy); display: block;">Subway Green Meal</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">₹50 discount on organic salad subs.</p>
                <div class="flex-between">
                  <span class="badge badge-points">500 GC</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('CAFE', 'Subway ₹50 Meal Discount', 500)">
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-Time Transaction Ledger -->
        <div class="neu-card neu-card-raised" style="border-radius: var(--radius-xl);">
          <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--color-navy); font-size: 1.3rem; font-weight: 800; margin: 0 0 0.25rem 0;">Wallet Transaction Ledger</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Immutable client-side record of verified waste earnings and civic redemptions.</p>
            </div>

            <!-- Filter Tabs -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-sm ${this.currentTab === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="window.RewardsWallet.filterLedger('all')">
                All
              </button>
              <button class="btn btn-sm ${this.currentTab === 'credit' ? 'btn-primary' : 'btn-secondary'}" onclick="window.RewardsWallet.filterLedger('credit')">
                Credits (+GC)
              </button>
              <button class="btn btn-sm ${this.currentTab === 'debit' ? 'btn-primary' : 'btn-secondary'}" onclick="window.RewardsWallet.filterLedger('debit')">
                Debits (-GC)
              </button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${State.state.transactions
              .filter(t => this.currentTab === 'all' || t.type === this.currentTab)
              .map(t => `
                <div class="neu-card-flat" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-md); flex-wrap: wrap; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0; flex: 1 1 130px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${t.type === 'credit' ? '#DCFCE7' : '#FEE2E2'}; color: ${t.type === 'credit' ? '#16A34A' : '#EF4444'}; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">
                      <i data-lucide="${t.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right'}" class="lucide-icon-sm"></i>
                    </div>
                    <div style="min-width: 0; word-break: break-word;">
                      <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">${t.title}</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted); word-break: break-all;">
                        ${Formatters.formatDateTime(t.date)} &bull; Ref: ${t.id} ${t.meta ? `&bull; ${t.meta}` : ''}
                      </div>
                    </div>
                  </div>

                  <div style="text-align: right; margin-left: auto;">
                    <div style="font-size: 1.15rem; font-weight: 800; color: ${t.type === 'credit' ? 'var(--color-primary-dark)' : '#EF4444'};">
                      ${t.type === 'credit' ? '+' : '-'}${t.amountGp} GC
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">
                      ${t.type === 'credit' ? '+' : '-'}${Formatters.formatCurrency(t.equivalentInr)}
                    </div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>

      </div>

      <!-- Mobile Recharge Modal Shell -->
      <div class="modal-overlay" id="recharge-modal">
        <div class="modal-content neu-card neu-card-raised" style="max-width: 460px;">
          <div class="modal-close-btn" onclick="window.RewardsWallet.closeModals()">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="smartphone" class="lucide-icon-md"></i>
            </div>
            <div>
              <h3 style="color: var(--color-navy); margin: 0; font-size: 1.2rem;">Instant Mobile Recharge</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">Recharge prepaid numbers using your Green Credits balance.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <input type="tel" class="form-input neu-input" id="recharge-phone" placeholder="Enter 10-digit mobile number" value="9876543210">
          </div>

          <div class="form-group">
            <label class="form-label">Telecom Operator</label>
            <select class="form-select neu-input" id="recharge-operator">
              <option value="Jio">Reliance Jio Prepaid</option>
              <option value="Airtel">Bharti Airtel</option>
              <option value="Vi">Vodafone Idea (Vi)</option>
              <option value="BSNL">BSNL Prepaid</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Select Recharge Plan</label>
            <select class="form-select neu-input" id="recharge-amount">
              <option value="100">₹10 Talktime (100 Green Credits)</option>
              <option value="500">₹50 Data Pack (500 Green Credits)</option>
              <option value="1000">₹100 Full Talktime (1,000 Green Credits)</option>
              <option value="2000">₹200 28-Day Unlimited (2,000 Green Credits)</option>
            </select>
          </div>

          <div class="neu-card-inset" style="padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; font-size: 0.85rem;">
            <div class="flex-between">
              <span style="color: var(--text-muted);">Current Available Balance:</span>
              <strong style="color: var(--color-primary-dark);">${user.greenPoints} GC (₹${inrValue})</strong>
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="window.RewardsWallet.submitRecharge()">
            Proceed & Deduct Points
          </button>
        </div>
      </div>

      <!-- Utility Bills Modal Shell -->
      <div class="modal-overlay" id="bills-modal">
        <div class="modal-content neu-card neu-card-raised" style="max-width: 460px;">
          <div class="modal-close-btn" onclick="window.RewardsWallet.closeModals()">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="lightbulb" class="lucide-icon-md"></i>
            </div>
            <div>
              <h3 style="color: var(--color-navy); margin: 0; font-size: 1.2rem;">Pay Utility Bill</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">Apply Green Credits as direct discount on municipal bills.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Service Type</label>
            <select class="form-select neu-input" id="bill-service">
              <option value="Electricity">Electricity Board (Tata Power / BESCOM)</option>
              <option value="Water">Municipal Water Board</option>
              <option value="Gas">Piped Gas (MGL / IGL)</option>
              <option value="Broadband">Broadband Internet</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Consumer / Account ID</label>
            <input type="text" class="form-input neu-input" id="bill-consumer-id" placeholder="e.g. 1029481029" value="1092834019">
          </div>

          <div class="form-group">
            <label class="form-label">Redeem Value</label>
            <select class="form-select neu-input" id="bill-gp-amount">
              <option value="500">₹50 Bill Discount (500 Green Credits)</option>
              <option value="1000">₹100 Bill Discount (1,000 Green Credits)</option>
            </select>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="window.RewardsWallet.submitBillPayment()">
            Confirm Bill Payment
          </button>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  openRechargeModal() {
    SoundFX.playClick();
    const modal = document.getElementById('recharge-modal');
    if (modal) {
      modal.classList.add('active');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  openBillsModal(serviceName = null) {
    SoundFX.playClick();
    const modal = document.getElementById('bills-modal');
    if (modal) {
      if (serviceName) {
        const select = document.getElementById('bill-service');
        if (select) select.value = serviceName;
      }
      modal.classList.add('active');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  closeModals() {
    SoundFX.playClick();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  },

  redeemQuick(cat, title, amountGp) {
    const res = State.redeemPoints(cat, title, amountGp);
    if (res.success) {
      SoundFX.playRedeemCash();
      Confetti.trigger(75);
      window.AppRouter.showToast(`Redeemed ${title} (-${amountGp} GC)`);
      this.render();
    } else {
      alert(res.message || 'Insufficient Green Credits balance');
    }
  },

  submitRecharge() {
    const phone = document.getElementById('recharge-phone').value;
    const operator = document.getElementById('recharge-operator').value;
    const amountGp = parseInt(document.getElementById('recharge-amount').value);

    const res = State.redeemPoints('RECHARGE', `${operator} Mobile Recharge ₹${Formatters.gpToInr(amountGp)}`, amountGp, `Mob: ${phone} (${operator})`);
    if (res.success) {
      this.closeModals();
      SoundFX.playRedeemCash();
      Confetti.trigger(90);
      window.AppRouter.showToast(`Recharge of ₹${Formatters.gpToInr(amountGp)} successful!`);
      this.render();
    } else {
      alert(res.message);
    }
  },

  submitBillPayment() {
    const service = document.getElementById('bill-service').value;
    const consumerId = document.getElementById('bill-consumer-id').value;
    const amountGp = parseInt(document.getElementById('bill-gp-amount').value);

    const res = State.redeemPoints('BILL', `${service} Bill Payment ₹${Formatters.gpToInr(amountGp)}`, amountGp, `Consumer ID: ${consumerId}`);
    if (res.success) {
      this.closeModals();
      SoundFX.playRedeemCash();
      Confetti.trigger(90);
      window.AppRouter.showToast(`${service} bill discount applied (-${amountGp} GC)`);
      this.render();
    } else {
      alert(res.message);
    }
  },

  filterLedger(tab) {
    SoundFX.playClick();
    this.currentTab = tab;
    this.render();
  }
};

window.RewardsWallet = RewardsWallet;
