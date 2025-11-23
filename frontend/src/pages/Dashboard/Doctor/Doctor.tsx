import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router";

import {CardInfoGlobal} from "./Components/CardInfoGlobal";
import {CardQueue} from "./Components/CardQueue";

import {ProfilesAPI, QueueAPI, RecordsAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Spinner} from "@/components/ui/spinner";
import {getFirstTwoNames} from "@/utils/functions";
import routes from "@/utils/routes";

export const DoctorDashboard = () => {
  const navigate = useNavigate();

  const {data, isPending} = useQuery({
    queryKey: ["info-doctor"],
    queryFn: ProfilesAPI.getInfoMe,
  });

  const {data: allProfiles} = useQuery({
    queryKey: ["all-profiles"],
    queryFn: ProfilesAPI.getAllProfiles,
    refetchInterval: 60000,
  });

  const {data: allQueue} = useQuery({
    queryKey: ["all-queue"],
    queryFn: QueueAPI.getAllQueue,
    refetchInterval: 60000,
  });

  const {data: allRecords} = useQuery({
    queryKey: ["all-records"],
    queryFn: RecordsAPI.getAllRecords,
    refetchInterval: 60000,
  });

  const {mutate: callNextMutate, isPending: isCallingNext} = useMutation({
    mutationFn: QueueAPI.callNext,
    onSuccess: (resp) => {
      const attendanceId = resp.called?.id;

      if (!attendanceId) {
        console.error("Erro: id do atendimento não veio na resposta");
        return;
      }

      void navigate(
        routes.ATTENDANCE.replace(":attendanceId", attendanceId),
      );
    },
  });

  const patients = allProfiles?.filter(p => p.role === "patient") ?? [];
  const patientsWaiting = allQueue ?? [];
  const patientsToday
    = allRecords?.filter((record) => {
      if (!record.started_at) {
        return false;
      }

      const recordDate = new Date(record.started_at);
      const today = new Date();

      return (
        recordDate.getFullYear() === today.getFullYear()
        && recordDate.getMonth() === today.getMonth()
        && recordDate.getDate() === today.getDate()
      );
    }) ?? [];

  const verifyGender = (gender: string) => {
    if (gender === "F") {
      return "Bem vinda, Dra ";
    } else if (gender === "M") {
      return "Bem vindo, Dr ";
    } else {
      return "";
    }
  };

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-center lg:items-start lg:max-w-[954px]">
        {isPending
          ? (
              <Spinner />
            )
          : (
              <div className="w-full">
                <h2 className="text-2xl font-medium">
                  {verifyGender(data?.gender ?? "")}
                  {getFirstTwoNames(data?.full_name ?? "")}
                  .
                </h2>

                <Separator className="mt-5 mb-5" />

                <div className="mb-3">
                  <h2 className="text-base font-normal leading-none text-muted-foreground">
                    Visão Geral
                  </h2>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-4">
                  <CardInfoGlobal
                    title="Total Pacientes"
                    total={patients.length}
                    iconName="Users"
                    iconBgColor="bg-green-100"
                    iconTextColor="text-green-600"
                  />
                  <CardInfoGlobal
                    title="Aguardando"
                    total={patientsWaiting.length}
                    iconName="TimerIcon"
                    iconBgColor="bg-orange-100"
                    iconTextColor="text-orange-600"
                  />
                  <CardInfoGlobal
                    title="Pacientes hoje"
                    total={patientsToday.length}
                    iconName="TrendingUp"
                    iconBgColor="bg-purple-100"
                    iconTextColor="text-purple-600"
                  />
                </div>

                <Separator className="mt-5 mb-5" />

                <div className="mb-3 flex flex-row justify-between items-center">
                  <h2 className="text-base font-normal leading-none text-muted-foreground">
                    Pacientes na Fila
                  </h2>
                  <Button
                    disabled={isCallingNext || !patientsWaiting.length}
                    onClick={() => {
                      callNextMutate();
                    }}
                  >
                    {isCallingNext ? <Spinner /> : "Iniciar atendimento"}
                  </Button>
                </div>

                <CardQueue queue={patientsWaiting} profiles={patients} />
              </div>
            )}
      </div>
    </div>
  );
};
