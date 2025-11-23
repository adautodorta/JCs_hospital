import {useMutation} from "@tanstack/react-query";
import {
  Activity,
  ClipboardList,
  Pill,
  Save,
  User,
  FileText,
} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {supabase} from "@/supabaseClient";

export const AttendanceContent = () => {
  const [subjective, setSubjective] = useState("");
  const [physicalExam, setPhysicalExam] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");

  const {mutate: saveRecordMutate, isPending: isSaving} = useMutation({
    mutationFn: async (data: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    }) => {
      const {error} = await supabase.from("medical_records").insert({
        subjective: data.subjective,
        objective_data: data.objective,
        assessment: data.assessment,
        plan: data.plan,
        created_at: new Date(),
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      toast.success("Prontuário salvo com sucesso!");
    },
    onError: (err) => {
      console.error("Erro ao salvar (Simulação):", err);
      toast.error("Erro ao salvar prontuário. Verifique o console.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    saveRecordMutate({
      subjective,
      objective: physicalExam,
      assessment,
      plan,
    });
  };

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-start lg:max-w-[954px]">
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
          <Button disabled={isSaving} onClick={handleSubmit} className="mt-4">
            {isSaving
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
                  disabled={isSaving}
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
                <Label htmlFor="physicalExam">Exame Físico Geral/Específico</Label>
                <Textarea
                  id="physicalExam"
                  placeholder="Estado geral, ausculta, palpação, inspeção..."
                  className="min-h-[100px]"
                  value={physicalExam}
                  onChange={(e) => {
                    setPhysicalExam(e.target.value);
                  }}
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                <Label htmlFor="plan">Conduta Terapêutica</Label>
                <Textarea
                  id="plan"
                  placeholder="Medicamentos prescritos, encaminhamentos, retorno..."
                  className="min-h-[120px]"
                  value={plan}
                  onChange={(e) => {
                    setPlan(e.target.value);
                  }}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isSaving} className="mb-24">
              {isSaving ? <Spinner /> : "Finalizar Atendimento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
