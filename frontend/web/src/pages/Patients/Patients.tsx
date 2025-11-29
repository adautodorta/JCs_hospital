import {PatientContent} from "./PatientContent";

import {AppSidebar} from "@/components/custom/AppSidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export const Patients = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <PatientContent />
      </main>
    </SidebarProvider>
  );
};
