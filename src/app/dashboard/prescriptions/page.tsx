
"use client"
import { Pill } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"

export default function DashboardPrescriptions() {
  return (
    <>
      <DashboardHeader title="Prescriptions" description="View your current and past prescriptions." />

      <Card>
        <CardContent className="pt-6">
            <div className="text-center p-12 text-muted-foreground">
                <Pill className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-medium">Prescription Feature Coming Soon</h3>
                <p className="mt-1 text-sm">
                    We are working on a feature to allow you to view and manage your prescriptions online. Please check back later!
                </p>
            </div>
        </CardContent>
      </Card>
    </>
  )
}
