# Qash — Full Stack E-Commerce Platform

متجر إلكتروني متكامل لديكور المنزل، مبني بـ Next.js و Node.js.

## 📁 Structure

- `qash-frontend/` — Next.js 16 (App Router, TypeScript, Tailwind, Zustand)
- `qash-backend/` — Node.js + Express + MongoDB + TypeScript

## ✨ Features

- Authentication with JWT + Email Verification
- Products with filters, search & recommendations
- Shopping Cart & Wishlist
- Checkout with coupons (SAVE10)
- Orders management
- Bilingual (Arabic / English) + RTL
- Dark Mode

## 🚀 Getting Started

### Backend

\`\`\`bash
cd qash-backend
npm install
npm run dev
\`\`\`
Create a `.env` file with: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`

### Frontend

\`\`\`bash
cd qash-frontend
npm install
npm run dev
\`\`\`
Create a `.env.local` file with: `API_BASE_URL=http://localhost:5000/api`

## 🛠️ Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, Zustand, Zod, Framer Motion
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer
