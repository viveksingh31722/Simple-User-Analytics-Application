# CausalFunnel Simple User Analytics Platform

A complete full-stack web analytics framework built to intercept, ingest, and graphically visualize user behavior through rich session aggregation, ordered user journeys, and highly responsive coordinate interaction heatmaps.

---

## 🏗️ Technical Stack Architecture

The solution is divided into two distinct components ensuring modularity, clear separation of concerns, and high maintainability:

### 1. Backend Service (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Middleware**: CORS enabled for cross-origin tracking beacons, Dotenv for configuration.
- **Design Pattern**: RESTful API endpoints catering to structured analytics ingest and optimized aggregations.

### 2. Frontend Platform (`/frontend`)
- **Framework**: Next.js (App Router with client-side reactive components)
- **Styling**: Pure custom Vanilla CSS & Design Tokens (Curated Dark Mode color palette, immersive glassmorphism aesthetics, dynamic micro-animations).
- **Client Tracker Script**: Reusable vanilla JavaScript bundle hosted statically at `/tracker.js` utilizing both `navigator.sendBeacon` and high-performance asynchronous fetch requests.

---

## 🗄️ MongoDB Database Integration Instructions

### How the Database is Added and Managed
In MongoDB, **you do not need to manually create databases or tables (collections) beforehand**. 

1. **Auto-Creation**: Upon starting the backend server, Mongoose connects to the default target address:
   ```text
   mongodb://127.0.0.1:27017/causalfunnel_analytics
   ```
2. **Dynamic Ingestion**: The moment the tracking script fires its very first `page_view` or `click` event from the Demo Webpage, MongoDB immediately automatically creates the database **`causalfunnel_analytics`** and instantiates the **`events`** collection.
3. **Inspecting Data Locally**:
   - Open **MongoDB Compass** and connect to `mongodb://localhost:27017`.
   - You will instantly see the `causalfunnel_analytics` database populated with real-time JSON tracking events containing compound index mappings for ultra-fast session querying.

---

## 🚀 Setup & Launch Instructions

Follow these step-by-step instructions to get the platform running locally.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on default port `27017` (or pass custom connection strings via `.env`).

### Step 1: Start the Backend Service
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000` by default and auto-connects to the local MongoDB instance.*

### Step 2: Start the Frontend Application
1. Open a separate terminal and navigate into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the primary Dashboard interface at:
   👉 **`http://localhost:3000`**
5. Launch the live simulated storefront at:
   👉 **`http://localhost:3000/demo`**

---

## 📊 Core Features & Advanced Capabilities

### 1. Client-Side Tracking Script (`/tracker.js`)
- **Dynamic 30-Minute Boundary Session Expiration**: Enforces server-aligned tracking logic by computing inactivity thresholds directly against `causalfunnel_last_activity`. If a user remains completely idle for over 30 minutes, the existing token string is wiped and a brand new persistent identifier is spawned upon subsequent interaction.
- **Page View Ingestion**: Triggers payload dispatch on script mount or page transitions.
- **Precision Bounding Coordinates**: Captures scroll-adjusted absolute document points (`x`/`y`) alongside full underlying parent surface widths (`viewportWidth`/`viewportHeight`).

### 2. Real-Time Dashboard Interfaces
- **Live Status Classification**: Evaluates captured data arrays dynamically to render highly visual green **● LIVE** or gray **EXPIRED** validation labels next to persistent session cards.
- **Interactive User Journeys**: Click any specific session token in the left side-panel to instantly load their chronological interaction timelines.
- **Responsive Layout Normalization Strategy**: Enables real-time toggling between **Absolute Raw Pixels** and **Proportional Responsive Scaling**. Proportional mode dynamically calculates percentage positioning (`left: (x / viewportWidth) * 100%`) ensuring precise interaction scatter overlays align correctly regardless of varying test monitor sizes.

---

## 🧠 Assumptions & Trade-Offs

1. **Session Lifecycle & Expiration**:
   - *Assumption*: Keying timeout rules on the client via `localStorage` activity intervals reliably simulates server-side sliding window session tracking while avoiding persistent network socket polling overhead.
   - *Trade-off*: A user forcefully closing their browser tab and immediately returning within 29 minutes will preserve their unified session string, matching standard web analytical expectations.

2. **Coordinate Normalization Modes**:
   - *Assumption*: Providing multi-mode coordinate projection empowers analysts to observe raw screen coordinates or fluid fluid-canvas maps.
   - *Trade-off*: Absolute pixel projection requires consistent window sizes, whereas proportional horizontal projection assumes centered flexible target designs. Both mechanisms are provided as live interactive toggles on the dashboard surface to deliver maximum control.

3. **Asynchronous Transport Strategy**:
   - *Assumption*: Modern browsing environments favor non-blocking tracking scripts.
   - *Trade-off*: `navigator.sendBeacon` is prioritized for exit clicks to prevent lost analytical events during browser tab closure. A reliable asynchronous standard `fetch` is provided as an immediate fallback.

---
*Designed with rich aesthetics, curated styling tokens, and robust performance mechanics to meet premium industry expectations.*
