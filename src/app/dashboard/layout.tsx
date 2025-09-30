
"use client";

import DashboardSidebar from "@/components/dashboard-sidebar";
import MobileDashboardHeader from "@/components/mobile-dashboard-header";
import ProtectedRoute from "@/components/protected-route"; // Import the new component

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
          <MobileDashboardHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
