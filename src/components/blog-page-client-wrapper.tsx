
"use client"
import Header from "@/components/header";
import Footer from "@/components/footer";
import TopBar from "@/components/top-bar";

export default function BlogPageClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
