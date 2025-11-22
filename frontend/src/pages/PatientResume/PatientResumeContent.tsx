import {useQuery} from "@tanstack/react-query";
import {Activity, User} from "lucide-react";
import {useParams} from "react-router";

import {RecordsList} from "./components/RecordList";
import {CardInfoPatient} from "../../components/custom/CardInfoPatient";

import {ProfilesAPI} from "@/api/api";
import {Spinner} from "@/components/ui/spinner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {formatCPF} from "@/utils/functions";

export const PatientResumeContent = () => {
  const {patientId} = useParams<{patientId: string}>();

  const {data: patient, isLoading} = useQuery({
    queryKey: ["profile", patientId],
    queryFn: () => ProfilesAPI.getProfileById(patientId ?? ""),
    enabled: !!patientId,
  });

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-start lg:max-w-[954px]">
        {isLoading
          ? (
              <div>
                <Spinner />
              </div>
            )
          : (
              <>
                <div className="w-full flex flex-row gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {patient?.full_name
                        .split(" ")
                        .map(n => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-medium self-start">
                      {patient?.full_name}
                    </h2>
                    <span>
                      CPF:
                      {" "}
                      {formatCPF(patient?.document_number ?? "")}
                    </span>
                  </div>
                </div>

                <Tabs className="mt-7 w-full" defaultValue="account">
                  <TabsList className="gap-1 rounded-full">
                    <TabsTrigger value="account" className="flex gap-4 rounded-full">
                      <User />
                      Dados Pessoais
                    </TabsTrigger>
                    <TabsTrigger value="records" className="flex gap-4">
                      <Activity />
                      Histórico Médico
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <CardInfoPatient data={patient} isPending={isLoading} />
                  </TabsContent>
                  <TabsContent value="records">
                    <RecordsList patientId={patientId ?? ""} />
                  </TabsContent>
                </Tabs>
              </>
            )}
      </div>
    </div>
  );
};
