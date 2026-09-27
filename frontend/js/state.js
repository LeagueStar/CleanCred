/* ==========================================================================
   CLEANCRED — REACTIVE STATE STORE & BACKEND INTEGRATION
   ==========================================================================
   This module provides the central application state management for CleanCred:
   
   1. REACTIVE STORE:
      - Encapsulates active role ('citizen' | 'worker' | 'admin' | 'institution'),
        user profile metrics, waste pickup queue, municipal analytics, and notifications.
      - Implements an Observer pattern via `subscribe(listener)`: subscribers receive
        `(newState, action, payload)` updates whenever `update()` or state transitions occur.

   2. STORAGE VERSIONING & LOCAL PERSISTENCE:
      - Persists demo state in `localStorage` under `cleancredDemoState_v3`.
      - Tracks schema version `STORAGE_VERSION = 3`.
      - Guarded against schema drift: if stored data version differs or deserialization
        fails, local cache is safely evicted and state reverts to canonical `getSeedState()`.

   3. AUTHENTICATION BOOTSTRAP:
      - Self-bootstraps demo sessions on startup (`initAuth()`) by logging into the
        backend using standard demo role PINs:
        * Citizen: DemoTester (PIN: 1234)
        * Worker:  DemoCollector (PIN: 5678)
        * Admin:   DemoAdmin (PIN: 9999)
      - Caches Bearer tokens in `this.sessions` for seamless role switching.

   4. API CLIENT & SYNC:
      - Provides `apiFetch(path, opts)` wrapper that injects role Bearer tokens and
        enforces structured JSON error reporting.
      - Periodically synchronizes live data (`syncWithBackend()`) against FastAPI endpoints:
        `/reports/mine`, `/wallet/{user_id}`, and `/analytics`.
      - Bridges UI operations directly to the backend:
        * `submitReport()`: Multipart/form-data upload to POST /reports.
        * `verifyPickup()`: POST /verify with geolocation hard gate (<= 50m).
        * `collectPickup()`: POST /collect with one-time QR code burn & ledger crediting.
   ========================================================================== */

