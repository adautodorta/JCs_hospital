import {useQuery} from "@tanstack/react-query";
import {Pill, Stethoscope} from "lucide-react";
import {useMemo} from "react";

import {ProfilesAPI, RecordsAPI} from "@/api/api";
import {InfoMessage} from "@/components/custom/InfoMessage";
import {formatDateTime} from "@/utils/functions";

export function RecordsList({patientId }: {patientId: string}) {
  const {data: records, isLoading} = useQuery({
    queryKey: ["records", patientId],
    queryFn: () => RecordsAPI.getRecordsByPatientId(patientId),
    enabled: !!patientId,
  });

  const {data: profiles} = useQuery({
    queryKey: ["profiles"],
    queryFn: ProfilesAPI.getAllProfiles,
  });

  const doctorMap = useMemo(() => {
    if (!profiles) {
      return {};
    }
    return profiles.reduce<Record<string, string>>((acc, p) => {
      acc[p.id] = p.full_name;
      return acc;
    }, {});
  }, [profiles]);

  if (isLoading) {
    return <div className="flex flex-col gap-6 mt-4 mb-24">Carregando...</div>;
  }

  if (!records?.length) {
    return (
      <InfoMessage message="Nenhum registro médico foi encontrado para este paciente." />
    );
  }

  const sortedRecords = [...records].sort(
    (a, b) =>
      new Date(b.started_at).getTime()
        - new Date(a.started_at).getTime(),
  );

  return (
    <div className="flex flex-col gap-6 mt-4">
      {sortedRecords.map(record => (
        <div key={record.id} className="border rounded-xl p-6 shadow-none bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Stethoscope className="text-green-600" size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">
                {formatDateTime(record.end_at)}
              </h3>
              <span className="text-sm text-gray-500">Emergência</span>
            </div>
            <div className="ml-auto text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Consulta
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Médico Responsável</p>
            <p>{doctorMap[record.doctor_id] ?? "Médico não encontrado"}</p>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Observações</p>
            <p>{record.subjective}</p>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Exames</p>
            <p>{record.objective_data}</p>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Diagnóstico</p>
            <p>{record.assessment}</p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl flex gap-2">
            <Pill className="text-blue-600 shrink-0" size={20} />
            <div>
              <p className="font-medium">Prescrição</p>
              <p className="text-blue-700">{record.planning}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
