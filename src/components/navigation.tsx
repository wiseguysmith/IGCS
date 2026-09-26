"use client";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { safeUrl } from "@/lib/content";
export function track(event: string) {
  window.dispatchEvent(new CustomEvent("igcs:track", { detail: event }));
}
export function Navigation({ event }: { event: SiteContent["event"] }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const update = () => setSolid(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className={`nav ${solid || open ? "solid" : ""}`}>
      <a className="brand" href="#" aria-label="IGCS home">
        {safeUrl(event.logoUrl) ? (
          <img src={event.logoUrl} alt="IG" width="54" height="54" />
        ) : (
          "IG"
        )}
        <span>
          INVESTOR GOLF
          <br />
          CAPITAL SUMMIT
        </span>
      </a>
      <nav
        id="main-nav"
        className={open ? "is-open" : ""}
        aria-label="Main navigation"
      >
        {[
          "Experience",
          "Golf",
          "Summit",
          "Salons",
          "Partners",
          "San Antonio",
        ].map((n) => (
          <a
            key={n}
            href={`#${n.toLowerCase().replace(" ", "-")}`}
            onClick={() => setOpen(false)}
          >
            {n}
          </a>
        ))}
      </nav>
      <a
        className="button gold"
        href="#invitation"
        onClick={() => {
          setOpen(false);
          track("request_invitation_click");
        }}
      >
        Request Invitation <span aria-hidden>↗</span>
      </a>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "☰"}
      </button>
    </header>
  );
}
export function TrackedLink({
  href,
  event,
  children,
  className,
}: {
  href: string;
  event: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className} onClick={() => track(event)}>
      {children}
    </a>
  );
}
export function Analytics({ gaId }: { gaId: string }) {
  const [choice, setChoice] = useState<string | null>("unset");
  useEffect(() => {
    try {
      setChoice(localStorage.getItem("igcs.analytics"));
    } catch {
      setChoice(null);
    }
    const params = new URLSearchParams(location.search);
    const utm: Record<string, string> = {};
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ].forEach((k) => {
      if (params.has(k)) utm[k] = params.get(k)!.slice(0, 200);
    });
    try {
      if (Object.keys(utm).length)
        sessionStorage.setItem("igcs.utm", JSON.stringify(utm));
    } catch {}
  }, []);
  useEffect(() => {
    if (choice !== "accepted" || !/^G-[A-Z0-9]+$/.test(gaId)) return;
    const w = window as unknown as {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      w.dataLayer.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", gaId, {
      page_location: location.origin + location.pathname,
      send_page_view: true,
    });
    let script = document.getElementById("igcs-ga");
    if (!script) {
      script = document.createElement("script");
      script.id = "igcs-ga";
      (script as HTMLScriptElement).src =
        `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
    }
    const send = (e: Event) => w.gtag("event", (e as CustomEvent).detail);
    window.addEventListener("igcs:track", send);
    return () => window.removeEventListener("igcs:track", send);
  }, [choice, gaId]);
  if (!gaId || choice) return null;
  function choose(value: string) {
    try {
      localStorage.setItem("igcs.analytics", value);
    } catch {}
    setChoice(value);
  }
  return (
    <aside className="cookie" aria-label="Analytics preference">
      <p>
        Allow optional analytics to help us improve the IGCS experience?{" "}
        <a href="/legal/privacy">Privacy</a>
      </p>
      <button onClick={() => choose("declined")}>Decline</button>
      <button onClick={() => choose("accepted")}>Allow analytics</button>
    </aside>
  );
}
