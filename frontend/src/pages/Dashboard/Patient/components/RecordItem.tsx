import {
  HospitalIcon,
} from "lucide-react";
import {useMemo} from "react";

import type {RecordsSummaryProps} from "@/api/api";
import {cn} from "@/lib/utils";
import {formatDateTime} from "@/utils/functions";

interface RecordItemProps {
  record: RecordsSummaryProps;
}

interface RecordConfig {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  badgeClasses: string;
  statusColorClass: string;
  statusText: string;
}

export const RecordItem = ({record}: RecordItemProps) => {
  const {
    title,
    subtitle,
    icon,
    badgeClasses,
    statusColorClass,
    statusText,
  } = useMemo<RecordConfig>(() => {
    const {started_at} = record;

    const formattedDate = formatDateTime(started_at);

    const titleText = "Atendimento Médico";
    const subtitleText = formattedDate.split(",")[0].trim();

    return {
      title: titleText,
      subtitle: subtitleText,
      icon: (
        <HospitalIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
      ),
      badgeClasses: "bg-green-100 border-green-600",
      statusColorClass: "text-green-600",
      statusText: "COMPLETO",
      recordFinished: true,
    };
  }, [record]);

  return (
    <div
      className={cn(
        "flex flex-row items-center w-full py-3 lg:px-4 cursor-pointer transition-colors rounded-lg",
        "hover:bg-muted/70",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 rounded-sm lg:rounded-lg border mr-3 lg:mr-4 shrink-0 self-center p-0",
          badgeClasses,
        )}
      >
        <div className="flex items-center justify-center w-full h-full">
          {icon}
        </div>
      </div>

      <div className="flex-1 max-lg:min-w-0 max-lg:max-w-[calc(100%-160px)]">
        <h3
          className={cn(
            "text-sm font-medium leading-none text-foreground",
            "max-lg:overflow-hidden max-lg:text-ellipsis max-lg:whitespace-nowrap",
            "lg:overflow-visible lg:whitespace-normal",
          )}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-lg:truncate">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col items-end ml-3 shrink-0 max-lg:min-w-[120px] lg:min-w-fit">
        <span
          className={cn(
            "text-sm font-medium leading-none text-right uppercase",
            statusColorClass,
          )}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
};
