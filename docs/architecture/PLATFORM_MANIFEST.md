# Vellum Platform Manifest

## Completion Estimate

Vellum is approximately 65–70% complete as a production SaaS platform.

The platform foundation is strong. Remaining work is focused on security hardening, end-to-end testing, finance intelligence, automation, AI assistant capabilities, deployment readiness, and production polish.

---

## Product Identity

Vellum is an intelligent operating system for service businesses built around the booking lifecycle.

The core promise:

Open Vellum. See what matters. Take action.

---

## Core Layers

Presentation

↓

Command Centers

↓

Domain Engines

↓

Intelligence Layer

↓

Recommendation Engine

↓

Automation Layer

↓

Event Layer

↓

Database

---

### Engine Contract

All new domain engines should target the shared `EngineResult<T>` shape.

Existing engines may be migrated incrementally as they are enhanced.

## Core Domains

### Booking Domain

Status: Mature

Includes:

- Booking Engine
- Booking Command Center
- Booking Health
- Booking Timeline
- Booking Mission
- Booking Countdown
- Booking AI Brief
- Booking Actions

### Workspace Domain

Status: Mature

Includes:

- Workspace Engine
- Workspace Command Center
- Workspace Mission
- Workspace Health
- Executive Brief
- Revenue Opportunity
- Risks
- Opportunities
- Executive Inbox

### Client Domain

Status: Strong

Includes:

- Client Engine
- Client Health
- Client Retention
- Lifetime Value
- Client Opportunities
- Client Command Center

### Finance Domain

Status: Planned

Will include:

- Finance Engine
- Revenue Health
- Cash Flow
- Collections
- Forecasting
- Aging Invoices

### Automation Domain

Status: Foundation

Will include:

- Rules
- Triggers
- Workflow execution
- Email automation
- AI-assisted automation

### Event Domain

Status: Foundation

Will include:

- Event stream
- Activity history
- Notification triggers
- Automation triggers
- AI context

---

## Intelligence Layer

The Intelligence Layer provides reusable business intelligence primitives.

Current services:

- score
- priority
- recommendation
- recommendation engine
- executive inbox

Rules:

- Intelligence services should stay generic.
- Intelligence services should not query Prisma directly.
- Domain engines should convert domain data into intelligence outputs.
- Recommendations should flow through the Recommendation Engine.

---

## Design System

The Vellum Design System standardizes UI composition.

Current primitives:

- CommandCard
- RecommendationCard
- MetricCard
- StatusBadge
- SectionHeader
- EmptyState
- ActionCard

Rules:

- Do not duplicate card styling.
- Prefer VDS primitives before creating new UI patterns.
- Pages should compose components, not contain large UI implementations.

---

## Engineering Rules

### Pages

Pages should:

- authenticate users
- load scoped data
- call services or engines
- render components

Pages should not:

- contain complex business rules
- duplicate authorization logic
- duplicate engine logic

### Engines

Engines should:

- contain business logic
- return typed results
- produce recommendations where appropriate
- remain testable

### Components

Components should:

- render UI
- receive typed props
- avoid database access
- avoid business logic

### Authorization

Authorization should:

- use shared authorization helpers
- validate user session
- validate workspace ownership
- enforce role permissions

### Testing

Business logic should be unit tested.

Priority test targets:

- intelligence utilities
- domain engines
- authorization rules
- recommendation logic

---

## Current Production Readiness

Completed:

- Unit tests
- Coverage
- Lint
- Production build
- Error page
- Not found page
- Logger foundation
- Security audit checklist
- Architecture docs

Remaining:

- Playwright end-to-end tests
- Full route protection audit
- Security headers
- Input validation audit
- Observability integration
- Performance profiling
- Deployment checklist

---

## Definition of Done

A significant feature is complete when:

- implementation works
- tests pass
- lint passes
- production build passes
- architecture remains consistent
- documentation is updated if a new pattern is introduced
- changes are committed cleanly

---

## Next Priorities

1. Standardize engine contracts.
2. Complete client route security audit.
3. Add Playwright E2E tests.
4. Build Finance Intelligence.
5. Build Automation workflows.
6. Build AI Executive Assistant.
7. Prepare beta launch checklist.
