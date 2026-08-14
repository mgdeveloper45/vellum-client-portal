# Vellum Booking Command Center Checkpoint

## Baseline

Current application baseline:

`3dc5ee6 feat: integrate deposits into booking command center`

Previous major workflow commits:

- `9a0a421 feat: route booking payment follow-up to invoice reminder`
- `5bcb802 feat: connect booking command center project workflows`

At this checkpoint:

- TypeScript typecheck passes
- focused Booking Command Center tests pass
- full test suite passes
- lint passes

Do not reimplement the completed workflows below unless a regression or new requirement requires changing them.

---

# Architecture Completed

## Booking → Project Relationship

Bookings can be linked to a Project through the optional unique Booking `projectId`.

Project creation from a booking is:

- workspace-scoped
- owner-validated
- client-resolved
- idempotent

If a booking already owns a project, the existing project is returned instead of creating a duplicate.

## Create Project Command

Booking Command Center has a real `CREATE_PROJECT` command.

Workflow:

1. Validate booking ID.
2. Validate workspace ID.
3. Validate owner ID.
4. Find booking scoped to workspace.
5. Return its existing project when already linked.
6. Resolve booking customer to an active workspace client using normalized email.
7. Validate project owner eligibility.
8. Create Project in `PLANNING`.
9. Link Project back to Booking.
10. Return resulting project.

Explicit failures:

- INVALID_BOOKING
- INVALID_WORKSPACE
- INVALID_OWNER
- BOOKING_NOT_FOUND
- CLIENT_NOT_FOUND
- PROJECT_CREATE_FAILED
- BOOKING_LINK_FAILED

The Booking Command Center action card understands the distinction between:

- `COMMAND`
- `NAVIGATION`

Do not assume every recommended action has `href`.

---

# Booking Command Center State

The command center currently derives:

## Project

- project existence
- projectId

## Invoice

- invoice existence
- all-invoices-paid state
- unpaid invoice ID
- whether multiple unpaid invoices exist

## Communication

- message existence

## Files

- file existence

## Deposits

- booking `depositRequired`
- booking `depositAmount`
- deposit existence
- total deposit amount requested
- total deposit payments recorded
- outstanding deposit balance
- whether all linked deposits are paid

Deposit outstanding is derived as:

`max(0, depositTotalRequested - depositTotalPaid)`

---

# Recommended Action Progression

## No Project

Recommend:

`Create Project`

Do NOT recommend project-owned workflows such as messaging, files, deposits, or invoice creation before a project exists.

## Project Exists + No Messages

Recommend:

`Message Client`

Route:

`/projects/{projectId}#messages`

ProjectMessages remains the source of truth.

## Project Exists + No Files

Recommend:

`Request Files`

Route:

`/projects/{projectId}#files`

ProjectFiles remains the source of truth.

## Required Deposit + No Deposit Requested

Recommend HIGH priority:

`Request deposit`

Route:

`/projects/{projectId}#deposits`

The existing RequestDepositForm remains the source of truth.

The form has:

`id="deposits"`

and scroll offset support so Booking Command Center deep-links land correctly.

## Required Deposit + Outstanding Balance

When:

- depositRequired
- deposit exists
- deposit is not fully paid
- depositOutstanding > 0

Recommend HIGH priority:

`Collect deposit`

Route:

`/projects/{projectId}#deposits`

Existing deposit/payment services remain the source of truth.

## Required Deposit Fully Paid

Do not recommend Request Deposit or Collect Deposit.

## Project Exists + No Invoice

Recommend:

`Create invoice`

Route:

`/projects/{projectId}#invoices`

ProjectInvoices remains the source of truth for amount entry and invoice creation.

## One Unpaid Invoice

Recommend HIGH priority:

`Follow up on payment`

Route directly to:

`/ai/invoice-reminder/{invoiceId}`

## Multiple Unpaid Invoices

Recommend:

`Follow up on payment`

Route:

`/projects/{projectId}#invoices`

This avoids arbitrarily selecting one invoice when multiple invoices require attention.

## Healthy / Nothing To Do

When health is HEALTHY and no recommendations remain:

`Booking is on track`

---

# Deposit Intelligence

Deposit intelligence is now integrated into four Booking Command Center layers.

## 1. Health

A deposit that is not required produces no health penalty.

Required deposit not requested:

-15

Reason:

`Required deposit has not been requested.`

Required deposit requested but still outstanding:

-15

Reason:

`Required deposit still has an outstanding balance.`

Required deposit fully paid:

No deposit health penalty.

IMPORTANT:

There must be only ONE copy of each deposit health penalty.

Do not re-add the previous duplicate -20 deposit checks.

## 2. Recommended Actions

Required + not requested:

`Request deposit`

Required + requested + outstanding:

`Collect deposit`

Paid or not required:

No deposit recommendation.

Deposit actions require an existing project/projectId.

## 3. Mission

Mission priority currently evaluates immediate severe health first.

If health score < 50:

`Booking Needs Immediate Attention`

