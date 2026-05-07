/** Base URL for metadata, sitemap, and robots. */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env != null && env.length > 0) return env.replace(/\/$/, "");
  return "https://sarathkonuru.dev";
}
