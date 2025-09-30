
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login page.
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // While checking for user authentication, show a loading state.
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-xl p-8 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <div className="pt-8 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the children components.
  return <>{children}</>;
}
