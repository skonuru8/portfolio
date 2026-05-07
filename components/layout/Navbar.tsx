import { isResumePdfAvailable } from "@/lib/resume";
import { NavbarClient } from "./NavbarClient";

export function Navbar() {
  return <NavbarClient pdfReady={isResumePdfAvailable()} />;
}
