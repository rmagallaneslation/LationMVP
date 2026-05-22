import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer, SectionHeader } from "@/components/landing/Section";

type FaqItem = {
  question: string;
  answer: string;
};

export const ClientsSection = () => {
  const { t } = useTranslation();
  const audienceItems = t("landing.audience.items", { returnObjects: true }) as string[];
  const faqItems = t("landing.faq.items", { returnObjects: true }) as FaqItem[];

  return (
    <>
      <Section id="audience" tone="muted">
        <SectionContainer>
          <SectionHeader
            label={t("landing.audience.label")}
            title={t("landing.audience.title")}
            subtitle={t("landing.audience.subtitle")}
          />

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {audienceItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </Section>

      <Section id="faq">
        <SectionContainer>
          <SectionHeader label={t("landing.faq.label")} title={t("landing.faq.title")} />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground">{item.question}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </SectionContainer>
      </Section>
    </>
  );
};
