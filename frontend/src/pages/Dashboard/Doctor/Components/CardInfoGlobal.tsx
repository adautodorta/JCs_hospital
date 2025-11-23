import {
  TimerIcon,
  Users,
  TrendingUp,
  type LucideIcon,
  Stethoscope,
} from "lucide-react";

import {Card} from "@/components/ui/card";

const iconMap = {
  Users,
  TimerIcon,
  TrendingUp,
  Stethoscope,
} as const;

type IconName = keyof typeof iconMap;

interface CardInfoGlobalProps {
  title: string;
  total: number | string;
  iconName: IconName;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function CardInfoGlobal({
  title,
  total,
  iconName,
  iconBgColor = "bg-blue-100",
  iconTextColor = "text-blue-600",
}: CardInfoGlobalProps) {
  const IconComponent: LucideIcon = iconMap[iconName];

  return (
    <Card className="w-full lg:w-55 rounded-xl border p-4 shadow-none">
      <div className="flex justify-between items-center">

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600 whitespace-normal lg:max-w-[170px]">
            {title}
          </span>

          <span className="text-3xl font-bold text-gray-900 mt-2">
            {total}
          </span>
        </div>

        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <IconComponent className={`h-6 w-6 ${iconTextColor}`} />
        </div>

      </div>
    </Card>
  );
}
