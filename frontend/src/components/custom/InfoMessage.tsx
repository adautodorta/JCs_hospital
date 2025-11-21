import {InfoIcon} from "lucide-react";

interface InfoMessageProps {
  message: string;
}

export const InfoMessage = ({message}: InfoMessageProps) => {
  return (
    <div className="w-full mt-3">
      <div className="flex flex-row max-lg:items-start lg:items-center gap-3 p-4 rounded-lg bg-muted">
        <InfoIcon className="w-5 h-5 text-muted-foreground shrink-0 max-lg:mt-0.5" />
        <p className="text-sm text-muted-foreground leading-normal">
          {message}
        </p>
      </div>
    </div>
  );
};
