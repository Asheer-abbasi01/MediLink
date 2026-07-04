# MediLink – Advanced Healthcare Management Platform (v2.0)

MediLink is a production-ready, feature-rich healthcare management SaaS platform built on the modern MERN stack. Designed with a premium glassmorphic UI/UX, unified component library, and strict enterprise security policies, MediLink streamlines clinic operations, patient portals, and automated stock systems.

---

## 📋 Table of Contents
1. [🌟 Key Features](#-key-features)
   - [Clinical Admin Portal](#clinical-admin-portal)
   - [Patient Portal](#patient-portal)
2. [🤖 Gemini AI Healthcare Assistant](#-gemini-ai-healthcare-assistant)
3. [🛡️ Security & Resilience Architecture](#️-security--resilience-architecture)
4. [🧪 ACID Transaction Protocol (Payment Workflow)](#-acid-transaction-protocol-payment-workflow)
5. [🛠️ Tech Stack & Dependencies](#️-tech-stack--dependencies)
6. [📂 Project Directory Structure](#-project-directory-structure)
7. [⚙️ Environment Configuration](#️-environment-configuration)
8. [🏁 Installation & Quickstart](#-installation--quickstart)
9. [📈 Database Migration & Seeding](#-database-migration--seeding)

---

## 🌟 Key Features

### Clinical Admin Portal
- **Financial Analytics & Revenue Charts**: Built-in charts displaying clinic collections, payment distributions, and patient flow statistics.
- **Appointment & Doctor Rosters**: Track and schedule doctor slots, manage working departments, register new clinicians, and approve or reschedule appointments.
- **Inventory & Pharmacy Management**: Maintain medicine availability, adjust prices, monitor stock counts, and execute inventory transactions.
- **Patient EMR & Billing**: Search patients, log clinical clinical journals/notes, issue bills, record payments, and audit receipts.
- **System Administration**: Full control over user registers, credentials, roles, and platform settings.

### Patient Portal
- **Appointment Booking**: Request appointment slots with specific doctors across various departments.
- **Personal Prescription & Bill Ledger**: View active prescriptions, check invoice status, and securely process payments.
- **Clinical Notebook**: Log private symptoms, diaries, or clinical journals.
- **Pharmacy Storefront**: Browse available medicine stocks, pricing, and manufacturer details.

---

## 🤖 Gemini AI Healthcare Assistant

MediLink integrates the **Google Generative AI SDK** (using `gemini-2.5-flash`) to offer a conversational virtual assistant:

- **Context-Aware Assistance**: Chat history is formatted dynamically to allow the AI to answer platform questions, guide navigation, and respond to general healthcare inquiries.
- **Automatic Safe Diagnostic Controls**: Enforced with system instructions to prevent the model from prescribing drugs, diagnosing diseases, or making definitive medical assertions. It prompts patients to consult verified human staff.
- **Graceful Fallback Mode**: If no `GEMINI_API_KEY` environment variable is defined on the server, the assistant operates in a simulated demo mode, introducing itself and explaining platform guides.

---

## 🛡️ Security & Resilience Architecture

MediLink's backend is hardened to defend sensitive medical data and prevent server failures:

- **Strict HTTP Headers (Helmet)**: Automates standard HTTP security headers to protect against cross-site scripting (XSS) and clickjacking.
- **IP Rate Limiting**:
  - `authLimiter`: Limits login/signup routes to 100 requests per 15 minutes to thwart brute-force attacks.
  - `apiLimiter`: Limits standard API endpoints to 500 requests per 5 minutes to prevent DDoS and API abuse.
- **CORS Allowances**: Tightened browser origin configurations protecting database transactions from unauthorized origins.
- **Centralized Error Middleware**: Intercepts Mongoose Validation Errors, Cast Errors (Invalid ObjectIds), and Mongo Duplicate Key Errors (code `11000`), returning structured JSON payloads without exposing server stack traces in production.
- **Graceful Shutdown Protocol**: Safely terminates active HTTP listen ports and disconnects the Mongoose/MongoDB connection upon receiving `SIGTERM` or `SIGINT` signals.

---

## 🧪 ACID Transaction Protocol (Payment Workflow)

To prevent race conditions, double-billing, or stock leakage, sensitive checkouts run inside **Mongoose Database Sessions** leveraging multi-document **ACID Transactions**:

```
[Payment Requested]
        │
        ▼
 1. Check if Bill exists and is Pending?
        │
        ├─► Yes: Proceed
        └─► No: Abort (Rollback)
        │
        ▼
 2. Verify payment amount matches bill exactly?
        │
        ├─► Yes: Proceed
        └─► No: Abort (Rollback)
        │
        ▼
 3. Verify enough medicine stocks are available?
        │
        ├─► Yes: Proceed
        └─► No: Abort (Rollback)
        │
        ▼
 4. Perform atomic operations inside transactional session:
     ├── A) Create payment record in "payment" collection
     ├── B) Mark status as "Paid" in "bill" collection
     └── C) Decrement stock quantity in "medicine" collection
        │
        ▼
[Commit & Return Transaction Successful]
```

*If any atomic step fails, the entire transaction is aborted, immediately restoring the database to its pre-transaction state.*

---

## 🛠️ Tech Stack & Dependencies

### Frontend (`medilink_frontend`)
- **React (v19)**: Built using concurrent rendering.
- **React Router Dom (v7)**: Manages layouts, roles, and client-side page routing.
- **Tailwind CSS (v3)**: Drives the custom utility-first glassmorphic styling system.
- **Recharts (v3)**: Generates clinical dashboards and financial analytics plots.
- **Axios Client**: Configured with request interceptors for JWT injection and response interceptors for global logging out on session expiration (HTTP 401).

### Backend (`MediLink_Backend`)
- **Node.js & Express (v5)**: Uses the modern Express 5 API router in ES Module (`import/export`) format.
- **Mongoose (v8)**: Drives ODM schemas, validation hooks, and transactional sessions.
- **Express-Rate-Limit & Helmet**: Restricts request rates and secures headers.
- **Morgan & Bcrypt / JWT**: Logs system accesses, hashes passwords, and signs auth payloads.

---

## 📂 Project Directory Structure

### Frontend Layout
```text
medilink_frontend/
├── public/                 # Static public assets
└── src/
    ├── api/
    │   └── client.js       # Base Axios instance with auth interceptors
    ├── assets/             # Images and design system assets
    ├── components/
    │   ├── ui/             # Reusable UI Atoms (Button, Badge, Card, Input, Table, etc.)
    │   ├── AdminLayout.jsx # Shell layout for clinical admin dashboards
    │   ├── UserLayout.jsx  # Shell layout for patient portals
    │   ├── AIChatbot.jsx   # Floating conversational AI drawer
    │   └── ...             # Modals, checkouts, and booking components
    ├── pages/
    │   ├── admin/          # Admin panels (Analytics, Users, Bills, Notes, Sidebar)
    │   ├── user/           # Patient views (Home, Appointments, Notes)
    │   ├── Home.jsx        # Landing page
    │   ├── Login.jsx       # Login interface
    │   ├── Signup.jsx      # Signup interface
    │   └── ChooseRole.jsx  # Role registration selection
    ├── routes/
    │   └── AppRoutes.jsx   # Client router and Route Protection
    ├── index.css           # Tailwind base configuration
    └── index.js            # React mount initializer
```

### Backend Layout
```text
MediLink_Backend/
├── config/
│   └── db.js               # Mongoose MongoDB connection builder
├── controllers/            # API Route logics (AI, Bills, Patients, Notes, Auth, etc.)
├── middleware/             # Express middlewares (errorMiddleware, rateLimitMiddleware)
├── models/                 # Database Mongoose Schemas (User, Patient, Medicine, Bill, etc.)
├── routes/                 # Express API Endpoint definitions (19 routed files)
├── scripts/
│   └── addStockToMedicines.js # Medicine stock migration & ID generator script
├── server.js               # Express application entry point & Graceful shutdown
└── transactions.js         # ACID Payment transaction session handler
```

---

## ⚙️ Environment Configuration

Set up environment credentials in both directories before starting the system.

### 🔑 Backend Configuration
Create a `.env` file in the `MediLink_Backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medilink
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRE=7d
GEMINI_API_KEY=your_google_gemini_api_key_here
CORS_ORIGIN=*
NODE_ENV=development
```

### 🔑 Frontend Configuration
Create a `.env` file in the `medilink_frontend/` directory:
```env
REACT_APP_API_URL=http://localhost:5000
SKIP_PREFLIGHT_CHECK=true
```

---

## 🏁 Installation & Quickstart

### Prerequisites
- Node.js (v18 or higher)
- A running MongoDB Server or MongoDB Atlas cluster

### Step 1: Install Dependencies
Install dependencies in both directories:
```bash
# In the repository root
cd MediLink_Backend
npm install

cd ../medilink_frontend
npm install
```

### Step 2: Start Development Servers
Run the backend and frontend in separate terminals:
```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
cd MediLink_Backend
npm run dev

# Terminal 2: React Frontend (runs on http://localhost:3000)
cd medilink_frontend
npm start
```

---

## 📈 Database Migration & Seeding

If you are setting up the database for the first time, you must run the inventory migration script. This script seeds a default stock of 50 for medicines without a stock field, updates statuses (`Available` / `Out of Stock`), and generates unique `medicineId` keys for all pharmacy listings:

```bash
# Run migration script
cd MediLink_Backend
node scripts/addStockToMedicines.js
```
The console will output a summary detailing the database connection, count of updated documents, and current inventory status.
