import {useMutation, useQuery} from "@tanstack/react-query";

import {ProfilesAPI, QueueAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";

export const CardInfoPatient = () => {
  const {data, isPending} = useQuery({
    queryKey: ["info-patient"],
    queryFn: ProfilesAPI.getInfoMe,
  });

  const {
    data: queueStatus,
  } = useQuery({
    queryKey: ["my-queue-position"],
    queryFn: QueueAPI.getMyPosition,
    refetchInterval: 5000,
  });

  const {mutate: checkinMutate, isPending: isCheckinLoading} = useMutation({
    mutationFn: () => QueueAPI.checkIn(),
  });

  const {mutate: cancelMutate, isPending: isCancelLoading} = useMutation({
    mutationFn: QueueAPI.cancel,
  });

  const isInQueue = queueStatus?.status === "in_queue";

  return (
    <Card className="w-full rounded-xl shadow-sm border border-border/40 gap-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl justify-between font-semibold text-foreground flex flex-col lg:flex-row w-full">
          <h2>
            Suas informações
          </h2>

          <Button
            onClick={() => {
              if (isInQueue) {
                cancelMutate();
              } else {
                checkinMutate();
              }
            }}
            disabled={isCheckinLoading || isCancelLoading}
          >
            {isCheckinLoading
              ? "Realizando check-in..."
              : isCancelLoading
                ? "Cancelando..."
                : isInQueue
                  ? "Cancelar check-in"
                  : "Fazer check-in"}
          </Button>
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent>
        {isPending
          ? (
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            )
          : (
              <>
                <div className="grid grid-cols-2 gap-4 pt-5 text-sm">
                  <InfoItem label="Nome completo" value={data?.full_name} />
                  <InfoItem label="Documento" value={data?.document_number} />
                  <InfoItem label="Data de nascimento" value={data?.date_of_birth} />
                  <InfoItem label="Gênero" value={data?.gender} />
                  <InfoItem label="Nacionalidade" value={data?.nationality} />
                  <InfoItem label="Endereço" value={data?.address} />
                  <InfoItem label="Nome da mãe" value={data?.mom_full_name} />
                  <InfoItem
                    label="Prioritário?"
                    value={data?.priority ? "Sim" : "Não"}
                  />
                </div>

                {/* 🔥 MOSTRAR POSIÇÃO NA FILA */}
                {isInQueue && (
                  <div className="mt-6 p-3 rounded-md bg-blue-100 text-blue-900 text-center font-medium">
                    Você está na posição
                    {" "}
                    <strong>{queueStatus.position}</strong>
                    {" "}
                    da fila
                  </div>
                )}
              </>
            )}
      </CardContent>
    </Card>
  );
};

const InfoItem = ({label, value }: {label: string; value?: string}) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className="text-foreground font-medium">{value ?? "-"}</span>
  </div>
);
