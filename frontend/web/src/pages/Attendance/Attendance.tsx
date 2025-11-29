import {AttendanceContent} from "./AttendanceContent";

import {AppSidebar} from "@/components/custom/AppSidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export const Attendance = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <AttendanceContent />
      </main>
    </SidebarProvider>
  );
};
