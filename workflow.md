# Influencer Brand Portal - Complete Workflow Guide

This document outlines the entire flow of the application, from initial database setup to the final client-facing influencer review.

---

## 🏗️ 1. Technical Architecture
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS & Shadcn UI
- **Backend/Auth:** Supabase
- **Multi-tenancy:** Enforced via PostgreSQL Row Level Security (RLS) policies.

---

## 🔑 2. User Roles
1. **Super Admin (Agency):** Can manage all Brands, create the Influencer Pool, and launch Campaigns.
2. **Brand Admin (Client):** Can manage their own team and review influencers for their specific brand.
3. **Brand User (Client Member):** Can review and status influencers but cannot manage the team.

---

## 🚀 3. Start-to-End Workflow

### Phase 1: Database Initialization
1.  **Run Schema:** Execute the `schema.sql` in the Supabase SQL Editor. This creates all tables and RLS policies.
2.  **Create Admin:** Use the provided SQL block to create the `admin@1to7media.com` user in `auth.users` and link them to the `super_admin` role in `public.profiles`.

### Phase 2: Agency Operations (The Setup)
*Logged in as admin@1to7media.com*

1.  **Brands:** Create a brand (e.g., "Nike").
2.  **Clients:** Create a client user linked to that brand.
3.  **Influencer Pool:** Add influencers to your master database (Name, Followers, Instagram, etc.).
4.  **Campaigns:** Create a new campaign and assign it to a Brand.
5.  **Pitching:** Open the campaign, click "Add Influencer", and pick influencers from your pool to "pitch" to the client. They will start with a **Pending** status.

### Phase 3: The "Demo Data" Shortcut
*Logged in as admin@1to7media.com*

1.  On the Dashboard, click the orange **"Generate Demo Data"** button.
2.  This automatically populates all tables with realistic data, assignments, and statuses so you can see the "fancy" UI immediately.

### Phase 4: Client Review (The Portal)
*Logged in as client@nike.com*

1.  **Login:** The client sees a dashboard filtered *only* to their brand.
2.  **Review:** They open the campaign and see the cards of influencers proposed by the agency.
3.  **Action:** The client clicks **"Shortlist"** or **"Reject"**.
4.  **Audit Trail:** Every action is timestamped and shows which client user made the decision.

### Phase 5: Closing the Loop
*Logged in as admin@1to7media.com*

1.  The Agency Admin returns to the campaign view.
2.  They instantly see the client's decisions, allowing them to proceed with contracting the shortlisted influencers.

---

## 🛠️ Maintenance & Development
- **RLS Safety:** No brand can ever see another brand's data. This is enforced at the database level.
- **Responsive Design:** The portal is fully mobile-responsive for clients on the go.
- **Server Actions:** All data mutations are handled via secure Next.js Server Actions.
