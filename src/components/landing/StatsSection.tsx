import { useTranslation } from "react-i18next";
import { Section, SectionContainer, SectionHeader } from "@/components/landing/Section";

type Step = {
  title: string;
  description: string;
};

export const StatsSection = () => {
  const { t } = useTranslation();
  const steps = t("landing.howItWorks.steps", { returnObjects: true }) as Step[];

  return (
    <Section id="how-it-works">
      <SectionContainer>
        <SectionHeader
          label={t("landing.howItWorks.label")}
          title={t("landing.howItWorks.title")}
          subtitle={t("landing.howItWorks.subtitle")}
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </SectionContainer>
    </Section>
  );
};
