import {useQuery} from "@tanstack/react-query";
import {Calendar, Eye, Search} from "lucide-react";
import {useState, useMemo} from "react";
import {useNavigate} from "react-router";

import {ProfilesAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Spinner} from "@/components/ui/spinner";
import {formatCPF, formatDateToBR} from "@/utils/functions";
import routes from "@/utils/routes";

export const PatientContent = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {data: profiles, isPending} = useQuery({
    queryKey: ["all-profiles-patient"],
    queryFn: ProfilesAPI.getAllProfiles,
    refetchInterval: 60000,
  });

  const patients = useMemo(() => {
    return profiles?.filter(p => p.role === "patient") ?? [];
  }, [profiles]);

  const filteredPatients = useMemo(() => {
    const term = search.toLowerCase();

    return patients.filter(p =>
      p.full_name.toLowerCase().includes(term)
      || p.document_number.toLowerCase().includes(term),
    );
  }, [patients, search]);

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-center lg:items-start lg:max-w-[954px]">

        <h2 className="text-2xl font-medium mb-4 self-start">
          Pacientes
        </h2>

        <Separator className="mb-6" />

        <div className="w-full mb-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {isPending
          ? (
              <div className="w-full flex justify-center py-10">
                <Spinner />
              </div>
            )
          : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-24">

                {filteredPatients.length === 0 && (
                  <p className="text-sm text-muted-foreground pl-1">
                    Nenhum paciente encontrado.
                  </p>
                )}

                {filteredPatients.map(patient => (
                  <Card
                    key={patient.id}
                    className="p-6 shadow-none transition-shadow rounded-xl border"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {patient.full_name
                              .split(" ")
                              .map(n => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-gray-900 font-medium">{patient.full_name}</h3>

                          <p className="text-gray-600 text-sm">
                            CPF:
                            {" "}
                            {formatCPF(patient.document_number)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Data de Nascimento:
                          {" "}
                          {formatDateToBR(patient.date_of_birth)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => void navigate(`${routes.PATIENTS}/${patient.id}`)}
                      variant="outline"
                      className="w-full cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Prontuário
                    </Button>
                  </Card>

                ))}

              </div>
            )}

      </div>
    </div>
  );
};
