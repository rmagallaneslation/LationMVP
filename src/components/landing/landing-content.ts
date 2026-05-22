import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Mail, MessageSquare, ShieldCheck } from "lucide-react";

type HeroPreviewCard = {
  title: string;
  subtitle: string;
  badge: string;
  cardClassName: string;
  badgeClassName: string;
};

type HeroFloatStat = {
  value: string;
  label: string;
};

type ContactCard = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  interactive?: boolean;
};

type FooterLink = {
  label: string;
  href: string;
};

const CONTACT_EMAIL = "hello@lation.com.mx";

const getHeroFeatures = (t: TFunction) => [
  t("landing.hero.features.expert"),
  t("landing.hero.features.qa"),
  t("landing.hero.features.reports"),
];

const getHeroPreviewCards = (t: TFunction): HeroPreviewCard[] => [
  {
    title: t("landing.hero.preview.cards.first.title"),
    subtitle: t("landing.hero.preview.cards.first.subtitle"),
    badge: t("landing.hero.preview.cards.first.badge"),
    cardClassName: "bg-secondary/50",
    badgeClassName: "bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent",
  },
  {
    title: t("landing.hero.preview.cards.second.title"),
    subtitle: t("landing.hero.preview.cards.second.subtitle"),
    badge: t("landing.hero.preview.cards.second.badge"),
    cardClassName: "bg-muted/50",
    badgeClassName: "bg-success/15 text-success",
  },
  {
    title: t("landing.hero.preview.cards.third.title"),
    subtitle: t("landing.hero.preview.cards.third.subtitle"),
    badge: t("landing.hero.preview.cards.third.badge"),
    cardClassName: "bg-muted/30",
    badgeClassName: "bg-accent/10 text-accent",
  },
];

const getHeroPreviewItems = (t: TFunction) => [
  {
    icon: ClipboardCheck,
    title: t("landing.hero.preview.items.criteria"),
  },
  {
    icon: ShieldCheck,
    title: t("landing.hero.preview.items.screening"),
  },
  {
    icon: MessageSquare,
    title: t("landing.hero.preview.items.report"),
  },
];

const heroFloatingStat: HeroFloatStat = { value: "24h", label: "Follow-up SLA" };
const heroFloatingBadge: HeroFloatStat = { value: "QA + Tech", label: "Evaluation" };

const getContactCards = (t: TFunction): ContactCard[] => [
  {
    icon: Mail,
    label: t("landing.contact.email.label"),
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    interactive: true,
  },
  {
    icon: MessageSquare,
    label: t("landing.contact.response.label"),
    value: t("landing.contact.response.time"),
  },
];

const getFooterLinks = (t: TFunction): FooterLink[] => [
  { label: t("landing.footer.services"), href: "#services" },
  { label: t("landing.footer.howItWorks"), href: "#how-it-works" },
  { label: t("landing.footer.faq"), href: "#faq" },
  { label: t("landing.footer.contact"), href: "#contact" },
];

export {
  CONTACT_EMAIL,
  getContactCards,
  getFooterLinks,
  getHeroFeatures,
  getHeroPreviewCards,
  getHeroPreviewItems,
  heroFloatingBadge,
  heroFloatingStat,
};
