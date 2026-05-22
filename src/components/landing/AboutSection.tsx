import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionContainer } from "@/components/landing/Section";

type ContentBlockProps = {
  label: string;
  title: string;
  description: string;
  items: string[];
};

const ContentBlock = ({ label, title, description, items }: ContentBlockProps) => (
  <div className="rounded-xl border border-border bg-card p-6 md:p-8">
    <p className="text-sm font-semibold text-accent">{label}</p>
    <h2 className="mt-3 text-2xl font-bold leading-tight text-foreground md:text-3xl">{title}</h2>
    <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const AboutSection = () => {
  const { t } = useTranslation();
  const problemItems = t("landing.problem.items", { returnObjects: true }) as string[];
  const solutionItems = t("landing.solution.items", { returnObjects: true }) as string[];

  return (
    <Section id="about">
      <SectionContainer>
        <div className="grid gap-6 lg:grid-cols-2">
          <ContentBlock
            label={t("landing.problem.label")}
            title={t("landing.problem.title")}
            description={t("landing.problem.description")}
            items={problemItems}
          />
          <ContentBlock
            label={t("landing.solution.label")}
            title={t("landing.solution.title")}
            description={t("landing.solution.description")}
            items={solutionItems}
          />
        </div>
      </SectionContainer>
    </Section>
  );
};
