import {PatientResumeContent} from "./PatientResumeContent";

import {AppSidebar} from "@/components/custom/AppSidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export const PatientResume = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <PatientResumeContent />
      </main>
    </SidebarProvider>
  );
};
