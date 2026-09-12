/* ==========================================================================
   CLEANCRED — FRONTEND ROUTER & APP CONTROLLER
   Smart India Hackathon 2026 // Team GreenLegacy
   Client-Side Architecture for Static GitHub Pages Deployment
   ========================================================================== */

import { State } from './state.js';
import { Formatters } from './utils/formatters.js';
import { Confetti } from './utils/confetti.js';
import { SoundFX } from './utils/audio.js';

// Component Views
import { DashboardView } from './components/dashboard.js';
import { ReportWasteView } from './components/reportWaste.js';
import { AdminDashboardView } from './components/adminDashboard.js';
import { RewardsWallet } from './components/rewardsWallet.js';
import { LiveTrackingView } from './components/liveTracking.js';
import { WorkerPortalView } from './components/workerPortal.js';
import { LeaderboardView } from './components/leaderboard.js';
import { ImpactDashboardView } from './components/impactDashboard.js';
import { ProfileView } from './components/profile.js';
import { IllegalDumpingView } from './components/illegalDumping.js';
import { InstitutionPortalView } from './components/institutionPortal.js';

class AppRouterManager {
  constructor() {
    this.currentRoute = 'dashboard'; // Default to Citizen Home
    this.init();
  }

  normalizeRoute(route) {
    if (!route || route === 'citizen' || route === 'home' || route === 'dashboard') {
      return 'dashboard';
    }
    const knownRoutes = [
      'dashboard',
      'report-waste',
      'worker',
      'admin',
      'rewards',
      'live-tracking',
      'leaderboard',
      'impact',
      'profile',
      'illegal-dumping',
      'institutions'
    ];
    if (knownRoutes.includes(route)) {
      return route;
    }
    return 'dashboard';
  }

  init() {
    // Listen for state changes to re-render navbar and active view
    State.subscribe(() => {
      this.updateNavbarHeader();
      this.renderCurrentView();
    });

    // Auto-detect initial route from hash or default to dashboard
    const rawHash = window.location.hash.replace('#', '');
    if (rawHash) {
      this.navigate(rawHash);
    } else {
      this.navigate('dashboard');
    }

    // Listen to browser hash changes
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '') || 'dashboard';
      const norm = this.normalizeRoute(newHash);
      if (norm !== this.currentRoute) {
        this.navigate(newHash);
      }
    });
  }

  switchExperience(role) {
    SoundFX.playClick();
    if (role === 'worker') {
      this.navigate('worker');
    } else if (role === 'admin') {
      this.navigate('admin');
    } else {
      this.navigate('dashboard');
    }
  }

  navigate(route, params = {}) {
    SoundFX.playClick();
    const targetRoute = this.normalizeRoute(route);
    this.currentRoute = targetRoute;
    window.location.hash = route;

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`view-${targetRoute}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update Topbar View Mode Switcher Active State
    const btnCitizen = document.getElementById('btn-mode-citizen');
    const btnWorker = document.getElementById('btn-mode-worker');
    const btnAdmin = document.getElementById('btn-mode-admin');

    if (btnCitizen && btnWorker && btnAdmin) {
      btnCitizen.classList.remove('active');
      btnWorker.classList.remove('active');
      btnAdmin.classList.remove('active');

      if (targetRoute === 'worker') {
        btnWorker.classList.add('active');
      } else if (targetRoute === 'admin') {
        btnAdmin.classList.add('active');
      } else {
        btnCitizen.classList.add('active');
      }
    }

    const btnProfile = document.getElementById('btn-topbar-profile');
    if (btnProfile) {
      if (targetRoute === 'profile') {
        btnProfile.classList.add('active');
      } else {
        btnProfile.classList.remove('active');
      }
    }

    // Update Points display in topbar
    this.updateNavbarHeader();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Render Target View Component
    this.renderCurrentView(params);

    // Re-create icons if Lucide is loaded
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderCurrentView(params = {}) {
    switch (this.currentRoute) {
      case 'dashboard':
        DashboardView.render(params);
        break;
      case 'report-waste':
        if (typeof ReportWasteView.startNewReport === 'function') {
          ReportWasteView.startNewReport(params);
        } else {
          ReportWasteView.render(params);
        }
        break;
      case 'worker':
        WorkerPortalView.render();
        break;
      case 'admin':
        AdminDashboardView.render();
        break;
      case 'rewards':
        RewardsWallet.render();
        break;
      case 'live-tracking':
        LiveTrackingView.render();
        break;
      case 'leaderboard':
        LeaderboardView.render();
        break;
      case 'impact':
        ImpactDashboardView.render();
        break;
      case 'profile':
        ProfileView.render();
        break;
      case 'illegal-dumping':
        IllegalDumpingView.render();
        break;
      case 'institutions':
        InstitutionPortalView.render();
        break;
      default:
        DashboardView.render(params);
    }
  }

  showToast(message, type = 'info') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.style.cssText = 'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #0F172A; color: #FFFFFF; padding: 0.65rem 1.25rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; z-index: 9999; box-shadow: 0 4px 14px rgba(15,23,42,0.25); transition: opacity 0.3s ease; opacity: 0; pointer-events: none;';
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.opacity = '1';
    setTimeout(() => {
      if (toast) toast.style.opacity = '0';
    }, 2800);
  }

  updateNavbarHeader() {
    const user = State.state.user;
    const topCounter = document.getElementById('user-points-counter-top');
    if (topCounter && user) {
      const pts = user.greenPoints || 1250;
      topCounter.innerText = `${Formatters.formatNumber(pts)} GC`;
    }
  }
}

// Instantiate and expose globally
window.AppRouter = new AppRouterManager();
export { AppRouterManager };
