import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section, SectionContainer } from "@/components/landing/Section";
import { TurnstileWidget } from "@/components/landing/TurnstileWidget";
import { getContactCards } from "@/components/landing/landing-content";
import { contactConfigError, isContactFormConfigured, runtimeConfig } from "@/lib/runtime-config";

type LeadFormData = {
  name: string;
  email: string;
  company: string;
  role: string;
  serviceInterest: string;
  phone: string;
  message: string;
  website: string;
};

function resolveLeadEndpoint() {
  const apiUrl = runtimeConfig.apiUrl?.trim();
  if (!apiUrl) {
    return "/api/lead";
  }

  return `${apiUrl.replace(/\/+$/, "")}/api/lead`;
}

const initialFormData: LeadFormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  serviceInterest: "",
  phone: "",
  message: "",
  website: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const contactCards = getContactCards(t);
  const contactFormAvailable = isContactFormConfigured && Boolean(runtimeConfig.turnstileSiteKey);
  const showTechnicalConfigHint =
    import.meta.env.DEV || import.meta.env.VITE_SHOW_CONTACT_CONFIG_HINT === "true";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const leadEndpoint = useMemo(resolveLeadEndpoint, []);

  const handleTurnstileTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setTurnstileResetSignal((current) => current + 1);
  };

  const isValidForm = () => {
    return (
      formData.name.trim().length >= 2 &&
      emailRegex.test(formData.email.trim()) &&
      formData.message.trim().length >= 10
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!contactFormAvailable) {
      toast.error(t("landing.contact.form.disabledToast"));
      return;
    }

    if (formData.website.trim()) {
      toast.success(t("landing.contact.form.success"));
      resetForm();
      return;
    }

    if (!isValidForm()) {
      toast.error(t("landing.contact.form.validationError"));
      return;
    }

    if (!turnstileToken) {
      toast.error(t("landing.contact.form.turnstileError"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        role: formData.role.trim(),
        serviceInterest: formData.serviceInterest.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        website: formData.website.trim(),
        locale: i18n.language,
        turnstileToken,
      };

      const response = await fetch(leadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          setTurnstileResetSignal((current) => current + 1);
        }
        throw new Error("lead_submission_failed");
      }

      toast.success(t("landing.contact.form.success"));
      resetForm();
    } catch {
      toast.error(t("landing.contact.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Section id="contact" tone="gradient">
      <SectionContainer>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {t("landing.contact.titlePrimary")}{" "}
              <span className="text-accent">{t("landing.contact.titleAccent")}</span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              {t("landing.contact.subtitle")}
            </p>

            <div className="mt-8 space-y-3">
              {contactCards.map((card) => {
                const className =
                  "flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left";
                const content = (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="font-semibold text-foreground">{card.value}</p>
                    </div>
                  </>
                );

                return card.href ? (
                  <a key={card.label} href={card.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <div key={card.label} className={className}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h3 className="text-2xl font-bold text-foreground">{t("landing.contact.form.title")}</h3>

            {!contactFormAvailable && (
              <Alert className="mt-6 border-amber-500/40 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 !text-amber-700 dark:!text-amber-300" />
                <AlertTitle className="text-amber-900 dark:text-amber-100">
                  {t("landing.contact.form.disabledTitle")}
                </AlertTitle>
                <AlertDescription className="text-amber-800/90 dark:text-amber-100/90">
                  <p>{t("landing.contact.form.disabledMessage")}</p>
                  {contactConfigError && showTechnicalConfigHint && (
                    <p className="mt-1 text-xs">
                      {t("landing.contact.form.disabledAdminHint", { error: contactConfigError })}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <fieldset disabled={!contactFormAvailable} className="mt-6 space-y-5 disabled:opacity-70">
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    {t("landing.contact.form.name")} *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("landing.contact.form.namePlaceholder")}
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    {t("landing.contact.form.email")} *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("landing.contact.form.emailPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-foreground">
                    {t("landing.contact.form.company")}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t("landing.contact.form.companyPlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                    {t("landing.contact.form.phone")}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("landing.contact.form.phonePlaceholder")}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="role" className="mb-2 block text-sm font-medium text-foreground">
                    {t("landing.contact.form.role")}
                  </label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder={t("landing.contact.form.rolePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="serviceInterest"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {t("landing.contact.form.serviceInterest")}
                  </label>
                  <select
                    id="serviceInterest"
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{t("landing.contact.form.servicePlaceholder")}</option>
                    <option value="technical_interviews">
                      {t("landing.contact.form.serviceOptions.technicalInterviews")}
                    </option>
                    <option value="qa_evaluation">
                      {t("landing.contact.form.serviceOptions.qaEvaluation")}
                    </option>
                    <option value="reports">{t("landing.contact.form.serviceOptions.reports")}</option>
                    <option value="advisory">{t("landing.contact.form.serviceOptions.advisory")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  {t("landing.contact.form.message")} *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("landing.contact.form.messagePlaceholder")}
                  rows={5}
                  required
                  minLength={10}
                />
              </div>

              {runtimeConfig.turnstileSiteKey && (
                <TurnstileWidget
                  siteKey={runtimeConfig.turnstileSiteKey}
                  onTokenChange={handleTurnstileTokenChange}
                  resetSignal={turnstileResetSignal}
                />
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !contactFormAvailable || !turnstileToken}
                className="w-full"
              >
                {isSubmitting ? (
                  t("landing.contact.form.sending")
                ) : !contactFormAvailable ? (
                  t("landing.contact.form.unavailable")
                ) : (
                  <>
                    {t("landing.contact.form.submit")}
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </fieldset>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {t("landing.contact.form.privacy")}
            </p>
          </form>
        </div>
      </SectionContainer>
    </Section>
  );
};
