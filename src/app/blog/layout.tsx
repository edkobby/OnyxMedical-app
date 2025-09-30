
import BlogSidebar from "@/components/blog-sidebar";
import BlogPageClientWrapper from "@/components/blog-page-client-wrapper";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogPageClientWrapper>
        <div className="container mx-auto py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">{children}</div>
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
    </BlogPageClientWrapper>
  );
}
