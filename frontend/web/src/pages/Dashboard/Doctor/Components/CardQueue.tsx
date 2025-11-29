import type {ProfilesSummary} from "@/api/api";
import {InfoMessage} from "@/components/custom/InfoMessage";

interface CardQueueProps {
  queue: {
    id?: string;
    checkin?: string;
    profile_id?: string;
  }[];
  profiles: ProfilesSummary[];
}

export const CardQueue = ({queue, profiles}: CardQueueProps) => {
  const queueWithNames = queue
    .map((item) => {
      const patient = profiles.find(p => p.id === item.profile_id);
      return {
        ...item,
        name: patient?.full_name ?? "Paciente",
        priority: patient?.priority ?? false,
      };
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority ? -1 : 1;
      }

      return new Date(a.checkin ?? 0).getTime() - new Date(b.checkin ?? 0).getTime();
    });

  if (queueWithNames.length === 0) {
    return <InfoMessage message="Nenhum paciente aguardando." />;
  }

  return (
    <div className="w-full mb-24">
      {queueWithNames.map((item, index) => (
        <div
          key={item.id ?? index}
          className="flex justify-between rounded-lg border p-3 bg-muted/30"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">{item.name}</span>
            <span className="text-xs text-muted-foreground">
              Check-in:
              {" "}
              {item.checkin ? new Date(item.checkin).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"}) : "--"}
            </span>
          </div>

          <div className="text-sm font-semibold text-primary">
            #
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};
