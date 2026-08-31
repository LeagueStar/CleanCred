/* ==========================================================================
   GREEN KARMA — MAIN APPLICATION ROUTER & CONTROLLER
   Tagline: EARN. RECYCLE. REWARD.
   ========================================================================== */

import { State } from './state.js';
import { Formatters } from './utils/formatters.js';
import { Confetti } from './utils/confetti.js';
import { SoundFX } from './utils/audio.js';

// Components
import { LandingPage } from './components/landing.js';
import { DashboardView } from './components/dashboard.js';
import { ReportWasteView } from './components/reportWaste.js';
import { LiveTrackingView } from './components/liveTracking.js';
import { RewardsWallet } from './components/rewardsWallet.js';
import { LeaderboardView } from './components/leaderboard.js';
import { WorkerPortalView } from './components/workerPortal.js';
import { AdminDashboardView } from './components/adminDashboard.js';
import { InstitutionPortalView } from './components/institutionPortal.js';
import { IllegalDumpingView } from './components/illegalDumping.js';
import { ImpactDashboardView } from './components/impactDashboard.js';
import { ProfileView } from './components/profile.js';

class AppRouterManager {
  constructor() {
    this.currentRoute = 'landing';
    this.init();
  }

  init() {
    // Listen for state changes to re-render active view and notification counts
    State.subscribe(() => {
      this.updateNavbarHeader();
      this.renderCurrentView();
    });

    // Close notifications tray on outside click
    document.addEventListener('click', (e) => {
      const tray = document.getElementById('notifications-tray');
      const bell = document.getElementById('notif-bell-btn');
      if (tray && bell && !tray.contains(e.target) && !bell.contains(e.target)) {
        tray.style.display = 'none';
      }
    });

    // Handle initial route
    const hash = window.location.hash.replace('#', '') || 'landing';
    this.navigate(hash);
  }

  navigate(route, params = {}) {
    SoundFX.playClick();
    this.currentRoute = route;
    window.location.hash = route;

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`view-${route}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update active nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.dataset.route === route) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update mobile bottom nav
    document.querySelectorAll('.mobile-nav-btn').forEach(el => {
      if (el.dataset.route === route) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render Component
    this.renderCurrentView(params);
  }

  renderCurrentView(params = {}) {
    switch (this.currentRoute) {
      case 'landing':
        LandingPage.render();
        break;
      case 'dashboard':
        DashboardView.render();
        break;
      case 'report-waste':
        ReportWasteView.render(params);
        break;
      case 'live-tracking':
        LiveTrackingView.render();
        break;
      case 'rewards':
        RewardsWallet.render();
        break;
      case 'leaderboard':
        LeaderboardView.render();
        break;
      case 'worker':
        WorkerPortalView.render();
        break;
      case 'admin':
        AdminDashboardView.render();
        break;
      case 'institutions':
        InstitutionPortalView.render();
        break;
      case 'illegal-dumping':
        IllegalDumpingView.render();
        break;
      case 'impact':
        ImpactDashboardView.render();
        break;
      case 'profile':
        ProfileView.render();
        break;
      default:
        LandingPage.render();
    }
  }

  handleRoleChange(role) {
    SoundFX.playClick();
    State.setRole(role);

    // Auto-navigate to the primary view for that role
    if (role === 'worker') {
      this.navigate('worker');
    } else if (role === 'admin') {
      this.navigate('admin');
    } else if (role === 'institution') {
      this.navigate('institutions');
    } else {
      this.navigate('dashboard');
    }
  }

  updateNavbarHeader() {
    const user = State.state.user;
    const notifs = State.state.notifications;
    const unreadCount = notifs.filter(n => !n.read).length;

    // Update user points chip in navbar
    const pointsChip = document.getElementById('nav-user-points');
    if (pointsChip) {
      pointsChip.textContent = `${Formatters.formatNumber(user.greenPoints)} GP`;
    }

    // Update notification dot
    const notifDot = document.getElementById('notif-dot');
    if (notifDot) {
      notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    // Update notification tray list
    const notifList = document.getElementById('notif-tray-list');
    if (notifList) {
      notifList.innerHTML = notifs.map(n => `
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); background: ${n.read ? '#FFFFFF' : '#F0FDF4'};">
          <strong style="font-size: 0.85rem; color: var(--color-navy); display: block; margin-bottom: 0.2rem;">${n.title}</strong>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">${n.message}</p>
          <span style="font-size: 0.7rem; color: var(--text-light); margin-top: 0.35rem; display: block;">${Formatters.formatRelativeTime(n.timestamp)}</span>
        </div>
      `).join('');
    }
  }

  toggleNotificationTray() {
    SoundFX.playClick();
    const tray = document.getElementById('notifications-tray');
    if (tray) {
      const isHidden = tray.style.display === 'none' || !tray.style.display;
      tray.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        State.markAllNotificationsRead();
      }
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.AppRouter = new AppRouterManager();
  window.Confetti = Confetti;
  window.SoundFX = SoundFX;
});
