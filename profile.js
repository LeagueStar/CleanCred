/* ==========================================================================
   GREEN LEGACY — CITIZEN PROFILE & ACCOUNT SETTINGS
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { SoundFX } from '../utils/audio.js';

export const ProfileView = {
  render() {
    const container = document.getElementById('view-profile');
    if (!container) return;

    const user = State.state.user;

    container.innerHTML = `
      <div class="app-container" style="max-width: 860px;">
        
        <!-- Header -->
        <div style="margin-bottom: 2rem;">
          <div class="badge badge-green" style="margin-bottom: 0.35rem;">
            <span>👤</span> Citizen Credentials & Settings
          </div>
          <h2>User Profile & Civic Identity</h2>
          <p>Manage your linked municipal KYC, notification preferences, and green achievements.</p>
        </div>

        <!-- 2-Column Profile Layout -->
        <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 2rem;" class="hero-grid">
          
          <!-- Left: Profile Summary Card -->
          <div class="glass-card" style="padding: 2rem; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); font-size: 2rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; border: 3px solid var(--color-primary);">
              ${user.avatar}
            </div>

            <h3 style="color: var(--color-navy); margin-bottom: 0.25rem;">${user.name}</h3>
            <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 1rem;">Member since ${user.joinDate}</p>

            <div style="margin-bottom: 1.5rem;">
              <span class="badge" style="background: #D1FAE5; color: #065F46; font-weight: 700;">
                ✓ Aadhaar / SBM KYC Verified
              </span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; text-align: left; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <div class="flex-between">
                <span style="color: var(--text-muted);">Green Wallet:</span>
                <strong style="color: var(--color-primary-dark);">${user.greenPoints} GC (₹${Formatters.gpToInr(user.greenPoints)})</strong>
              </div>
              <div class="flex-between">
                <span style="color: var(--text-muted);">Current Rank:</span>
                <strong>#${user.rank} (Ward 4B)</strong>
              </div>
              <div class="flex-between">
                <span style="color: var(--text-muted);">Streak:</span>
                <strong style="color: #EA580C;">🔥 ${user.greenStreakDays} Days</strong>
              </div>
            </div>
          </div>

          <!-- Right: Details Form & Settings -->
          <div class="glass-card" style="padding: 2rem;">
            <h3 style="color: var(--color-navy); margin-bottom: 1.25rem;">Account Information</h3>

            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="profile-name" value="${user.name}">
            </div>

            <div class="grid-cols-2">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="profile-email" value="${user.email}">
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Number</label>
                <input type="tel" class="form-input" id="profile-phone" value="${user.phone}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Registered Residential Address</label>
              <input type="text" class="form-input" id="profile-address" value="${user.address}">
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1.25rem; margin-top: 1.25rem;">
              <h4 style="color: var(--color-navy); margin-bottom: 0.75rem;">Civic Preferences</h4>
              <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; margin-bottom: 0.5rem; cursor: pointer;">
                <input type="checkbox" checked> Receive real-time SMS & WhatsApp alerts for incoming waste van
              </label>
              <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; margin-bottom: 0.5rem; cursor: pointer;">
                <input type="checkbox" checked> Auto-enroll in Weekly Ward 4B Segregation Challenges
              </label>
            </div>

            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="window.ProfileView.saveProfile()">
              Save Changes ✓
            </button>

            <!-- Demo Controls -->
            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">Testing the demo? You can wipe everything back to the starting data.</span>
              <button class="btn btn-sm" style="background: transparent; color: var(--text-muted); border: 1px solid var(--color-border);" onclick="window.ProfileView.resetDemo()">
                ↺ Reset Demo Data
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  saveProfile() {
    SoundFX.playClick();
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('profile-phone').value;
    const address = document.getElementById('profile-address').value;

    State.state.user.name = name;
    State.state.user.email = email;
    State.state.user.phone = phone;
    State.state.user.address = address;

    State.addNotification({
      title: '👤 Profile Updated',
      message: 'Your account details and municipal pickup address were saved.',
      type: 'info'
    });

    // Persist the edit and let other views (navbar, dashboard, etc.) pick it up
    State.notify();

    alert('Profile information updated successfully!');
    this.render();
  },

  resetDemo() {
    SoundFX.playClick();
    const confirmed = confirm('Reset all demo data back to its original starting state? This cannot be undone.');
    if (!confirmed) return;

    State.resetState();
    alert('Demo data has been reset to its original state.');
    window.AppRouter.navigate('profile');
  }
};

window.ProfileView = ProfileView;
