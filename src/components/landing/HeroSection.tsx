import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/landing/Section";
import {
  getHeroFeatures,
  getHeroPreviewCards,
  heroFloatingBadge,
  heroFloatingStat,
} from "@/components/landing/landing-content";

export const HeroSection = () => {
  const { t } = useTranslation();
  const features = getHeroFeatures(t);
  const previewCards = getHeroPreviewCards(t);

  const handleScrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 h-80 w-80 animate-float-delayed rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <SectionContainer className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span className="text-sm font-medium text-primary dark:text-accent">
                {t("landing.hero.trustedBy")}
              </span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t("landing.hero.titlePrimary")}{" "}
              <span className="text-accent">{t("landing.hero.titleAccent")}</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground md:text-xl lg:mx-0">
              {t("landing.hero.subtitle")}
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <Button variant="hero" size="xl" onClick={handleScrollToContact} className="group">
                {t("landing.hero.cta")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="rotate-1 rounded-2xl border border-border bg-card p-6 shadow-xl transition-transform duration-500 hover:rotate-0">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="space-y-4">
                  {previewCards.map((card) => (
                    <div
                      key={card.title}
                      className={`flex items-center justify-between rounded-lg p-4 ${card.cardClassName}`}
                    >
                      <div>
                        <p className="font-semibold text-foreground">{card.title}</p>
                        <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${card.badgeClassName}`}>
                        {card.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 rounded-xl border border-accent/20 bg-card p-4 shadow-lg"
              >
                <p className="text-3xl font-bold text-accent">{heroFloatingStat.value}</p>
                <p className="text-sm text-muted-foreground">{heroFloatingStat.label}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="absolute -top-4 -right-4 rounded-xl bg-accent p-3 text-accent-foreground shadow-lg"
              >
                <p className="text-sm font-semibold">{heroFloatingBadge.value}</p>
                <p className="text-xs opacity-90">{heroFloatingBadge.label}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium">{t("landing.hero.scroll")}</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
