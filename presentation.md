# 1to7 Media: Influencer Campaign Brand Portal
## Presentation Deck - Product Overview

### 💡 The Problem
Agencies currently rely on manual spreadsheets, WhatsApp threads, and fragmented emails to manage influencer shortlists. This leads to:
- **Data Fragmentation:** Hard to track client decisions.
- **Lack of Professionalism:** Spreadsheets don't feel "premium" to high-end brands.
- **Privacy Risks:** Manual work increases the chance of leaking data between brands.

### ✨ The Solution
A custom-built, multi-tenant portal that centralizes influencer management, campaign tracking, and client approvals into one cohesive, high-performance web application.

---

### 🛠️ Core Features

#### 1. Centralized Influencer Pool
- A master database of all agency influencers.
- Real-time data on follower counts, locations, and contact info.
- Searchable and filterable for quick campaign matching.

#### 2. Multi-Tenant Brand Portals
- **Isolated Experiences:** Each brand (Nike, Red Bull, etc.) gets their own dedicated dashboard.
- **Zero Leakage:** Advanced Row Level Security (RLS) ensures Brand A can never see Brand B's data.
- **White-Labeled Feel:** Premium UI design tailored to feel like a custom enterprise tool.

#### 3. Interactive Campaign Pipelines
- **The "Pitch" Workflow:** Agencies "propose" influencers to a campaign.
- **One-Click Approvals:** Clients review influencer profiles and click "Shortlist" or "Reject" instantly.
- **Audit Logging:** Every decision is tracked (who made it and when) for complete accountability.

#### 4. Team Accountability
- **Role-Based Access:** Agency Admins vs. Brand Admins vs. Brand Users.
- **Internal Team Management:** Clients can invite their own team members to help with the review process.

---

### 🏗️ Technology Stack (State-of-the-Art)
- **Frontend:** Next.js 16 (App Router) with React 19 for ultra-fast, server-side performance.
- **Styling:** Tailwind CSS v4 & Shadcn UI for a modern, glassmorphism-inspired aesthetic.
- **Database & Security:** Supabase (PostgreSQL) with Row Level Security (RLS) enforcing multi-tenancy at the core level.
- **Speed:** Zero-latency updates using Next.js Server Actions.

---

### 📈 Business Impact
- **80% Faster Approvals:** Reduces back-and-forth communication.
- **Enhanced Brand Perception:** Clients feel they are using a cutting-edge SaaS platform.
- **Scalable Operations:** Manage 100+ brands with the same team size.

---

### 🛡️ Security & Privacy
- **Enterprise-Grade Auth:** Built-in Supabase Authentication with encrypted password hashing.
- **Database Shielding:** Data is siloed at the schema level; a client literally *cannot* query another brand's data.
