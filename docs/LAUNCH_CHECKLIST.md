# Vellum Launch Checklist

## 1. Application Quality

- [ ] Unit tests pass
- [ ] Playwright tests pass
- [ ] Production build passes
- [ ] CI passes on main branch
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No known critical bugs

## 2. Database

- [ ] Production PostgreSQL database created
- [ ] `DATABASE_URL` configured in production
- [ ] `SHADOW_DATABASE_URL` configured where required
- [ ] Prisma schema synchronized
- [ ] Production migrations reviewed
- [ ] Backup strategy confirmed
- [ ] Seed data reviewed
- [ ] Database connection tested from production

## 3. Authentication

- [ ] `AUTH_SECRET` configured
- [ ] `AUTH_TRUST_HOST` configured
- [ ] `NEXTAUTH_URL` uses production domain
- [ ] Google OAuth production callback configured
- [ ] Google sign-in tested
- [ ] Credentials sign-in tested
- [ ] Password reset tested
- [ ] Microsoft Entra ID client ID added
- [ ] Microsoft Entra ID client secret added
- [ ] Microsoft issuer verified
- [ ] Microsoft sign-in tested

## 4. Email

- [ ] `RESEND_API_KEY` configured
- [ ] `EMAIL_FROM` uses verified sender domain
- [ ] Booking confirmation email tested
- [ ] Reschedule email tested
- [ ] Invoice receipt email tested
- [ ] Password reset email tested
- [ ] Invitation email tested
- [ ] Email failure handling verified

## 5. Stripe

- [ ] Stripe production secret key configured
- [ ] Stripe production publishable key configured
- [ ] Professional production price ID configured
- [ ] Production webhook endpoint created
- [ ] Production webhook secret configured
- [ ] Checkout tested
- [ ] Subscription checkout tested
- [ ] Invoice payment tested
- [ ] Paid invoice webhook tested
- [ ] Subscription webhook tested
- [ ] Failed payment handling reviewed
- [ ] Stripe Customer Portal reviewed

## 6. Google Calendar

- [ ] `GOOGLE_CLIENT_EMAIL` configured
- [ ] `GOOGLE_PRIVATE_KEY` configured correctly
- [ ] `GOOGLE_CALENDAR_ID` configured
- [ ] Service account has calendar access
- [ ] Booking calendar event creation tested
- [ ] Reschedule calendar update tested
- [ ] Cancellation calendar behavior tested
- [ ] Calendar failure handling reviewed

## 7. Cloudflare R2

- [ ] R2 account ID configured
- [ ] R2 access key configured
- [ ] R2 secret key configured
- [ ] R2 bucket configured
- [ ] R2 public URL configured
- [ ] File upload tested
- [ ] File download tested
- [ ] File permissions reviewed
- [ ] File deletion behavior reviewed

## 8. OpenAI

- [ ] `OPENAI_API_KEY` configured
- [ ] `AI_MOCK_MODE=false` in production
- [ ] OpenAI provider selected correctly
- [ ] Executive AI brief tested
- [ ] AI cache tested
- [ ] API failure fallback tested
- [ ] Rate-limit behavior reviewed
- [ ] Cost controls reviewed
- [ ] No AI calls run during CI

## 9. Environment Variables

- [ ] All required variables documented
- [ ] No secrets committed to Git
- [ ] `.env` excluded from Git
- [ ] Production variables added to hosting platform
- [ ] Preview environment variables reviewed
- [ ] Development environment variables reviewed
- [ ] Public variables use `NEXT_PUBLIC_` only when appropriate
- [ ] Multiline private keys preserve line breaks

## 10. Security

- [ ] Authorization tested for ADMIN
- [ ] Authorization tested for CLIENT
- [ ] OWNER and MANAGER behavior reviewed
- [ ] Workspace data isolation tested
- [ ] Client data isolation tested
- [ ] Protected routes verified
- [ ] Stripe webhook signatures verified
- [ ] File upload restrictions reviewed
- [ ] Input validation reviewed
- [ ] Rate limiting reviewed
- [ ] Blacklist feature audited
- [ ] Sensitive logs removed

## 11. Observability

- [ ] Error monitoring configured
- [ ] Request logging configured
- [ ] AI provider metadata logged safely
- [ ] Health endpoint added
- [ ] Database health monitored
- [ ] Stripe webhook failures monitored
- [ ] Email failures monitored
- [ ] Production alerts configured

## 12. Analytics

- [ ] Product analytics provider selected
- [ ] Privacy policy updated
- [ ] Analytics consent reviewed
- [ ] Sign-up tracked
- [ ] Booking creation tracked
- [ ] Invoice payment tracked
- [ ] Subscription upgrade tracked
- [ ] AI brief usage tracked
- [ ] Key retention events tracked

## 13. UI and Mobile

- [ ] Dashboard reviewed against Figma
- [ ] Client detail reviewed against Figma
- [ ] Booking calendar reviewed against Figma
- [ ] Booking detail reviewed against Figma
- [ ] Finance screens reviewed
- [ ] Settings reviewed
- [ ] Mobile navigation tested
- [ ] Mobile booking flow tested
- [ ] Tablet layouts tested
- [ ] Empty states reviewed
- [ ] Loading states reviewed
- [ ] Keyboard navigation tested
- [ ] Color contrast reviewed
- [ ] Touch targets reviewed

## 14. Performance

- [ ] Lighthouse audit completed
- [ ] Large images optimized
- [ ] Database queries reviewed
- [ ] Dashboard load time reviewed
- [ ] AI response removed from uncached request path
- [ ] Bundle size reviewed
- [ ] Server logs reviewed for slow requests
- [ ] Mobile performance reviewed

## 15. Deployment

- [ ] Production hosting project created
- [ ] Repository connected
- [ ] Build command verified
- [ ] Node version configured
- [ ] Production domain connected
- [ ] SSL active
- [ ] OAuth callback URLs updated
- [ ] Stripe webhook URL updated
- [ ] Resend domain verified
- [ ] Deployment rollback process documented

## 16. Production Smoke Test

- [ ] Landing page loads
- [ ] Sign-in works
- [ ] Dashboard loads
- [ ] Client can be created
- [ ] Booking can be created
- [ ] Booking can be rescheduled
- [ ] Calendar event is created
- [ ] Invoice can be created
- [ ] Stripe payment succeeds
- [ ] Webhook marks invoice paid
- [ ] Receipt email sends
- [ ] File upload works
- [ ] AI brief loads
- [ ] Notifications appear
- [ ] Mobile smoke test passes

## 17. Launch Operations

- [ ] Beta users selected
- [ ] Support email created
- [ ] Feedback channel created
- [ ] Bug-report process created
- [ ] Incident response owner identified
- [ ] Rollback criteria defined
- [ ] Launch announcement prepared
- [ ] First-week monitoring plan prepared
