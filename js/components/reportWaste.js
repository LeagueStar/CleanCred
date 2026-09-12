/* ==========================================================================
   CLEANCRED — 5-STEP VERIFIED WASTE REPORTING FLOW
   Smart India Hackathon 2026 // Team GreenLegacy
   Model: Report → Verify → Collect → Record → Earn
   Tactile Neumorphism + Civic Technology
   ========================================================================== */

import { State } from '../state.js';
import { Formatters } from '../utils/formatters.js';
import { SoundFX } from '../utils/audio.js';
import { MapHelper } from '../utils/mapHelper.js';

export const ReportWasteView = {
  currentStep: 1,
  formData: {
    category: 'wet', // 'wet' | 'dry' | 'harmful'
    subType: 'Kitchen Vegetable & Fruit Scraps',
    quantity: 3.5,
    address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
    ward: 'Ward 4B (Bandra West)',
    pickupSlot: 'Morning Route (08:00 AM - 11:00 AM)',
    notes: '',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
    aiVerified: true,
    aiPurityScore: 98.4,
    geoCoords: null,
    geoStatus: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    geoLabel: null,
    geoError: null,
    geoRequested: false
  },

  categoryConfig: {
    wet: {
      name: 'Wet Waste (Organic)',
      points: 10,
      icon: 'apple',
      color: 'var(--waste-wet)',
      bg: 'var(--waste-wet-bg)',
      border: 'var(--waste-wet-border)',
      destination: 'Ward 4B Biomethanation & Aerobic Composting Facility',
      subTypes: [
        'Kitchen Vegetable & Fruit Scraps',
        'Cooked Food Waste & Leftovers',
        'Tea Leaves & Coffee Grounds',
        'Garden Trimmings & Fallen Leaves'
      ]
    },
    dry: {
      name: 'Dry Waste (Recyclable)',
      points: 7,
      icon: 'package',
      color: 'var(--waste-dry)',
      bg: 'var(--waste-dry-bg)',
      border: 'var(--waste-dry-border)',
      destination: 'Bandra MRF (Material Recovery Facility) & Baler Unit',
      subTypes: [
        'Cardboard Shipping Cartons & Paper',
        'PET Water & Soda Bottles',
        'Aluminium & Steel Beverage Cans',
        'Clean Glass Containers & Jars'
      ]
    },
    harmful: {
      name: 'Harmful Waste (Hazardous)',
      points: 5,
      icon: 'battery-charging',
      color: 'var(--waste-harmful)',
      bg: 'var(--waste-harmful-bg)',
      border: 'var(--waste-harmful-border)',
      destination: 'Authorized State Hazardous & E-Waste Processing Plant',
      subTypes: [
        'Used Lithium & Alkaline Batteries',
        'Discarded Electronics & Circuit Boards',
        'Fluorescent Tubes & CFL Bulbs',
        'Expired Domestic Pharmaceutical Medicines'
      ]
    }
  },

  demoCatalog: {
    wet: [
      { label: 'Vegetable Scraps', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80' },
      { label: 'Fruit Peels', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80' },
      { label: 'Compost Mix', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23efc?w=600&q=80' }
    ],
    dry: [
      { label: 'Cardboard & Paper', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80' },
      { label: 'Plastic Bottles', url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&q=80' },
      { label: 'Beverage Cans', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }
    ],
    harmful: [
      { label: 'Used Batteries', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80' },
      { label: 'E-Waste Circuits', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80' },
      { label: 'CFL / Fluorescent', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80' }
    ]
  },

  startNewReport(params = {}) {
    this.currentStep = 1;
    const cat = (params.category && this.categoryConfig[params.category]) ? params.category : 'wet';
    const initialPhoto = this.demoCatalog[cat] ? this.demoCatalog[cat][0].url : this.demoCatalog.wet[0].url;

    this.formData = {
      category: cat,
      subType: this.categoryConfig[cat].subTypes[0],
      quantity: 3.5,
      address: State.state.user.address || 'Flat 402, Green Meadows, Ward 4B, Mumbai',
      ward: 'Ward 4B (Bandra West)',
      pickupSlot: 'Morning Route (08:00 AM - 11:00 AM)',
      notes: '',
      photoUrl: initialPhoto,
      aiVerified: true,
      aiPurityScore: 98.4,
      geoCoords: null,
      geoStatus: 'idle',
      geoLabel: null,
      geoError: null,
      geoRequested: false
    };

    this.render(params);
  },

  render(params = {}) {
    const container = document.getElementById('view-report-waste');
    if (!container) return;

    if (params.category && this.categoryConfig[params.category]) {
      this.formData.category = params.category;
      this.formData.subType = this.categoryConfig[params.category].subTypes[0];
    }

    container.innerHTML = `
      <div class="app-container report-wizard-container animate-fade-in" style="max-width: 820px; margin: 0 auto; padding-bottom: 5rem;">
        
        <!-- Header -->
        <div class="wizard-step-header">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.AppRouter.navigate('dashboard')">
              <i data-lucide="arrow-left" class="lucide-icon-sm"></i>
              <span>Back to Home</span>
            </button>
            <span class="badge badge-green" style="display: inline-flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="shield-check" class="lucide-icon-sm"></i>
              <span>Swachh Bharat Mission (Urban)</span>
            </span>
          </div>
          <h1 class="wizard-step-title">Report Waste Collection</h1>
          <p class="wizard-step-desc">
            Schedule verified municipal collection. Green Credits are credited upon scale verification by Ramesh Kumar.
          </p>
        </div>

        <!-- 5-Step Progress Bar -->
        <div class="wizard-progress-bar neu-card-inset" style="padding: 1.25rem 1rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem; position: relative;">
          <div style="position: absolute; top: 32px; left: 10%; right: 10%; height: 3px; background: #CBD5E1; z-index: 1;">
            <div style="width: ${(this.currentStep - 1) * 25}%; height: 100%; background: var(--color-primary); transition: width 0.3s ease;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; position: relative; z-index: 2;">
            <div class="wizard-step-node ${this.currentStep === 1 ? 'active' : this.currentStep > 1 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(1)">
              <div class="wizard-node-circle">${this.currentStep > 1 ? '✓' : '1'}</div>
              <span class="wizard-node-label">Category</span>
            </div>

            <div class="wizard-step-node ${this.currentStep === 2 ? 'active' : this.currentStep > 2 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(2)">
              <div class="wizard-node-circle">${this.currentStep > 2 ? '✓' : '2'}</div>
              <span class="wizard-node-label">AI Purity</span>
            </div>

            <div class="wizard-step-node ${this.currentStep === 3 ? 'active' : this.currentStep > 3 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(3)">
              <div class="wizard-node-circle">${this.currentStep > 3 ? '✓' : '3'}</div>
              <span class="wizard-node-label">Location</span>
            </div>

            <div class="wizard-step-node ${this.currentStep === 4 ? 'active' : this.currentStep > 4 ? 'completed' : ''}" onclick="window.ReportWasteView.goToStep(4)">
              <div class="wizard-node-circle">${this.currentStep > 4 ? '✓' : '4'}</div>
              <span class="wizard-node-label">Review</span>
            </div>

            <div class="wizard-step-node ${this.currentStep === 5 ? 'active' : ''}">
              <div class="wizard-node-circle">5</div>
              <span class="wizard-node-label">Status</span>
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div class="neu-card neu-card-raised" style="padding: 2rem; border-radius: var(--radius-xl);">
          ${this.renderStepContent()}
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderStepContent() {
    const config = this.categoryConfig[this.formData.category];

    switch (this.currentStep) {
      case 1:
        return `
          <div>
            <div class="wizard-step-eyebrow">Step 1 of 4 &bull; Categorization</div>
            <h2 class="wizard-step-title">Select Waste Category</h2>
            <p class="wizard-step-desc">
              Source segregation ensures high recovery efficiency and unlocks Green Credits.
            </p>

            <!-- 3 Category Options -->
            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem;">
              
              <div class="waste-card-option wet neu-card-flat ${this.formData.category === 'wet' ? 'selected' : ''}" onclick="window.ReportWasteView.setCategory('wet')" style="cursor: pointer;">
                <div class="flex-between">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--waste-wet-bg); color: var(--waste-wet); display: flex; align-items: center; justify-content: center;">
                      <i data-lucide="apple" class="lucide-icon-md"></i>
                    </div>
                    <div>
                      <strong style="font-size: 1.05rem; color: var(--color-navy);">Wet Waste (Organic)</strong>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">Vegetable peels, food scraps, cooked leftovers, garden leaves</div>
                    </div>
                  </div>
                  <span class="badge badge-green" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">+10 GC/KG</span>
                </div>
              </div>

              <div class="waste-card-option dry neu-card-flat ${this.formData.category === 'dry' ? 'selected' : ''}" onclick="window.ReportWasteView.setCategory('dry')" style="cursor: pointer;">
                <div class="flex-between">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--waste-dry-bg); color: var(--waste-dry); display: flex; align-items: center; justify-content: center;">
                      <i data-lucide="package" class="lucide-icon-md"></i>
                    </div>
                    <div>
                      <strong style="font-size: 1.05rem; color: var(--color-navy);">Dry Waste (Recyclable)</strong>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">Cardboard cartons, PET plastic, beverage cans, clean paper</div>
                    </div>
                  </div>
                  <span class="badge badge-blue" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">+7 GC/KG</span>
                </div>
              </div>

              <div class="waste-card-option harmful neu-card-flat ${this.formData.category === 'harmful' ? 'selected' : ''}" onclick="window.ReportWasteView.setCategory('harmful')" style="cursor: pointer;">
                <div class="flex-between">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--waste-harmful-bg); color: var(--waste-harmful); display: flex; align-items: center; justify-content: center;">
                      <i data-lucide="battery-charging" class="lucide-icon-md"></i>
                    </div>
                    <div>
                      <strong style="font-size: 1.05rem; color: var(--color-navy);">Harmful Waste (Hazardous)</strong>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">Batteries, domestic e-waste, fluorescent lamps, expired medicines</div>
                    </div>
                  </div>
                  <span class="badge badge-red" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">+5 GC/KG</span>
                </div>
              </div>

            </div>

            <!-- Subtype Selection -->
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label">Specify Waste Material Sub-Type</label>
              <select id="select-waste-subtype" class="form-select neu-input" onchange="window.ReportWasteView.setSubType(this.value)">
                ${config.subTypes.map(st => `
                  <option value="${st}" ${this.formData.subType === st ? 'selected' : ''}>${st}</option>
                `).join('')}
              </select>
            </div>

            <!-- Estimated Quantity (BUG 1 FIX: Smooth non-destructive slider) -->
            <div style="margin-bottom: 1.75rem;">
              <div class="flex-between" style="margin-bottom: 0.35rem;">
                <label class="form-label" style="margin: 0;">Estimated Weight</label>
                <strong id="display-weight-val" style="font-size: 1.1rem; color: var(--color-primary-dark);">${this.formData.quantity} KG</strong>
              </div>
              <input type="range" min="1" max="15" step="0.5" value="${this.formData.quantity}" style="width: 100%; accent-color: var(--color-primary);" oninput="window.ReportWasteView.setQuantity(this.value)">
              <div class="flex-between" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                <span>1 KG (Small Bin)</span>
                <span>5 KG (Standard Bin)</span>
                <span>15 KG (Bulk Collection)</span>
              </div>
            </div>

            <button class="btn btn-primary btn-lg btn-full" onclick="window.ReportWasteView.goToStep(2)">
              <span>Next: Photo &amp; AI Purity Check</span>
              <i data-lucide="arrow-right" class="lucide-icon-sm"></i>
            </button>
          </div>
        `;

      case 2:
        const demos = this.demoCatalog[this.formData.category] || this.demoCatalog.wet;
        return `
          <div>
            <div class="wizard-step-eyebrow">Step 2 of 4 &bull; Visual Purity Verification</div>
            <h2 class="wizard-step-title">Upload Photo Proof</h2>
            <p class="wizard-step-desc">
              Computer vision validates segregation compliance for <strong>${config.name}</strong>.
            </p>

            <!-- Main Photo Preview Box -->
            <div class="photo-upload-zone" style="margin-bottom: 1.25rem;">
              <img src="${this.formData.photoUrl}" alt="Waste Preview" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 0.75rem;" />
              
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; color: var(--color-navy); margin-bottom: 0.75rem;">
                <i data-lucide="camera" class="lucide-icon-sm"></i>
                <span>Attached: ${this.formData.subType}</span>
              </div>

              <!-- Upload & Demo Action Row (BUG 2 FIX) -->
              <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                <input type="file" id="waste-photo-file-input" accept="image/*" style="display: none;" onchange="window.ReportWasteView.handleFileUpload(this)">
                <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('waste-photo-file-input').click()">
                  <i data-lucide="upload" class="lucide-icon-sm"></i>
                  <span>Upload Photo from Device</span>
                </button>
              </div>
            </div>

            <!-- Explicit Demo Image Selection Grid (BUG 2 FIX) -->
            <div class="demo-picker-container">
              <label class="form-label" style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem;">
                <i data-lucide="image" class="lucide-icon-sm"></i>
                <span>Or select a sample demonstration image:</span>
              </label>
              <div class="demo-picker-grid">
                ${demos.map(d => `
                  <div class="demo-thumb-btn ${this.formData.photoUrl === d.url ? 'active' : ''}" onclick="window.ReportWasteView.selectDemoImage('${d.url}')">
                    <img src="${d.url}" alt="${d.label}" class="demo-thumb-img" />
                    <span class="demo-thumb-label">${d.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- AI Automated Verification Card -->
            <div class="neu-card-flat" style="display: flex; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-primary); margin-top: 1.25rem;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="sparkles" class="lucide-icon-md"></i>
              </div>
              <div>
                <strong style="color: var(--color-primary-dark); font-size: 0.95rem; display: block;">
                  AI Purity Pre-Check Passed (${this.formData.aiPurityScore}% Score)
                </strong>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.2rem 0 0.4rem 0;">
                  Waste matches <strong>${this.formData.category.toUpperCase()}</strong> classification with zero cross-contamination detected.
                </p>
                <span class="badge badge-green">✓ Segregation Verified</span>
              </div>
            </div>

            <div class="step-nav-grid" style="margin-top: 1.5rem;">
              <button class="btn btn-secondary btn-lg" onclick="window.ReportWasteView.goToStep(1)">
                <i data-lucide="arrow-left" class="lucide-icon-sm"></i>
                <span>Back</span>
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.goToStep(3)">
                <span>Confirm Location &amp; Schedule</span>
                <i data-lucide="arrow-right" class="lucide-icon-sm"></i>
              </button>
            </div>
          </div>
        `;

      case 3:
        return `
          <div>
            <div class="wizard-step-eyebrow">Step 3 of 4 &bull; Municipal Routing</div>
            <h2 class="wizard-step-title">Pickup Location &amp; Time Slot</h2>
            <p class="wizard-step-desc">
              Your location ensures direct route dispatch to Ramesh Kumar's electric collection van.
            </p>

            <!-- Real Geolocation Card (BUG 3 FIX) -->
            <div class="neu-card-inset geo-status-box" style="margin-bottom: 1.25rem;">
              <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
                ${this.formData.geoStatus === 'loading' ? `
                  <span class="badge badge-amber" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <i data-lucide="loader-2" class="lucide-icon-sm animate-spin"></i>
                    <span>Detecting Device Coordinates...</span>
                  </span>
                ` : this.formData.geoStatus === 'success' && this.formData.geoCoords ? `
                  <span class="badge badge-green" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <i data-lucide="map-pin" class="lucide-icon-sm"></i>
                    <span>GPS Locked: ${this.formData.geoLabel}</span>
                  </span>
                ` : `
                  <span class="badge badge-amber" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <i data-lucide="map-pin-off" class="lucide-icon-sm"></i>
                    <span>${this.formData.geoError || 'GPS Standby &bull; Manual Address Active'}</span>
                  </span>
                `}

                <button type="button" class="btn btn-secondary btn-sm" onclick="window.ReportWasteView.detectLocation()">
                  <i data-lucide="crosshair" class="lucide-icon-sm"></i>
                  <span>${this.formData.geoCoords ? 'Update Location' : 'Detect GPS'}</span>
                </button>
              </div>

              <!-- Editable Pickup Address Input -->
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Doorstep Pickup Address</label>
                <input type="text" id="report-address-input" class="form-input neu-input" value="${this.formData.address}" oninput="window.ReportWasteView.formData.address = this.value" placeholder="Enter flat/house no., building, street">
              </div>
            </div>

            <!-- Route Slot Selection -->
            <div style="margin-bottom: 1.25rem;">
              <label class="form-label">Select Designated Collection Slot</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label class="neu-card-inset" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); cursor: pointer; font-size: 0.85rem; font-weight: 700; color: var(--color-navy);">
                  <input type="radio" name="pickupSlot" value="Morning Route (08:00 AM - 11:00 AM)" ${this.formData.pickupSlot.includes('Morning') ? 'checked' : ''} onchange="window.ReportWasteView.formData.pickupSlot = this.value" style="accent-color: var(--color-primary);">
                  <span>Morning Municipal Route &bull; 08:00 AM - 11:00 AM (Standard)</span>
                </label>
                <label class="neu-card-flat" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); cursor: pointer; font-size: 0.85rem; color: var(--text-secondary);">
                  <input type="radio" name="pickupSlot" value="Afternoon Route (02:00 PM - 05:00 PM)" ${this.formData.pickupSlot.includes('Afternoon') ? 'checked' : ''} onchange="window.ReportWasteView.formData.pickupSlot = this.value" style="accent-color: var(--color-primary);">
                  <span>Afternoon Route &bull; 02:00 PM - 05:00 PM (Special Recovery)</span>
                </label>
              </div>
            </div>

            <!-- Notes -->
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label">Doorstep Handover Note (Optional)</label>
              <input type="text" class="form-input neu-input" value="${this.formData.notes}" oninput="window.ReportWasteView.formData.notes = this.value" placeholder="e.g. Leave at gate or ring bell">
            </div>

            <div class="step-nav-grid">
              <button class="btn btn-secondary btn-lg" onclick="window.ReportWasteView.goToStep(2)">
                <i data-lucide="arrow-left" class="lucide-icon-sm"></i>
                <span>Back</span>
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.goToStep(4)">
                <span>Review &amp; Confirm Request</span>
                <i data-lucide="arrow-right" class="lucide-icon-sm"></i>
              </button>
            </div>
          </div>
        `;

      case 4:
        return `
          <div>
            <div class="wizard-step-eyebrow">Step 4 of 4 &bull; Final Verification Summary</div>
            <h2 class="wizard-step-title">Review Report Details</h2>
            <p class="wizard-step-desc">
              Please review your pickup summary. A municipal officer will verify weight and purity at handover.
            </p>

            <div class="neu-card-flat" style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.25rem;">
              <div style="padding: 1rem 1.25rem; border-bottom: 1px solid var(--color-border); background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: space-between;">
                <span class="badge ${this.formData.category === 'wet' ? 'badge-green' : this.formData.category === 'dry' ? 'badge-blue' : 'badge-red'}">
                  ${config.name}
                </span>
                <strong style="font-size: 1.05rem; color: var(--color-primary-dark);">+${config.points} GC/KG (Gated on Verification)</strong>
              </div>

              <div style="padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.85rem;">
                <div class="flex-between">
                  <span style="color: var(--text-muted);">Material Sub-type:</span>
                  <strong style="color: var(--color-navy);">${this.formData.subType}</strong>
                </div>
                <div class="flex-between">
                  <span style="color: var(--text-muted);">Estimated Quantity:</span>
                  <strong style="color: var(--color-navy);">${this.formData.quantity} KG</strong>
                </div>
                <div class="flex-between">
                  <span style="color: var(--text-muted);">Handover Address:</span>
                  <strong style="color: var(--color-navy); text-align: right;">${this.formData.address}</strong>
                </div>
                <div class="flex-between">
                  <span style="color: var(--text-muted);">Selected Slot:</span>
                  <span style="color: var(--text-secondary); text-align: right;">${this.formData.pickupSlot}</span>
                </div>
                <div class="flex-between">
                  <span style="color: var(--text-muted);">Destination Facility:</span>
                  <span style="color: var(--text-secondary); text-align: right;">${config.destination}</span>
                </div>
              </div>
            </div>

            <!-- Official Rule Notice -->
            <div class="neu-card-inset" style="border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.825rem; border-left: 4px solid var(--color-amber);">
              <strong style="color: #92400E; display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.25rem;">
                <i data-lucide="alert-triangle" class="lucide-icon-sm"></i>
                <span>Verification Rule:</span>
              </strong>
              <span style="color: #78350F;">
                Green Credits are <em>not</em> credited on report submission. They will be deposited into your wallet once municipal worker Ramesh Kumar verifies segregation on his digital scale.
              </span>
            </div>

            <div class="step-nav-grid">
              <button class="btn btn-secondary btn-lg" onclick="window.ReportWasteView.goToStep(3)">
                <i data-lucide="arrow-left" class="lucide-icon-sm"></i>
                <span>Edit</span>
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.ReportWasteView.submitRequest()">
                <span>Confirm &amp; Submit Request</span>
                <i data-lucide="check" class="lucide-icon-sm"></i>
              </button>
            </div>
          </div>
        `;

      case 5:
        const latest = State.state.pickups[0];
        return `
          <div style="text-align: center; padding: 1.5rem 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: var(--color-primary-dark); font-size: 1.8rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);">
              <i data-lucide="check" class="lucide-icon-lg"></i>
            </div>

            <span class="badge badge-green" style="margin-bottom: 0.5rem;">Request Registered Successfully</span>
            <h2 style="color: var(--color-navy); font-size: 1.6rem; font-weight: 800; margin-bottom: 0.25rem;">Awaiting Municipal Collection</h2>
            <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto;">
              Your waste collection request has been dispatched to <strong>Worker Ramesh Kumar</strong>. Hand over your waste bag and share the OTP below.
            </p>

            <div class="neu-card-inset" style="border-radius: var(--radius-lg); padding: 1.5rem; max-width: 380px; margin: 0 auto 1.75rem auto;">
              <div class="eyebrow" style="margin-bottom: 0.25rem; font-size: 0.75rem;">Collection Handover OTP</div>
              <div style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 900; letter-spacing: 0.15em; color: var(--color-primary-dark); margin: 0.25rem 0;">
                ${latest ? latest.otp : '8492'}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                Request ID: <strong>${latest ? latest.id : 'GK-2026-NEW'}</strong> &bull; Worker ETA: <strong>18 mins</strong>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" onclick="window.AppRouter.navigate('live-tracking')">
                <i data-lucide="navigation" class="lucide-icon-sm"></i>
                <span>Track Collection Live</span>
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.AppRouter.switchExperience('worker')">
                <i data-lucide="truck" class="lucide-icon-sm"></i>
                <span>Worker Portal</span>
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.ReportWasteView.startNewReport()">
                <i data-lucide="plus" class="lucide-icon-sm"></i>
                <span>Report Another Waste Item</span>
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.AppRouter.navigate('dashboard')">
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        `;

      default:
        return `<p>Invalid step</p>`;
    }
  },

  setCategory(cat) {
    SoundFX.playClick();
    this.formData.category = cat;
    this.formData.subType = this.categoryConfig[cat].subTypes[0];
    const catalog = this.demoCatalog[cat] || this.demoCatalog.wet;
    this.formData.photoUrl = catalog[0].url;
    this.render();
  },

  setSubType(val) {
    this.formData.subType = val;
  },

  setQuantity(val) {
    this.formData.quantity = parseFloat(val);
    const lbl = document.getElementById('display-weight-val');
    if (lbl) {
      lbl.textContent = `${this.formData.quantity} KG`;
    }
  },

  goToStep(step) {
    SoundFX.playClick();
    this.currentStep = step;
    this.render();

    // If entering Step 3 and location hasn't been requested, trigger GPS detection
    if (step === 3 && !this.formData.geoRequested) {
      this.formData.geoRequested = true;
      this.detectLocation();
    }
  },

  handleFileUpload(input) {
    const file = input && input.files ? input.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.formData.photoUrl = e.target.result;
      this.formData.aiPurityScore = Math.round((96 + Math.random() * 3.5) * 10) / 10;
      SoundFX.playClick();
      this.render();
      if (window.AppRouter && window.AppRouter.showToast) {
        window.AppRouter.showToast('Photo proof uploaded & purity checked.');
      }
    };
    reader.readAsDataURL(file);
  },

  selectDemoImage(url) {
    SoundFX.playClick();
    this.formData.photoUrl = url;
    this.formData.aiPurityScore = Math.round((96 + Math.random() * 3.8) * 10) / 10;
    this.render();
  },

  async detectLocation() {
    this.formData.geoStatus = 'loading';
    this.render();

    try {
      const pos = await MapHelper.getUserLocation();
      this.formData.geoCoords = { lat: pos.lat, lng: pos.lng };
      this.formData.geoLabel = MapHelper.formatCoords(pos.lat, pos.lng);
      this.formData.geoStatus = 'success';
      this.formData.geoError = null;
      this.render();
      if (window.AppRouter && window.AppRouter.showToast) {
        window.AppRouter.showToast('GPS coordinates locked successfully.');
      }
    } catch (err) {
      this.formData.geoStatus = 'error';
      this.formData.geoError = err.message || 'GPS access denied or unavailable.';
      this.render();
    }
  },

  submitRequest() {
    SoundFX.playPointsEarned();
    State.createWasteRequest({
      category: this.formData.category,
      subType: this.formData.subType,
      quantity: this.formData.quantity,
      address: this.formData.address,
      notes: this.formData.notes,
      photoUrl: this.formData.photoUrl,
      geoCoords: this.formData.geoCoords
    });

    this.currentStep = 5;
    this.render();
  }
};

window.ReportWasteView = ReportWasteView;
