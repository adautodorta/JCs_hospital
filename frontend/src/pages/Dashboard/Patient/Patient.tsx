import {useQuery} from "@tanstack/react-query";
import {LogOut} from "lucide-react";

import {CheckinSection} from "./components/CheckinSection";
import {RecordsList} from "./components/RecordsList";
import {CardInfoPatient} from "../../../components/custom/CardInfoPatient";

import {ProfilesAPI} from "@/api/api";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {supabase} from "@/supabaseClient";
import {getFirstTwoNames} from "@/utils/functions";

export const PatientDashboard = () => {
  const {data, isPending} = useQuery({
    queryKey: ["info-patient"],
    queryFn: ProfilesAPI.getInfoMe,
  });

  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-center lg:items-start lg:max-w-[954px]">
        <h2 className="text-2xl font-medium mb-4 w-full">
          Bem vindo(a),
          {" "}
          {getFirstTwoNames(data?.full_name ?? "")}
        </h2>
        <CheckinSection />
        <Separator className="mb-5 mt-5" />
        <CardInfoPatient data={data} isPending={isPending} />
        <Separator className="mb-5 mt-5" />
        <RecordsList />
        <Button className="cursor-pointer w-full mt-7 mb-42" variant="destructive" size="sm" onClick={() => void supabase.auth.signOut()}>
          <LogOut />
          Sair
        </Button>
      </div>
    </div>
  );
};
