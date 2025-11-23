import {useQuery} from "@tanstack/react-query";

import {RecordItem} from "./RecordItem";

import {RecordsAPI} from "@/api/api";
import {InfoMessage} from "@/components/custom/InfoMessage";
import {Skeleton} from "@/components/ui/skeleton";

export const RecordsList = () => {
  const {
    data: records = [],
    isPending: recordsPending,
  } = useQuery({
    queryKey: ["medical-records"],
    queryFn: () => RecordsAPI.getRecordsMe(),
  });

  if (recordsPending) {
    return (
      <div className="w-full mt-6">
        <Skeleton className="h-6 w-40 mb-4 bg-input-foreground" />
        <div className="space-y-3">
          {Array.from({length: 5}).map((_, index) => (
            <Skeleton key={index} className="w-full h-20 rounded-lg bg-input-foreground" />
          ))}
        </div>
      </div>
    );
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
  );

  return (
    <div className="w-full mt-4">
      <div className="mb-4">
        <h2 className="text-base font-normal leading-none text-muted-foreground">
          Últimos atendimentos
        </h2>
      </div>

      {sortedRecords.length === 0
        ? (
            <InfoMessage message="Você não possui nenhum registro médico de atendimento." />
          )
        : (
            <div className="flex flex-col">
              {sortedRecords.map(record => (
                <RecordItem
                  key={record.id}
                  record={record}
                />
              ))}
            </div>
          )}
    </div>
  );
};
