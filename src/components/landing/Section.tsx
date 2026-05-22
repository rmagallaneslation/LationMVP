import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "default" | "muted" | "gradient" | "accent";

const toneClasses: Record<SectionTone, string> = {
  default: "bg-background",
  muted: "bg-secondary/30",
  gradient: "bg-gradient-section",
  accent: "bg-accent/10",
};

type SectionProps = {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: React.ReactNode;
};

const Section = ({ id, tone = "default", className, children }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn("py-24 relative overflow-hidden", toneClasses[tone], className)}
    >
      {children}
    </section>
  );
};

type SectionContainerProps = React.HTMLAttributes<HTMLDivElement>;

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("container mx-auto px-4 md:px-6", className)}
        {...props}
      />
    );
  },
);
SectionContainer.displayName = "SectionContainer";

type SectionHeaderProps = {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  labelClassName?: string;
};

const SectionHeader = ({
  label,
  title,
  titleAccent,
  subtitle,
  align = "center",
  className,
  labelClassName,
}: SectionHeaderProps) => {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={cn("space-y-4", alignment, className)}>
      {label ? (
        <span className={cn("block text-sm font-semibold", labelClassName ?? "text-accent")}>
          {label}
        </span>
      ) : null}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
        {title}
        {titleAccent ? <span className="text-accent"> {titleAccent}</span> : null}
      </h2>
      {subtitle ? (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      ) : null}
    </div>
  );
};

type SectionGridProps = React.HTMLAttributes<HTMLDivElement>;

const SectionGrid = ({ className, ...props }: SectionGridProps) => {
  return <div className={cn("grid gap-8", className)} {...props} />;
};

export { Section, SectionContainer, SectionHeader, SectionGrid };
