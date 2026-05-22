import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/landing/Section";
import { getHeroFeatures, getHeroPreviewItems } from "@/components/landing/landing-content";

export const HeroSection = () => {
  const { t } = useTranslation();
  const features = getHeroFeatures(t);
  const previewItems = getHeroPreviewItems(t);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92dvh] overflow-hidden bg-gradient-hero pt-28">
      <SectionContainer className="relative z-10 flex min-h-[calc(92dvh-7rem)] items-center">
        <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t("landing.hero.titlePrimary")}{" "}
              <span className="text-accent">{t("landing.hero.titleAccent")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("landing.hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" onClick={() => scrollTo("contact")}>
                {t("landing.hero.cta")}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => scrollTo("how-it-works")}>
                {t("landing.hero.secondaryCta")}
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="rounded-xl border border-border bg-card p-6 shadow-md"
          >
            <p className="text-sm font-semibold text-accent">{t("landing.hero.preview.title")}</p>
            <div className="mt-6 space-y-4">
              {previewItems.map((item) => (
                <div key={item.title} className="flex items-center gap-4 rounded-lg bg-secondary/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background text-accent">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
              {t("landing.hero.note")}
            </p>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
};