Otherwise required deposit work can become the mission.

Required + not requested:

Title:

`Request Required Deposit`

Priority:

HIGH

Required + outstanding:

Title:

`Collect Outstanding Deposit`

Priority:

HIGH

The outstanding amount is included in the mission description.

A paid required deposit does not override the normal mission workflow.

## 4. Timeline

A deposit event appears only when the booking requires a deposit.

Not requested:

`Required deposit has not been requested.`

Outstanding:

`Required deposit has $X outstanding.`

Fully paid:

`Required deposit has been paid.`

The timeline deposit event is completed only when the required deposit is fully paid.

---

# Deposit Domain Ownership

Do NOT create a Booking-specific deposit/payment implementation.

The Project deposit workflow already owns:

- requesting deposits
- displaying deposits
- recording payments
- payment history
- deposit financial calculations
- deposit status synchronization

Booking Command Center only derives intelligence from this state and routes users into the Project workflow.

---

# Booking Intelligence Pipeline

Current conceptual pipeline:

Booking + Project state
        |
        v
Booking Command Center
        |
        +--> financial state
        |
        +--> Booking Health
        |
        +--> Recommended Actions
        |
        +--> Booking Timeline
        |
        +--> Booking Lifecycle
        |
        +--> Booking Mission
        |
        +--> AI Summary

`booking-engine.ts` is the orchestration boundary for these intelligence builders.

Deposit state currently flows into:

- Booking Health
- Recommended Actions
- Booking Timeline
- Booking Mission

---

# Current Action Architecture

Booking
  |
  +-- No Project
  |     |
  |     +-- Create Project
  |
  +-- Project Exists
        |
        +-- No Messages
        |     |
        |     +-- Message Client
        |
        +-- No Files
        |     |
        |     +-- Request Files
        |
        +-- Deposit Required
        |     |
        |     +-- Not Requested
        |     |     +-- Request Deposit
        |     |
        |     +-- Outstanding
        |           +-- Collect Deposit
        |
        +-- No Invoice
        |     |
        |     +-- Create Invoice
        |
        +-- Invoice Unpaid
              |
              +-- One unpaid
              |     +-- AI Invoice Reminder
              |
              +-- Multiple unpaid
                    +-- Project Invoices

---

# Important Design Principle

Booking Command Center is an orchestration and intelligence layer.

It should NOT duplicate domain workflows already owned elsewhere.

Examples:

- Project creation → Booking command/application service
- Messaging → ProjectMessages
- Files → ProjectFiles
- Deposit requests → RequestDepositForm
- Deposit payments → existing deposit payment workflow
- Invoices → ProjectInvoices
- Invoice reminders → existing AI invoice-reminder workflow

Before creating a new Booking-specific action or form, first determine whether that capability already belongs to Project or another domain.

---

# Regression Coverage

Booking action tests now cover:

- Create Project recommendation
- Create Invoice recommendation
- missing projectId protection
- unpaid invoice follow-up
- single unpaid invoice reminder routing
- multiple unpaid invoice routing
- messaging hidden before Project exists
- project message deep-link
- file action hidden before Project exists
- project file deep-link
- deposit request recommendation
- outstanding deposit recommendation
- no deposit action after payment
- no deposit action when deposit is not required
- no deposit action before Project exists
- healthy/all-clear behavior
- no unnecessary recommendations

Booking health tests cover:

- deposit not required
- required deposit not requested
- outstanding required deposit
- fully paid required deposit

Booking mission tests cover:

- required deposit request mission
- outstanding deposit collection mission
- paid deposit does not override normal mission
- severe health remains higher priority than deposit collection

Booking timeline tests cover:

- no event when deposit isn't required
- required deposit not requested
- outstanding deposit
- fully paid deposit

Booking Command Center tests cover aggregate deposit financial state and paid-state derivation.

---

# Avoid Repeating Completed Work

Before changing Booking Command Center code, inspect this checkpoint.

Specifically, do NOT repeat these already-completed tasks:

- adding projectId to booking intelligence
- converting Create Project into a real command
- adding project anchors for messages/files/invoices
- routing single unpaid invoices to AI invoice reminder
- routing multiple unpaid invoices to Project invoices
- adding deposit fields to BookingHealthInput
- adding deposit state to booking-engine
- adding deposit health penalties
- adding deposit recommended actions
- adding deposit mission behavior
- adding deposit timeline behavior
- adding the `#deposits` Project anchor

If one of those appears missing, inspect the current implementation and Git history before adding it again.

---

# Next Work

Continue Booking Command Center development from:

`3dc5ee6`

Do not redesign already-working Project workflows.

For the next capability:

1. inspect current Booking Command Center behavior
2. identify the next real workflow gap
3. inspect the existing owning domain
4. route/orchestrate rather than duplicate
5. add regression tests
6. run focused tests
7. run:
   - `npm run typecheck`
   - `npm test`
   - `npm run lint`
8. commit the coherent feature slice
9. update this checkpoint only when architecture meaningfully changes
