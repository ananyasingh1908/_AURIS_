# AURIS

**AI-powered Urban Intelligence Platform for connected, sustainable, and resilient cities.**

Built for **Washington Hackathon 2026** — Theme: *Urban Intelligence: Smart & Sustainable Cities*
Team **Starlight** · Yeshwantrao Chavan College of Engineering

## The Problem

Modern cities generate huge amounts of data — from citizens, departments, infrastructure, mobility, water, energy, and environmental sensors — but that data stays fragmented across disconnected departments and platforms. This creates six recurring failures in urban governance:

1. Delayed identification and resolution of urban problems
2. Limited proactive detection of emerging risks and environmental changes
3. Departments operating in isolation with little coordination
4. Difficulty monitoring conditions like AQI and measuring overall city health
5. Recurring urban problems with no effective root-cause analysis
6. Sustainability initiatives disconnected from everyday city management

**The core question AURIS answers:** *How can cities transform fragmented urban data into connected intelligence that enables proactive decisions, coordinated action, and measurable improvement?*

---

## The Solution

AURIS connects citizens, government departments, environmental data, and sustainability systems through one central intelligence layer — helping cities **detect** problems, **understand** their causes, **coordinate** a response, and **measure** progress.

### Core Features

- **Multi-Agent Intelligence & Coordination** — specialized AI agents monitor different urban sectors (water, traffic, air quality, waste, energy) and collaborate through a central AI orchestrator, visualized live in the **AI Center**.
- **Intelligent Citizen Reporting** — citizens submit complaints with text, images, and location; AURIS classifies, prioritizes, and routes them to the right department automatically.
- **Proactive Urban Risk Detection** — current and historical data are analyzed to flag anomalies, recurring problems, and emerging risks before they escalate.
- **Interactive Urban Intelligence & Environmental Map** — a live map of AQI, pollution, flooding, traffic, and infrastructure incidents with location-based insights across Indian cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad) and select global cities.
- **City Health & Sustainability Index** — a composite score tracking overall city condition alongside environmental and carbon-reduction progress.
- **Carbon Intelligence & Cross-Department Action** — a carbon credit marketplace (buy, sell, retire, and list projects) that connects emission-reduction opportunities to real department workflows.
- **Urban Causal Graph** — traces cause-and-effect chains across incidents (e.g. rainfall → drainage overload → flooding → traffic gridlock) with recommended interventions at each node.
- **Environmental Impact Estimates** — per-incident environmental impact (e.g. water lost, estimated CO₂ from traffic idling) calculated from transparent, cited formulas.
- **Nearby Hospitals** — real hospital lookup near any incident's coordinates via the OpenStreetMap Overpass API.
- **Role-Based Access Control** — 13 distinct city roles (City Administrator, department officers, sustainability organizations, citizens, and more), each with a scoped view; only the City Administrator sees the complete platform.
- **Audit Trail** — every automated and human action across the platform is logged for accountability.

### Workflow

**Detect → Understand → Verify → Coordinate → Act → Measure → Improve**

---

## Who It's For

| User | Value |
|---|---|
| **Municipal Governments** | City-wide monitoring, decision-making, and resource prioritization |
| **Government Departments** | Intelligent issue routing, cross-department coordination, and resolution tracking |
| **Citizens** | Easy reporting, complaint tracking, and local updates |
| **Sustainability Organizations** | Environmental impact tracking and carbon-project discovery |

**Expected impact:**
- **Cities** — proactive problem management, fewer recurring issues, improved environmental conditions, and measurable progress via the City Health Index
- **Governments** — faster response, better coordination, improved accountability
- **Citizens** — easier reporting, greater transparency, quicker resolution

---

## Tech Stack

**Frontend**
- React 18 (React 19 in this build) + TypeScript + Vite
- Tailwind CSS — clean, enterprise-style light theme
- Framer Motion — transitions, timelines, and interactive elements
- Recharts — KPI time series, emissions tracking, and what-if projections
- Lucide React — icon system
- Leaflet / React-Leaflet — the Urban Intelligence & Environmental Map
- React Context (`AurisContext`) with localStorage persistence for client-side state

**Backend**
- Node.js + Express (REST API layer)
- Supabase (Postgres + Auth) for real persistence and Google sign-in
- MongoDB/Mongoose scaffold present for local/offline development

**Data & Intelligence**
- OpenStreetMap Overpass API — real nearby-hospital lookups
- Formula-based environmental impact modeling (transparent, cited assumptions — not black-box numbers)
- City-specific incident data grounded in real infrastructure challenges across major Indian metros

**Tooling**
- GitHub for version control
- Oxlint for linting

---

## Project Structure

```
AURIS/
├── src/
│   ├── pages/          # Overview, Urban Command, City Health, Citizen, Carbon,
│   │                    # Departments, AI Center, Analytics, Google Auth
│   ├── components/      # Navbar, AI Assistant Drawer, Incident Detail Panel,
│   │                    # Audit Trail, Global Search, Causal Graph, modals, etc.
│   ├── services/        # incidentEngine, urbanIntelligence, environmentalImpactService,
│   │                    # hospitalService, aiChatService, googleAuthService, rbac
│   ├── store/            # AurisContext — global app state
│   ├── maps/             # Geospatial map rendering
│   ├── data/             # Mock/seed data (incidents, cities, roles)
│   └── types/            # Shared TypeScript types
├── backend/
│   └── src/
│       ├── controllers/  # auth, incidents, complaints, carbon, notifications, chat
│       ├── routes/
│       ├── middleware/
│       └── config/        # database, env, supabase
└── public/
```

---

## Getting Started

### Frontend

```bash
npm install
cp .env.example .env   # add your Google OAuth client ID and Supabase project keys
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # add your JWT secret, Supabase keys, and Google OAuth client ID
npm run dev
```

The frontend expects the backend at `VITE_API_URL` (defaults to `http://localhost:5000/api`).

---

## Roadmap

- [ ] Full migration of persistence from localStorage to Supabase across all modules
- [ ] Live multi-user updates via Supabase Realtime
- [ ] Expanded incident coverage across more Indian cities and real open government datasets
- [ ] Deeper citizen engagement (complaint upvoting, notifications, public transparency reporting)
- [ ] Verified carbon project onboarding workflow

---

## License

Built for Washington Hackathon 2026. All rights reserved by Team Starlight unless otherwise noted.
