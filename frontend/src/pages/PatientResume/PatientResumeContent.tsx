import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router";

import {ProfilesAPI} from "@/api/api";

export const PatientResumeContent = () => {
  const {patientId} = useParams<{patientId: string}>();

  const {data: patient, isLoading} = useQuery({
    queryKey: ["profile", patientId],
    queryFn: () => ProfilesAPI.getProfileById(patientId ?? ""),
    enabled: !!patientId,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-center lg:items-start lg:max-w-[954px]">
        <span className="text-blue-600 font-semibold">
          {patient?.full_name
            .split(" ")
            .map(n => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <h2 className="text-2xl font-medium mb-4 self-start">
          Pacientes
        </h2>
        <div>
          Informações do paciente
          {patientId}
        </div>
      </div>
    </div>
  );
};
