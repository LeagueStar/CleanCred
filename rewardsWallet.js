/* ==========================================================================
   GREEN KARMA — FINTECH GREEN WALLET & REWARDS STORE
   Points Conversion: 100 Green Points = ₹10 INR
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

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem;">
              <span>🌱</span> Green Karma Fintech Wallet
            </div>
            <h2>Green Points & Rewards Store</h2>
            <p>Convert responsible waste disposal into real-world utility savings and shopping vouchers.</p>
          </div>

          <!-- Fast Conversion Banner -->
          <div style="background: rgba(22, 163, 74, 0.1); border: 1.5px solid var(--color-primary); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; color: var(--color-primary-dark);">
            ⚡ Conversion Rate: 100 GP = ₹10 INR
          </div>
        </div>

        <!-- 3-Card Wallet Overview -->
        <div class="grid-cols-3" style="margin-bottom: 2.5rem;">
          
          <!-- Balance Card -->
          <div class="glass-card glass-card-emerald" style="padding: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #DCFCE7;">Available Green Balance</span>
              <span style="font-size: 1.5rem;">💳</span>
            </div>
            <div style="font-size: 2.8rem; font-weight: 900; color: #FFFFFF; line-height: 1;">
              ${Formatters.formatNumber(user.greenPoints)} <span style="font-size: 1.25rem; font-weight: 600;">GP</span>
            </div>
            <div style="margin-top: 0.75rem; font-size: 1.05rem; font-weight: 700; color: #DCFCE7;">
              ≈ ${Formatters.formatCurrency(inrValue)} Real Cash Value
            </div>
            <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
              <button class="btn btn-secondary btn-sm" style="background: #FFFFFF; color: var(--color-primary-dark);" onclick="window.RewardsWallet.openRechargeModal()">
                📱 Recharge
              </button>
              <button class="btn btn-secondary btn-sm" style="background: rgba(255,255,255,0.2); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.4);" onclick="window.RewardsWallet.openBillsModal()">
                💡 Pay Bills
              </button>
            </div>
          </div>

          <!-- Total Earned All-Time -->
          <div class="glass-card" style="padding: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Lifetime Earnings</span>
              <span style="font-size: 1.5rem;">📈</span>
            </div>
            <div style="font-size: 2.8rem; font-weight: 900; color: var(--color-navy); line-height: 1;">
              1,680 <span style="font-size: 1.25rem; font-weight: 600; color: var(--text-muted);">GP</span>
            </div>
            <div style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--color-primary); font-weight: 700;">
              ≈ ₹168.00 Earned via 18 Pickups
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1rem;">Average earning: ₹28.50 per week through segregated disposal.</p>
          </div>

          <!-- Total Redeemed -->
          <div class="glass-card" style="padding: 2rem; border-radius: var(--radius-xl);">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Redeemed Value</span>
              <span style="font-size: 1.5rem;">🎁</span>
            </div>
            <div style="font-size: 2.8rem; font-weight: 900; color: var(--color-navy); line-height: 1;">
              430 <span style="font-size: 1.25rem; font-weight: 600; color: var(--text-muted);">GP</span>
            </div>
            <div style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
              ₹43.00 Redeemed (Recharge & Vouchers)
            </div>
            <div style="margin-top: 1.25rem;">
              <span class="badge badge-green">KYC Verified Wallet ✓</span>
            </div>
          </div>

        </div>

        <!-- Reward Store Catalogue Sections -->
        <div style="margin-bottom: 3.5rem;">
          <h3 style="color: var(--color-navy); margin-bottom: 1.5rem;">Explore Instant Redemptions</h3>

          <!-- Category 1: Mobile Recharge -->
          <div style="margin-bottom: 2.5rem;">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">📱</span>
                <strong style="font-size: 1.15rem; color: var(--color-navy);">Mobile Prepaid Recharges</strong>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Instant OTP Credit (Jio, Airtel, Vi)</span>
            </div>

            <div class="grid-cols-4">
              
              <!-- ₹10 Plan -->
              <div class="glass-card" style="padding: 1.25rem; text-align: center; border-top: 4px solid var(--color-primary);">
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-navy); margin-bottom: 0.25rem;">₹10</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">Talktime / Topup</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">100 GP</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Mobile Topup ₹10', 100)">
                  Redeem ₹10
                </button>
              </div>

              <!-- ₹50 Plan -->
              <div class="glass-card" style="padding: 1.25rem; text-align: center; border-top: 4px solid var(--color-primary);">
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-navy); margin-bottom: 0.25rem;">₹50</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">Talktime + 5GB Data</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">500 GP</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Mobile Data Pack ₹50', 500)">
                  Redeem ₹50
                </button>
              </div>

              <!-- ₹100 Plan -->
              <div class="glass-card" style="padding: 1.25rem; text-align: center; border-top: 4px solid var(--color-primary);">
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-navy); margin-bottom: 0.25rem;">₹100</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">Full Talktime Pack</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">1,000 GP</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Full Talktime Pack ₹100', 1000)">
                  Redeem ₹100
                </button>
              </div>

              <!-- ₹200 Plan -->
              <div class="glass-card" style="padding: 1.25rem; text-align: center; border-top: 4px solid var(--color-primary);">
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-navy); margin-bottom: 0.25rem;">₹200</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">Unlimited 28-Day Plan</div>
                <div class="badge badge-points" style="margin-bottom: 1rem;">2,000 GP</div>
                <button class="btn btn-secondary btn-sm btn-block" onclick="window.RewardsWallet.redeemQuick('RECHARGE', 'Unlimited 28-Day Plan ₹200', 2000)">
                  Redeem ₹200
                </button>
              </div>

            </div>
          </div>

          <!-- Category 2: Utility Bills & Municipal Fees -->
          <div style="margin-bottom: 2.5rem;">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">💡</span>
                <strong style="font-size: 1.15rem; color: var(--color-navy);">Utility Bills & Municipal Services</strong>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Direct Bill Deduction</span>
            </div>

            <div class="grid-cols-4">
              
              <div class="glass-card" style="padding: 1.25rem; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.35rem;">⚡</div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Electricity Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Tata Power / BESCOM / Adani</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹50 Off (500 GP)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Electricity')">
                  Pay Bill
                </button>
              </div>

              <div class="glass-card" style="padding: 1.25rem; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.35rem;">💧</div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Water Board Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Municipal Corporation Jal Board</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹50 Off (500 GP)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Water')">
                  Pay Bill
                </button>
              </div>

              <div class="glass-card" style="padding: 1.25rem; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.35rem;">🔥</div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Piped Gas Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Mahanagar Gas / IGL / Adani</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹50 Off (500 GP)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Gas')">
                  Pay Bill
                </button>
              </div>

              <div class="glass-card" style="padding: 1.25rem; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.35rem;">🌐</div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Broadband Bill</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.85rem;">Airtel Fiber / JioFiber / ACT</p>
                <div class="badge badge-points" style="margin-bottom: 1rem;">₹100 Off (1,000 GP)</div>
                <button class="btn btn-emerald-outline btn-sm btn-block" onclick="window.RewardsWallet.openBillsModal('Broadband')">
                  Pay Bill
                </button>
              </div>

            </div>
          </div>

          <!-- Category 3: Eco Shopping & Cafes -->
          <div>
            <div class="flex-between" style="margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">🛍️</span>
                <strong style="font-size: 1.15rem; color: var(--color-navy);">Eco-Friendly Brand Vouchers & Cafes</strong>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Partner Discounts</span>
            </div>

            <div class="grid-cols-4">
              
              <div class="glass-card" style="padding: 1.25rem;">
                <div class="badge badge-green" style="margin-bottom: 0.5rem;">Organic Store</div>
                <strong style="color: var(--color-navy); display: block;">BigBasket Organic</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">₹100 Voucher on min ₹500 grocery.</p>
                <div class="flex-between">
                  <span class="badge badge-points">1,000 GP</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('SHOPPING', 'BigBasket Organic ₹100 Voucher', 1000)">
                    Claim
                  </button>
                </div>
              </div>

              <div class="glass-card" style="padding: 1.25rem;">
                <div class="badge" style="background: #FEF3C7; color: #B45309; margin-bottom: 0.5rem;">Sustainable</div>
                <strong style="color: var(--color-navy); display: block;">Bamboo India Store</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">₹50 Gift Card for eco toothbrushes & kits.</p>
                <div class="flex-between">
                  <span class="badge badge-points">500 GP</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('SHOPPING', 'Bamboo India ₹50 Voucher', 500)">
                    Claim
                  </button>
                </div>
              </div>

              <div class="glass-card" style="padding: 1.25rem;">
                <div class="badge badge-navy" style="margin-bottom: 0.5rem;">Cafe Partner</div>
                <strong style="color: var(--color-navy); display: block;">Starbucks Coffee</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">Free reusable bamboo tumbler with refill.</p>
                <div class="flex-between">
                  <span class="badge badge-points">1,200 GP</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('CAFE', 'Starbucks Eco Tumbler Voucher', 1200)">
                    Claim
                  </button>
                </div>
              </div>

              <div class="glass-card" style="padding: 1.25rem;">
                <div class="badge badge-green" style="margin-bottom: 0.5rem;">Healthy Food</div>
                <strong style="color: var(--color-navy); display: block;">Subway Green Meal</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.25rem 0 1rem 0;">₹50 discount on organic salad subs.</p>
                <div class="flex-between">
                  <span class="badge badge-points">500 GP</span>
                  <button class="btn btn-primary btn-sm" onclick="window.RewardsWallet.redeemQuick('CAFE', 'Subway ₹50 Meal Discount', 500)">
                    Claim
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Real-Time Transaction Ledger -->
        <div class="glass-card" style="padding: 2rem;">
          <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--color-navy);">Wallet Transaction Ledger</h3>
              <p style="font-size: 0.85rem;">Transparent record of all waste earnings and reward disbursements.</p>
            </div>

            <!-- Filters -->
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm ${this.currentTab === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="window.RewardsWallet.filterLedger('all')">
                All
              </button>
              <button class="btn btn-sm ${this.currentTab === 'credit' ? 'btn-primary' : 'btn-secondary'}" onclick="window.RewardsWallet.filterLedger('credit')">
                Credits (+GP)
              </button>
              <button class="btn btn-sm ${this.currentTab === 'debit' ? 'btn-primary' : 'btn-secondary'}" onclick="window.RewardsWallet.filterLedger('debit')">
                Debits (-GP)
              </button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${State.state.transactions
              .filter(t => this.currentTab === 'all' || t.type === this.currentTab)
              .map(t => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 42px; height: 42px; border-radius: 50%; background: ${t.type === 'credit' ? '#DCFCE7' : '#FEE2E2'}; color: ${t.type === 'credit' ? '#16A34A' : '#EF4444'}; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; font-weight: 800;">
                      ${t.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">${t.title}</strong>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">
                        ${Formatters.formatDateTime(t.date)} &bull; Ref: ${t.id} ${t.meta ? `&bull; ${t.meta}` : ''}
                      </div>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <div style="font-size: 1.15rem; font-weight: 800; color: ${t.type === 'credit' ? 'var(--color-primary-dark)' : '#EF4444'};">
                      ${t.type === 'credit' ? '+' : '-'}${t.amountGp} GP
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
        <div class="modal-content">
          <div class="modal-close-btn" onclick="window.RewardsWallet.closeModals()">✕</div>
          
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <span style="font-size: 2rem;">📱</span>
            <div>
              <h3 style="color: var(--color-navy);">Instant Mobile Recharge</h3>
              <p style="font-size: 0.85rem;">Recharge prepaid numbers using your Green Points balance.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <input type="tel" class="form-input" id="recharge-phone" placeholder="Enter 10-digit mobile number" value="9876543210">
          </div>

          <div class="form-group">
            <label class="form-label">Telecom Operator</label>
            <select class="form-select" id="recharge-operator">
              <option value="Jio">Reliance Jio Prepaid</option>
              <option value="Airtel">Bharti Airtel</option>
              <option value="Vi">Vodafone Idea (Vi)</option>
              <option value="BSNL">BSNL Prepaid</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Select Recharge Plan</label>
            <select class="form-select" id="recharge-amount">
              <option value="100">₹10 Talktime (100 Green Points)</option>
              <option value="500">₹50 Data Pack (500 Green Points)</option>
              <option value="1000">₹100 Full Talktime (1,000 Green Points)</option>
              <option value="2000">₹200 28-Day Unlimited (2,000 Green Points)</option>
            </select>
          </div>

          <div style="background: var(--waste-wet-bg); border: 1.5px solid var(--waste-wet-border); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.85rem;">
            <div class="flex-between">
              <span>Your GP Balance:</span>
              <strong>${user.greenPoints} GP (₹${inrValue})</strong>
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="window.RewardsWallet.submitRecharge()">
            Proceed & Deduct Points ⚡
          </button>
        </div>
      </div>

      <!-- Utility Bills Modal Shell -->
      <div class="modal-overlay" id="bills-modal">
        <div class="modal-content">
          <div class="modal-close-btn" onclick="window.RewardsWallet.closeModals()">✕</div>
          
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <span style="font-size: 2rem;">💡</span>
            <div>
              <h3 style="color: var(--color-navy);">Pay Utility Bill</h3>
              <p style="font-size: 0.85rem;">Apply Green Karma points as direct discount on municipal bills.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Service Type</label>
            <select class="form-select" id="bill-service">
              <option value="Electricity">Electricity Board (Tata Power / BESCOM)</option>
              <option value="Water">Municipal Water Board</option>
              <option value="Gas">Piped Gas (MGL / IGL)</option>
              <option value="Broadband">Broadband Internet</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Consumer / Account ID</label>
            <input type="text" class="form-input" id="bill-consumer-id" placeholder="e.g. 1029481029" value="1092834019">
          </div>

          <div class="form-group">
            <label class="form-label">Redeem Value</label>
            <select class="form-select" id="bill-gp-amount">
              <option value="500">₹50 Bill Discount (500 Green Points)</option>
              <option value="1000">₹100 Bill Discount (1,000 Green Points)</option>
            </select>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="window.RewardsWallet.submitBillPayment()">
            Confirm Bill Payment ⚡
          </button>
        </div>
      </div>
    `;
  },

  openRechargeModal() {
    SoundFX.playClick();
    const modal = document.getElementById('recharge-modal');
    if (modal) modal.classList.add('active');
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
      this.render();
    } else {
      alert(res.message || 'Insufficient Green Points balance');
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
