import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Mail, MessageSquare, ShieldCheck } from "lucide-react";

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

export { CONTACT_EMAIL, getContactCards, getFooterLinks, getHeroFeatures, getHeroPreviewItems };
