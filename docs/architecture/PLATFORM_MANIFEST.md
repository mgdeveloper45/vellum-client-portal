# Vellum Platform Manifest

## Philosophy

Vellum is an intelligent operating system for service businesses.

Every architectural decision should reinforce one of three goals:

1. Help businesses make better decisions.
2. Reduce repetitive work through automation.
3. Maintain a clean, scalable platform.

---

# Layered Architecture

Presentation

↓

Command Centers

↓

Intelligence Layer

↓

Domain Engines

↓

Automation Engine

↓

Event Engine

↓

Database

---

# Responsibilities

## Pages

Pages never contain business logic.

Pages:

- authenticate users
- load data
- call engines
- render components

---

## Domain Engines

Domain Engines contain business rules.

Examples:

Booking Engine

Workspace Engine

Future:

Client Engine

Finance Engine

Growth Engine

---

## Intelligence Layer

The Intelligence Layer combines outputs from multiple engines.

It never queries Prisma directly.

Responsibilities include:

- Recommendations
- Executive Inbox
- Prioritization
- Scoring
- AI summaries

---

## Automation Layer

Automation reacts to Events.

Automation executes workflows.

Automation never owns business rules.

---

## Event Layer

Major business actions create events.

Events become the source of truth for:

- automation
- notifications
- activity feeds
- analytics
- AI context

---

# Design System

Dashboard components should use the Vellum Design System.

Prefer:

- CommandCard
- RecommendationCard
- MetricCard
- StatusBadge
- SectionHeader

Never duplicate layout or styling.

---

# Engineering Rules

✓ Extend existing abstractions before creating new ones.

✓ One concept should have one implementation.

✓ Business logic belongs in engines.

✓ Components render.

✓ Engines think.

✓ Intelligence combines.

✓ Automation executes.

✓ Events record.

---

# Definition of Done

Every significant feature should include:

- implementation
- tests
- documentation (if architecture changes)
- clean commit