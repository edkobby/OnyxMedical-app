
"use client"

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">{title}</h1>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
