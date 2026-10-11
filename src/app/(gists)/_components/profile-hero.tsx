import { Clock, FileText, Languages, MapPin, Users } from "lucide-react";
import { site } from "@/lib/site";
import { relativeTime } from "@/lib/gist-display";

export function ProfileHero({
  gistCount,
  languageCount,
  lastUpdated,
}: {
  gistCount: number;
  languageCount: number;
  lastUpdated?: string;
}) {
  return (
    <section className="flex flex-col items-stretch justify-between gap-6 pb-2 lg:flex-row lg:items-center">
      <div className="flex items-start gap-3.5 sm:items-center sm:gap-5">
        <img
          src={site.avatar}
          alt={site.author}
          width={96}
          height={96}
          className="size-14 shrink-0 rounded-full border-2 border-border object-cover bg-subtle sm:size-20 md:size-24"
        />
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-base font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {site.author}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">{site.tagline}</p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground sm:gap-3 sm:text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Users className="hidden size-3.5 sm:inline" />
              <span>{site.roles[0]}</span>
            </span>
            <span className="text-border sm:hidden">•</span>
            <span className="hidden text-border sm:inline">|</span>
            <span>{site.roles[1]}</span>
            <span className="text-border sm:hidden">•</span>
            <span className="hidden text-border sm:inline">|</span>
            <span>{site.roles[2]}</span>
            <span className="text-border sm:hidden">•</span>
            <span className="inline-flex items-center gap-1 sm:ml-1">
              <MapPin className="size-2.5 sm:size-3.5" />
              <span>{site.location}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-2 lg:flex lg:min-w-[340px] lg:w-auto lg:items-center lg:justify-start lg:gap-0 lg:space-x-8 lg:self-auto lg:rounded-xl lg:border lg:border-border lg:bg-subtle/80 lg:px-6 lg:py-4">
        <Stat
          icon={<FileText className="size-3.5" />}
          label="Total Gists"
          mobileLabel="Gists"
          value={String(gistCount)}
        />
        <Stat
          icon={<Languages className="size-3.5" />}
          label="Languages"
          mobileLabel="Languages"
          value={String(languageCount)}
        />
        <Stat
          icon={<Clock className="size-3.5" />}
          label="Last Updated"
          mobileLabel="Updated"
          value={relativeTime(lastUpdated)}
          compact
        />
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  mobileLabel,
  value,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  mobileLabel: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-border bg-subtle px-2.5 py-2 text-center lg:items-start lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-left">
      <div className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`font-semibold text-foreground ${compact ? "text-xs lg:mt-1 lg:text-base" : "text-sm lg:text-2xl"} whitespace-nowrap`}
      >
        {value}
      </div>
      <span className="mt-0.5 text-[10px] tracking-wider text-muted-foreground uppercase lg:hidden">
        {mobileLabel}
      </span>
    </div>
  );
}
