<div align="center">

# 🌍 CleanCred
### Verified Waste Action & Green Credits Platform

**Smart India Hackathon 2026** · Problem Statement **SIH26195** · Team **GreenLegacy** (ID: GSIH26015)
Theme: *Clean & Green Technology* · Category: *Software*

[![Live Demo](https://img.shields.io/badge/Live-Demo-059669?style=for-the-badge&logo=googlechrome&logoColor=white)](https://leaguestar.github.io/CleanCred/)
[![SIH 2026](https://img.shields.io/badge/SIH-2026-0891B2?style=for-the-badge)](#-about)
[![License](https://img.shields.io/badge/License-Proprietary-0F172A?style=for-the-badge)](#%EF%B8%8F-license--copyright)

[🌐 Live Website](https://leaguestar.github.io/CleanCred/) · [✨ Features](#-features--portals) · [⚙️ How It Works](#%EF%B8%8F-how-it-works) · [🛠️ Tech Stack](#%EF%B8%8F-technology-stack) · [🚀 Setup](#-installation--local-setup) · [👥 Team](#-team-greenlegacy)

</div>

---

## 📖 About

**CleanCred** is a **proof-backed waste management and collection platform** built for Smart India Hackathon 2026. Instead of rewarding citizens for simply *reporting* waste, CleanCred only issues **Green Credits** once an action is independently **verified** — turning municipal waste tracking into a closed-loop, auditable system.

Every claimed action is checked against multiple independent signals before a credit is minted, which means the credit ledger reflects real, confirmed cleanup activity rather than self-reported claims. This gives municipalities a trustworthy dataset for monitoring, accountability, and planning — while giving citizens a transparent, gamified reason to participate.

> **Report → Verify → Collect → Record → Earn**

## 🚨 The Problem

Most civic waste-reporting apps stop at "report" — a citizen submits a complaint or photo, and there's no reliable way to confirm the waste was actually segregated, collected, or resolved. This creates:

- Reward systems that can be gamed with fake or duplicate submissions
- No verifiable link between a citizen's claimed action and the outcome on the ground
- Municipalities with reporting data but no confidence in its accuracy

## 💡 Our Solution

CleanCred closes that gap with **multi-signal verification** — a claim only becomes a credit once it clears every checkpoint in the pipeline:

### Phase 1 purity verification

The demo's photo flow uses an offline, rule-based purity check. It sends the selected waste category and material to the local `POST /api/verify-photo` endpoint, which returns a deterministic score from the municipal material catalog. No API key or network call is required. It validates the declared material, not the image contents. **Phase 1 is rule-based verification; Phase 2 roadmap integrates a vision model.**

| Signal | What It Confirms |
| :--- | :--- |
| 🤖 **AI Segregation Check** | Whether the submitted waste is properly segregated |
| 📍 **GPS Proximity** | That the citizen was actually at the reported location |
| ⏱️ **Timestamp Verification** | That the action happened when it was claimed to |
| 🔳 **QR-Based Collection** | Sanitation staff confirm physical collection at source |

### Why It's Different

- **Proof-backed action** — every credit is tied to verifiable evidence, not a self-report
- **Multi-signal verification** — AI + GPS + QR + timestamp working together, not any single check alone
- **Closed-loop accountability** — a full Report → Verify → Collect → Record cycle, not a one-way complaint box
- **Behaviour-linked rewards** — credits are issued *after* verification, never merely for submitting
- **Municipal visibility** — the same verified event doubles as clean data for monitoring and analytics

## ✨ Features & Portals

CleanCred is a multi-portal ecosystem, with a dedicated experience for every stakeholder in the waste-management lifecycle:

| Portal / Module | Description |
| :--- | :--- |
| 🧑‍🤝‍🧑 **Citizen Dashboard** | Login, profile, and a central home to track activity and impact |
| 📝 **Waste & Dumping Reporting** | Report standard waste or flag illegal dumping sites with geolocation |
| 🎁 **Rewards Wallet** | Verified green actions earn Green Credits, with confetti + audio feedback |
| 🏆 **Leaderboard** | Community rankings that drive friendly competition and engagement |
| 🗺️ **Live Tracking & Mapping** | Real-time view of collection routes and worker deployment |
| 🔳 **Smart QR Integration** | QR generation and in-browser scanning for smart-bin and collection verification |
| 🧹 **Worker Portal** | Sanitation staff view assigned tasks and mark bins/sites as cleared |
| 🏢 **Institution Portal** | Institutions manage local sustainability goals and participation |
| 📊 **Admin & Impact Analytics** | System-wide metrics, verified-report oversight, and environmental impact tracking |

## ⚙️ How It Works

```
   ┌────────────┐     ┌─────────────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐
   │  1. REPORT │ ──▶ │  2. VERIFY  │ ──▶ │ 3. COLLECT │ ──▶ │ 4. RECORD  │ ──▶ │ 5. EARN  │
   └────────────┘     └─────────────┘     └────────────┘     └────────────┘     └──────────┘
   Citizen submits     AI + GPS +          Sanitation staff    Verified event      Green Credits
   evidence of a       Timestamp check     confirm pickup      logged for city-    minted to the
   segregated/         the claim           via QR scan         wide analytics      citizen's wallet
   disposed action
```

1. **Report** — A citizen submits evidence (photo + location) of waste segregation, disposal, or an illegal dumping site.
2. **Verify** — The system checks AI-based segregation quality, GPS proximity to the reported site, and timestamp authenticity.
3. **Collect** — A waste collector arrives and confirms pickup by scanning a QR code, closing the loop physically.
4. **Record** — The verified event is logged into city-wide monitoring and impact-analytics dashboards.
5. **Earn** — Only now are Green Credits issued to the citizen's Rewards Wallet, with a single centralized credit-award path and duplicate-verification protection to keep the ledger accurate.

## 🎨 Design System

CleanCred follows a deliberate **Surrealism × Neumorphism** visual language — solid, matte, dimensional surfaces with raised/inset shadows and a surreal environmental accent palette. There is **zero glassmorphism**: no `backdrop-filter`, no frosted-glass panels, no translucent UI surfaces. This keeps the interface feeling tactile and credible rather than trend-chasing, in line with a civic-infrastructure product rather than a generic AI-SaaS dashboard.

## 🛠️ Technology Stack

CleanCred uses a lightweight, dependency-light stack chosen for a smooth UI and rapid, judge-friendly deployment:

| Layer | Technology |
| :--- | :--- |
| **Structure** | Semantic HTML5 |
| **Styling** | Tailwind CSS (via CDN, utility layer) + custom `main.css`, `components.css`, `animations.css`, `responsive.css` for the Surrealism × Neumorphism design system |
| **Application Logic** | Modular Vanilla JavaScript (ES modules) — a lightweight client-side router and global state manager |
| **Interactivity** | Custom utilities for QR generation/scanning, live-map rendering, confetti, and audio feedback |
| **Local Dev Server** | Python (`server.py`) — a zero-dependency `http.server`-based server; also exposes a `/api/health` check and a `/api/report_test` endpoint used for local demo/testing, not a production backend |
| **Deployment** | Static hosting via GitHub Pages |

## 📂 Project Structure

```bash
CleanCred/
├── index.html                  # Main entry point & app shell
├── server.py                   # Local dev server (+ demo/test endpoints)
├── start.bat                   # Windows one-click startup script
├── css/
│   ├── main.css                 # Global styles, design tokens & design-system rules
│   ├── components.css           # Component-level styling
│   ├── animations.css           # Transitions & keyframes
│   └── responsive.css           # Mobile / tablet responsiveness
└── js/
    ├── app.js                   # App router & controller
    ├── state.js                 # Global state management
    ├── components/               # One module per portal/view
    │   ├── dashboard.js              # Citizen dashboard
    │   ├── reportWaste.js            # Waste reporting flow
    │   ├── illegalDumping.js         # Illegal dumping reports
    │   ├── rewardsWallet.js          # Green Credits wallet
    │   ├── leaderboard.js            # Community leaderboard
    │   ├── liveTracking.js           # Live collection map
    │   ├── workerPortal.js           # Sanitation worker portal
    │   ├── institutionPortal.js      # Institution portal
    │   ├── adminDashboard.js         # Admin controls
    │   ├── impactDashboard.js        # Analytics & impact
    │   ├── profile.js                # User profile
    │   └── landing.js                # Landing page
    └── utils/                     # Shared helpers
        ├── qrCode.js                  # QR code generation
        ├── qrScanner.js               # In-browser QR scanning
        ├── mapHelper.js               # Map rendering utilities
        ├── confetti.js                # Reward celebration effects
        ├── audio.js                   # Sound feedback
        └── formatters.js              # Shared formatting helpers
```

## 🚀 Installation & Local Setup

**Prerequisites:** [Python 3.x](https://www.python.org/downloads/) installed on your system. No `pip install` required — the server uses only Python's standard library.

1. **Clone the repository**
   ```bash
   git clone https://github.com/LeagueStar/CleanCred.git
   cd CleanCred
   ```

2. **Launch the server**

   - **Windows** — double-click `start.bat`, or run it from the command line
   - **macOS / Linux / manual** —
     ```bash
     python3 server.py
     ```

3. **Open the app**

   Navigate to `http://localhost:8081`.

No build step, no package manager, no external services required — clone and run.

## 🧭 Usage Workflow

| Role | What They Do |
| :--- | :--- |
| **Citizens** | Log in, report waste or dumping sites with photo evidence, and track Green Credits and leaderboard rank in the Rewards Wallet |
| **Sanitation Workers** | Open the Worker Portal to view assigned tasks, follow live collection routes, and confirm pickup via QR scan |
| **Institutions** | Manage local sustainability goals and monitor participation from the Institution Portal |
| **Admins** | Use the Admin & Impact Dashboards to verify reports, oversee credit distribution, and analyze city-wide environmental impact |

## 🗺️ Roadmap

- [ ] Live backend integration for persistent credit ledger and user accounts
- [ ] Production AI model for automated segregation-quality scoring
- [ ] Municipal-grade analytics exports for civic bodies
- [ ] Native mobile app for on-the-go citizen reporting

## 🤝 Contributing

This project was developed exclusively for the **Smart India Hackathon 2026**. Outside contributions, pull requests, and forks are not accepted, in order to preserve the integrity of the submission.

## 🛡️ License & Copyright

**Copyright © 2026 Team GreenLegacy. All Rights Reserved.**

This project was developed by **Team GreenLegacy** for the Smart India Hackathon (SIH) 2026. This source code is proprietary and confidential. No part of this software, code, or design may be copied, reproduced, distributed, published, or modified — in whole or in part, in any form or by any means — without the prior written, explicit permission of the copyright owners.

Unauthorized copying, cloning, or use of this project is strictly prohibited.

## 👥 Team GreenLegacy

| Member | GitHub |
| :--- | :--- |
| **Kartik Devdhawala** | [@LeagueStar](https://github.com/LeagueStar) |
| **Harshprit Bagga** | — |
| **Shivansh Prajapati** | — |
| **Suraj Singh** | — |
| **Satyam Gupta** | — |
| **Kreya Patel** | — |

<div align="center">

**🌐 [Live Website](https://leaguestar.github.io/CleanCred/)** · Built with 💚 for a cleaner tomorrow

</div>
