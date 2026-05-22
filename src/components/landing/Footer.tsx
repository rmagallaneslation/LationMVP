import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lationLogoDark from "@/assets/lation-logo-dark.png";
import { CONTACT_EMAIL, getFooterLinks } from "@/components/landing/landing-content";

export const Footer = () => {
  const { t } = useTranslation();
  const footerLinks = getFooterLinks(t);

  return (
    <footer className="bg-primary py-10 text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center">
              <img src={lationLogoDark} alt="Lation" className="h-12 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
              {t("landing.footer.tagline")}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block text-sm font-semibold text-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-primary-foreground/85 hover:text-accent">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-primary-foreground/15 pt-6">
          <p className="text-sm text-primary-foreground/70">
            {t("landing.footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};
