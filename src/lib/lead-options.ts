export const attendeeCategories = [
  "Investor",
  "Family Office",
  "Wealth Advisor",
  "Asset Manager",
  "Financial Institution",
  "Founder",
  "FinTech Executive",
  "Digital Asset Executive",
  "Sponsor / Partner",
  "Other",
];
export const leadInterests = [
  "Golf",
  "Capital Summit",
  "Private Salons",
  "Partnerships",
];
export function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
