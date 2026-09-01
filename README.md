<div align="center">
  <h1>🌍 CleanCred</h1>
  <p><b>An Intelligent, Gamified Waste Management & Tracking Platform</b></p>
  <p>Developed by <b>LeagueStar (Kartik Devdhawala) — Team GreenLegacy</b></p>
  <p>
    <a href="https://leaguestar.github.io/CleanCred/"><b>🌐 View Live Website</b></a> •
    <a href="#-features--portals"><b>Features</b></a> •
    <a href="#-installation--local-setup"><b>Installation</b></a>
  </p>
</div>

---

## 📖 About

**CleanCred** is a comprehensive, multi-portal waste management ecosystem designed to incentivize environmental cleanliness and accountability. By combining real-time reporting, geolocation tracking, and a gamified rewards system, the platform bridges the gap between citizens, sanitation workers, and governing institutions. 

The goal is simple: reward users for responsible waste disposal while providing administrators and sanitation teams with actionable, data-driven insights into city-wide environmental impacts. Whether it is tracking smart bin usage via QR codes, reporting illegal dumping sites, or analyzing an organization's ecological footprint, CleanCred digitizes and rewards the entire waste management lifecycle.

## ✨ Features & Portals

The application architecture is divided into specialized modules and dedicated dashboards to serve various stakeholders effectively:

| Feature/Module | Description |
| :--- | :--- |
| **Citizen & User Dashboard** | Empowers users to log in, view their profiles, and navigate the platform. |
| **Waste & Dumping Reporting** | Allows citizens to report standard waste or flag illegal dumping sites with geolocation. |
| **Gamified Rewards Wallet** | Incentivizes users by awarding credits for verified green actions, complete with interactive audio and visual confetti feedback. |
| **Live Tracking & Mapping** | Real-time monitoring of waste collection routes and worker deployments using map utilities. |
| **Smart QR Integration** | Facilitates smart bin usage and quick verification through built-in QR generation and scanning capabilities. |
| **Worker & Institution Portals** | Dedicated interfaces for sanitation staff to track tasks, and institutions to manage local sustainability goals. |
| **Admin & Impact Analytics** | High-level overviews of system metrics, user engagement, and measurable environmental impact. |

## 🛠️ Technology Stack

CleanCred utilizes a lightweight yet robust stack, prioritizing a smooth UI and rapid deployment:

*   **Frontend UI:** Pure HTML5, enhanced with a modern UI relying on custom styling techniques and responsive layouts.
*   **Aesthetics:** Modern frosted-glass visual effects (`glassmorphism.css`) and dynamic transitions (`animations.css`).
*   **State Management & Logic:** Modular Vanilla JavaScript handling global state and core application flow.
*   **Backend / Server:** Python-based server architecture (`server.py`).

## 📂 Project Structure

```bash
CleanCred/
├── index.html                   # Main entry point
├── server.py                    # Python backend server
├── start.bat                    # Windows startup script
├── css/                         
│   ├── animations.css           # UI transitions and keyframes
│   ├── components.css           # Modular styling for components
│   ├── glassmorphism.css        # Frosted glass UI effects
│   ├── main.css                 # Global stylesheets
│   └── responsive.css           # Mobile/tablet responsiveness
└── js/
    ├── app.js                   # Application initialization    
    ├── state.js                 # Global state management
    ├── components/              # Specialized UI modules (dashboards, portals, reports)
    └── utils/                   # Helpers (audio, confetti, maps, QR code/scanner)

   ```
## 🚀 Installation & Local Setup

To run CleanCred locally on your machine for development or evaluation:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/LeagueStar/CleanCred.git](https://github.com/LeagueStar/CleanCred.git)
    cd CleanCred
    ```
2.  **Launch the Environment:**
    *   **Windows:** Execute the provided batch script by double-clicking `start.bat` or running it from the command line.
    *   **Manual/Cross-Platform:** Run the Python server directly to host the application:
        ```bash
        python server.py
        ```
        *(Ensure you have Python 3.x installed on your system)*.
3.  **Access the Application:**
    Open your preferred web browser and navigate to the local port hosted by the Python server (typically `http://localhost:8000` or as defined in the server output).

## 💡 Usage Workflow

1. **Citizens:** Log in, scan smart bin QR codes, or snap photos of illegal dumping sites to report them. Track your earned CleanCreds and leaderboard ranking in the Gamified Wallet.
2. **Sanitation Workers:** Access the Worker Portal to view active tasks, follow optimized collection routes via live tracking, and mark bins or dumping sites as cleared.
3. **Institutions & Admins:** Use the Admin & Impact Dashboards to monitor city-wide cleanliness, verify user reports, distribute rewards, and analyze sustainability metrics.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! If you'd like to improve CleanCred:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/Enhancement`).
3. Commit your changes (`git commit -m 'Add some Enhancement'`).
4. Push to the branch (`git push origin feature/Enhancement`).
5. Open a Pull Request.

## 🛡️ License

This project was developed for innovation and hackathon purposes. All rights reserved by **Team GreenLegacy**.

## 📞 Contact

**Team GreenLegacy**
* **Developer:** Kartik Devdhawala (LeagueStar)
* **GitHub:** [@LeagueStar](https://github.com/LeagueStar)
* **Live Website:** [CleanCred Live](https://leaguestar.github.io/CleanCred/)
