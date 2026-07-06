# Vellum Security Audit

## Current Status

Production build passes.

Tests pass.

Lint passes.

---

## Route Protection Checklist

Every authenticated route should verify:

- User is signed in.
- User belongs to the workspace being accessed.
- Role permissions are enforced.
- Client users cannot access admin-only resources.
- Server actions validate ownership before mutation.

---

## High-Risk Areas

### Clients

Routes:

- /clients
- /clients/[clientId]
- /clients/[clientId]/edit
- /clients/new

Audit goals:

- Clients cannot view other clients.
- Admin/Owner/Manager can manage workspace clients.
- Workspace ownership is enforced.

---

### Projects

Routes:

- /projects
- /projects/[projectId]
- /projects/[projectId]/edit
- /projects/new

Audit goals:

- Project belongs to current workspace.
- Client users can only access their own projects.

---

### Invoices

Routes:

- /invoices
- /invoices/[invoiceId]/pdf

Audit goals:

- Invoice belongs to current workspace.
- Payment status cannot be changed without Stripe/webhook validation.

---

### Bookings

Routes:

- /bookings
- /bookings/[bookingId]
- /bookings/[bookingId]/reschedule

Audit goals:

- Booking belongs to current workspace.
- Cancel/reschedule actions validate workspace ownership.

---

### Settings

Routes:

- /settings
- /users
- /users/[userId]/edit
- /users/new

Audit goals:

- Only Owner/Admin can manage users.
- Billing/settings actions are restricted.

---

## Server Actions Checklist

Every server action should:

- Call auth().
- Validate session.user.
- Query current user/workspace.
- Verify target record belongs to workspace.
- Enforce role permissions.
- Return safe errors.
- Never trust client-provided workspaceId without verification.

---

## Next Steps

1. Audit client routes.
2. Audit project routes.
3. Audit invoice routes.
4. Audit booking routes.
5. Audit settings and user management.
6. Add Playwright tests for critical access flows.
