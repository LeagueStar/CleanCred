import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';

export const DashboardView = {
  render() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const user = State.state.user;
    const activePickup = State.state.pickups.find(p => ['on_the_way', 'assigned', 'created'].includes(p.status));
    const inrValue = Formatters.gpToInr(user.greenPoints);

    container.innerHTML = `
      <div class="app-container citizen-dashboard">
        <header class="dashboard-heading">
          <div><p class="eyebrow">Ward 4B · Mumbai</p><h1>Good morning, ${user.name.split(' ')[0]}</h1><p>${activePickup ? 'Your collection is in progress. Track its verified recovery journey below.' : 'Your next responsible collection starts with a simple report.'}</p></div>
          <button class="btn btn-primary btn-lg" onclick="window.AppRouter.navigate('report-waste')">Report Waste</button>
        </header>
        ${activePickup ? `
          <section class="pickup-status" aria-label="Active pickup"><div class="pickup-status-copy"><p class="eyebrow">Active pickup</p><h2>${activePickup.categoryName} collection</h2><p>Request ${activePickup.id} · ${activePickup.workerName || 'Assigned municipal worker'} is on the way. Estimated arrival: ${activePickup.etaMinutes || 12} minutes.</p></div><div class="pickup-status-actions"><div class="pickup-otp"><span>Pickup OTP</span><strong>${activePickup.otp || '8492'}</strong></div><button class="btn btn-secondary" onclick="window.AppRouter.navigate('live-tracking')">Track pickup</button></div></section>
        ` : `
          <section class="pickup-status pickup-empty" aria-label="No active pickup"><div class="pickup-status-copy"><p class="eyebrow">No active pickup</p><h2>Ready when your waste is segregated</h2><p>Report a collection request and follow it from pickup through verification.</p></div><button class="btn btn-primary" onclick="window.AppRouter.navigate('report-waste')">Report Waste</button></section>
        `}
        <section class="dashboard-metrics" aria-label="Your impact and Green Credits">
          <button class="metric-card metric-credit" onclick="window.AppRouter.navigate('rewards')"><span>Available Green Credits</span><strong>${Formatters.formatNumber(user.greenPoints)} <small>GC</small></strong><em>Worth ${Formatters.formatCurrency(inrValue)}</em></button>
          <div class="metric-card"><span>Waste diverted</span><strong>${user.lifetimeWasteKg} <small>kg</small></strong><em>${user.pickupsCompleted} verified collections</em></div>
          <div class="metric-card"><span>Carbon avoided</span><strong>${user.co2SavedKg} <small>kg CO₂</small></strong><em>${user.treesEquivalent} tree equivalents</em></div>
        </section>
        <div class="dashboard-columns">
          <section class="dashboard-panel dashboard-action-panel"><div class="section-heading"><div><p class="eyebrow">Next step</p><h2>Report a collection</h2><p>Choose a category to begin a municipal pickup request.</p></div></div><div class="waste-options">
            <button class="waste-option wet" onclick="window.AppRouter.navigate('report-waste', { category: 'wet' })"><strong>Wet waste</strong><span>Food and organic waste</span><em>Earn 10 GC</em></button>
            <button class="waste-option dry" onclick="window.AppRouter.navigate('report-waste', { category: 'dry' })"><strong>Dry recyclables</strong><span>Paper, plastic, glass and metal</span><em>Earn 7 GC</em></button>
            <button class="waste-option harmful" onclick="window.AppRouter.navigate('report-waste', { category: 'harmful' })"><strong>Harmful waste</strong><span>Batteries and hazardous material</span><em>Earn 5 GC</em></button>
          </div></section>
          <section class="dashboard-panel dashboard-activity-panel"><div class="section-heading"><div><p class="eyebrow">Collection history</p><h2>Recent activity</h2></div><button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('live-tracking')">View tracking</button></div><div class="activity-list">
            ${State.state.pickups.slice(0, 4).map(p => `<div class="activity-row"><div><strong>${p.subType}</strong><span>${Formatters.formatRelativeTime(p.createdAt)} · ${p.quantityKg} kg</span></div>${p.status === 'verified' ? `<span class="status verified">+${p.pointsReward} GC verified</span>` : p.status === 'on_the_way' ? `<span class="status pending">Collection en route</span>` : `<span class="status assigned">Assigned</span>`}</div>`).join('')}
          </div></section>
        </div>
        <section class="dashboard-panel dashboard-rewards-panel"><div class="section-heading"><div><p class="eyebrow">Green Credits</p><h2>Use your balance when you are ready</h2><p>Available balance: ${Formatters.formatNumber(user.greenPoints)} GC</p></div><button class="btn btn-secondary" onclick="window.AppRouter.navigate('rewards')">View Green Credits</button></div><div class="challenge-list">${State.state.challenges.slice(0, 2).map(ch => `<div class="challenge-row"><div><strong>${ch.title}</strong><span>${ch.description}</span></div><span>${ch.current}/${ch.target} · +${ch.rewardGp} GC</span></div>`).join('')}</div></section>
      </div>`;
  }
};

window.DashboardView = DashboardView;
