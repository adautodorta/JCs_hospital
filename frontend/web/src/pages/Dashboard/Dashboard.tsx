import {AdminDashboard} from "./Admin/Admin";
import {DoctorDashboard} from "./Doctor/Doctor";
import {PatientDashboard} from "./Patient/Patient";

import {AppSidebar} from "@/components/custom/AppSidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {useRoleStore} from "@/store";

export const Dashboard = () => {
  const role = useRoleStore(state => state.role);

  switch (role) {
    case "patient":
      return <PatientDashboard />;
    case "doctor":
      return (
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger />
            <DoctorDashboard />
          </main>
        </SidebarProvider>
      );
    case "admin":
      return <AdminDashboard />;
    default:
      return <PatientDashboard />;
  }
};
