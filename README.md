# Investor Golf Capital Summit

Next.js + TypeScript + Tailwind. A responsive application-led event site with a protected content editor and structured lead pipeline, designed for Vercel and Supabase.

## Run

npm install
npm run dev
npm run build
npm start

## Connect production

1. Import wiseguysmith/IGCS into Vercel using the Next.js preset.
2. Create or select an approved Supabase project and run supabase/schema.sql in its SQL editor. Tables have row-level security and no anonymous or authenticated table access; only server-side service-role requests can access them.
3. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables. Keep the service-role key secret; never put it in a NEXT_PUBLIC variable. Use .env.example for local configuration.
4. Create an administrator in Supabase Auth. Using the Supabase dashboard or trusted server-side Admin API, assign app_metadata {"igcs_admin":true}. Do not put this role in user_metadata. The /admin route verifies the signed-in user against Supabase before every read/write, and stores the short-lived session in an HTTP-only SameSite cookie. Sign in again after the session expires.
5. Visit /admin to edit event settings, copy, agenda, speakers, partners, updates, FAQs, legal policies and brand asset URLs. Empty speaker/partner collections are intentional; no fictional profiles are included.
6. Add the approved Privacy Policy, verify storage with a test request in a nonproduction environment, and enable Applications Open in the content editor. Until these requirements are met, forms are visibly closed and the API rejects submissions.
7. Set NEXT_PUBLIC_GA_ID to the approved GA4 ID. Analytics loads only after visitor consent. Meta/LinkedIn pixels are intentionally absent until approved. Named conversion/interest events are wired; no form values are sent to analytics. UTM values persist in session storage and are stored with leads.
8. Add final logo artwork and approved brand variants. The current IG text mark and favicon are provisional, not a recreation or approval of the missing master logo. Add the official Mindful Tech URL in the editor. Generate approved OG imagery after the logo is supplied.
9. Set SITE_INDEXABLE=true only on the approved production deployment. Exact dates, day-two venue, speakers, partners, ticket price, salon rules, prizes, payment provider and legal copy remain editable. No event schema is published while exact dates are unconfirmed.

## Lead management

/admin separates attendee and partner submissions. Each record includes source page, UTM data, server timestamp, type, CRM tag, status, notes and owner. Applicant statuses: New, Review, Qualified, Invited, Registered, Paid, Attending, Declined, Waitlist. Partner statuses: Target, Intro, Discovery, Proposal, Negotiation, Contracted, Paid, Activated. The UI shows the newest 250 records; older records remain in Supabase. Lead API validates lengths and required fields, checks origin, includes a honeypot, and applies a database-atomic ten-minute per-email/per-type duplicate window. Configure platform-level rate limits or a bot challenge before broad public promotion.

A successful response is sent only after durable database insertion. Database failures never display a false success. Real storage/auth round-trip testing requires a connected Supabase project.

## Registration roadmap

No public checkout is present. Extend the approved applicant record with a hashed, expiring, single-use registration token; add provider-independent payment and credential records. Validate approval server-side before private registration. Payment provider and payment methods remain undecided. No automatic acceptance, speaker confirmation, prize amounts or salon entitlement is promised.

## Photography

- Keith Tanner, golf course aerial: https://unsplash.com/photos/a-golf-course-is-surrounded-by-trees-EGQ0m5QyNu8
- Skyler Smith, San Antonio River Walk: https://unsplash.com/photos/riverwalk-with-buildings-and-trees-at-sunset-d_cORpul5MI
- Ronan, dining detail: https://unsplash.com/photos/clear-wine-glasses-on-top-of-dining-table-PCE0T5i4pDI

Downloaded as WebP, served using next/image. Unsplash License: https://unsplash.com/license. Golf and dining images are atmospheric and do not document the event venues. Replace with approved venue/event imagery when supplied.

## Launch items still required

Approved logo files and OG image, Vercel project access, Supabase project and admin provisioning, approved legal copy, GA4 measurement ID, official Mindful Tech link, final event details, production integration tests, and production Lighthouse verification. Do not claim the Phase 1 definition of done until these are complete.

## Verification

Run `npm run build`, then `node --test tests/http.test.mjs`. The HTTP suite starts an isolated production server on 127.0.0.1:3101 with Supabase disabled and stops it when finished. It verifies rendering, privacy headers, unauthenticated admin access, origin validation, malformed roles/URLs/login, oversized bodies, closed storage behavior, and legal placeholder labeling. It never inserts live lead records. Nine checks passed on 2026-09-26. Browser-based responsive and performance QA remains outstanding because the browser automation runtime was unavailable during this pass.
