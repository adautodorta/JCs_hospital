import {useQuery} from "@tanstack/react-query";
import {Calendar, FileText} from "lucide-react";

import {RecordsAPI} from "@/api/api";

export function RecordsList({patientId }: {patientId: string}) {
  const {data: records, isLoading} = useQuery({
    queryKey: ["records", patientId],
    queryFn: () => RecordsAPI.getRecordsByPatientId(patientId),
    enabled: !!patientId,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }
  if (!records?.length) {
    return <p>Nenhum registro encontrado.</p>;
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      {records.map(record => (
        <div key={record.id} className="border rounded-xl p-6 shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="text-green-600" size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">
                Date
              </h3>
              <span className="text-sm text-gray-500">Cardiologia</span>
            </div>
            <div className="ml-auto text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Consulta
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Médico Responsável</p>
            <p className="font-medium">Dr. Carlos Mendes</p>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Diagnóstico</p>
            <p>{record.assessment}</p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl flex gap-2">
            <FileText className="text-blue-600" size={20} />
            <div>
              <p className="font-medium">Prescrição</p>
              <p className="text-blue-700 underline">{record.planning}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">Observações</p>
            <p>{record.subjective}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
