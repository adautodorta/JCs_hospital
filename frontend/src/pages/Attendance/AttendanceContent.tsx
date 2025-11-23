import {useMutation, useQuery} from "@tanstack/react-query";
import {
  Activity,
  ClipboardList,
  Pill,
  Save,
  User,
  FileText,
  InfoIcon,
} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router";
import {toast} from "sonner";

import {RecordsList} from "../PatientResume/components/RecordList";

import {AttendanceAPI, ProfilesAPI, QueueAPI} from "@/api/api";
import {CardInfoPatient} from "@/components/custom/CardInfoPatient";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Spinner} from "@/components/ui/spinner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {formatCPF} from "@/utils/functions";
import routes from "@/utils/routes";

export const AttendanceContent = () => {
  const navigate = useNavigate();
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [planning, setPlanning] = useState("");

  const {data: me} = useQuery({
    queryKey: ["info-doctor"],
    queryFn: ProfilesAPI.getInfoMe,
  });
  const {data: queue} = useQuery({
    queryKey: ["all-queue"],
    queryFn: QueueAPI.getAllQueue,
    refetchInterval: 10000,
  });
  const currentPatientId = queue?.find(q => q.assigned_doctor_id === me?.id)?.profile_id;

  const {data: patient, isLoading} = useQuery({
    queryKey: ["profile", currentPatientId],
    queryFn: () => ProfilesAPI.getProfileById(currentPatientId ?? ""),
    enabled: !!currentPatientId,
  });

  const {mutate: finishMutate, isPending} = useMutation({
    mutationFn: async (data: {
      subjective: string;
      objective_data: string;
      assessment: string;
      planning: string;
    }) => {
      return AttendanceAPI.finish(data);
    },

    onSuccess: () => {
      toast.success("Atendimento finalizado com sucesso!");
      setSubjective("");
      setObjective("");
      setAssessment("");
      setPlanning("");
      void navigate(routes.DASHBOARD);
    },
    onError: () => {
      toast.error("Erro ao finalizar atendimento.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    finishMutate({
      subjective,
      objective_data: objective,
      assessment,
      planning,
    });
  };

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-start lg:max-w-[954px]">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-7">
          <InfoIcon className="text-primary" />
          Informações do Paciente
        </h2>
        {!patient
          ? (
              <div className="w-full flex flex-row gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />

                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </div>
            )
          : (
              <div className="w-full flex flex-row gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {patient.full_name
                      .split(" ")
                      .map(n => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-medium self-start">
                    {patient.full_name}
                  </h2>
                  <span>
                    CPF:
                    {" "}
                    {formatCPF(patient.document_number)}
                  </span>
                </div>
              </div>
            )}

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
            <div className="w-full">
              <CardInfoPatient data={patient} isPending={isLoading} />
            </div>
          </TabsContent>
          <TabsContent value="records">
            <RecordsList patientId={patient?.id ?? ""} />
          </TabsContent>
        </Tabs>

        <Separator className="mt-7 mb-7" />

        <div className="flex w-full justify-between mb-7 flex-col lg:flex-row">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="text-primary" />
              Prontuário Eletrônico
            </h2>
            <p className="text-muted-foreground">
              Preencha os dados seguindo o modelo SOAP.
            </p>
          </div>
          <Button disabled={isPending} onClick={handleSubmit} className="mt-4">
            {isPending
              ? (
                  <>
                    <Spinner className="mr-2" />
                    {" "}
                    Salvando...
                  </>
                )
              : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {" "}
                    Finalizar Atendimento
                  </>
                )}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
                <User className="w-5 h-5" />
                S - Subjetivo
              </CardTitle>
              <CardDescription>
                Queixa principal, história da doença atual, história médica pregressa e outros...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="subjective">Anamnese</Label>
                <Textarea
                  id="subjective"
                  placeholder="Descreva a queixa principal e o histórico relatado..."
                  className="min-h-[120px] resize-y"
                  value={subjective}
                  onChange={(e) => {
                    setSubjective(e.target.value);
                  }}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                <Activity className="w-5 h-5" />
                O - Objetivo
              </CardTitle>
              <CardDescription>
                Informações obtidas por meio do exame físico e de exames complementares.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="objective">Exame Físico Geral/Específico</Label>
                <Textarea
                  id="objective"
                  placeholder="Estado geral, ausculta, palpação, inspeção..."
                  className="min-h-[100px]"
                  value={objective}
                  onChange={(e) => {
                    setObjective(e.target.value);
                  }}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-600">
                <ClipboardList className="w-5 h-5" />
                A - Avaliação
              </CardTitle>
              <CardDescription>
                Interpretação clínica das informações coletadas nas etapas Subjetiva e Objetiva.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="assessment">Hipótese Diagnóstica / CID</Label>
                <Textarea
                  id="assessment"
                  placeholder="Conclusão clínica..."
                  className="min-h-20"
                  value={assessment}
                  onChange={(e) => {
                    setAssessment(e.target.value);
                  }}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
                <Pill className="w-5 h-5" />
                P - Plano
              </CardTitle>
              <CardDescription>
                Conduta, prescrições, exames solicitados e orientações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="planning">Conduta Terapêutica</Label>
                <Textarea
                  id="planning"
                  placeholder="Medicamentos prescritos, encaminhamentos, retorno..."
                  className="min-h-[120px]"
                  value={planning}
                  onChange={(e) => {
                    setPlanning(e.target.value);
                  }}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isPending} className="mb-24">
              {isPending ? <Spinner /> : "Finalizar Atendimento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
