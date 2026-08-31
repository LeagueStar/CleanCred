/* ==========================================================================
   GREEN KARMA — GAMIFIED LEADERBOARD, BADGES & CHALLENGES
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

export const LeaderboardView = {
  currentTab: 'city',

  render() {
    const container = document.getElementById('view-leaderboard');
    if (!container) return;

    const list = State.state.leaderboards[this.currentTab] || State.state.leaderboards.city;
    const top3 = list.slice(0, 3);
    const rest = list.slice(3);

    container.innerHTML = `
      <div class="app-container">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem;">
              <span>🏆</span> Gamified Citizen Ranking
            </div>
            <h2>Eco Leaderboard & Badges</h2>
            <p>Compete with citizens, colleges, and neighborhoods to build a cleaner future.</p>
          </div>

          <!-- Highlight Current Rank Pill -->
          <div style="background: linear-gradient(135deg, #0B5D3B, #16A34A); color: #FFFFFF; padding: 0.75rem 1.25rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 1.8rem;">🔥</div>
            <div>
              <div style="font-size: 0.75rem; color: #DCFCE7; font-weight: 700; text-transform: uppercase;">Your Current Standing</div>
              <strong style="font-size: 1.1rem; color: #FFFFFF;">#12 Shivansh Prajapati (1,250 GP)</strong>
              <div style="font-size: 0.75rem; color: #84CC16;">You are only 120 points away from #10! 🚀</div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 2.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
          <button class="btn btn-sm ${this.currentTab === 'city' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('city')">
            🏙️ City (Mumbai)
          </button>
          <button class="btn btn-sm ${this.currentTab === 'neighborhood' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('neighborhood')">
            🏘️ Ward 4B Neighborhood
          </button>
          <button class="btn btn-sm ${this.currentTab === 'global' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('global')">
            🌍 Global National
          </button>
          <button class="btn btn-sm ${this.currentTab === 'college' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('college')">
            🎓 Colleges & Universities
          </button>
          <button class="btn btn-sm ${this.currentTab === 'school' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('school')">
            🏫 Schools & Green Clubs
          </button>
        </div>

        <!-- 3-Place Podium Section -->
        <div style="background: linear-gradient(180deg, rgba(22,163,74,0.06) 0%, rgba(255,255,255,0.9) 100%); border-radius: var(--radius-xl); padding: 2.5rem 1.5rem 1.5rem 1.5rem; margin-bottom: 2.5rem; border: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: center; align-items: flex-end; gap: 1.5rem; max-width: 720px; margin: 0 auto;" class="points-podium">
            
            <!-- Rank 2 (Silver) -->
            ${top3[1] ? `
              <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">🥈</div>
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #E2E8F0; border: 3px solid #94A3B8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: #475569; margin-bottom: 0.5rem;">
                  ${top3[1].avatar}
                </div>
                <strong style="font-size: 0.95rem; color: var(--color-navy); display: block;">${top3[1].name}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${top3[1].location}</span>
                <div style="background: #E2E8F0; width: 100%; height: 110px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; color: #334155;">
                  <span style="font-size: 1.15rem;">${top3[1].points} GP</span>
                  <span style="font-size: 0.75rem; color: #64748B;">${top3[1].wasteKg} KG Waste</span>
                </div>
              </div>
            ` : ''}

            <!-- Rank 1 (Gold) -->
            ${top3[0] ? `
              <div style="flex: 1.15; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="font-size: 2.4rem; margin-bottom: 0.25rem;">👑 🥇</div>
                <div style="width: 72px; height: 72px; border-radius: 50%; background: #FEF3C7; border: 4px solid #F59E0B; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.4rem; color: #B45309; margin-bottom: 0.5rem; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);" class="animate-pulse-glow">
                  ${top3[0].avatar}
                </div>
                <strong style="font-size: 1.05rem; color: var(--color-navy); display: block;">${top3[0].name}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${top3[0].location}</span>
                <div style="background: linear-gradient(180deg, #FDE68A, #F59E0B); width: 100%; height: 145px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; color: #78350F; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);">
                  <span style="font-size: 1.35rem;">${top3[0].points} GP</span>
                  <span style="font-size: 0.8rem; color: #92400E;">${top3[0].wasteKg} KG Waste</span>
                </div>
              </div>
            ` : ''}

            <!-- Rank 3 (Bronze) -->
            ${top3[2] ? `
              <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">🥉</div>
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #FED7AA; border: 3px solid #EA580C; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: #9A3412; margin-bottom: 0.5rem;">
                  ${top3[2].avatar}
                </div>
                <strong style="font-size: 0.95rem; color: var(--color-navy); display: block;">${top3[2].name}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${top3[2].location}</span>
                <div style="background: #FED7AA; width: 100%; height: 85px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; color: #7C2D12;">
                  <span style="font-size: 1.15rem;">${top3[2].points} GP</span>
                  <span style="font-size: 0.75rem; color: #9A3412;">${top3[2].wasteKg} KG Waste</span>
                </div>
              </div>
            ` : ''}

          </div>
        </div>

        <!-- 2-Column Section: Detailed Ranked List (Left) & Collectible Badges + Challenges (Right) -->
        <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 2rem;" class="hero-grid">
          
          <!-- Left: Full Leaderboard List -->
          <div class="glass-card" style="padding: 1.75rem;">
            <h3 style="color: var(--color-navy); margin-bottom: 1.25rem;">Full Standings</h3>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${list.map(u => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.25rem; border-radius: var(--radius-md); border: 1.5px solid ${u.isUser ? 'var(--color-primary)' : 'var(--color-border)'}; background: ${u.isUser ? '#ECFDF5' : '#F8FAFC'};">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.1rem; font-weight: 800; color: ${u.rank <= 3 ? '#F59E0B' : 'var(--text-muted)'}; width: 28px;">
                      #${u.rank}
                    </span>
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: ${u.isUser ? 'var(--color-primary-dark)' : '#E2E8F0'}; color: ${u.isUser ? '#FFFFFF' : '#1E293B'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
                      ${u.avatar}
                    </div>
                    <div>
                      <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">
                        ${u.name} ${u.isUser ? '<span class="badge badge-green" style="font-size: 0.65rem; padding: 2px 6px;">You</span>' : ''}
                      </strong>
                      <span style="font-size: 0.75rem; color: var(--text-muted);">${u.location} &bull; ${u.wasteKg} KG Segregated</span>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <span class="badge badge-points" style="font-size: 0.85rem;">${Formatters.formatNumber(u.points)} GP</span>
                    ${u.streak ? `
                      <div style="font-size: 0.72rem; color: #EA580C; font-weight: 700; margin-top: 2px;">
                        🔥 ${u.streak}d streak
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Badges Showcase & Weekly Challenges -->
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            
            <!-- Badges Section -->
            <div class="glass-card" style="padding: 1.75rem;">
              <div class="flex-between" style="margin-bottom: 1.25rem;">
                <h3 style="color: var(--color-navy);">Collectible Badges</h3>
                <span class="badge badge-green">4 / 7 Unlocked</span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 1rem; text-align: center;">
                ${State.state.badges.map(b => `
                  <div class="glass-card-interactive" style="padding: 0.85rem 0.5rem; border-radius: var(--radius-md); border: 1px solid ${b.unlocked ? 'var(--color-primary-light)' : '#CBD5E1'}; background: ${b.unlocked ? '#F0FDF4' : '#F1F5F9'}; opacity: ${b.unlocked ? '1' : '0.65'};" onclick="window.LeaderboardView.showBadgeDetails('${b.id}')">
                    <div style="font-size: 2rem; margin-bottom: 0.25rem; filter: ${b.unlocked ? 'none' : 'grayscale(100%)'};">
                      ${b.icon}
                    </div>
                    <strong style="font-size: 0.75rem; color: var(--color-navy); display: block; line-height: 1.2;">${b.name}</strong>
                    <div style="font-size: 0.65rem; color: ${b.unlocked ? 'var(--color-primary)' : 'var(--text-muted)'}; margin-top: 0.25rem;">
                      ${b.unlocked ? 'Unlocked ✓' : `${b.progress || 0}%`}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Active Challenges -->
            <div class="glass-card" style="padding: 1.75rem;">
              <h3 style="color: var(--color-navy); margin-bottom: 1rem;">Active Civic Challenges</h3>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${State.state.challenges.map(c => `
                  <div style="padding: 1rem; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                    <div class="flex-between" style="margin-bottom: 0.35rem;">
                      <strong style="color: var(--color-navy); font-size: 0.88rem;">${c.title}</strong>
                      <span class="badge badge-points">+${c.rewardGp} GP</span>
                    </div>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.65rem;">${c.description}</p>
                    
                    <div class="flex-between" style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">
                      <span>Progress: ${c.current} / ${c.target}</span>
                      <span>${Math.round((c.current / c.target) * 100)}%</span>
                    </div>
                    <div style="height: 6px; background: #E2E8F0; border-radius: var(--radius-full); overflow: hidden;">
                      <div style="height: 100%; width: ${(c.current / c.target) * 100}%; background: linear-gradient(90deg, #16A34A, #84CC16);"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- Badge Detail Modal -->
      <div class="modal-overlay" id="badge-modal">
        <div class="modal-content" style="text-align: center;">
          <div class="modal-close-btn" onclick="document.getElementById('badge-modal').classList.remove('active')">✕</div>
          <div id="badge-modal-body"></div>
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    SoundFX.playClick();
    this.currentTab = tab;
    this.render();
  },

  showBadgeDetails(badgeId) {
    SoundFX.playClick();
    const badge = State.state.badges.find(b => b.id === badgeId);
    if (!badge) return;

    const modalBody = document.getElementById('badge-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">${badge.icon}</div>
        <h2 style="color: var(--color-navy); margin-bottom: 0.5rem;">${badge.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">${badge.description}</p>
        
        <div style="background: #F8FAFC; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
          ${badge.unlocked ? `
            <span style="color: var(--color-primary-dark); font-weight: 800;">🎉 Unlocked on ${badge.unlockedAt}</span>
          ` : `
            <span style="color: var(--text-muted); font-weight: 700;">Locked &bull; Current Progress: ${badge.progress}%</span>
          `}
        </div>

        ${badge.unlocked ? `
          <button class="btn btn-primary btn-block" onclick="window.Confetti.trigger(100); SoundFX.playPointsEarned();">
            Celebrate Badge 🎊
          </button>
        ` : `
          <button class="btn btn-secondary btn-block" onclick="document.getElementById('badge-modal').classList.remove('active')">
            Close
          </button>
        `}
      `;

      document.getElementById('badge-modal').classList.add('active');
    }
  }
};

window.LeaderboardView = LeaderboardView;
