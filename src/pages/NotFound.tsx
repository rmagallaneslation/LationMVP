import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-accent">404</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">{t("landing.notFound.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("landing.notFound.description")}</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {t("landing.notFound.home")}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
