import {User} from "lucide-react";

import {type ProfilesSummary} from "@/api/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {formatCPF, formatDateToBR} from "@/utils/functions";

interface CardInfoPatientProps {
  data: ProfilesSummary | undefined;
  isPending?: boolean;
}
export const CardInfoPatient = ({data, isPending}: CardInfoPatientProps) => {
  const verifyGender = (gender: string) => {
    if (gender === "F") {
      return "Feminino";
    } else if (gender === "M") {
      return "Masculino";
    } else {
      return "";
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full mt-2 rounded-xl shadow-sm border border-border/50 bg-card text-card-foreground gap-3">
        <CardHeader className="flex flex-row items-center gap-3">
          <User className="h-6 w-6 text-blue-600" />
          {" "}
          <CardTitle className="text-lg font-medium">
            Informações Pessoais
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {isPending
            ? (
                <div className="flex flex-col gap-6">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )
            : (
                <div className="flex flex-col gap-4">
                  <InfoItem label="Nome completo" value={data?.full_name} />
                  <InfoItem
                    label="Data de nascimento"
                    value={formatDateToBR(data?.date_of_birth ?? "")}
                  />
                  <InfoItem
                    label="Documento (CPF)"
                    value={formatCPF(data?.document_number ?? "")}
                  />
                  <InfoItem label="Gênero" value={verifyGender(data?.gender ?? "")} />
                  <InfoItem label="Nacionalidade" value={data?.nationality} />
                  <InfoItem label="Endereço" value={data?.address} />
                  <InfoItem label="Nome da mãe" value={data?.mom_full_name} />
                  <InfoItem
                    label="Prioritário"
                    value={data?.priority ? "Sim" : "Não"}
                  />
                </div>
              )}
        </CardContent>
      </Card>
    </div>

  );
};

const InfoItem = ({label, value }: {label: string; value?: string}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground font-normal">{label}</span>
    <span className="text-base font-medium text-foreground line-clamp-2">
      {value ?? "-"}
    </span>
  </div>
);