import { Formatters } from './utils/formatters.js';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Demo persistence (localStorage) — see saveState()/restoreState()/resetState()
const STORAGE_KEY = 'cleancredDemoState_v3';
const STORAGE_VERSION = 3;

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.restoreState() || this.getSeedState();
    this.sessions = { citizen: null, worker: null, admin: null };
    this.authReady = this.initAuth();
    this.authReady.then(() => this.syncWithBackend()).catch(e => console.warn('CleanCred: Initial sync warning:', e));
  }

  // Original seed/demo dataset. Also used by resetState() to restore
  // the app to its starting condition.
  getSeedState() {
    return {
      // Current User Role: 'citizen' | 'worker' | 'admin' | 'institution'
      currentRole: 'citizen',

      // Citizen Profile (DemoTester)
      user: {
        id: 'usr_demotester_99',
        name: 'DemoTester',
        email: 'demotester@cleancred.org',
        phone: '+91 98765 43210',
        avatar: 'DT',
        address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
        greenPoints: 1250, // 100 Credits = ₹10 => ₹125
        get greenCredits() { return this.greenPoints; },
        set greenCredits(val) { this.greenPoints = val; },
        lifetimeWasteKg: 125,
        pickupsCompleted: 18,
        co2SavedKg: 84.5,
        treesEquivalent: 6.2,
        waterSavedLitres: 480,
        // Category breakdown of lifetimeWasteKg — kept in sync with it
        // (wet + dry + harmful === lifetimeWasteKg) so the Impact
        // Dashboard's composition card can derive real percentages.
        wasteByCategoryKg: { wet: 48, dry: 65, harmful: 12 },
        rank: 12,
        greenStreakDays: 8,
        kycVerified: true,
        joinDate: '12 Jan 2026'
      },

      // Municipal Worker Profile (DemoCollector)
      worker: {
        id: 'wrk_democollector',
        name: 'DemoCollector',
        zone: 'Zone 4 — Ward 4B (West Bandra)',
        vehicle: 'Electric Waste Van (MH-02-GK-4091)',
        rating: 4.9,
        todayCollections: 14,
        totalVerifiedKg: 1840,
        status: 'Active on Route'
      },

      // Government / Municipal City Data (Smart City Command Center)
      cityStats: {
        totalWasteTons: 24850,
        recycledPercentage: 68,
        activeCitizens: 125420,
        verifiedPickups: 87540,
        wasteDiversionRate: 42,
        greenPointsIssued: 4850000,
        greenPointsRedeemed: 3920000,
        hotspotsResolved: 342,
        // Category breakdown of totalWasteTons — kept in sync with it
        // so the admin Segregation Ratio chart derives real percentages.
        wasteByCategoryTons: { wet: 12922, dry: 8946, harmful: 2982 },
        connectedDatabases: [
          { name: 'Application', status: 'LOCAL DEMO', detail: 'Interactive prototype running in this browser' },
          { name: 'Data Store', status: 'BROWSER PERSISTENCE', detail: 'Demo state is saved locally on this device' },
          { name: 'Municipal Integration', status: 'PROTOTYPE', detail: 'Workflow demonstration; no live city system is connected' },
          { name: 'MRF Network', status: 'DEMO DATASET', detail: 'Recovery stages are represented with sample data' }
        ]
      },

      // Active & Historical Pickup Requests
      pickups: [
        {
          id: 'GK-2026-89421',
          category: 'wet',
          categoryName: 'Wet Waste (Organic)',
          pointsReward: 10,
          quantityKg: 4.5,
          subType: 'Kitchen Vegetable & Fruit Scraps',
          address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          status: 'on_the_way', // 'created', 'assigned', 'on_the_way', 'collected', 'verified', 'rejected'
          workerName: 'DemoCollector',
          workerPhone: '+91 98111 22334',
          vehicleNo: 'MH-02-GK-4091',
          otp: '8492',
          etaMinutes: 12,
          currentLocation: [19.0620, 72.8410],
          destinationLocation: [19.0760, 72.8777],
          notes: 'Biodegradable green bin kept at doorstep'
        },
        {
          id: 'GK-2026-89210',
          category: 'dry',
          categoryName: 'Dry Waste (Recyclable)',
          pointsReward: 7,
          quantityKg: 8.2,
          subType: 'Cardboard cartons & PET beverage bottles',
          address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
          createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
          status: 'verified',
          workerName: 'DemoCollector',
          otp: '5120',
          pointsCredited: 7
        },
        {
          id: 'GK-2026-88741',
          category: 'harmful',
          categoryName: 'Harmful Waste (Hazardous)',
          pointsReward: 5,
          quantityKg: 2.0,
          subType: 'Used Lithium Batteries & Broken Fluorescent Tube',
          address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
          createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
          status: 'verified',
          workerName: 'Sunil Jadhav',
          otp: '3941',
          pointsCredited: 5
        }
      ],

      // Assigned queue for worker portal
      workerQueue: [
        {
          id: 'GK-2026-89421',
          userName: 'DemoTester',
          address: 'Flat 402, Green Meadows, Ward 4B',
          category: 'wet',
          subType: 'Kitchen Scraps',
          quantityKg: 4.5,
          pointsReward: 10,
          status: 'on_the_way',
          otp: '8492',
          photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80'
        },
        {
          id: 'GK-2026-89512',
          userName: 'Aanya Sharma',
          address: 'B-14 Silver Oak Apt, Hill Road',
          category: 'dry',
          subType: 'Paper & Metal Cans',
          quantityKg: 6.0,
          pointsReward: 7,
          status: 'assigned',
          otp: '1984',
          photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&q=80'
        },
        {
          id: 'GK-2026-89601',
          userName: 'Rohit Verma',
          address: 'Sector 3, Sunrise Society',
          category: 'harmful',
          subType: 'Medical & E-waste',
          quantityKg: 1.5,
          pointsReward: 5,
          status: 'assigned',
          otp: '7721',
          photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80'
        }
      ],

      // Rewards & Fintech Transactions
      transactions: [
        {
          id: 'TXN-849102',
          title: 'Wet Waste Pickup Verified',
          category: 'EARN',
          amountGp: 10,
          equivalentInr: 1,
          date: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          type: 'credit',
          status: 'SUCCESS',
          refId: 'GK-2026-89210'
        },
        {
          id: 'TXN-848011',
          title: '7-Day Green Streak Bonus',
          category: 'STREAK',
          amountGp: 25,
          equivalentInr: 2.5,
          date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          type: 'credit',
          status: 'SUCCESS'
        },
        {
          id: 'TXN-846200',
          title: 'Jio Mobile Recharge ₹10',
          category: 'RECHARGE',
          amountGp: 100,
          equivalentInr: 10,
          date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          type: 'debit',
          status: 'SUCCESS',
          meta: 'Mob: 9876543210 (Jio Prepaid)'
        },
        {
          id: 'TXN-845119',
          title: 'Weekly Segregation Challenge Completed',
          category: 'CHALLENGE',
          amountGp: 50,
          equivalentInr: 5,
          date: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
          type: 'credit',
          status: 'SUCCESS'
        }
      ],

      // Gamified Badges
      badges: [
        {
          id: 'badge_1',
          name: 'First Recycler',
          icon: '🌱',
          description: 'Completed your very first segregated waste pickup.',
          unlocked: true,
          unlockedAt: '15 Jan 2026'
        },
        {
          id: 'badge_2',
          name: '100 KG Recycled',
          icon: '♻️',
          description: 'Diverted over 100 kilograms of waste from city landfills.',
          unlocked: true,
          unlockedAt: '20 Aug 2026'
        },
        {
          id: 'badge_3',
          name: '7-Day Green Streak',
          icon: '🔥',
          description: 'Logged segregated waste 7 consecutive days in a row.',
          unlocked: true,
          unlockedAt: '28 Aug 2026'
        },
        {
          id: 'badge_4',
          name: 'Eco Champion',
          icon: '🏆',
          description: 'Accumulate more than 2,000 Credits.',
          unlocked: false,
          progress: 62.5 // 1250/2000
        },
        {
          id: 'badge_5',
          name: 'Planet Protector',
          icon: '🌎',
          description: 'Save 100+ KG of CO₂ emissions through responsible disposal.',
          unlocked: false,
          progress: 84.5 // 84.5/100
        },
        {
          id: 'badge_6',
          name: 'Waste Warrior',
          icon: '🚮',
          description: 'Successfully reported and helped clear harmful waste.',
          unlocked: true,
          unlockedAt: '10 Feb 2026'
        },
        {
          id: 'badge_7',
          name: 'Community Hero',
          icon: '🏅',
          description: 'Reported verified illegal dumping hotspots in your ward.',
          unlocked: false,
          progress: 50
        }
      ],

      // Daily & Weekly Challenges
      challenges: [
        {
          id: 'ch_1',
          title: 'Weekly Segregation Master',
          description: 'Segregate waste correctly 5 times this week.',
          current: 4,
          target: 5,
          rewardGp: 50,
          daysLeft: 3,
          category: 'weekly'
        },
        {
          id: 'ch_2',
          title: 'Plastic Recovery Sprint',
          description: 'Recycle 10 plastic containers, boxes, or bottles.',
          current: 7,
          target: 10,
          rewardGp: 20,
          daysLeft: 2,
          category: 'daily'
        },
        {
          id: 'ch_3',
          title: 'Zero Single-Use Plastic',
          description: 'Avoid single-use plastic bags for 7 consecutive days.',
          current: 5,
          target: 7,
          rewardGp: 30,
          daysLeft: 2,
          category: 'weekly'
        },
        {
          id: 'ch_4',
          title: 'Spot & Clean Hotspot',
          description: 'Report an illegal dumping hotspot in your ward.',
          current: 0,
          target: 1,
          rewardGp: 20,
          daysLeft: 5,
          category: 'weekly'
        }
      ],

      // Leaderboard dataset
      leaderboards: {
        global: [
          { rank: 1, name: 'Aarav Mehta', avatar: 'AM', points: 5420, wasteKg: 520, streak: 34, location: 'Mumbai' },
          { rank: 2, name: 'Priya Sharma', avatar: 'PS', points: 4980, wasteKg: 460, streak: 28, location: 'Bengaluru' },
          { rank: 3, name: 'Vikramaditya Roy', avatar: 'VR', points: 4650, wasteKg: 430, streak: 25, location: 'Delhi' },
          { rank: 4, name: 'Ananya Gupta', avatar: 'AG', points: 3890, wasteKg: 370, streak: 19, location: 'Pune' },
          { rank: 5, name: 'Karan Malhotra', avatar: 'KM', points: 3410, wasteKg: 310, streak: 15, location: 'Hyderabad' },
          { rank: 12, name: 'DemoTester (You)', avatar: 'DT', points: 1250, wasteKg: 125, streak: 8, location: 'Mumbai', isUser: true }
        ],
        city: [
          { rank: 1, name: 'Aarav Mehta', avatar: 'AM', points: 5420, wasteKg: 520, streak: 34, location: 'Ward 2A' },
          { rank: 2, name: 'Sneha Deshmukh', avatar: 'SD', points: 4210, wasteKg: 400, streak: 22, location: 'Ward 4B' },
          { rank: 3, name: 'Rahul Rane', avatar: 'RR', points: 3950, wasteKg: 380, streak: 18, location: 'Ward 7C' },
          { rank: 8, name: 'DemoTester (You)', avatar: 'DT', points: 1250, wasteKg: 125, streak: 8, location: 'Ward 4B', isUser: true }
        ],
        neighborhood: [
          { rank: 1, name: 'Sneha Deshmukh', avatar: 'SD', points: 4210, wasteKg: 400, streak: 22, location: 'Bldg 3' },
          { rank: 2, name: 'Rohan Patil', avatar: 'RP', points: 2150, wasteKg: 210, streak: 14, location: 'Bldg 8' },
          { rank: 3, name: 'DemoTester (You)', avatar: 'DT', points: 1250, wasteKg: 125, streak: 8, location: 'Bldg 4', isUser: true }
        ],
        college: [
          { rank: 1, name: 'IIT Bombay Eco Cell', avatar: 'IIT', points: 38400, wasteKg: 3600, location: 'Powai Campus' },
          { rank: 2, name: 'BITS Pilani Green Club', avatar: 'BP', points: 31200, wasteKg: 2950, location: 'Goa Campus' },
          { rank: 3, name: 'Delhi University Nature Hub', avatar: 'DU', points: 27800, wasteKg: 2600, location: 'North Campus' }
        ],
        school: [
          { rank: 1, name: 'Delhi Public School Green Club', avatar: 'DPS', points: 19500, wasteKg: 1840, location: 'RK Puram' },
          { rank: 2, name: 'The Mother\'s International School', avatar: 'MIS', points: 16200, wasteKg: 1510, location: 'New Delhi' },
          { rank: 3, name: 'St. Xavier\'s Eco Brigade', avatar: 'SX', points: 14800, wasteKg: 1390, location: 'Mumbai' }
        ]
      },

      // Illegal Dumping Reports
      illegalDumpingReports: [
        {
          id: 'DUMP-2026-104',
          location: 'Under Flyover, Link Road, Ward 4B',
          wasteType: 'Construction Debris & Mixed Plastics',
          reportedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          status: 'Investigating', // 'Submitted', 'Assigned', 'Investigating', 'Resolved'
          photoUrl: 'https://images.unsplash.com/photo-1611288875785-58586c06a4b1?w=300&q=80',
          rewardGp: 20
        },
        {
          id: 'DUMP-2026-098',
          location: 'Near Old Water Tank, Sector 9',
          wasteType: 'Abandoned Commercial Waste',
          reportedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          status: 'Resolved',
          photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=300&q=80',
          rewardGp: 20,
          pointsCredited: true
        }
      ],

      // Notifications Feed
      notifications: [
        {
          id: 'notif_1',
          title: '🚚 Pickup On The Way',
          message: 'Your assigned worker is en route to your location for request #GK-2026-89421.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          type: 'pickup'
        },
        {
          id: 'notif_2',
          title: '+10 Credits issued',
          message: 'Wet waste collection #GK-2026-89210 verified successfully by municipal inspector.',
          timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          read: false,
          type: 'points'
        },
        {
          id: 'notif_3',
          title: '🔥 8-Day Green Streak!',
          message: 'Keep logging segregated waste daily to unlock the Eco Master +50 Credits milestone.',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          read: true,
          type: 'streak'
        },
        {
          id: 'notif_4',
          title: '📱 Recharge Successful',
          message: '₹10 Jio recharge applied successfully using 100 Credits.',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          read: true,
          type: 'reward'
        }
      ]
    };
  }

  // ------------------------------------------------------------------
  // Demo persistence (localStorage)
  // ------------------------------------------------------------------

  // Attempt to restore a previously saved demo session. Returns null
  // (falling back to the seed state) if nothing is saved, or if what's
  // saved is missing/corrupted/from an incompatible schema version.
  restoreState() {
    try {
      try { localStorage.removeItem('greenLegacyDemoState'); } catch (_) {}
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const looksValid = parsed
        && (parsed.version === STORAGE_VERSION || parsed.schemaVersion === STORAGE_VERSION)
        && parsed.state
        && parsed.state.user
        && parsed.state.cityStats
        && Array.isArray(parsed.state.pickups)
        && Array.isArray(parsed.state.transactions);

      if (!looksValid) {
        console.warn('CleanCred: saved demo state was missing/invalid or outdated — starting from the seed state.');
        return null;
      }

      if (parsed.state.user && typeof parsed.state.user.greenPoints === 'number') {
        Object.defineProperty(parsed.state.user, 'greenCredits', {
          get() { return this.greenPoints; },
          set(v) { this.greenPoints = v; },
          configurable: true,
          enumerable: true
        });
      }

      return parsed.state;
    } catch (e) {
      console.warn('CleanCred: saved demo state was corrupted — starting from the seed state.', e);
      return null;
    }
  }

  // Persist the current state. Called automatically after every
  // state-mutating action (see notify()). Best-effort: a demo should
  // keep working even if localStorage is unavailable or full.
  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: STORAGE_VERSION,
        schemaVersion: STORAGE_VERSION,
        state: this.state
      }));
    } catch (e) {
      console.warn('CleanCred: could not save demo state to localStorage.', e);
    }
  }

  // Wipe the saved session and restore the original seed data.
  resetState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('greenLegacyDemoState');
    } catch (e) {
      // Ignore — saveState() below will just overwrite it if it still exists.
    }
    this.state = this.getSeedState();
    this.saveState();
    this.notify();
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.saveState();
    this.listeners.forEach(fn => fn(this.state));
  }

  // Set Active Role
  setRole(role) {
    this.state.currentRole = role;
    this.notify();
  }

  // ------------------------------------------------------------------
  // Authentication & API Client
  // ------------------------------------------------------------------
  async initAuth() {
    try {
      const [citizenAuth, workerAuth, adminAuth] = await Promise.all([
        this.loginOrRegister('citizen', 1, '1234', 'DemoTester'),
        this.loginOrRegister('worker', 2, '5678', 'DemoCollector'),
        this.loginOrRegister('admin', 3, '9999', 'DemoAdmin')
      ]);
      if (citizenAuth) this.sessions.citizen = citizenAuth;
      if (workerAuth) this.sessions.worker = workerAuth;
      if (adminAuth) this.sessions.admin = adminAuth;
    } catch (e) {
      console.warn('CleanCred: Auth initialization warning:', e);
    }
  }

  async loginOrRegister(role, id, pin, defaultName) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id, pin })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`CleanCred: Auth login failed for ${role}:`, e);
      return null;
    }

    // Attempt creation if user is not in database
    try {
      const reg = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: defaultName, role, pin })
      });
      if (reg.ok) {
        const u = await reg.json();
        const res2 = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: u.id, pin })
        });
        if (res2.ok) return await res2.json();
      }
    } catch (e) {
      console.warn(`CleanCred: User registration fallback failed for ${role}:`, e);
    }
    return null;
  }

  async apiFetch(path, options = {}, role = null) {
    if (this.authReady) {
      await this.authReady;
    }
    const currentRole = role || this.state.currentRole || 'citizen';
    const session = this.sessions[currentRole] || this.sessions.citizen;
    const headers = Object.assign({}, options.headers || {});
    if (session && session.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    let body = options.body;
    if (body && !(body instanceof FormData) && typeof body === 'object') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg = errorData.detail || errorData.message || res.statusText || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.detail = errorData.detail;
      throw err;
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return res;
  }

  async ensureImageBlob(formData) {
    if (formData.photoFile instanceof Blob) {
      return formData.photoFile;
    }
    if (formData.photoUrl && formData.photoUrl.startsWith('data:image')) {
      const res = await fetch(formData.photoUrl);
      return await res.blob();
    }
    if (formData.photoUrl && (formData.photoUrl.startsWith('http://') || formData.photoUrl.startsWith('https://'))) {
      try {
        const res = await fetch(formData.photoUrl, { mode: 'cors' });
        if (res.ok) {
          const b = await res.blob();
          return new File([b], 'demo_waste.jpg', { type: b.type || 'image/jpeg' });
        }
      } catch (e) {
        // CORS fallback
      }
    }
    // Synthesize realistic jpeg blob on canvas
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = formData.category === 'wet' ? '#15803d' : (formData.category === 'dry' ? '#1d4ed8' : '#b91c1c');
    ctx.fillRect(0, 0, 320, 320);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(formData.subType || formData.category || 'Waste Evidence', 24, 160);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    return new File([blob], `${formData.category || 'waste'}_sample.jpg`, { type: 'image/jpeg' });
  }

  // ------------------------------------------------------------------
  // Reactive Store & Backend Sync
  // ------------------------------------------------------------------
  async syncWithBackend() {
    try {
      if (this.authReady) await this.authReady;

      // 1. Sync Citizen's own reports via GET /reports/mine (Citizen auth)
      try {
        const myReports = await this.apiFetch('/reports/mine', {}, 'citizen');
        if (Array.isArray(myReports)) {
          const mappedReports = myReports.map(r => {
            const rawCat = (r.category || 'WET').toLowerCase();
            const cat = rawCat === 'hazardous' ? 'harmful' : rawCat;
            const existing = this.state.pickups.find(p => String(p.id) === String(r.id));
            let status = 'created';
            if (r.collected_at || r.status === 'COLLECTED') {
              status = 'collected';
            } else if (r.status === 'READY_FOR_COLLECTION') {
              status = 'READY_FOR_COLLECTION';
            } else if (r.status === 'WORKER_REJECTED') {
              status = 'rejected';
            } else if (existing && (existing.status === 'assigned' || existing.status === 'on_the_way')) {
              status = existing.status;
            }

            return {
              id: String(r.id),
              category: cat,
              categoryName: cat === 'wet' ? 'Wet Waste (Organic)' : (cat === 'dry' ? 'Dry Waste (Recyclable)' : 'Harmful Waste (Hazardous)'),
              pointsReward: r.category === 'HAZARDOUS' ? 15 : (r.category === 'WET' ? 12 : 13),
              quantityKg: 3.5,
              subType: `${r.category} Waste`,
              address: this.state.user.address || 'Flat 402, Green Meadows, Ward 4B, Mumbai',
              createdAt: r.captured_at,
              status,
              workerName: 'DemoCollector',
              workerPhone: '+91 98111 22334',
              vehicleNo: 'MH-02-GK-4091',
              otp: String(r.id).padStart(4, '0'),
              etaMinutes: 12,
              verification_score: r.verification_score,
              risk_level: r.risk_level,
              risk_flags: r.risk_flags,
              ai: {
                predicted_category: r.predicted_category,
                accepted: r.ai_accepted,
                confidence: r.confidence,
                explanation: r.explanation,
                model: r.model
              },
              qr_token: (existing && existing.qr_token) || null,
              geoCoords: { lat: r.report_lat, lng: r.report_lon }
            };
          });

          const backendIds = new Set(mappedReports.map(r => r.id));
          const localOnly = this.state.pickups.filter(p => !backendIds.has(String(p.id)));
          this.state.pickups = [...mappedReports, ...localOnly];
        }
      } catch (err) {
        console.warn('Citizen reports sync warning:', err);
      }

      // 2. Sync Worker Queue via GET /reports (Admin auth)
      try {
        const allReports = await this.apiFetch('/reports', {}, 'admin');
        if (Array.isArray(allReports)) {
          const mappedQueue = allReports.map(r => {
            const rawCat = (r.category || 'WET').toLowerCase();
            const cat = rawCat === 'hazardous' ? 'harmful' : rawCat;
            const existing = this.state.workerQueue.find(w => String(w.id) === String(r.id));
            let status = 'created';
            if (r.collected_at || r.status === 'COLLECTED') {
              status = 'collected';
            } else if (r.status === 'READY_FOR_COLLECTION') {
              status = 'READY_FOR_COLLECTION';
            } else if (r.status === 'WORKER_REJECTED') {
              status = 'rejected';
            } else if (existing && (existing.status === 'assigned' || existing.status === 'on_the_way')) {
              status = existing.status;
            }

            return {
              id: String(r.id),
              userName: r.citizen || this.state.user.name,
              address: this.state.user.address,
              category: cat,
              subType: `${r.category} Waste`,
              quantityKg: 3.5,
              pointsReward: r.category === 'HAZARDOUS' ? 15 : (r.category === 'WET' ? 12 : 13),
              status,
              otp: String(r.id).padStart(4, '0'),
              photoUrl: (existing && existing.photoUrl) || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80',
              geoCoords: { lat: r.report_lat, lng: r.report_lon },
              verification_score: r.verification_score,
              risk_level: r.risk_level,
              qr_token: (existing && existing.qr_token) || (this.state.pickups.find(p => String(p.id) === String(r.id))?.qr_token) || null
            };
          });
          const queueIds = new Set(mappedQueue.map(q => q.id));
          const localQueueOnly = this.state.workerQueue.filter(w => !queueIds.has(String(w.id)));
          this.state.workerQueue = [...mappedQueue, ...localQueueOnly];
        }
      } catch (err) {
        console.warn('Worker queue sync warning:', err);
      }

      // 3. Sync User Profile & Wallet via GET /wallet/1 (Citizen auth)
      try {
        const wallet = await this.apiFetch('/wallet/1', {}, 'citizen');
        if (wallet && wallet.user) {
          this.state.user.greenPoints = wallet.user.points;
          this.state.user.greenCredits = wallet.user.points;
          if (Array.isArray(wallet.transactions)) {
            const mappedTx = wallet.transactions.map(t => ({
              id: `TXN-${t.report_id || Math.floor(100000 + Math.random() * 900000)}`,
              title: 'Verified Waste Collection',
              category: 'EARN',
              amountGp: t.points,
              equivalentInr: Formatters.gpToInr(t.points),
              date: t.created_at,
              type: 'credit',
              status: 'SUCCESS',
              refId: String(t.report_id)
            }));
            const txIds = new Set(mappedTx.map(t => t.id));
            const localTx = this.state.transactions.filter(t => !txIds.has(t.id));
            this.state.transactions = [...mappedTx, ...localTx];
          }
        }
      } catch (err) {
        console.warn('Wallet sync warning:', err);
      }

      // 4. Sync Municipal Analytics via GET /analytics (Admin auth)
      try {
        const analytics = await this.apiFetch('/analytics', {}, 'admin');
        if (analytics && analytics.totals) {
          this.state.cityStats.verifiedPickups = analytics.totals.verified + 87540;
          this.state.cityStats.greenPointsIssued = analytics.totals.credits + 4850000;
          this.state.cityStats.activeCitizens = analytics.totals.citizens + 125420;
          this.state.cityStats.analytics = analytics;
        }
      } catch (err) {
        console.warn('Analytics sync warning:', err);
      }

      // 5. Sync Leaderboard via GET /leaderboard (Public)
      try {
        const lb = await this.apiFetch('/leaderboard', {}, 'citizen');
        if (Array.isArray(lb) && lb.length > 0) {
          this.state.leaderboards.global = lb.map((u, idx) => ({
            rank: idx + 1,
            name: u.name,
            avatar: (u.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            points: u.points,
            wasteKg: Math.round(u.points / 10),
            streak: 8,
            location: 'Mumbai',
            isUser: u.id === 1
          }));
        }
      } catch (err) {
        console.warn('Leaderboard sync warning:', err);
      }

      this.notify();
    } catch (err) {
      console.warn('CleanCred: Backend sync info:', err);
    }
  }

  // Submit New Waste Request (POST /reports)
  async createWasteRequest(formData) {
    const slot = formData.pickupSlot || 'Morning Route (08:00 AM - 11:00 AM)';
    const rawCat = (formData.category || 'wet').toLowerCase();
    const category = rawCat === 'harmful' ? 'HAZARDOUS' : rawCat.toUpperCase();
    const coords = formData.geoCoords || { lat: 19.0760, lng: 72.8777 };
    const lat = typeof coords.lat === 'number' ? coords.lat : (Array.isArray(coords) ? coords[0] : 19.0760);
    const lon = typeof coords.lng === 'number' ? coords.lng : (Array.isArray(coords) ? coords[1] : 72.8777);

    // Get real image blob
    const photoBlob = await this.ensureImageBlob(formData);

    const postData = new FormData();
    postData.append('category', category);
    postData.append('latitude', lat.toString());
    postData.append('longitude', lon.toString());
    postData.append('image', photoBlob, photoBlob.name || 'waste_evidence.jpg');

    // Call backend POST /reports (citizen role auth)
    // Throws error on 409 duplicate SHA-256 or bad request
    const data = await this.apiFetch('/reports', {
      method: 'POST',
      body: postData
    }, 'citizen');

    const serverId = String(data.report_id);
    const pointsMap = { wet: 12, dry: 13, harmful: 15, HAZARDOUS: 15, WET: 12, DRY: 13 };

    const newRequest = {
      id: serverId,
      category: rawCat,
      categoryName: rawCat === 'wet' ? 'Wet Waste (Organic)' : (rawCat === 'dry' ? 'Dry Waste (Recyclable)' : 'Harmful Waste (Hazardous)'),
      pointsReward: pointsMap[category] || 10,
      quantityKg: parseFloat(formData.quantity) || 3.5,
      subType: formData.subType || 'General segregated waste',
      description: formData.description || '',
      address: formData.address || this.state.user.address,
      landmark: formData.landmark || '',
      pickupType: formData.pickupType || 'doorstep',
      pickupSlot: slot,
      scheduledDate: 'Today',
      scheduledTime: slot.includes('Morning') ? '08:00 AM - 11:00 AM' : (slot.includes('Afternoon') ? '02:00 PM - 05:00 PM' : slot),
      createdAt: data.server_timestamp || new Date().toISOString(),
      status: 'created',
      workerName: 'DemoCollector',
      workerPhone: '+91 98111 22334',
      vehicleNo: 'MH-02-GK-4091',
      otp: serverId.padStart(4, '0'),
      etaMinutes: 18,
      photoUrl: formData.photoUrl || null,
      photoSource: formData.photoSource || 'demo',
      geoCoords: { lat, lng: lon }
    };

    this.state.pickups.unshift(newRequest);
    this.state.workerQueue.unshift({
      id: serverId,
      userName: this.state.user.name,
      address: newRequest.address,
      pickupSlot: newRequest.pickupSlot,
      category: newRequest.category,
      subType: newRequest.subType,
      quantityKg: newRequest.quantityKg,
      pointsReward: newRequest.pointsReward,
      status: 'created',
      otp: newRequest.otp,
      photoUrl: newRequest.photoUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&q=80',
      photoSource: newRequest.photoSource,
      geoCoords: newRequest.geoCoords
    });

    this.state.lastSubmittedRequestId = serverId;

    this.addNotification({
      title: '📋 Waste Request Created',
      message: `Your pickup request #${serverId} is confirmed. Status: Awaiting Worker Assignment.`,
      type: 'pickup'
    });

    this.notify();
    this.syncWithBackend().catch(() => {});
    return newRequest;
  }

  // Worker Verifies Waste (POST /verify)
  async verifyWasteSubmission(pickupId, approved = true, workerCoords = null) {
    const pickup = this.state.pickups.find(p => String(p.id) === String(pickupId));
    const workerItem = this.state.workerQueue.find(p => String(p.id) === String(pickupId));

    if (!pickup && !workerItem) {
      throw new Error(`Pickup #${pickupId} not found.`);
    }

    const currentStatus = (pickup ? pickup.status : workerItem.status);
    if (currentStatus === 'READY_FOR_COLLECTION' || currentStatus === 'collected' || currentStatus === 'verified') {
      return {
        success: false,
        alreadyVerified: true,
        message: 'Pickup has already been verified and one-time QR issued.',
        qr_token: (pickup && pickup.qr_token) || (workerItem && workerItem.qr_token)
      };
    }

    // Determine report coordinates
    const baseCoords = (pickup && pickup.geoCoords) || (workerItem && workerItem.geoCoords) || { lat: 19.0760, lng: 72.8777 };
    const repLat = typeof baseCoords.lat === 'number' ? baseCoords.lat : (Array.isArray(baseCoords) ? baseCoords[0] : 19.0760);
    const repLon = typeof baseCoords.lng === 'number' ? baseCoords.lng : (Array.isArray(baseCoords) ? baseCoords[1] : 72.8777);

    let workerLat = repLat;
    let workerLon = repLon;

    if (workerCoords) {
      workerLat = typeof workerCoords.lat === 'number' ? workerCoords.lat : (Array.isArray(workerCoords) ? workerCoords[0] : workerLat);
      workerLon = typeof workerCoords.lng === 'number' ? workerCoords.lng : (Array.isArray(workerCoords) ? workerCoords[1] : workerLon);
    }

    const reportId = parseInt(pickupId, 10);
    if (isNaN(reportId)) {
      // Demo item fallback
      const fakeToken = `DEMO-QR-${Date.now()}`;
      if (pickup) { pickup.status = approved ? 'READY_FOR_COLLECTION' : 'rejected'; pickup.qr_token = fakeToken; }
      if (workerItem) { workerItem.status = approved ? 'READY_FOR_COLLECTION' : 'rejected'; workerItem.qr_token = fakeToken; }
      this.notify();
      return { success: true, qr_token: fakeToken, verification_score: 95, risk_level: 'LOW' };
    }

    // Call backend POST /verify with worker auth
    // Throws if GPS gate >50m or AI rejection or unsegregated
    const data = await this.apiFetch('/verify', {
      method: 'POST',
      body: {
        report_id: reportId,
        segregated: Boolean(approved),
        worker_lat: workerLat,
        worker_lon: workerLon
      }
    }, 'worker');

    if (pickup) {
      pickup.status = 'READY_FOR_COLLECTION';
      pickup.qr_token = data.qr_token;
      pickup.verification_score = data.verification_score;
      pickup.risk_level = data.risk_level;
      pickup.risk_flags = data.risk_flags;
      pickup.ai = data.ai;
    }
    if (workerItem) {
      workerItem.status = 'READY_FOR_COLLECTION';
      workerItem.qr_token = data.qr_token;
      workerItem.verification_score = data.verification_score;
      workerItem.risk_level = data.risk_level;
      workerItem.risk_flags = data.risk_flags;
      workerItem.ai = data.ai;
    }

    this.notify();
    this.syncWithBackend().catch(() => {});
    return {
      success: true,
      report_id: reportId,
      status: 'READY_FOR_COLLECTION',
      qr_token: data.qr_token,
      verification_score: data.verification_score,
      risk_level: data.risk_level,
      distance_m: data.distance_m
    };
  }

  // Worker Collects Waste via One-Time QR Token (POST /collect)
  async collectReport(pickupId, qrToken, workerCoords = null) {
    const pickup = this.state.pickups.find(p => String(p.id) === String(pickupId));
    const workerItem = this.state.workerQueue.find(p => String(p.id) === String(pickupId));

    const currentStatus = (pickup ? pickup.status : workerItem?.status);
    if (currentStatus === 'collected' || currentStatus === 'verified') {
      return {
        success: false,
        alreadyCollected: true,
        message: 'QR has already been consumed and pickup collected.'
      };
    }

    const baseCoords = (pickup && pickup.geoCoords) || (workerItem && workerItem.geoCoords) || { lat: 19.0760, lng: 72.8777 };
    const repLat = typeof baseCoords.lat === 'number' ? baseCoords.lat : (Array.isArray(baseCoords) ? baseCoords[0] : 19.0760);
    const repLon = typeof baseCoords.lng === 'number' ? baseCoords.lng : (Array.isArray(baseCoords) ? baseCoords[1] : 72.8777);

    let workerLat = repLat;
    let workerLon = repLon;

    if (workerCoords) {
      workerLat = typeof workerCoords.lat === 'number' ? workerCoords.lat : (Array.isArray(workerCoords) ? workerCoords[0] : workerLat);
      workerLon = typeof workerCoords.lng === 'number' ? workerCoords.lng : (Array.isArray(workerCoords) ? workerCoords[1] : workerLon);
    }

    const reportId = parseInt(pickupId, 10);
    if (isNaN(reportId)) {
      // Demo item fallback
      const pts = (pickup && pickup.pointsReward) || 10;
      if (pickup) { pickup.status = 'collected'; pickup.pointsCredited = pts; }
      if (workerItem) { workerItem.status = 'collected'; }
      this.state.user.greenPoints += pts;
      this.notify();
      return { success: true, credits_awarded: pts };
    }

    // Call backend POST /collect with worker auth
    // Throws if GPS >50m, invalid token, or already consumed
    const data = await this.apiFetch('/collect', {
      method: 'POST',
      body: {
        report_id: reportId,
        qr_token: qrToken,
        worker_lat: workerLat,
        worker_lon: workerLon
      }
    }, 'worker');

    const points = data.credits_awarded || 10;
    if (pickup) {
      pickup.status = 'collected';
      pickup.pointsCredited = points;
    }
    if (workerItem) {
      workerItem.status = 'collected';
    }

    if (data.user && typeof data.user.points === 'number') {
      this.state.user.greenPoints = data.user.points;
      this.state.user.greenCredits = data.user.points;
    } else {
      this.state.user.greenPoints += points;
      this.state.user.greenCredits += points;
    }

    // Update transactions & notifications
    this.state.transactions.unshift({
      id: `TXN-${reportId}`,
      title: 'Verified Waste Collection',
      category: 'EARN',
      amountGp: points,
      equivalentInr: Formatters.gpToInr(points),
      date: data.collected_at || new Date().toISOString(),
      type: 'credit',
      status: 'SUCCESS',
      refId: String(reportId)
    });

    this.addNotification({
      title: `+${points} Credits Issued`,
      message: `Pickup #${reportId} verified & collected. One-time QR consumed.`,
      type: 'points'
    });

    this.notify();
    this.syncWithBackend().catch(() => {});
    return {
      success: true,
      report_id: reportId,
      status: 'COLLECTED',
      credits_awarded: points,
      user: data.user
    };
  }

  // Award Credits backwards-compatible bridge
  awardCredits(pickupId, weight = null) {
    const pickup = this.state.pickups.find(p => String(p.id) === String(pickupId));
    const token = (pickup && pickup.qr_token) || (this.state.workerQueue.find(w => String(w.id) === String(pickupId))?.qr_token);
    if (token) {
      return this.collectReport(pickupId, token);
    }
    return this.verifyWasteSubmission(pickupId, true);
  }

  // Lifecycle status updates
  updatePickupStatus(pickupId, newStatus) {
    const validStatuses = ['created', 'assigned', 'on_the_way', 'READY_FOR_COLLECTION', 'collected', 'verified', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      console.warn(`CleanCred: Invalid status ${newStatus}`);
      return { success: false, message: `Invalid status ${newStatus}` };
    }

    const pickup = this.state.pickups.find(p => String(p.id) === String(pickupId));
    const workerItem = this.state.workerQueue.find(p => String(p.id) === String(pickupId));

    if (!pickup && !workerItem) {
      return { success: false, message: `Pickup ${pickupId} not found` };
    }

    const currentStatus = (pickup ? pickup.status : workerItem.status) || 'created';
    if (currentStatus === 'collected' || currentStatus === 'verified' || currentStatus === 'rejected') {
      return { success: false, message: `Pickup is already in terminal status "${currentStatus}"` };
    }

    if (pickup) pickup.status = newStatus;
    if (workerItem) workerItem.status = newStatus;

    this.notify();
    return { success: true, status: newStatus };
  }

  // Redeem Credits (STEP 5: Real API POST /users/{userId}/redeem)
  redeemPoints(category, title, amountGp, metadata = '') {
    if (this.state.user.greenPoints < amountGp) {
      return { success: false, message: 'Insufficient Credits balance' };
    }

    // Call real backend endpoint
    fetch(`${API_BASE_URL}/users/1/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, title, amountGp, metadata })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => {
        if (data && typeof data.newBalanceGp === 'number') {
          this.state.user.greenPoints = data.newBalanceGp;
          this.notify();
        }
      })
      .catch(e => console.warn('Backend redeem error:', e));

    const inrValue = Formatters.gpToInr(amountGp);
    this.state.user.greenPoints -= amountGp;

    this.state.transactions.unshift({
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      title: title,
      category: category,
      amountGp: amountGp,
      equivalentInr: inrValue,
      date: new Date().toISOString(),
      type: 'debit',
      status: 'SUCCESS',
      meta: metadata
    });

    this.state.cityStats.greenPointsRedeemed += amountGp;

    this.addNotification({
      title: `🎁 Redemption Successful`,
      message: `${title} applied for ₹${inrValue} (${amountGp} Credits deducted).`,
      type: 'reward'
    });

    this.notify();
    return { success: true, newBalanceGp: this.state.user.greenPoints, inrValue };
  }

  // Report Illegal Dumping (STEP 5: Real API POST /dumping-reports)
  reportIllegalDumping(data) {
    const newReport = {
      id: `DUMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      location: data.location,
      wasteType: data.wasteType,
      reportedAt: new Date().toISOString(),
      status: 'Submitted',
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1611288875785-58586c06a4b1?w=300&q=80',
      rewardGp: 20
    };

    fetch(`${API_BASE_URL}/dumping-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: data.location,
        wasteType: data.wasteType,
        photoUrl: newReport.photoUrl,
        rewardGp: 20
      })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(serverReport => {
        if (serverReport && serverReport.id) {
          newReport.id = serverReport.id;
          this.notify();
        }
      })
      .catch(e => console.warn('Backend dumping report fallback:', e));

    this.state.illegalDumpingReports.unshift(newReport);
    this.addNotification({
      title: '🚨 Illegal Dumping Reported',
      message: `Report #${newReport.id} registered. Once municipal inspection resolves this site, +20 Credits will be credited.`,
      type: 'info'
    });

    this.notify();
    return newReport;
  }

  // Helper to Add Notification
  addNotification(notif) {
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: notif.title,
      message: notif.message,
      timestamp: new Date().toISOString(),
      read: false,
      type: notif.type || 'info'
    });
  }

  // Mark all notifications as read
  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.read = true);
    this.notify();
  }
}

export const State = new StateStore();
window.State = State;
