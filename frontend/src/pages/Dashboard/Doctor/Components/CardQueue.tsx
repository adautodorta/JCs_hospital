import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

interface CardQueueProps {
  queue: {
    id?: string;
    checkin?: string;
    profile_id?: string;
  }[];
  profiles: {
    id: string;
    full_name: string;
  }[];
}

export const CardQueue = ({queue, profiles}: CardQueueProps) => {
  const queueWithNames = queue.map((item) => {
    const patient = profiles.find(p => p.id === item.profile_id);
    return {
      ...item,
      name: patient?.full_name ?? "Paciente",
    };
  });

  return (
    <Card className="w-full mt-6 rounded-xl border p-4 shadow-none gap-0">
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-base font-normal leading-none text-muted-foreground">
          Pacientes na Fila
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-0">
        {queueWithNames.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum paciente aguardando.</p>
        )}

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
      </CardContent>
    </Card>
  );
};
