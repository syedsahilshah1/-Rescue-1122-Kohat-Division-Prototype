# SERMS: Smart Emergency Response Management System
### 🚑 Rescue 1122 Kohat Division Prototype

SERMS is a professional-grade, real-time emergency management platform designed to streamline the lifecycle of an emergency—from the first call to hospital admission. Built with a focus on **Redundant Intelligence** and **Role-Based Command**, it ensures that dispatchers, responders, and hospitals work in sync.

---

## 🚀 Core Features

### 1. 📊 Central Analytics Command
- Real-time visualization of incident trends.
- Occupancy alerts for regional hospitals.
- Status breakdown of the active rescue fleet.

### 2. 📡 Intelligent Dispatch (RBAC)
- **Live Incidents**: Track emergencies from "Dispatching" to "Completed".
- **Quick Assign**: Automated matching of incidents to the nearest available unit.
- **Differentiated Workflows**: 
  - **Administrators**: Full system command.
  - **Operators**: Handle reporting and dispatching.
  - **Responders**: Update assigned unit status and manage equipment/supplies.

### 3. 🛠️ Smart Fleet Monitoring
- **Telemetry Data**: Live tracking of **Oxygen Levels** with critical low-level warnings.
- **Equipment Matrix**: Instant verification of life-saving tools (Ventilators, Defibrillators) per unit.
- **GPS Integration**: Real-time coordinates and driver contact synchronization.

### 4. 🏥 Hospital Capability Matrix
- **Facility Specialization**: Distinct clinical focus areas (e.g., Trauma, Burn Center).
- **Localized Control**: Each hospital (DHQ, Liaquat, CMH) has its own secure access to manage:
  - Bed Occupancy (ICU vs General).
  - Ventilator Availability.
- **Pulsing Warnings**: Visual alerts when a facility reaches critical capacity.

---

## 💻 Technology Stack

- **Frontend**: React 18, Vite, Framer Motion (Animations), Lucide React (Icons).
- **Backend**: Laravel 11, PHP 8.2+, MySQL.
- **Authentication**: Laravel Sanctum (Token-based).
- **Styling**: Premium Glassmorphism UI with Vanilla CSS.

---

## ⚙️ Installation & Setup

### Backend (Laravel)
1. Navigate to the `backend` directory.
2. Install dependencies: `composer install`.
3. Configure `.env` file (Database, App Key).
4. Run migrations and seed data:
   ```bash
   php artisan migrate:fresh --seed
   ```
5. Start the server: `php artisan serve`.

### Frontend (React)
1. Navigate to the root directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

---

## 🔐 Mock Credentials (For Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@rescue1122.pk` | `password` |
| **Operator** | `op1@rescue1122.pk` | `password` |
| **Responder** | `responder@rescue1122.pk` | `password` |
| **DHQ Hospital** | `dhq@hospital.pk` | `password` |
| **Liaquat Hospital** | `lmh@hospital.pk` | `password` |

---

## 🛡️ Security Measures
- **Role-Based Access Control (RBAC)**: Enforced at both API and UI levels.
- **Data Integrity**: Foreign key constraints ensure data consistency across incidents and responders.
- **Audit Ready**: All critical status changes are designed for logging and review.

---
*Developed for Rescue 1122 Kohat Division - Smart Management Initiative.*
