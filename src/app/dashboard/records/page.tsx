
"use client"
import { Archive } from "lucide-react"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"

export default function DashboardRecords() {
  return (
    <>
      <DashboardHeader title="Medical Records" description="Access your complete health history." />

      <Card>
        <CardContent className="pt-6">
            <div className="text-center p-12 text-muted-foreground">
                <Archive className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-medium">Feature Coming Soon</h3>
                <p className="mt-1 text-sm">
                    We are currently building a secure digital vault for your medical records. Please check back later!
                </p>
            </div>
        </CardContent>
      </Card>
    </>
  )
}
