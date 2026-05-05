# Influencer Campaign Portal: Expert Product & Architecture Plan

As an expert in Marketing Technology (MarTech) and SaaS architecture, I have deeply analyzed both audio recordings. The conversation highlights a classic scaling bottleneck faced by agencies: **transitioning from static, decentralized spreadsheets to a centralized, trackable, and premium client portal.**

Here is a professional breakdown of the problem, product strategy, and technical implementation plan.

---

## 📊 Expert Analysis of the Business Problem

### 1. The Presentation & Brand Perception Gap
*   **The Issue:** Sharing raw Excel/Google Sheets ("sample sheets") with clients looks unprofessional and diminishes the agency's perceived value.
*   **The Goal:** Deliver a "fancy" (premium), presentable, and intuitive UI that wows the brand and makes data consumption effortless.

### 2. Workflow Inefficiency & Data Silos
*   **The Issue:** Moving influencers through a funnel (e.g., discovering 100 → shortlisting 50 → finalizing) is highly manual and error-prone in spreadsheets.
*   **The Goal:** Implement a structured status pipeline (e.g., `Proposed` ➔ `Shortlisted` ➔ `Rejected`) directly within the portal.

### 3. Lack of Accountability & Auditability (The "Who Did What" Problem)
*   **The Issue:** When a brand shares a single sheet or login across its team, the agency cannot track *who* approved or rejected an influencer (*"kisne kya kiya yeh nahi pata chalta"*).
*   **The Goal:** Implement a Multi-Tenant architecture with Role-Based Access Control (RBAC). The agency provisions a "Brand Admin" account, and that Admin can independently create "Sub-Users" for their team. Every action is then logged against a specific user ID.

---

## 🏗️ Product Architecture & Tech Stack (Updated with Supabase)

Switching to **Supabase** is a brilliant architectural decision for this specific use case. It significantly reduces backend overhead while providing enterprise-grade security.

*   **Core Framework:** **Next.js (App Router)** - For the frontend UI and server-side rendering.
*   **Backend as a Service (BaaS):** **Supabase**
    *   **Database:** Supabase provides a managed **PostgreSQL** database, which is perfect for our relational data.
    *   **Authentication:** Supabase Auth will handle our logins (replacing NextAuth).
    *   **Security (RLS):** Supabase features **Row Level Security**. This is a killer feature for client portals. We can enforce database-level rules so that *Brand A* can physically never query or access campaigns belonging to *Brand B*, preventing catastrophic data leaks.
*   **UI/UX Design System:** **Tailwind CSS + Shadcn UI** - To guarantee the "fancy" and premium look the stakeholders requested.

---

## 🗄️ Relational Database Schema (Supabase PostgreSQL)

We will utilize a multi-tenant structure within Supabase:

1.  **`brands` (The Tenant)**
    *   `id`, `name`, `created_at`
2.  **`users` (Identity & Access - Extended from Supabase Auth)**
    *   `id` (References Supabase `auth.users`), `brand_id` (FK), `full_name`, `role` (`super_admin`, `brand_admin`, `brand_user`)
3.  **`campaigns` (The "Sheet" Replacement)**
    *   `id`, `brand_id` (FK), `name`, `status`, `created_at`
4.  **`influencers` (The Creator Pool)**
    *   `id`, `name`, `instagram_url`, `followers`, `location`, `contact_number`
5.  **`campaign_influencers` (The Pivot/Workflow Table)**
    *   Links `campaigns` to `influencers`.
    *   `status` (Enum: `pending`, `shortlisted`, `rejected`).
    *   `updated_by` (FK to `users.id` - Solves the audit trail requirement).
    *   `updated_at`.

---

## 🚀 Execution Phases (MVP Roadmap)

### Phase 1: Foundation & Identity
- Initialize Next.js and Tailwind in `d:\yash\may\portal-brands`.
- Set up a new Supabase project.
- Configure Supabase Auth and design the PostgreSQL tables.
- Implement Row Level Security (RLS) policies (e.g., users can only read `campaigns` where `campaign.brand_id == user.brand_id`).

### Phase 2: Agency Operations Hub (Internal)
- Build a secure dashboard for `super_admin` (Agency).
- Create UI to onboard new Brands and generate their initial `brand_admin` credentials via Supabase Admin API.
- Create UI to define Campaigns and add Influencers to them.

### Phase 3: Brand Portal & Sub-User Management
- Build the Brand-facing application shell.
- Create the "Team Management" settings page allowing the `brand_admin` to invite `brand_user` accounts.

### Phase 4: The Interactive Campaign Dashboard
- Build the highly presentable, interactive view of Influencers for a specific Campaign using Shadcn UI data tables.
- Implement the Action Pipeline (Shortlist/Reject buttons).
- Integrate the Audit Log (displaying "Shortlisted by [User Name]").

---

> [!IMPORTANT]
> ## 🛑 User Review & Sign-off Required
> 
> The plan has been updated to fully leverage Supabase!
> 
> **Are we cleared to begin Execution Phase 1?**
> If you approve, I will initialize the Next.js project right now. You will just need to create a free Supabase project on supabase.com and provide me with the `URL` and `ANON KEY` when I ask for them.
