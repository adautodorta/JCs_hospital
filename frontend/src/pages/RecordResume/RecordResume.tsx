import {useQuery} from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Pill,
  User,
  ClipboardList,
} from "lucide-react";
import {useMemo} from "react";
import {useNavigate, useParams} from "react-router";

import {ProfilesAPI, RecordsAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {formatDateTime} from "@/utils/functions";
import routes from "@/utils/routes";

const LoadingSkeleton = () => (
  <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl" />
);

export const RecordResume = () => {
  const {recordId} = useParams();
  const navigate = useNavigate();

  const {data: record, isLoading: isLoadingRecord} = useQuery({
    queryKey: ["record", recordId],
    queryFn: () => RecordsAPI.getRecordById(recordId ?? ""),
    enabled: !!recordId,
  });

  const {data: profiles, isLoading: isLoadingProfiles} = useQuery({
    queryKey: ["profiles"],
    queryFn: ProfilesAPI.getAllProfiles,
  });

  const doctorName = useMemo(() => {
    if (!record || !profiles) {
      return "Carregando...";
    }
    const doctor = profiles.find(p => p.id === record.doctor_id);
    return doctor ? doctor.full_name : "Médico não identificado";
  }, [record, profiles]);

  const isLoading = isLoadingRecord || isLoadingProfiles;

  if (!isLoading && !record) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
        <p>Atendimento não encontrado.</p>
        <Button variant="link" onClick={() => void navigate(routes.DASHBOARD)}>
          Voltar ao início
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center mb-12">
      <div className="w-full max-w-[369px] flex flex-col items-center lg:items-start lg:max-w-[800px]">

        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent cursor-pointer mb-6 text-gray-600 hover:text-black gap-2"
          onClick={() => void navigate(routes.DASHBOARD)}
        >
          <ArrowLeft size={20} />
          Voltar para meus atendimentos
        </Button>

        {isLoading
          ? (
              <LoadingSkeleton />
            )
          : (
              <div className="w-full flex flex-col gap-6">

                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <ClipboardList size={24} />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">
                          Resumo do Atendimento
                        </h1>
                        <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm font-medium">
                          <Calendar size={14} />
                          {record?.end_at
                            ? formatDateTime(record.end_at)
                            : formatDateTime(record?.started_at ?? "")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg md:self-center">
                      <div className="w-8 h-8 bg-white border rounded-full flex items-center justify-center text-gray-500">
                        <User size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Médico Responsável</span>
                        <span className="text-sm font-medium text-gray-900">{doctorName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <Pill className="absolute -right-6 -bottom-6 text-blue-500/20 w-48 h-48 rotate-12" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Pill className="text-white w-6 h-6" />
                      </div>
                      <h2 className="text-lg font-bold tracking-wide">Prescrição & Orientações</h2>
                    </div>

                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-md border border-white/10">
                      <p className="text-blue-50 text-base leading-relaxed whitespace-pre-wrap">
                        {record?.planning ?? "Nenhuma prescrição registrada."}
                      </p>
                    </div>

                    <p className="text-blue-200 text-xs mt-4 text-center lg:text-left opacity-80">
                      Siga rigorosamente as orientações médicas. Em caso de dúvidas, entre em contato com a clínica.
                    </p>
                  </div>
                </div>

              </div>
            )}
      </div>
    </div>
  );
};
