/* ==========================================================================
   GREEN LEGACY — REACTIVE STATE STORE
   Persistent State, Role-Based Access, & Event Subscriptions
   ========================================================================== */

import { Formatters } from './utils/formatters.js';

const API_BASE_URL = 'http://localhost:8000';

// Demo persistence (localStorage) — see saveState()/restoreState()/resetState()
const STORAGE_KEY = 'greenLegacyDemoState';
const STORAGE_VERSION = 1;

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.restoreState() || this.getSeedState();
    this.syncWithBackend();
  }

  // Original seed/demo dataset. Also used by resetState() to restore
  // the app to its starting condition.
  getSeedState() {
    return {
      // Current User Role: 'citizen' | 'worker' | 'admin' | 'institution'
      currentRole: 'citizen',

      // Citizen Profile (Shivansh Prajapati)
      user: {
        id: 'usr_shivansh_99',
        name: 'Shivansh Prajapati',
        email: 'shivansh.green@karma.org',
        phone: '+91 98765 43210',
        avatar: 'SP',
        address: 'Flat 402, Green Meadows, Ward 4B, Mumbai',
        greenPoints: 1250, // 100 GC = ₹10 => ₹125
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

      // Municipal Worker Profile (Ramesh Kumar)
      worker: {
        id: 'wrk_ramesh_04',
        name: 'Ramesh Kumar',
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
          workerName: 'Ramesh Kumar',
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
          workerName: 'Ramesh Kumar',
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
          userName: 'Shivansh Prajapati',
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
          description: 'Accumulate more than 2,000 Green Credits.',
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
          { rank: 12, name: 'Shivansh Prajapati (You)', avatar: 'SP', points: 1250, wasteKg: 125, streak: 8, location: 'Mumbai', isUser: true }
        ],
        city: [
          { rank: 1, name: 'Aarav Mehta', avatar: 'AM', points: 5420, wasteKg: 520, streak: 34, location: 'Ward 2A' },
          { rank: 2, name: 'Sneha Deshmukh', avatar: 'SD', points: 4210, wasteKg: 400, streak: 22, location: 'Ward 4B' },
          { rank: 3, name: 'Rahul Rane', avatar: 'RR', points: 3950, wasteKg: 380, streak: 18, location: 'Ward 7C' },
          { rank: 8, name: 'Shivansh Prajapati (You)', avatar: 'SP', points: 1250, wasteKg: 125, streak: 8, location: 'Ward 4B', isUser: true }
        ],
        neighborhood: [
          { rank: 1, name: 'Sneha Deshmukh', avatar: 'SD', points: 4210, wasteKg: 400, streak: 22, location: 'Bldg 3' },
          { rank: 2, name: 'Rohan Patil', avatar: 'RP', points: 2150, wasteKg: 210, streak: 14, location: 'Bldg 8' },
          { rank: 3, name: 'Shivansh Prajapati (You)', avatar: 'SP', points: 1250, wasteKg: 125, streak: 8, location: 'Bldg 4', isUser: true }
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
          message: 'Worker Ramesh Kumar is 12 mins away from your location for request #GK-2026-89421.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          type: 'pickup'
        },
        {
          id: 'notif_2',
          title: '+10 Green Credits issued',
          message: 'Wet waste collection #GK-2026-89210 verified successfully by municipal inspector.',
          timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          read: false,
          type: 'points'
        },
        {
          id: 'notif_3',
          title: '🔥 8-Day Green Streak!',
          message: 'Keep logging segregated waste daily to unlock the Eco Master +50 GC milestone.',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          read: true,
          type: 'streak'
        },
        {
          id: 'notif_4',
          title: '📱 Recharge Successful',
          message: '₹10 Jio recharge applied successfully using 100 Green Credits.',
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const looksValid = parsed
        && parsed.version === STORAGE_VERSION
        && parsed.state
        && parsed.state.user
        && parsed.state.cityStats
        && Array.isArray(parsed.state.pickups)
        && Array.isArray(parsed.state.transactions);

      if (!looksValid) {
        console.warn('Green Legacy: saved demo state was missing/invalid — starting from the seed state.');
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
      console.warn('Green Legacy: saved demo state was corrupted — starting from the seed state.', e);
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
        state: this.state
      }));
    } catch (e) {
      console.warn('Green Legacy: could not save demo state to localStorage.', e);
    }
  }

  // Wipe the saved session and restore the original seed data.
  resetState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
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

  // Sync local reactive store with real backend on load & after actions
  async syncWithBackend() {
    try {
      // 1. Sync reports from backend
      const reportsRes = await fetch(`${API_BASE_URL}/users/1/reports`);
      if (reportsRes.ok) {
        const backendReports = await reportsRes.json();
        if (Array.isArray(backendReports) && backendReports.length > 0) {
          const backendIds = new Set(backendReports.map(r => r.id));
          const localOnly = this.state.pickups.filter(p => !backendIds.has(p.id));
          this.state.pickups = [...backendReports, ...localOnly];

          const workerQueueBackend = backendReports.map(r => ({
            id: r.id,
            userName: r.userName || this.state.user.name,
            address: r.address,
            pickupSlot: r.pickupSlot,
            category: r.category,
            subType: r.subType,
            quantityKg: r.quantityKg,
            pointsReward: r.pointsReward,
            status: r.status,
            otp: r.otp,
            photoUrl: r.photoUrl,
            photoSource: r.photoSource,
            geoCoords: r.geoCoords
          }));
          const localOnlyWorker = this.state.workerQueue.filter(w => !backendIds.has(w.id));
          this.state.workerQueue = [...workerQueueBackend, ...localOnlyWorker];
        }
      }

      // 2. Sync user profile & green points balance
      const userRes = await fetch(`${API_BASE_URL}/users/1`);
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData && typeof userData.greenPoints === 'number') {
          this.state.user.greenPoints = userData.greenPoints;
          if (userData.name) this.state.user.name = userData.name;
          if (userData.email) this.state.user.email = userData.email;
          if (userData.phone) this.state.user.phone = userData.phone;
          if (userData.address) this.state.user.address = userData.address;
        }
      }

      // 3. Sync dashboard stats
      const dashRes = await fetch(`${API_BASE_URL}/dashboard`);
      if (dashRes.ok) {
        const dash = await dashRes.json();
        if (dash && typeof dash.total_reports === 'number') {
          this.state.cityStats.verifiedPickups = (dash.approved_reports || 0) + 87540;
        }
      }

      this.notify();
    } catch (err) {
      console.warn('CleanCred: Backend sync info (offline fallback active):', err);
    }
  }

  // Submit New Waste Request (STEP 5: Real API POST /reports)
  createWasteRequest(formData) {
    const pointsMap = { wet: 10, dry: 7, harmful: 5 };
    const slot = formData.pickupSlot || 'Morning Route (08:00 AM - 11:00 AM)';
    const localId = Formatters.generateRequestId();

    const newRequest = {
      id: localId,
      category: formData.category,
      categoryName: formData.category === 'wet' ? 'Wet Waste (Organic)' : formData.category === 'dry' ? 'Dry Waste (Recyclable)' : 'Harmful Waste (Hazardous)',
      pointsReward: pointsMap[formData.category] || 5,
      quantityKg: parseFloat(formData.quantity) || 3.0,
      subType: formData.subType || 'General segregated waste',
      description: formData.description || '',
      address: formData.address || this.state.user.address,
      landmark: formData.landmark || '',
      pickupType: formData.pickupType || 'doorstep',
      pickupSlot: slot,
      scheduledDate: 'Today',
      scheduledTime: slot.includes('Morning') ? '08:00 AM - 11:00 AM' : (slot.includes('Afternoon') ? '02:00 PM - 05:00 PM' : slot),
      createdAt: new Date().toISOString(),
      status: 'created',
      workerName: 'Ramesh Kumar (Ward 4B Fleet)',
      workerPhone: '+91 98111 22334',
      vehicleNo: 'MH-02-GK-4091',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      etaMinutes: 18,
      photoUrl: formData.photoUrl || null,
      photoSource: formData.photoSource || 'demo',
      geoCoords: formData.geoCoords || [19.0760, 72.8777]
    };

    this.state.pickups.unshift(newRequest);
    this.state.workerQueue.unshift({
      id: newRequest.id,
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

    this.state.lastSubmittedRequestId = newRequest.id;

    this.addNotification({
      title: '📋 Waste Request Created',
      message: `Your pickup request #${newRequest.id} is confirmed. Status: Awaiting Worker Assignment.`,
      type: 'pickup'
    });

    this.notify();

    // Multipart/form-data payload to real backend
    const postData = new FormData();
    postData.append('user_id', '1');
    postData.append('waste_type', formData.category || 'wet');
    postData.append('category', formData.category || 'wet');
    postData.append('subtype', formData.subType || 'General segregated waste');
    postData.append('approximate_weight', parseFloat(formData.quantity) || 3.0);
    const coords = formData.geoCoords || [19.0760, 72.8777];
    postData.append('latitude', coords[0]);
    postData.append('longitude', coords[1]);
    postData.append('address', formData.address || this.state.user.address);
    postData.append('pickup_slot', slot);

    fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      body: postData
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => {
        if (data && data.report) {
          const serverId = data.report.id;
          newRequest.id = serverId;
          this.state.lastSubmittedRequestId = serverId;
          if (window.ReportWasteView) {
            window.ReportWasteView.lastSubmittedRequestId = serverId;
          }
          const workerItem = this.state.workerQueue.find(w => w.id === localId);
          if (workerItem) workerItem.id = serverId;
          this.notify();
        }
      })
      .catch(err => {
        console.warn('Real backend report creation fallback:', err);
      });

    return newRequest;
  }

  // Worker Verifies Waste & Credits GC (STEP 5: Real API POST /reports/{id}/verify)
  verifyWasteSubmission(pickupId, approved = true, adjustedWeightKg = null) {
    const pickup = this.state.pickups.find(p => p.id === pickupId);
    const workerItem = this.state.workerQueue.find(p => p.id === pickupId);

    const alreadyVerified = (pickup && pickup.status === 'verified') || (workerItem && workerItem.status === 'verified');
    if (alreadyVerified) {
      return {
        success: false,
        alreadyVerified: true,
        message: "Pickup has already been verified and credited.",
        points: (pickup && pickup.pointsCredited) || (pickup && pickup.pointsReward) || 0,
        awardedPoints: 0,
        weight: pickup ? pickup.quantityKg : null
      };
    }

    if (!pickup && !workerItem) {
      return { success: false, message: `Pickup ${pickupId} not found.` };
    }

    // Call real backend verification endpoint
    fetch(`${API_BASE_URL}/reports/${encodeURIComponent(pickupId)}/verify?segregated=${approved}&source=worker`, {
      method: 'POST'
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => {
        if (data) {
          if (pickup && data.purity_score !== undefined) {
            pickup.purity_score = data.purity_score;
          }
          if (workerItem && data.purity_score !== undefined) {
            workerItem.purity_score = data.purity_score;
          }
          this.syncWithBackend();
        }
      })
      .catch(err => console.warn('Backend verify call fallback:', err));

    if (approved) {
      const rateMap = { wet: 10, dry: 7, harmful: 5 };
      const rate = pickup ? (rateMap[pickup.category] || pickup.pointsReward || 10) : 10;
      const weight = (adjustedWeightKg !== null && adjustedWeightKg !== undefined) ? adjustedWeightKg : (pickup ? pickup.quantityKg : 4.0);
      const points = (adjustedWeightKg !== null && adjustedWeightKg !== undefined) ? Math.round(weight * rate) : (pickup ? pickup.pointsReward : 10);

      // Update Pickup Status
      if (pickup) {
        pickup.status = 'verified';
        pickup.quantityKg = weight;
        pickup.pointsCredited = points;
      }
      if (workerItem) {
        workerItem.status = 'verified';
        workerItem.quantityKg = weight;
        workerItem.pointsReward = points;
      }

      // Credit User Points & Impact locally
      this.state.user.greenPoints += points;
      this.state.user.lifetimeWasteKg += weight;
      this.state.user.pickupsCompleted += 1;
      this.state.user.co2SavedKg += Math.round(weight * 0.65 * 10) / 10;
      this.state.user.treesEquivalent = Math.round((this.state.user.co2SavedKg / 13.5) * 10) / 10;

      const category = pickup ? pickup.category : 'wet';
      if (this.state.user.wasteByCategoryKg && this.state.user.wasteByCategoryKg[category] !== undefined) {
        this.state.user.wasteByCategoryKg[category] = Math.round((this.state.user.wasteByCategoryKg[category] + weight) * 10) / 10;
      }

      // Update Municipal Stats
      this.state.cityStats.verifiedPickups += 1;
      this.state.cityStats.greenPointsIssued += points;
      this.state.cityStats.totalWasteTons = Math.round((this.state.cityStats.totalWasteTons + weight / 1000) * 100) / 100;
      if (this.state.cityStats.wasteByCategoryTons && this.state.cityStats.wasteByCategoryTons[category] !== undefined) {
        this.state.cityStats.wasteByCategoryTons[category] = Math.round((this.state.cityStats.wasteByCategoryTons[category] + weight / 1000) * 100) / 100;
      }

      // Add Ledger Transaction
      this.state.transactions.unshift({
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `${pickup ? pickup.categoryName : 'Waste'} Pickup Verified`,
        category: category,
        amount: points,
        amountGp: points,
        equivalentInr: Formatters.gpToInr(points),
        date: new Date().toISOString(),
        type: 'credit',
        status: 'SUCCESS',
        refId: pickupId
      });

      // Add Notification
      this.addNotification({
        title: `+${points} Green Credits issued`,
        message: `Waste pickup #${pickupId} (${weight} kg) has been verified. Green Wallet updated.`,
        type: 'points'
      });

      this.notify();
      const purityScore = (pickup && pickup.purity_score) || (workerItem && workerItem.purity_score) || 95;
      return { success: true, points, awardedPoints: points, weight, purity_score: purityScore };
    } else {
      if (pickup) pickup.status = 'rejected';
      if (workerItem) workerItem.status = 'rejected';

      this.addNotification({
        title: `Waste submission rejected`,
        message: `Pickup #${pickupId} was rejected due to improper segregation. Please re-segregate and try again.`,
        type: 'error'
      });

      this.notify();
      return { success: false };
    }
  }

  // Award Credits: backend auto-awards inside /verify (STEP 5)
  awardCredits(pickupId, weight = null) {
    return this.verifyWasteSubmission(pickupId, true, weight);
  }

  // Lifecycle status updates (STEP 5: Real API POST /collect and /verify-location)
  updatePickupStatus(pickupId, newStatus) {
    const validStatuses = ['created', 'assigned', 'on_the_way', 'collected', 'verified', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      console.warn(`CleanCred: Invalid status ${newStatus}`);
      return { success: false, message: `Invalid status ${newStatus}` };
    }

    const pickup = this.state.pickups.find(p => p.id === pickupId);
    const workerItem = this.state.workerQueue.find(p => p.id === pickupId);

    if (!pickup && !workerItem) {
      return { success: false, message: `Pickup ${pickupId} not found` };
    }

    // Call corresponding backend endpoints (STEP 5)
    if (newStatus === 'collected') {
      fetch(`${API_BASE_URL}/reports/${encodeURIComponent(pickupId)}/collect`, {
        method: 'POST'
      }).catch(e => console.warn('Backend collect endpoint call:', e));
    } else if (newStatus === 'on_the_way') {
      const lat = (pickup && pickup.currentLocation && pickup.currentLocation[0]) || 19.0620;
      const lon = (pickup && pickup.currentLocation && pickup.currentLocation[1]) || 72.8410;
      fetch(`${API_BASE_URL}/reports/${encodeURIComponent(pickupId)}/verify-location?worker_latitude=${lat}&worker_longitude=${lon}`, {
        method: 'POST'
      }).catch(e => console.warn('Backend verify-location endpoint call:', e));
    }

    const currentStatus = (pickup ? pickup.status : workerItem.status) || 'created';
    if (currentStatus === 'verified' || currentStatus === 'rejected') {
      return { success: false, message: `Pickup is already in terminal status "${currentStatus}"` };
    }

    if (pickup) pickup.status = newStatus;
    if (workerItem) workerItem.status = newStatus;

    this.notify();
    return { success: true, status: newStatus };
  }

  // Redeem Green Credits (STEP 5: Real API POST /users/{userId}/redeem)
  redeemPoints(category, title, amountGp, metadata = '') {
    if (this.state.user.greenPoints < amountGp) {
      return { success: false, message: 'Insufficient Green Credits balance' };
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
      message: `${title} applied for ₹${inrValue} (${amountGp} GC deducted).`,
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
      message: `Report #${newReport.id} registered. Once municipal inspection resolves this site, +20 GC will be credited.`,
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
