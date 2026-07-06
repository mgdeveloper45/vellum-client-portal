# Vellum Architecture Inventory

## Purpose

This document tracks the major engines, services, components, tests, and documentation in Vellum so future development extends existing architecture instead of duplicating it.

---

## Domain Engines

### Booking

- `src/lib/services/bookings/booking-engine.ts`
- `src/lib/services/bookings/booking-health.ts`
- `src/lib/services/bookings/booking-timeline.ts`
- `src/lib/services/bookings/booking-mission.ts`
- `src/lib/services/bookings/booking-countdown.ts`
- `src/lib/services/bookings/booking-ai.ts`
- `src/lib/services/bookings/booking-actions.ts`
- `src/lib/services/bookings/booking-command-center.ts`

### Workspace

- `src/lib/services/workspace/workspace-engine.ts`
- `src/lib/services/workspace/workspace-health.ts`
- `src/lib/services/workspace/workspace-mission.ts`
- `src/lib/services/workspace/workspace-executive-brief.ts`
- `src/lib/services/workspace/workspace-revenue-opportunity.ts`
- `src/lib/services/workspace/workspace-risk.ts`
- `src/lib/services/workspace/workspace-opportunity.ts`

### Client

- `src/lib/services/clients/client-engine.ts`
- `src/lib/services/clients/client-types.ts`
- `src/lib/services/clients/client-health.ts`
- `src/lib/services/clients/client-retention.ts`
- `src/lib/services/clients/client-lifetime-value.ts`
- `src/lib/services/clients/client-opportunities.ts`

---

## Platform Services

### Intelligence

- `src/lib/services/intelligence/score.ts`
- `src/lib/services/intelligence/priority.ts`
- `src/lib/services/intelligence/recommendation.ts`
- `src/lib/services/intelligence/recommendation-engine.ts`
- `src/lib/services/intelligence/executive-inbox.ts`

### Events

- `src/lib/services/events/event-types.ts`
- `src/lib/services/events/workspace-events.ts`
- `src/lib/services/events/event-engine.ts`

### Automation

- `src/lib/services/automation/automation-types.ts`
- `src/lib/services/automation/automation-rule.ts`
- `src/lib/services/automation/automation-engine.ts`

### Authorization

- `src/lib/auth/authorization.ts`
- `src/lib/auth/authorization-rules.ts`

---

## Command Centers

### Booking Command Center

- `src/components/booking-command-center/`

### Workspace Command Center

- `src/components/dashboard/workspace-command-center.tsx`

### Client Command Center

- `src/components/client-command-center/`

---

## Vellum Design System

- `src/components/ui/command-card.tsx`
- `src/components/ui/recommendation-card.tsx`
- `src/components/ui/metric-card.tsx`
- `src/components/ui/status-badge.tsx`
- `src/components/ui/section-header.tsx`
- `src/components/ui/empty-state.tsx`
- `src/components/ui/action-card.tsx`

---

## Key Pages

### Dashboard

- `src/app/dashboard/page.tsx`

### Bookings

- `src/app/bookings/page.tsx`
- `src/app/bookings/[bookingId]/page.tsx`

### Clients

- `src/app/clients/page.tsx`
- `src/app/clients/[clientId]/page.tsx`
- `src/app/clients/[clientId]/edit/page.tsx`
- `src/app/clients/new/page.tsx`

---

## Tests

### Intelligence

- `src/lib/services/intelligence/__tests__/`

### Workspace

- `src/lib/services/workspace/__tests__/`

### Client

- `src/lib/services/clients/__tests__/`

### Authorization

- `src/lib/auth/__tests__/`

---

## Documentation

- `docs/architecture/PLATFORM_MANIFEST.md`
- `docs/architecture/DESIGN_SYSTEM.md`
- `docs/architecture/DOMAIN_MODEL.md`
- `docs/architecture/INTELLIGENCE_LAYER.md`
- `docs/PRODUCT_ROADMAP.md`
- `docs/SECURITY_AUDIT.md`

---

## Rules Before Creating New Files

Before creating a new file, check:

1. Does this concept already exist?
2. Can an existing engine/service/component be extended?
3. Does this belong in a domain, platform service, or VDS?
4. Does this introduce a new architectural pattern?
5. If yes, does documentation need to be updated?

---

## Next Audit Targets

- Verify all engines expose recommendations consistently.
- Verify all command centers use VDS primitives.
- Verify all protected routes use shared authorization helpers.
- Verify all domain engines have unit tests.
- Verify no duplicate recommendation/action models remain.
