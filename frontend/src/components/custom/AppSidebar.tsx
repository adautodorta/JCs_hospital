import {
  LayoutDashboard,
  Users,
} from "lucide-react";

import IconLogo from "./../../assets/icon.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: Users,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent className="mt-4">

        <div className="flex items-center gap-3 px-4 pb-4 mb-4 border-b">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <img
              className="p-1"
              src={IconLogo}
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-900 text-sm">JCS Hospital</span>
            <span className="text-gray-500 text-xs">Jesus Cristo Salva</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                    >
                      <a href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
