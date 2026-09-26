"use client";
import { useEffect, useState, type FormEvent } from "react";
import { defaultContent, type SiteContent } from "@/lib/content";
type Value = string | number | boolean | Value[] | { [key: string]: Value };
type Lead = {
  id: string;
  lead_type: string;
  crm_tag: string;
  fields: Record<string, string>;
  interests: string[];
  source_page: string;
  utm: Record<string, string>;
  created_at: string;
  status: string;
  notes: string;
  owner: string;
};
const templates: Record<string, Value> = {
  speakers: {
    name: "",
    title: "",
    organization: "",
    session: "",
    photo: "",
    socialUrl: "",
  },
  partners: { name: "", type: "", logo: "", website: "" },
  updates: { title: "", body: "" },
  faqs: { question: "", answer: "" },
};
const label = (s: string) =>
  s
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .replace(/^./, (x) => x.toUpperCase());
function Editor({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Value;
  onChange: (value: Value) => void;
}) {
  if (typeof value === "boolean")
    return (
      <label className="admin-toggle">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label(name)}
      </label>
    );
  if (typeof value === "string" || typeof value === "number")
    return (
      <label>
        {label(name)}
        {typeof value === "string" &&
        (value.length > 110 ||
          ["description", "body", "privacy", "terms", "answer"].includes(
            name,
          )) ? (
          <textarea
            value={value}
            rows={4}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            value={value}
            type={typeof value === "number" ? "number" : "text"}
            onChange={(e) =>
              onChange(
                typeof value === "number"
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
          />
        )}
      </label>
    );
  if (Array.isArray(value))
    return (
      <fieldset className="admin-array">
        <legend>{label(name)}</legend>
        {value.map((item, i) => (
          <div className="admin-array-item" key={i}>
            <Editor
              name={`${name} ${i + 1}`}
              value={item}
              onChange={(v) =>
                onChange(value.map((old, j) => (j === i ? v : old)))
              }
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              Remove {label(name)} {i + 1}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange([
              ...value,
              structuredClone(templates[name] ?? value[0] ?? ""),
            ])
          }
        >
          + Add {label(name)}
        </button>
      </fieldset>
    );
  return (
    <fieldset>
      <legend>{label(name)}</legend>
      {Object.entries(value).map(([key, v]) => (
        <Editor
          key={key}
          name={key}
          value={v}
          onChange={(newValue) => onChange({ ...value, [key]: newValue })}
        />
      ))}
    </fieldset>
  );
}
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState("leads");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const r = await fetch("/api/admin");
      if (r.ok) {
        const d = await r.json();
        setContent(d.content);
        setLeads(d.leads);
        setAuthenticated(true);
      }
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function request(data: unknown) {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      return true;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (
      await request({
        action: "login",
        email: f.get("email"),
        password: f.get("password"),
      })
    )
      await load();
  }
  function updateLead(id: string, patch: Partial<Lead>) {
    setLeads((old) => old.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  return (
    <main className="admin-page">
      <a href="/" className="eyebrow">
        ← IGCS WEBSITE
      </a>
      <div className="admin-heading">
        <h1>IGCS administration</h1>
        {authenticated && (
          <button
            onClick={async () => {
              if (await request({ action: "logout" })) setAuthenticated(false);
            }}
          >
            Sign out
          </button>
        )}
      </div>
      {message && (
        <p className="admin-message" role="status">
          {message}
        </p>
      )}
      {loading ? (
        <p>Loading…</p>
      ) : !authenticated ? (
        <form onSubmit={login} className="admin-login">
          <h2>Team sign in</h2>
          <p>Use an authorized IGCS administrator account.</p>
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button disabled={busy} className="button navy-button">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-tabs">
            <button
              aria-pressed={view === "leads"}
              onClick={() => setView("leads")}
            >
              Leads ({leads.length})
            </button>
            <button
              aria-pressed={view === "content"}
              onClick={() => setView("content")}
            >
              Website content
            </button>
          </div>
          {view === "content" ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (await request({ action: "content", content }))
                  setMessage("Website content saved.");
              }}
            >
              <p className="admin-help">
                Changes publish when saved. Keep applications closed until the
                privacy policy and lead storage are approved. Use full HTTPS
                URLs for approved brand assets, speaker photos and partner
                logos.
              </p>
              {Object.entries(content).map(([key, value]) => (
                <details key={key}>
                  <summary>{label(key)}</summary>
                  <Editor
                    name={key}
                    value={value as Value}
                    onChange={(newValue) =>
                      setContent({ ...content, [key]: newValue })
                    }
                  />
                </details>
              ))}
              <button disabled={busy} className="button navy-button admin-save">
                {busy ? "Saving…" : "Save website content"}
              </button>
            </form>
          ) : (
            <>
              <label className="admin-filter">
                Lead source
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All leads</option>
                  <option value="invitation">Invitation requests</option>
                  <option value="partner">Partnership inquiries</option>
                </select>
              </label>
              <p className="admin-help">
                Latest 250 submissions. Full records remain in the database.
                Owner, status and notes are private to the IGCS team.
              </p>
              {leads
                .filter((l) => filter === "all" || l.lead_type === filter)
                .map((l) => (
                  <details className="lead-record" key={l.id}>
                    <summary>
                      {l.fields.name ||
                        `${l.fields.firstName} ${l.fields.lastName}`}{" "}
                      · {l.fields.company} <span>{l.status}</span>
                    </summary>
                    <p className="eyebrow">{l.crm_tag}</p>
                    <dl>
                      {Object.entries(l.fields).map(([k, v]) => (
                        <div key={k}>
                          <dt>{label(k)}</dt>
                          <dd>{v || "—"}</dd>
                        </div>
                      ))}
                      <div>
                        <dt>Interests</dt>
                        <dd>{l.interests.join(", ") || "—"}</dd>
                      </div>
                      <div>
                        <dt>Submitted</dt>
                        <dd>{new Date(l.created_at).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt>Source</dt>
                        <dd>{l.source_page}</dd>
                      </div>
                      <div>
                        <dt>Campaign</dt>
                        <dd>{JSON.stringify(l.utm)}</dd>
                      </div>
                    </dl>
                    <div className="admin-fields">
                      <label>
                        Status
                        <select
                          value={l.status}
                          onChange={(e) =>
                            updateLead(l.id, { status: e.target.value })
                          }
                        >
                          {(l.lead_type === "partner"
                            ? [
                                "Target",
                                "Intro",
                                "Discovery",
                                "Proposal",
                                "Negotiation",
                                "Contracted",
                                "Paid",
                                "Activated",
                              ]
                            : [
                                "New",
                                "Review",
                                "Qualified",
                                "Invited",
                                "Registered",
                                "Paid",
                                "Attending",
                                "Declined",
                                "Waitlist",
                              ]
                          ).map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Owner
                        <input
                          value={l.owner}
                          onChange={(e) =>
                            updateLead(l.id, { owner: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Notes
                        <textarea
                          value={l.notes}
                          onChange={(e) =>
                            updateLead(l.id, { notes: e.target.value })
                          }
                        />
                      </label>
                    </div>
                    <button
                      disabled={busy}
                      onClick={async () => {
                        if (
                          await request({
                            action: "lead",
                            id: l.id,
                            status: l.status,
                            owner: l.owner,
                            notes: l.notes,
                          })
                        )
                          setMessage("Lead updated.");
                      }}
                    >
                      Save lead
                    </button>
                  </details>
                ))}
              {!leads.length && (
                <p className="admin-empty">No submissions yet.</p>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
