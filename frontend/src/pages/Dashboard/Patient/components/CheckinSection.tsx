import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {QueueAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";

export const CheckinSection = () => {
  const queryClient = useQueryClient();

  const {
    data: queueStatus,
  } = useQuery({
    queryKey: ["my-queue-position"],
    queryFn: QueueAPI.getMyPosition,
    refetchInterval: 10000,
  });

  const {mutate: checkinMutate, isPending: isCheckinLoading} = useMutation({
    mutationFn: () => QueueAPI.checkIn(),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ["my-queue-position"]});
      toast.success("Você entrou na fila de espera.");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao tentar realizar o check-in");
    },
  });

  const {mutate: cancelMutate, isPending: isCancelLoading} = useMutation({
    mutationFn: QueueAPI.cancel,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ["my-queue-position"]});
      toast.success("Você cancelou seu check-in.");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao tentar cancelar o check-in");
    },
  });

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
