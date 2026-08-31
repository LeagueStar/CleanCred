/* ==========================================================================
   GREEN LEGACY — REPORT WASTE 5-STEP WIZARD COMPONENT
   Interactive Category Selection, Photo Simulation, Map Pin, and Request ID
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { MapHelper } from '../utils/mapHelper.js';
import { Confetti } from '../utils/confetti.js';
import { SoundFX } from '../utils/audio.js';

export const ReportWasteView = {
  currentStep: 1,
  formData: {
    category: 'wet',
    subType: 'Kitchen Food & Vegetable Scraps',
    quantity: 4.5,
    description: '',
    photoUrl: null,
    address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
    landmark: 'Opposite Green Park Avenue',
    pickupType: 'doorstep',
    scheduledDate: 'Today',
    scheduledTime: 'Slot 10:00 AM - 12:00 PM'
  },
  mapInstance: null,
  markerInstance: null,

  render(initialParams = {}) {
    const container = document.getElementById('view-report-waste');
    if (!container) return;

    if (initialParams.category) {
      this.formData.category = initialParams.category;
    }
    this.currentStep = 1;

    container.innerHTML = `
      <div class="app-container" style="max-width: 860px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="badge badge-green" style="margin-bottom: 0.5rem;">EARN. RECYCLE. REWARD.</div>
          <h2>Report Waste & Request Pickup</h2>
          <p>Complete the 5-step verification process to earn guaranteed Green Credits.</p>
        </div>

        <!-- Stepper Navigation Bar -->
        <div class="stepper-header">
          <div class="step-item ${this.currentStep === 1 ? 'active' : this.currentStep > 1 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(1)">
            <div class="step-circle">${this.currentStep > 1 ? '✓' : '1'}</div>
            <span class="step-label">Category</span>
          </div>

          <div class="step-item ${this.currentStep === 2 ? 'active' : this.currentStep > 2 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(2)">
            <div class="step-circle">${this.currentStep > 2 ? '✓' : '2'}</div>
            <span class="step-label">Details & Photo</span>
          </div>

          <div class="step-item ${this.currentStep === 3 ? 'active' : this.currentStep > 3 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(3)">
            <div class="step-circle">${this.currentStep > 3 ? '✓' : '3'}</div>
            <span class="step-label">Location Map</span>
          </div>

          <div class="step-item ${this.currentStep === 4 ? 'active' : this.currentStep > 4 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(4)">
            <div class="step-circle">${this.currentStep > 4 ? '✓' : '4'}</div>
            <span class="step-label">Pickup Time</span>
          </div>

          <div class="step-item ${this.currentStep === 5 ? 'active' : ''}">
            <div class="step-circle">5</div>
            <span class="step-label">Confirmation</span>
          </div>
        </div>

        <!-- Dynamic Wizard Step Container -->
        <div class="glass-card" style="padding: 2.25rem; background: #FFFFFF;" id="wizard-step-content">
          ${this.renderStepContent()}
        </div>

      </div>
    `;

    if (this.currentStep === 3) {
      setTimeout(() => this.initStepMap(), 100);
    }
  },

  renderStepContent() {
    switch (this.currentStep) {
      case 1:
        return this.renderStep1();
      case 2:
        return this.renderStep2();
      case 3:
        return this.renderStep3();
      case 4:
        return this.renderStep4();
      case 5:
        return this.renderStep5();
      default:
        return this.renderStep1();
    }
  },

  // STEP 1: Waste Category Selection
  renderStep1() {
    return `
      <div>
        <h3 style="margin-bottom: 0.5rem; color: var(--color-navy);">Step 1: Select Waste Category</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.75rem;">Choose the segregated waste type you are reporting to see available credits reward.</p>

        <div class="grid-cols-3" style="margin-bottom: 2rem;">
          
          <!-- Wet Card -->
          <div class="glass-card-interactive" style="padding: 1.5rem; border-radius: var(--radius-xl); border: 2px solid ${this.formData.category === 'wet' ? 'var(--waste-wet)' : 'var(--color-border)'}; background: ${this.formData.category === 'wet' ? 'var(--waste-wet-bg)' : '#FFFFFF'};" onclick="window.ReportWasteView.setCategory('wet')">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 2rem;">🟢</span>
              <span class="badge" style="background: var(--waste-wet); color: #FFFFFF; font-weight: 800;">+10 GC</span>
            </div>
            <h4 style="color: var(--waste-wet); margin-bottom: 0.35rem;">Wet Waste</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Organic kitchen scraps, vegetable peels, food leftovers & garden waste.</p>
          </div>

          <!-- Dry Card -->
          <div class="glass-card-interactive" style="padding: 1.5rem; border-radius: var(--radius-xl); border: 2px solid ${this.formData.category === 'dry' ? 'var(--waste-dry)' : 'var(--color-border)'}; background: ${this.formData.category === 'dry' ? 'var(--waste-dry-bg)' : '#FFFFFF'};" onclick="window.ReportWasteView.setCategory('dry')">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 2rem;">🔵</span>
              <span class="badge" style="background: var(--waste-dry); color: #FFFFFF; font-weight: 800;">+7 GC</span>
            </div>
            <h4 style="color: var(--waste-dry); margin-bottom: 0.35rem;">Dry Waste</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Paper, cardboard boxes, plastic containers, beverage bottles, glass & metal.</p>
          </div>

          <!-- Harmful Card -->
          <div class="glass-card-interactive" style="padding: 1.5rem; border-radius: var(--radius-xl); border: 2px solid ${this.formData.category === 'harmful' ? 'var(--waste-harmful)' : 'var(--color-border)'}; background: ${this.formData.category === 'harmful' ? 'var(--waste-harmful-bg)' : '#FFFFFF'};" onclick="window.ReportWasteView.setCategory('harmful')">
            <div class="flex-between" style="margin-bottom: 1rem;">
              <span style="font-size: 2rem;">🔴</span>
              <span class="badge" style="background: var(--waste-harmful); color: #FFFFFF; font-weight: 800;">+5 GC</span>
            </div>
            <h4 style="color: var(--waste-harmful); margin-bottom: 0.35rem;">Harmful Waste</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Batteries, expired medicines, chemical sprays, old electronic gadgets & CFLs.</p>
          </div>

        </div>

        <div style="text-align: right;">
          <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.goToStep(2)">
            Continue to Details & Photo →
          </button>
        </div>
      </div>
    `;
  },

  // STEP 2: Waste Details & Photo Upload
  renderStep2() {
    const subTypesMap = {
      wet: ['Kitchen Vegetable & Fruit Scraps', 'Cooked Food Leftovers', 'Garden & Fallen Leaves Waste', 'Organic Compostables'],
      dry: ['Cardboard Cartons & Packaging', 'Plastic Bottles & Containers (PET/HDPE)', 'Paper, Magazines & Newspapers', 'Glass Jars & Metal Cans', 'Old Clothes & Textiles'],
      harmful: ['Used Lithium & Alkaline Batteries', 'Expired Medications & Syringes', 'E-Waste (Old Phones, Cables, Chargers)', 'Paints, Aerosols & Chemical Solvents']
    };

    const currentSubTypes = subTypesMap[this.formData.category] || subTypesMap.wet;

    return `
      <div>
        <h3 style="margin-bottom: 0.5rem; color: var(--color-navy);">Step 2: Waste Details & Photo</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.75rem;">Specify the exact material and upload a photo for verification.</p>

        <!-- Sub-type Selection -->
        <div class="form-group">
          <label class="form-label">Specific Material Sub-Category</label>
          <select class="form-select" id="form-sub-type" onchange="window.ReportWasteView.formData.subType = this.value">
            ${currentSubTypes.map(st => `
              <option value="${st}" ${this.formData.subType === st ? 'selected' : ''}>${st}</option>
            `).join('')}
          </select>
        </div>

        <!-- Quantity Slider -->
        <div class="form-group" style="margin-top: 1.25rem;">
          <div class="flex-between">
            <label class="form-label">Approximate Weight / Quantity</label>
            <span id="weight-display" style="font-weight: 800; color: var(--color-primary-dark); font-size: 1.1rem;">
              ${this.formData.quantity} KG
            </span>
          </div>
          <input type="range" min="0.5" max="25" step="0.5" value="${this.formData.quantity}" style="width: 100%; accent-color: var(--color-primary);" oninput="window.ReportWasteView.updateWeight(this.value)">
          <div class="flex-between" style="font-size: 0.75rem; color: var(--text-muted);">
            <span>0.5 kg (Small Bag)</span>
            <span>10 kg (Large Box)</span>
            <span>25 kg (Bulk)</span>
          </div>
        </div>

        <!-- Photo Upload Preview & Camera Simulation -->
        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Upload Waste Photo for Verification</label>
          
          <div style="border: 2px dashed var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; background: #F8FAFC; cursor: pointer;" onclick="document.getElementById('waste-photo-input').click()">
            <input type="file" id="waste-photo-input" accept="image/*" style="display: none;" onchange="window.ReportWasteView.handlePhotoUpload(event)">
            
            <div id="photo-preview-box">
              ${this.formData.photoUrl ? `
                <img src="${this.formData.photoUrl}" style="max-height: 160px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: 0.5rem;" />
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-dark);">Photo Attached ✓ (Click to change)</div>
              ` : `
                <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📸</div>
                <strong style="color: var(--color-navy); display: block; font-size: 0.95rem;">Click to Take or Upload Waste Photo</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Shows municipal worker that waste is properly segregated.</p>
              `}
            </div>
          </div>
        </div>

        <div class="flex-between" style="margin-top: 2rem;">
          <button class="btn btn-secondary" onclick="window.ReportWasteView.goToStep(1)">
            ← Back
          </button>
          <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.goToStep(3)">
            Confirm Location →
          </button>
        </div>
      </div>
    `;
  },

  // STEP 3: Location Map Pin
  renderStep3() {
    return `
      <div>
        <h3 style="margin-bottom: 0.5rem; color: var(--color-navy);">Step 3: Confirm Pickup Location</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">Pinpoint your doorstep location so the nearest collection vehicle can reach seamlessly.</p>

        <!-- Use My Location Trigger -->
        <div style="margin-bottom: 1rem; display: flex; gap: 0.75rem; align-items: center;">
          <button class="btn btn-sm btn-emerald-outline" onclick="window.ReportWasteView.detectLocation()">
            <span>📍</span> Auto-Detect My Current GPS Location
          </button>
          <span style="font-size: 0.8rem; color: var(--text-muted);">or drag the pin on map</span>
        </div>

        <!-- Interactive Map Container -->
        <div id="report-location-map" style="height: 260px; width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.25rem;"></div>

        <!-- Address Text Fields -->
        <div class="grid-cols-2">
          <div class="form-group">
            <label class="form-label">Full Street Address</label>
            <input type="text" class="form-input" id="form-address" value="${this.formData.address}" onchange="window.ReportWasteView.formData.address = this.value">
          </div>
          <div class="form-group">
            <label class="form-label">Nearby Landmark</label>
            <input type="text" class="form-input" id="form-landmark" value="${this.formData.landmark}" onchange="window.ReportWasteView.formData.landmark = this.value">
          </div>
        </div>

        <div class="flex-between" style="margin-top: 2rem;">
          <button class="btn btn-secondary" onclick="window.ReportWasteView.goToStep(2)">
            ← Back
          </button>
          <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.goToStep(4)">
            Select Pickup Preference →
          </button>
        </div>
      </div>
    `;
  },

  // STEP 4: Pickup Preference
  renderStep4() {
    return `
      <div>
        <h3 style="margin-bottom: 0.5rem; color: var(--color-navy);">Step 4: Pickup Method & Schedule</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.75rem;">Choose whether you want doorstep van collection or drop-off at a municipal MRF kiosk.</p>

        <div class="grid-cols-3" style="margin-bottom: 2rem;">
          
          <div class="glass-card-interactive" style="padding: 1.5rem; border-radius: var(--radius-lg); border: 2px solid ${this.formData.pickupType === 'doorstep' ? 'var(--color-primary)' : 'var(--color-border)'};" onclick="window.ReportWasteView.setPickupType('doorstep')">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🚚</div>
            <strong style="color: var(--color-navy); display: block;">Doorstep Pickup</strong>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Electric waste van collects from your gate.</p>
          </div>

          <div class="glass-card-interactive" style="padding: 1.5rem; border-radius: var(--radius-lg); border: 2px solid ${this.formData.pickupType === 'center' ? 'var(--color-primary)' : 'var(--color-border)'};" onclick="window.ReportWasteView.setPickupType('center')">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🏢</div>
            <strong style="color: var(--color-navy); display: block;">Drop at Center</strong>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Drop at Ward 4B Smart Waste Kiosk.</p>
          </div>

          <div class="glass-card-interactive" style="padding: 1.5rem; border-radius: var(--radius-lg); border: 2px solid ${this.formData.pickupType === 'scheduled' ? 'var(--color-primary)' : 'var(--color-border)'};" onclick="window.ReportWasteView.setPickupType('scheduled')">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📅</div>
            <strong style="color: var(--color-navy); display: block;">Schedule Slot</strong>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Pick specific date and convenient time.</p>
          </div>

        </div>

        <div class="grid-cols-2">
          <div class="form-group">
            <label class="form-label">Preferred Date</label>
            <select class="form-select" onchange="window.ReportWasteView.formData.scheduledDate = this.value">
              <option value="Today">Today (Within 30 mins)</option>
              <option value="Tomorrow Morning">Tomorrow Morning (09:00 AM - 12:00 PM)</option>
              <option value="Tomorrow Evening">Tomorrow Evening (04:00 PM - 07:00 PM)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Time Window</label>
            <select class="form-select" onchange="window.ReportWasteView.formData.scheduledTime = this.value">
              <option value="Slot 10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
              <option value="Slot 02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
              <option value="Slot 05:00 PM - 07:00 PM">Evening (05:00 PM - 07:00 PM)</option>
            </select>
          </div>
        </div>

        <div class="flex-between" style="margin-top: 2rem;">
          <button class="btn btn-secondary" onclick="window.ReportWasteView.goToStep(3)">
            ← Back
          </button>
          <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.submitRequest()">
            <span>🚀</span> Confirm & Submit Request
          </button>
        </div>
      </div>
    `;
  },

  // STEP 5: Request Confirmation & Request ID
  renderStep5() {
    const lastRequest = State.state.pickups[0];
    return `
      <div style="text-align: center; padding: 1.5rem 0;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;" class="animate-pulse-glow">
          🎉
        </div>

        <h2 style="color: var(--color-primary-dark); margin-bottom: 0.5rem;">Waste Request Created Successfully!</h2>
        <p style="font-size: 1rem; color: var(--text-muted); max-width: 520px; margin: 0 auto 1.75rem auto;">
          Your request is officially queued in the Municipal Waste Grid. A collection worker has been assigned.
        </p>

        <!-- Request Details Box -->
        <div style="background: #F8FAFC; border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; max-width: 480px; margin: 0 auto 2rem auto; text-align: left;">
          <div class="flex-between" style="margin-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Request ID</span>
            <strong style="color: var(--color-navy); font-size: 1rem; letter-spacing: 0.05em;">${lastRequest ? lastRequest.id : 'GK-2026-89421'}</strong>
          </div>

          <div class="flex-between" style="margin-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Status</span>
            <span class="badge" style="background: #FEF3C7; color: #92400E; font-weight: 700;">🟡 Awaiting Verification</span>
          </div>

          <div class="flex-between" style="margin-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Pickup Verification OTP</span>
            <strong style="color: var(--color-primary-dark); font-size: 1.25rem; letter-spacing: 0.15em;">${lastRequest ? lastRequest.otp : '8492'}</strong>
          </div>

          <div class="flex-between">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Expected Credits</span>
            <span class="badge badge-points">+${lastRequest ? lastRequest.pointsReward : 10} Green Credits</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-lg" onclick="window.AppRouter.navigate('live-tracking')">
            <span>📍</span> Track Live Collection On Map
          </button>
          <button class="btn btn-secondary btn-lg" onclick="window.AppRouter.navigate('dashboard')">
            Back to Dashboard
          </button>
        </div>
      </div>
    `;
  },

  goToStep(step) {
    SoundFX.playClick();
    this.currentStep = step;
    const contentBox = document.getElementById('wizard-step-content');
    if (contentBox) {
      contentBox.innerHTML = this.renderStepContent();
    }
    this.render();
  },

  setCategory(cat) {
    SoundFX.playClick();
    this.formData.category = cat;
    this.goToStep(1);
  },

  setPickupType(type) {
    SoundFX.playClick();
    this.formData.pickupType = type;
    this.goToStep(4);
  },

  updateWeight(val) {
    this.formData.quantity = parseFloat(val);
    const display = document.getElementById('weight-display');
    if (display) display.textContent = `${this.formData.quantity} KG`;
  },

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.photoUrl = e.target.result;
        SoundFX.playClick();
        this.goToStep(2);
      };
      reader.readAsDataURL(file);
    }
  },

  initStepMap() {
    const mapElement = document.getElementById('report-location-map');
    if (!mapElement || !window.L) return;

    this.mapInstance = MapHelper.initMap('report-location-map', [19.0760, 72.8777], 15);
    if (!this.mapInstance) return;

    const pin = MapHelper.createCustomPin('🏠', 'Your Location', '#16A34A');
    this.markerInstance = window.L.marker([19.0760, 72.8777], { icon: pin, draggable: true }).addTo(this.mapInstance);

    this.markerInstance.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      this.formData.address = `Near Coordinates (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}), Ward 4B`;
      const addrField = document.getElementById('form-address');
      if (addrField) addrField.value = this.formData.address;
    });
  },

  detectLocation() {
    SoundFX.playClick();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (this.mapInstance && this.markerInstance) {
            this.mapInstance.setView([lat, lng], 16);
            this.markerInstance.setLatLng([lat, lng]);
            this.formData.address = `GPS Detected Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Ward 4B`;
            const addrField = document.getElementById('form-address');
            if (addrField) addrField.value = this.formData.address;
          }
        },
        () => {
          alert('Using default city coordinates for Ward 4B.');
        }
      );
    }
  },

  submitRequest() {
    const newReq = State.createWasteRequest(this.formData);
    SoundFX.playPointsEarned();
    Confetti.trigger(80);
    this.currentStep = 5;
    this.render();
  }
};

window.ReportWasteView = ReportWasteView;
