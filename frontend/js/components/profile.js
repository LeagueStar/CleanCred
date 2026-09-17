/* ==========================================================================
   CLEANCRED — CITIZEN PROFILE & CIVIC SETTINGS
   Tactile Neumorphism + Civic Technology
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
      <div class="app-container" style="max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 4rem 1rem;">
        
        <!-- Header -->
        <div style="margin-bottom: 2rem;">
          <div class="badge badge-green" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            <i data-lucide="user" class="lucide-icon-sm"></i>
            <span>Citizen Profile & Municipal Registry</span>
          </div>
          <h2 style="color: var(--color-navy); font-size: 1.85rem; font-weight: 800; margin: 0.25rem 0;">Account & Verification</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Manage your linked municipal KYC, notification preferences, and civic credentials.</p>
        </div>

        <!-- 2-Column Profile Layout -->
        <div class="hero-grid hero-grid-profile" style="gap: 1.75rem;">
          
          <!-- Left: Profile Summary Card -->
          <div class="neu-card neu-card-raised" style="padding: 2rem; text-align: center; border-radius: var(--radius-xl);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); font-size: 1.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; border: 3px solid var(--color-primary); box-shadow: 0 4px 14px rgba(22, 163, 74, 0.2);">
              ${user.avatar}
            </div>

            <h3 style="color: var(--color-navy); font-size: 1.3rem; margin: 0 0 0.25rem 0;">${user.name}</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 1rem 0;">Citizen Member since ${user.joinDate}</p>

            <div style="margin-bottom: 1.5rem;">
              <span class="badge badge-green" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <i data-lucide="shield-check" class="lucide-icon-sm"></i>
                <span>Aadhaar / SBM KYC Verified</span>
              </span>
            </div>

            <div class="neu-card-inset" style="border-radius: var(--radius-md); padding: 1rem; text-align: left; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.6rem;">
              <div class="flex-between">
                <span style="color: var(--text-muted);">Green Credits:</span>
                <strong style="color: var(--color-primary-dark);">${user.greenPoints} GC (₹${Formatters.gpToInr(user.greenPoints)})</strong>
              </div>
              <div class="flex-between">
                <span style="color: var(--text-muted);">Current Ward Rank:</span>
                <strong style="color: var(--color-navy);">#${user.rank} (Ward 4B)</strong>
              </div>
              <div class="flex-between">
                <span style="color: var(--text-muted);">Segregation Streak:</span>
                <strong style="color: #B45309; display: flex; align-items: center; gap: 0.25rem;">
                  <i data-lucide="flame" class="lucide-icon-sm"></i>
                  <span>${user.greenStreakDays} active days</span>
                </strong>
              </div>
            </div>
          </div>

          <!-- Right: Details Form & Settings -->
          <div class="neu-card neu-card-raised" style="padding: 2rem; border-radius: var(--radius-xl);">
            <h3 style="color: var(--color-navy); margin-bottom: 1.25rem; font-size: 1.25rem; font-weight: 800;">Account Information</h3>

            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input neu-input" id="profile-name" value="${user.name}">
            </div>

            <div class="grid-cols-2" style="gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input neu-input" id="profile-email" value="${user.email}">
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Number</label>
                <input type="tel" class="form-input neu-input" id="profile-phone" value="${user.phone}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Registered Residential Address</label>
              <input type="text" class="form-input neu-input" id="profile-address" value="${user.address}">
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1.25rem; margin-top: 1.25rem;">
              <h4 style="color: var(--color-navy); margin-bottom: 0.75rem; font-size: 0.95rem; font-weight: 800;">Civic Notification Preferences</h4>
              <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; margin-bottom: 0.5rem; cursor: pointer; color: var(--text-main);">
                <input type="checkbox" checked style="accent-color: var(--color-primary);"> Receive real-time SMS & WhatsApp alerts for incoming waste van
              </label>
              <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; margin-bottom: 0.5rem; cursor: pointer; color: var(--text-main);">
                <input type="checkbox" checked style="accent-color: var(--color-primary);"> Auto-enroll in Weekly Ward 4B Segregation Challenges
              </label>
            </div>

            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="window.ProfileView.saveProfile()">
              <i data-lucide="save" class="lucide-icon-sm"></i>
              <span>Save Changes</span>
            </button>

            <!-- Demo Controls -->
            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">Testing the demo? You can reset state back to seed data.</span>
              <button class="btn btn-sm btn-secondary" onclick="window.ProfileView.resetDemo()">
                <i data-lucide="rotate-ccw" class="lucide-icon-sm"></i>
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
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

    // STEP 5: Real backend PUT /users/1
    fetch('http://localhost:8000/users/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, address })
    }).catch(e => console.warn('CleanCred: Backend profile save error:', e));

    State.addNotification({
      title: 'Profile Updated',
      message: 'Your account details and municipal pickup address were saved.',
      type: 'info'
    });

    State.notify();
    window.AppRouter.showToast('Profile changes saved successfully.');
    this.render();
  },

  resetDemo() {
    SoundFX.playClick();
    const confirmed = confirm('Reset all demo data back to its original starting state? This cannot be undone.');
    if (!confirmed) return;

    State.resetState();
    window.AppRouter.showToast('Demo reset to initial seed state.');
    window.AppRouter.navigate('profile');
  }
};

window.ProfileView = ProfileView;
