/* ==========================================================================
   CLEANCRED — GAMIFIED LEADERBOARD, BADGES & CIVIC CHALLENGES
   Tactile Neumorphism + Civic Technology
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

    const rawList = State.state.leaderboards[this.currentTab] || State.state.leaderboards.city;

    // Keep the citizen's own row in sync with their live wallet/impact stats
    const list = rawList.map(u => u.isUser ? {
      ...u,
      points: State.state.user.greenPoints,
      wasteKg: State.state.user.lifetimeWasteKg,
      streak: State.state.user.greenStreakDays
    } : u);

    const top3 = list.slice(0, 3);
    const currentUserEntry = list.find(u => u.isUser);
    const currentUserIndex = currentUserEntry ? list.indexOf(currentUserEntry) : -1;
    const aheadOfUser = currentUserIndex > 0 ? list[currentUserIndex - 1] : null;
    const gapToNextRank = (currentUserEntry && aheadOfUser) ? (aheadOfUser.points - currentUserEntry.points) : 0;

    container.innerHTML = `
      <div class="app-container" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header -->
        <div class="flex-between" style="margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="trophy" class="lucide-icon-sm"></i>
              <span>Civic Participation & Gamification</span>
            </div>
            <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Community Impact Standings</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Verified recovery contributions across citizens, neighborhoods, and academic institutions.</p>
          </div>

          <!-- Highlight Current Rank Pill (Tactile Raised) -->
          <div class="neu-card neu-card-raised" style="padding: 0.85rem 1.25rem; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 1rem; border-left: 4px solid var(--color-primary);">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 900;">
              <i data-lucide="award" class="lucide-icon-md"></i>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Your Standing</div>
              ${currentUserEntry ? `
                <strong style="font-size: 1rem; color: var(--color-navy); display: block;">
                  #${currentUserEntry.rank} ${State.state.user.name} (${Formatters.formatNumber(currentUserEntry.points)} GC)
                </strong>
                <div style="font-size: 0.75rem; color: var(--color-primary-dark); font-weight: 600;">
                  ${gapToNextRank > 0 ? `${Formatters.formatNumber(gapToNextRank)} GC needed to reach #${aheadOfUser.rank}` : "You currently lead this standing"}
                </div>
              ` : `
                <strong style="font-size: 1rem; color: var(--color-navy); display: block;">Not Ranked Here</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Enrolled in Ward 4B Resident category</div>
              `}
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem;">
          <button class="btn btn-sm ${this.currentTab === 'city' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('city')">
            <i data-lucide="map-pin" class="lucide-icon-sm"></i>
            <span>Mumbai Metro</span>
          </button>
          <button class="btn btn-sm ${this.currentTab === 'neighborhood' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('neighborhood')">
            <i data-lucide="home" class="lucide-icon-sm"></i>
            <span>Ward 4B</span>
          </button>
          <button class="btn btn-sm ${this.currentTab === 'global' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('global')">
            <i data-lucide="globe" class="lucide-icon-sm"></i>
            <span>National SBM</span>
          </button>
          <button class="btn btn-sm ${this.currentTab === 'college' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('college')">
            <i data-lucide="graduation-cap" class="lucide-icon-sm"></i>
            <span>Colleges</span>
          </button>
          <button class="btn btn-sm ${this.currentTab === 'school' ? 'btn-primary' : 'btn-secondary'}" onclick="window.LeaderboardView.switchTab('school')">
            <i data-lucide="book-open" class="lucide-icon-sm"></i>
            <span>Schools</span>
          </button>
        </div>

        <!-- 3-Place Neumorphic Podium Section -->
        <div class="neu-card neu-card-raised" style="border-radius: var(--radius-xl); padding: 2.5rem 1.5rem 1.5rem 1.5rem; margin-bottom: 2.5rem;">
          <div style="display: flex; justify-content: center; align-items: flex-end; gap: 1.5rem; max-width: 720px; margin: 0 auto;" class="points-podium">
            
            <!-- Rank 2 (Silver) -->
            ${top3[1] ? `
              <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #E2E8F0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: 800; margin-bottom: 0.5rem;">
                  <i data-lucide="medal" class="lucide-icon-sm"></i>
                </div>
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #E2E8F0; border: 3px solid #94A3B8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: #475569; margin-bottom: 0.5rem;">
                  ${top3[1].avatar}
                </div>
                <strong style="font-size: 0.95rem; color: var(--color-navy); display: block;">${top3[1].name}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${top3[1].location}</span>
                <div class="neu-card-raised" style="width: 100%; height: 110px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; color: #334155; border-top: 4px solid #94A3B8;">
                  <span style="font-size: 1.15rem;">${top3[1].points} GC</span>
                  <span style="font-size: 0.75rem; color: #64748B;">${top3[1].wasteKg} KG Waste</span>
                </div>
              </div>
            ` : ''}

            <!-- Rank 1 (Gold) -->
            ${top3[0] ? `
              <div style="flex: 1.15; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; font-weight: 900; margin-bottom: 0.5rem; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);">
                  <i data-lucide="crown" class="lucide-icon-md"></i>
                </div>
                <div style="width: 72px; height: 72px; border-radius: 50%; background: #FEF3C7; border: 4px solid #F59E0B; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.4rem; color: #B45309; margin-bottom: 0.5rem; box-shadow: 0 6px 16px rgba(245, 158, 11, 0.25);">
                  ${top3[0].avatar}
                </div>
                <strong style="font-size: 1.05rem; color: var(--color-navy); display: block;">${top3[0].name}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${top3[0].location}</span>
                <div class="neu-card-raised" style="width: 100%; height: 145px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; color: #78350F; border-top: 4px solid #F59E0B; background: linear-gradient(180deg, #FEF3C7 0%, var(--bg-surface) 100%);">
                  <span style="font-size: 1.35rem; color: #B45309;">${top3[0].points} GC</span>
                  <span style="font-size: 0.8rem; color: #92400E;">${top3[0].wasteKg} KG Waste</span>
                </div>
              </div>
            ` : ''}

            <!-- Rank 3 (Bronze) -->
            ${top3[2] ? `
              <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #FED7AA; color: #9A3412; display: flex; align-items: center; justify-content: center; font-weight: 800; margin-bottom: 0.5rem;">
                  <i data-lucide="medal" class="lucide-icon-sm"></i>
                </div>
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #FED7AA; border: 3px solid #EA580C; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: #9A3412; margin-bottom: 0.5rem;">
                  ${top3[2].avatar}
                </div>
                <strong style="font-size: 0.95rem; color: var(--color-navy); display: block;">${top3[2].name}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${top3[2].location}</span>
                <div class="neu-card-raised" style="width: 100%; height: 85px; border-radius: var(--radius-md) var(--radius-md) 0 0; margin-top: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; color: #7C2D12; border-top: 4px solid #EA580C;">
                  <span style="font-size: 1.15rem;">${top3[2].points} GC</span>
                  <span style="font-size: 0.75rem; color: #9A3412;">${top3[2].wasteKg} KG Waste</span>
                </div>
              </div>
            ` : ''}

          </div>
        </div>

        <!-- 2-Column Section: Detailed Ranked List (Left) & Collectible Badges + Challenges (Right) -->
        <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 1.75rem;" class="hero-grid">
          
          <!-- Left: Full Leaderboard List -->
          <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
            <h3 style="color: var(--color-navy); margin-bottom: 1.25rem; font-size: 1.25rem; font-weight: 800;">Full Standings</h3>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${list.map(u => `
                <div class="${u.isUser ? 'neu-card-inset' : 'neu-card-flat'}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.25rem; border-radius: var(--radius-md); ${u.isUser ? 'border-left: 4px solid var(--color-primary);' : ''}">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.1rem; font-weight: 900; color: ${u.rank <= 3 ? '#F59E0B' : 'var(--text-muted)'}; width: 28px;">
                      #${u.rank}
                    </span>
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: ${u.isUser ? 'var(--color-primary-dark)' : '#E2E8F0'}; color: ${u.isUser ? '#FFFFFF' : '#1E293B'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
                      ${u.avatar}
                    </div>
                    <div>
                      <strong style="color: var(--color-navy); font-size: 0.95rem; display: block;">
                        ${u.name} ${u.isUser ? '<span class="badge badge-green" style="font-size: 0.65rem; padding: 2px 6px; margin-left: 4px;">You</span>' : ''}
                      </strong>
                      <span style="font-size: 0.75rem; color: var(--text-muted);">${u.location} &bull; ${u.wasteKg} KG Segregated</span>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <span class="badge badge-points" style="font-size: 0.85rem;">${Formatters.formatNumber(u.points)} GC</span>
                    ${u.streak ? `
                      <div style="font-size: 0.72rem; color: #EA580C; font-weight: 700; margin-top: 2px; display: flex; align-items: center; justify-content: flex-end; gap: 0.2rem;">
                        <i data-lucide="flame" style="width: 12px; height: 12px;"></i>
                        <span>${u.streak}d streak</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Badges Showcase & Weekly Challenges -->
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            
            <!-- Badges Section -->
            <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
              <div class="flex-between" style="margin-bottom: 1.25rem;">
                <h3 style="color: var(--color-navy); font-size: 1.2rem; font-weight: 800; margin: 0;">Verified Badges</h3>
                <span class="badge badge-green">4 / 7 Unlocked</span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.75rem; text-align: center;">
                ${State.state.badges.map(b => `
                  <div class="${b.unlocked ? 'neu-card-flat' : 'neu-card-inset'}" style="padding: 0.85rem 0.5rem; border-radius: var(--radius-md); opacity: ${b.unlocked ? '1' : '0.6'}; cursor: pointer;" onclick="window.LeaderboardView.showBadgeDetails('${b.id}')">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: ${b.unlocked ? '#DCFCE7' : '#E2E8F0'}; color: ${b.unlocked ? 'var(--color-primary-dark)' : '#64748B'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.35rem auto;">
                      <i data-lucide="${b.unlocked ? 'award' : 'lock'}" class="lucide-icon-sm"></i>
                    </div>
                    <strong style="font-size: 0.75rem; color: var(--color-navy); display: block; line-height: 1.2;">${b.name}</strong>
                    <div style="font-size: 0.65rem; color: ${b.unlocked ? 'var(--color-primary-dark)' : 'var(--text-muted)'}; margin-top: 0.25rem; font-weight: 700;">
                      ${b.unlocked ? 'Unlocked' : `${b.progress || 0}%`}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Active Challenges -->
            <div class="neu-card neu-card-raised" style="padding: 1.75rem; border-radius: var(--radius-xl);">
              <h3 style="color: var(--color-navy); font-size: 1.2rem; font-weight: 800; margin-bottom: 1rem;">Active Civic Challenges</h3>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${State.state.challenges.map(c => `
                  <div class="neu-card-flat" style="padding: 1rem; border-radius: var(--radius-md);">
                    <div class="flex-between" style="margin-bottom: 0.35rem;">
                      <strong style="color: var(--color-navy); font-size: 0.88rem;">${c.title}</strong>
                      <span class="badge badge-points">+${c.rewardGp} GC</span>
                    </div>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.65rem;">${c.description}</p>
                    
                    <div class="flex-between" style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
                      <span>Progress: ${c.current} / ${c.target}</span>
                      <span>${Math.round((c.current / c.target) * 100)}%</span>
                    </div>
                    <div class="neu-card-inset" style="height: 8px; border-radius: 9999px; overflow: hidden; padding: 1px;">
                      <div style="height: 100%; width: ${(c.current / c.target) * 100}%; background: linear-gradient(90deg, #16A34A, #84CC16); border-radius: 9999px;"></div>
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
        <div class="modal-content neu-card neu-card-raised" style="text-align: center; max-width: 440px;">
          <div class="modal-close-btn" onclick="document.getElementById('badge-modal').classList.remove('active')">
            <i data-lucide="x" class="lucide-icon-sm"></i>
          </div>
          <div id="badge-modal-body"></div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
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
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);">
          <i data-lucide="${badge.unlocked ? 'award' : 'lock'}" class="lucide-icon-lg"></i>
        </div>
        <h2 style="color: var(--color-navy); font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">${badge.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">${badge.description}</p>
        
        <div class="neu-card-inset" style="border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
          ${badge.unlocked ? `
            <span style="color: var(--color-primary-dark); font-weight: 800;">Unlocked on ${badge.unlockedAt}</span>
          ` : `
            <span style="color: var(--text-muted); font-weight: 700;">Locked &bull; Current Progress: ${badge.progress}%</span>
          `}
        </div>

        ${badge.unlocked ? `
          <button class="btn btn-primary btn-block" onclick="window.Confetti.trigger(100); SoundFX.playPointsEarned();">
            Celebrate Badge
          </button>
        ` : `
          <button class="btn btn-secondary btn-block" onclick="document.getElementById('badge-modal').classList.remove('active')">
            Close
          </button>
        `}
      `;

      document.getElementById('badge-modal').classList.add('active');
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.LeaderboardView = LeaderboardView;
