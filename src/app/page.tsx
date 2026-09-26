import Image from "next/image";
import { getContent, databaseReady } from "@/lib/server";
import { safeUrl } from "@/lib/content";
import { Navigation, TrackedLink, Analytics } from "@/components/navigation";
import { LeadForm } from "@/components/lead-form";
export const dynamic = "force-dynamic";
export default async function Home() {
  const c = await getContent();
  const e = c.event;
  const enabled = e.applicationsOpen && databaseReady() && !!c.legal.privacy;
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Navigation event={e} />
      <main id="main">
        <section className="hero">
          <Image
            className="hero-photo"
            src="/golf.webp"
            alt="Morning light across a tree-lined golf course"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">
              {e.location.toUpperCase()} <span>•</span> {e.timing.toUpperCase()}
            </p>
            <h1>
              {c.hero.headline}
              <br />
              <em>{c.hero.headlineAccent}</em>
            </h1>
            <p className="hero-line">{c.hero.tagline}</p>
            <p className="hero-description">{c.hero.description}</p>
            <div className="actions">
              <TrackedLink
                className="button gold"
                href="#invitation"
                event="request_invitation_click"
              >
                Request an Invitation <span aria-hidden>↗</span>
              </TrackedLink>
              <TrackedLink
                className="text-link"
                href="#partners"
                event="partner_click"
              >
                Become a Partner <span aria-hidden>↗</span>
              </TrackedLink>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              TradFi <span>•</span> FinTech <span>•</span> DeFi
            </p>
            <p>
              Powered by <strong>Mindful Tech</strong>
            </p>
            <a href="#experience">DISCOVER THE EXPERIENCE ↓</a>
          </div>
        </section>
        <section id="experience" className="section intro">
          <div className="section-heading">
            <p className="eyebrow">01 / THE EXPERIENCE</p>
            <h2>{c.concept.headline}</h2>
          </div>
          <div className="two-col">
            <article>
              <p className="eyebrow">DAY ONE / ON THE COURSE</p>
              <h3>Investor Golf</h3>
              <p>{c.concept.golf}</p>
              <TrackedLink
                href="#golf"
                event="golf_interest"
                className="light-link"
              >
                Explore the golf experience ↗
              </TrackedLink>
            </article>
            <article>
              <p className="eyebrow">DAY TWO / IN THE ROOM</p>
              <h3>Capital Summit</h3>
              <p>{c.concept.summit}</p>
              <TrackedLink
                href="#summit"
                event="summit_interest"
                className="light-link"
              >
                Explore the summit ↗
              </TrackedLink>
            </article>
          </div>
        </section>
        <section className="story-wrap">
          <div className="section story">
            <p className="eyebrow">RELATIONSHIPS DRIVE CAPITAL</p>
            <h2>{c.story.headline}</h2>
            <p className="story-lead">{c.story.description}</p>
            <div className="pillars">
              {c.story.pillars.map((p, i) => (
                <div key={p.name}>
                  <span className="eyebrow">0{i + 1}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
            <p className="story-end">IGCS brings all three together.</p>
          </div>
        </section>
        <section className="section audience">
          <div>
            <p className="eyebrow">A CONSIDERED CIRCLE</p>
            <h2>
              Who’s in
              <br />
              <em>the room.</em>
            </h2>
            <div className="big-stat">{e.participants}</div>
            <p className="eyebrow">CURATED PARTICIPANTS</p>
            <p className="muted">
              Deliberately intimate.
              <br />
              Designed for meaningful interaction.
            </p>
          </div>
          <div className="audience-list">
            {c.audience.map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
        </section>
        <section className="journey-wrap">
          <div className="section journey">
            <p className="eyebrow">TWO DAYS, THOUGHTFULLY CONNECTED</p>
            <ol>
              {c.journey.map((j, i) => (
                <li key={`${j.stage}-${i}`}>
                  <span>0{i + 1}</span>
                  <p className="eyebrow">{j.stage}</p>
                  <h3>{j.title}</h3>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="golf" className="section golf">
          <div className="photo-panel">
            <Image
              src="/golf.webp"
              alt="Aerial golf landscape with sculpted greens and mature trees"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="photo-label">THE GAME IS JUST THE BEGINNING.</div>
          </div>
          <div className="golf-copy">
            <p className="eyebrow">02 / INVESTOR GOLF</p>
            <h2>{c.golf.headline}</h2>
            <p className="venue">{e.golfVenue}</p>
            <p className="muted">{c.golf.description}</p>
            <div className="golf-stats">
              <p>
                <strong>{e.teams}</strong>
                <span>TEAMS</span>
              </p>
              <p>
                <strong>{e.players}</strong>
                <span>PLAYERS</span>
              </p>
            </div>
            <p className="eyebrow">EXPERIENCES MAY INCLUDE</p>
            <ul className="simple-list">
              {c.golf.experiences.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="awards">{e.golfAwards}</p>
          </div>
        </section>
        <section id="summit" className="summit-wrap">
          <div className="section summit">
            <div className="section-heading">
              <p className="eyebrow">03 / CAPITAL SUMMIT</p>
              <h2>{c.summit.headline}</h2>
            </div>
            <div className="topics">
              {c.summit.topics.map((t, i) => (
                <article key={t.name}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                  </div>
                  <span className="topic-mark" aria-hidden>
                    +
                  </span>
                </article>
              ))}
            </div>
            <div className="speakers">
              <p className="eyebrow">THE PEOPLE SHAPING CAPITAL</p>
              {c.speakers.length ? (
                <div className="speaker-grid">
                  {c.speakers.map((s) => (
                    <article key={s.name}>
                      {safeUrl(s.photo) && (
                        <img
                          src={s.photo}
                          alt={s.name}
                          loading="lazy"
                          width="300"
                          height="340"
                        />
                      )}
                      <h3>{s.name}</h3>
                      <p>
                        {s.title} · {s.organization}
                      </p>
                      <p>{s.session}</p>
                      {safeUrl(s.socialUrl) && (
                        <a
                          href={s.socialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View profile ↗
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="announcing">
                  <h3>
                    Speakers & Participants
                    <br />
                    <em>Announcing Soon</em>
                  </h3>
                  <p>
                    A curated group. A considered conversation.
                    <br />
                    The full program will be shared in due course.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section id="salons" className="salons-wrap">
          <div className="section salons">
            <div>
              <p className="eyebrow">04 / PRIVATE INVESTOR SALONS</p>
              <h2>{c.salons.headline}</h2>
              <p>{c.salons.description}</p>
              <div className="salon-themes">
                {c.salons.themes.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <p className="access">{e.salonAccess}</p>
              <p className="small muted">
                Summit attendance does not automatically include salon access.
              </p>
              <TrackedLink
                className="light-link"
                href="#invitation"
                event="salon_interest"
              >
                Express your interest ↗
              </TrackedLink>
            </div>
            <div className="salon-photo">
              <Image
                src="/dining.webp"
                alt="Wine glasses and candlelight on an intimate dining table"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <span>SPACE FOR A DEEPER CONVERSATION.</span>
            </div>
          </div>
        </section>
        <section id="partners" className="section partners">
          <div className="section-heading">
            <p className="eyebrow">05 / PARTNERSHIPS</p>
            <h2>{c.partnerships.headline}</h2>
          </div>
          <p className="partner-intro">{c.partnerships.description}</p>
          <div className="partner-types">
            {c.partnerships.types.map((t, i) => (
              <p key={t}>
                <span>0{i + 1}</span>
                {t}
              </p>
            ))}
          </div>
          {c.partners.length > 0 && (
            <div className="partner-logos">
              {c.partners.map((p) => (
                <article key={p.name}>
                  {safeUrl(p.logo) && (
                    <img
                      src={p.logo}
                      alt={p.name}
                      width="180"
                      height="90"
                      loading="lazy"
                    />
                  )}
                  <h3>
                    {safeUrl(p.website) ? (
                      <a href={p.website}>{p.name}</a>
                    ) : (
                      p.name
                    )}
                  </h3>
                  <p>{p.type}</p>
                </article>
              ))}
            </div>
          )}
          <TrackedLink
            href="#partnership-form"
            event="partnership_deck_request"
            className="button navy-button"
          >
            Request Partnership Deck <span aria-hidden>↗</span>
          </TrackedLink>
        </section>
        <section id="san-antonio" className="destination">
          <Image
            src="/san-antonio.webp"
            alt="San Antonio River Walk and city architecture at sunset"
            fill
            sizes="100vw"
          />
          <div className="destination-shade" />
          <div className="section">
            <p className="eyebrow">06 / SAN ANTONIO, TEXAS</p>
            <h2>{c.destination.headline}</h2>
            <p>{c.destination.description}</p>
            <span className="eyebrow">
              HILL COUNTRY SPIRIT. GLOBAL PERSPECTIVE.
            </span>
          </div>
        </section>
        {c.updates.length > 0 && (
          <section className="section">
            <p className="eyebrow">EVENT UPDATES</p>
            {c.updates.map((u) => (
              <article className="update" key={u.title}>
                <h3>{u.title}</h3>
                <p>{u.body}</p>
              </article>
            ))}
          </section>
        )}
        <section id="invitation" className="section invitation">
          <div>
            <p className="eyebrow">YOUR NEXT CONVERSATION STARTS HERE</p>
            <h2>
              Request
              <br />
              <em>an invitation.</em>
            </h2>
            <p>
              IGCS is intentionally limited to maintain the quality of the
              network and experience.
            </p>
            <div className="invitation-detail">
              <p>
                {e.location}
                <br />
                {e.timing}
              </p>
              <p>
                Two days. A curated network.
                <br />
                Relationships that extend beyond the event.
              </p>
            </div>
          </div>
          <LeadForm
            kind="invitation"
            enabled={enabled}
            partnershipTypes={c.partnerships.types}
          />
        </section>
        <section id="partnership-form" className="partner-form-wrap">
          <div className="section invitation">
            <div>
              <p className="eyebrow">BECOME PART OF THE EXPERIENCE</p>
              <h2>
                Let’s build
                <br />
                <em>something meaningful.</em>
              </h2>
              <p>
                Tell us where your organization fits in the conversation. Our
                team will share the partnership deck and discuss the right
                opportunity.
              </p>
            </div>
            <LeadForm
              kind="partner"
              enabled={enabled}
              partnershipTypes={c.partnerships.types}
            />
          </div>
        </section>
        {c.faqs.length > 0 && (
          <section className="section faqs">
            <h2>Questions, answered.</h2>
            {c.faqs.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </section>
        )}
      </main>
      <footer>
        <div className="footer-main">
          <a className="footer-mark" href="#" aria-label="IGCS home">
            IG
          </a>
          <div>
            <h3>
              Investor Golf
              <br />
              Capital Summit
            </h3>
            <p>TradFi • FinTech • DeFi</p>
            <p>
              {e.location}
              <br />
              {e.timing}
            </p>
          </div>
          <nav aria-label="Footer navigation">
            {["Experience", "Golf", "Summit", "Partners", "Invitation"].map(
              (n) => (
                <a key={n} href={`#${n.toLowerCase()}`}>
                  {n === "Invitation" ? "Request Invitation" : n}
                </a>
              ),
            )}
            <a
              href={
                e.contactEmail
                  ? `mailto:${e.contactEmail}`
                  : "#partnership-form"
              }
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Investor Golf Capital Summit</p>
          <div>
            <a href="/legal/privacy">Privacy</a>
            <a href="/legal/terms">Terms</a>
            <a href="/legal/event-terms">Event policies</a>
          </div>
          <p>
            Powered by{" "}
            {safeUrl(e.mindfulTechUrl) ? (
              <a href={e.mindfulTechUrl}>Mindful Tech</a>
            ) : (
              <strong>Mindful Tech</strong>
            )}
          </p>
        </div>
      </footer>
      <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </>
  );
}
