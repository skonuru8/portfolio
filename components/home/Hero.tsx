import { isResumePdfAvailable } from "@/lib/resume";
import { HeroClient } from "./HeroClient";

/** Server wrapper — resolves the PDF availability check (needs `fs`), then delegates to the client component. */
export function Hero() {
  return <HeroClient pdfReady={isResumePdfAvailable()} />;
}
