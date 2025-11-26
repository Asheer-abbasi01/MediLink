# MediLink – Full-Stack Healthcare System

**MediLink** is a comprehensive full-stack healthcare management system built using the **MERN stack** (MongoDB, Express, React, Node.js). The system focuses on managing **patients, bills, payments, medicine stock, and role-based access** while ensuring **ACID-compliant transactions** for critical operations like payments and medicine usage.

---

## Features

### Backend Features (Node.js + Express + MongoDB)
- **CRUD operations** for:
  - Patients, Doctors, Nurses, Staff
  - Bills & Payments
  - Medicines & Stock management
  - Appointments, Prescriptions, Room assignments
- **ACID Transactions**
  - Payment processing with automatic bill updates
  - Medicine stock decrement and rollback on failure
- **Role-Based Access Control**
  - Admin vs. User permissions
  - Secure authentication with **bcrypt**
- **Data Validation**
  - Ensures payments match bill amounts
  - Checks medicine stock before deduction
- **Security**
  - Input sanitization
  - Password hashing
  - Prevention against common vulnerabilities

### Frontend Features (React)
- Interactive **payment form** with step-wise transaction visualization
- Dynamic **medicine usage management** (add/remove medicines)
- Responsive design for all devices
- Form validation for payments and card details

---

## Technology Stack

| Layer     | Technology                                   |
|----------|---------------------------------------------|
| Frontend | React, Tailwind CSS                          |
| Backend  | Node.js, Express.js                           |
| Database | MongoDB (Atlas/Local)                        |
| Security | bcrypt, dotenv, validation, transaction-safe operations |
| Version Control | Git & GitHub                          |

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- npm / yarn
- MongoDB Atlas account or local MongoDB server

---

### Clone Repository
```bash
git clone https://github.com/Asheer-abbasi01/MediLink.git
cd MediLink
