import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {QueueAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";

/**
 * Componente de Check-in na Fila de Atendimento
 * 
 * Regras de Negócio Implementadas:
 * 1. Paciente pode fazer check-in apenas se não estiver na fila
 * 2. Paciente pode cancelar check-in apenas se estiver aguardando
 * 3. Posição na fila é atualizada automaticamente a cada 10 segundos
 * 4. Status da fila: "not_in_queue", "waiting", "called"
 * 
 * Estados da Fila:
 * - "not_in_queue": Paciente não está na fila (pode fazer check-in)
 * - "waiting": Paciente está aguardando (mostra posição, pode cancelar)
 * - "called": Paciente foi chamado (não pode cancelar, apenas visualizar)
 */
export const CheckinSection = () => {
  const queryClient = useQueryClient();

  /**
   * Consulta a posição do paciente na fila
   * Atualiza automaticamente a cada 10 segundos para manter informação atualizada
   * Considera priorização: pacientes prioritários aparecem primeiro
   */
  const {
    data: queueStatus,
  } = useQuery({
    queryKey: ["my-queue-position"],
    queryFn: QueueAPI.getMyPosition,
    refetchInterval: 10000, // Atualiza a cada 10 segundos
  });

  /**
   * Mutation para realizar check-in na fila
   * Regra: Registra paciente na fila com status "waiting"
   * Timezone: Backend registra automaticamente no timezone de Fortaleza
   */
  const {mutate: checkinMutate, isPending: isCheckinLoading} = useMutation({
    mutationFn: () => QueueAPI.checkIn(),
    onSuccess: () => {
      // Invalida cache para atualizar posição imediatamente
      void queryClient.invalidateQueries({queryKey: ["my-queue-position"]});
      toast.success("Você entrou na fila de espera.");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao tentar realizar o check-in");
    },
  });

  /**
   * Mutation para cancelar check-in
   * Regra: Remove paciente da fila completamente
   * Não permite cancelamento se paciente já estiver em atendimento
   */
  const {mutate: cancelMutate, isPending: isCancelLoading} = useMutation({
    mutationFn: QueueAPI.cancel,
    onSuccess: () => {
      // Invalida cache para atualizar status imediatamente
      void queryClient.invalidateQueries({queryKey: ["my-queue-position"]});
      toast.success("Você cancelou seu check-in.");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao tentar cancelar o check-in");
    },
  });

  // Renderização condicional baseada no status da fila
  // Regra: Interface muda conforme o estado do paciente na fila

  // Estado: Paciente não está na fila - permite fazer check-in
  if (queueStatus?.status === "not_in_queue") {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="pt-5 mb-2">
          <h2 className="text-base font-normal leading-none text-muted-foreground">
            Fila de espera
          </h2>
        </div>
        <MessageQueue status={queueStatus.status} position={queueStatus.position ?? ""} />
        <Button
          className="w-full cursor-pointer"
          onClick={() => {
            checkinMutate();
          }}
        >
          {isCheckinLoading
            ? <Spinner />
            : "Fazer check-in"}
        </Button>
      </div>
    );
  }

  // Estado: Paciente está aguardando - mostra posição e permite cancelar
  // Regra: Posição considera priorização (pacientes prioritários primeiro)
  if (queueStatus?.status === "waiting") {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="pt-5 mb-2">
          <h2 className="text-base font-normal leading-none text-muted-foreground">
            Fila de espera
          </h2>
        </div>
        <MessageQueue status={queueStatus.status} position={queueStatus.position ?? ""} />
        <Button
          className="w-full cursor-pointer"
          onClick={() => {
            cancelMutate();
          }}
        >
          {isCancelLoading
            ? <Spinner />
            : "Cancelar check-in"}
        </Button>
      </div>
    );
  }

  // Estado: Paciente foi chamado - apenas visualização, sem ações
  // Regra: Não permite cancelamento quando já está sendo atendido
  if (queueStatus?.status === "called") {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="pt-5 mb-2">
          <h2 className="text-base font-normal leading-none text-muted-foreground">
            Fila de espera
          </h2>
        </div>
        <MessageQueue status={queueStatus.status} position={queueStatus.position ?? ""} />
      </div>
    );
  }
};

interface MessageQueueProps {
  status: string;
  position: string | number;
}

const MessageQueue = ({status, position}: MessageQueueProps) => {
  const called = status === "called";

  const getMessagePersonalized = () => {
    if (status === "not_in_queue") {
      return "Você não está na fila de espera";
    } else if (status === "waiting") {
      return `Você está na posição ${String(position)} da fila.`;
    }
  };

  return (
    <>
      {called
        ? (
            <div className="p-3 rounded-md bg-green-100 text-green-600 text-center font-medium">
              Chegou a sua vez
            </div>
          )
        : (
            <div className="p-3 rounded-md bg-blue-100 text-blue-900 text-center font-medium">
              {getMessagePersonalized()}
            </div>
          )}
    </>
  );
};
