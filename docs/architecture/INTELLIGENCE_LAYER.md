# Intelligence Layer

The Intelligence Layer combines insights from multiple domains.

It consumes engines.

It does not query the database directly.

---

Booking Engine
│
Workspace Engine
│
Finance Engine
│
Client Engine
▼
Recommendation Engine
▼
Executive Inbox

---

## Responsibilities

- Health scoring
- Prioritization
- Recommendations
- Executive Inbox
- AI summaries

---

## Shared Utilities

- score.ts
- priority.ts
- recommendation.ts

These utilities should remain generic and reusable across domains.

---

## Goal

Present business owners with a single prioritized stream of work rather than isolated dashboards.
