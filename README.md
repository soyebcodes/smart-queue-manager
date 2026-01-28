# Smart Appointment & Queue Manager

A robust, premium-designed appointment scheduling and real-time waiting queue management system. Built with **Next.js 16**, **Supabase**, and **Tailwind CSS**, this application provides a seamless experience for both administrators and customers.

## ✨ Features

- **📊 Real-time Dashboard**: Live statistics for today's appointments, pending tasks, and staff load distribution.
- **📅 Smart Appointments**: Advanced booking system with integrated **Conflict Detection** and availability feedback.
- **🚶 Advanced Queue Management**: Automatically moves unassigned appointments to a waiting queue with manual override capabilities.
- **👥 Staff & Service Management**: Define service categories, set daily staff capacities, and manage roles.
- **🕵️ Activity Audit Trail**: Comprehensive logging of all administrative actions (scheduling, staff changes, services).
- **🎨 Premium UI/UX**:
  - **Violet/Zinc Theme**: A modern, sophisticated aesthetic.
  - **Responsive Design**: Full mobile support with a dedicated hamburger navigation menu.
  - **Dynamic Interactivity**: Hover effects, smooth transitions, and loading states.
- **🌓 Dark/Light Mode**: Optimized for both professional environments and high-contrast accessibility.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase

## 🚀 Getting Started

### 1. Prerequisite
- Node.js 18+
- Supabase Account

### 2. Installation
```bash
git clone https://github.com/soyebcodes/smart-queue-manager.git
cd smart-queue-manager
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Locally
```bash
pnpm dev
```

## 🏗️ Build for Production
```bash
pnpm build
pnpm start
```

## 📄 License
MIT
