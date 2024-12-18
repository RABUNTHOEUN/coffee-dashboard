// import { AppSidebar } from "@/components/app-sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"

// export default function Page() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">
//                     Building Your Application
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Data Fetching</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//             <div className="aspect-video rounded-xl bg-muted/50" />
//             <div className="aspect-video rounded-xl bg-muted/50" />
//             <div className="aspect-video rounded-xl bg-muted/50" />
//           </div>
//           <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }



// "use client";

// import React from "react";
// import { useUserContext } from "../context/UserContext";

// const Dashboard = () => {
//   const { isAuthenticated, login, logout } = useUserContext();

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
//       <button onClick={login}>Login</button>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };

// export default Dashboard;


import { AreaChartComponent } from '@/components/area-chart'
import { AreaChartInteractiveComponent } from '@/components/area-chart-interactive'
import { BarChartComponent } from '@/components/bar-chart'
import { PieChartComponent } from '@/components/pie-chart'
import React from 'react'
import Invoice from '../invoice/page'

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white mb-4 ml-4">
        Dashboard
      </h1>
      
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50"><AreaChartComponent /></div>
        <div className="aspect-video rounded-xl bg-muted/50"><BarChartComponent /></div>
        <div className="aspect-video rounded-xl bg-muted/50"><PieChartComponent /></div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min my-4">
        <AreaChartInteractiveComponent />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min my-4 pt-4">
        <Invoice />
      </div>
    </div>
  )
}

export default Dashboard
