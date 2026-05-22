import { BarChart3, ClipboardList, FileText, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer, SectionGrid, SectionHeader } from "@/components/landing/Section";

export const ServicesSection = () => {
  const { t } = useTranslation();
  const services = [
    {
      icon: ClipboardList,
      title: t("landing.services.items.interviews.title"),
      description: t("landing.services.items.interviews.description"),
      features: t("landing.services.items.interviews.features", { returnObjects: true }) as string[],
    },
    {
      icon: ShieldCheck,
      title: t("landing.services.items.qa.title"),
      description: t("landing.services.items.qa.description"),
      features: t("landing.services.items.qa.features", { returnObjects: true }) as string[],
    },
    {
      icon: FileText,
      title: t("landing.services.items.reports.title"),
      description: t("landing.services.items.reports.description"),
      features: t("landing.services.items.reports.features", { returnObjects: true }) as string[],
    },
    {
      icon: BarChart3,
      title: t("landing.services.items.advisory.title"),
      description: t("landing.services.items.advisory.description"),
      features: t("landing.services.items.advisory.features", { returnObjects: true }) as string[],
    },
  ];

  return (
    <Section id="services" tone="muted">
      <SectionContainer>
        <SectionHeader
          label={t("landing.services.label")}
          title={t("landing.services.title")}
          subtitle={t("landing.services.subtitle")}
        />

        <SectionGrid className="mt-12 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/10 text-accent">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{service.description}</p>
              <ul className="mt-5 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </SectionGrid>
      </SectionContainer>
    </Section>
  );
};
