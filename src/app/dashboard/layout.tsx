import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Jobbsiffror - Sveriges arbetsmarknad',
  description: 'Data och analyser om sveriges arbetsmarknad'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          <main className='min-h-[calc(100vh-4rem)] flex-1'>{children}</main>
          {/* page main content ends */}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
