import { notFound } from "next/navigation";
import { getContent } from "@/lib/server";
const titles: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms",
  "event-terms": "Event Terms",
  "cancellation-refunds": "Cancellation / Refund Policy",
  "media-release": "Photography / Media Release",
  "crypto-payments": "Crypto Payment Terms",
  "golf-competition": "Golf Competition Terms",
};
export default async function Legal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!titles[slug]) notFound();
  const c = await getContent();
  const copy = c.legal[slug as keyof typeof c.legal];
  return (
    <main className="section legal-page">
      <a href="/" className="eyebrow">
        ← INVESTOR GOLF CAPITAL SUMMIT
      </a>
      <h1>{titles[slug]}</h1>
      <div className="legal-copy">
        {copy ||
          "This policy is being prepared and has not yet been approved. The final policy will be published here before the relevant applications, registration or event activity opens."}
      </div>
      <nav className="legal-links" aria-label="Event policies">
        {Object.entries(titles).map(([key, title]) => (
          <a key={key} href={`/legal/${key}`}>
            {title}
          </a>
        ))}
      </nav>
      <p className="endorsement">Powered by Mindful Tech</p>
    </main>
  );
}
