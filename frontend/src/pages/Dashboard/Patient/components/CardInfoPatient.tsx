import {useQuery} from "@tanstack/react-query";

import {ProfilesAPI} from "@/api/api";
import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {formatCPF, formatDateToBR, getFirstTwoNames} from "@/utils/functions";

export const CardInfoPatient = () => {
  const {data, isPending} = useQuery({
    queryKey: ["info-patient"],
    queryFn: ProfilesAPI.getInfoMe,
  });

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
      <h2 className="text-2xl font-medium mb-4">
        Bem vindo(a),
        {" "}
        {getFirstTwoNames(data?.full_name ?? "")}
      </h2>

      <Card className="w-full rounded-xl shadow-none border border-border/40 gap-0 p-5">
        <CardContent className="p-0">
          {isPending
            ? (
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              )
            : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <InfoItem label="Nome completo" value={data?.full_name} />
                    <InfoItem label="Documento" value={formatCPF(data?.document_number ?? "")} />
                    <InfoItem label="Data de nascimento" value={formatDateToBR(data?.date_of_birth ?? "")} />
                    <InfoItem label="Gênero" value={verifyGender(data?.gender ?? "")} />
                    <InfoItem label="Nacionalidade" value={data?.nationality} />
                    <InfoItem label="Endereço" value={data?.address} />
                    <InfoItem label="Nome da mãe" value={data?.mom_full_name} />
                    <InfoItem
                      label="Prioritário"
                      value={data?.priority ? "Sim" : "Não"}
                    />
                  </div>
                </>
              )}
        </CardContent>
      </Card>
    </div>

  );
};

const InfoItem = ({label, value }: {label: string; value?: string}) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className="text-foreground font-medium">{value ?? "-"}</span>
  </div>
);
