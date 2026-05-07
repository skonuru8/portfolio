import { Hero } from "@/components/home/Hero";
import { ImpactMetrics } from "@/components/home/ImpactMetrics";
import { Transformations } from "@/components/home/Transformations";
import { HowIThink } from "@/components/home/HowIThink";
import { WorkIndex } from "@/components/home/WorkIndex";
import { RecognitionPreview } from "@/components/home/RecognitionPreview";
import { ContactPanel } from "@/components/home/ContactPanel";
import { SectionDivider } from "@/components/layout/SectionDivider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionDivider />
      <ImpactMetrics />
      <SectionDivider />
      <Transformations />
      <SectionDivider />
      <HowIThink />
      <SectionDivider />
      <WorkIndex />
      <SectionDivider />
      <RecognitionPreview />
      <SectionDivider />
      <ContactPanel />
    </>
  );
}
