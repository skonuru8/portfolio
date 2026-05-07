import fs from "fs";
import path from "path";

const RESUME_REL = ["public", "resume", "sarath-konuru-resume.pdf"];

export function getResumePdfAbsolutePath() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), ...RESUME_REL);
}

export function isResumePdfAvailable(): boolean {
  try {
    return fs.existsSync(getResumePdfAbsolutePath());
  } catch {
    return false;
  }
}
