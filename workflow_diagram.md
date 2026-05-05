# Visual Workflow Diagram

You can use this visual flow to explain how data moves through the portal.

```mermaid
graph TD
    subgraph "Agency Admin (The Controller)"
        A[Create Brand Profile] --> B[Create Master Influencer Pool]
        B --> C[Create Campaign for Brand]
        C --> D[Pitch Influencers to Campaign]
    end

    subgraph "The Handover"
        D --> |Real-time Sync| E{Client Dashboard}
    end

    subgraph "The Brand Portal (The Client)"
        E --> F[Review Influencer Profiles]
        F --> G[Decision: Shortlist or Reject]
    end

    subgraph "The Result"
        G --> |Instant Notification| H[Agency proceeds with Contract]
        G --> |Audit Log| I[Decision Recorded with Timestamp]
    end

    style A fill:#4f46e5,stroke:#fff,color:#fff
    style B fill:#4f46e5,stroke:#fff,color:#fff
    style C fill:#4f46e5,stroke:#fff,color:#fff
    style D fill:#4f46e5,stroke:#fff,color:#fff
    
    style E fill:#0ea5e9,stroke:#fff,color:#fff
    style F fill:#0ea5e9,stroke:#fff,color:#fff
    style G fill:#0ea5e9,stroke:#fff,color:#fff
    
    style H fill:#10b981,stroke:#fff,color:#fff
    style I fill:#6366f1,stroke:#fff,color:#fff
```

### Key Stages Explained:

1.  **Preparation (Agency):** You build your library of talent and set up the client's account.
2.  **The Pitch:** You select specific talent from your library that fits a specific brand campaign.
3.  **The Portal:** The client receives a high-end, branded experience where they can review your suggestions.
4.  **The Decision:** The client takes action. No more "I'll let you know." They click a button, and you see it instantly.
5.  **Data Security:** Throughout this whole process, the **RLS (Row Level Security)** ensures that no other client can see these negotiations.
