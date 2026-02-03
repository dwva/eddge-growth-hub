import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ParentSidebar from './ParentSidebar';
import ParentHeader from './ParentHeader';
import { ChildProvider } from '@/contexts/ChildContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

interface ParentDashboardLayoutProps {
  children: ReactNode;
}

const ParentDashboardLayoutInner = ({ children }: ParentDashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ParentSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-14' : 'ml-56'
        )}
      >
        <ParentHeader />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const ParentDashboardLayout = ({ children }: ParentDashboardLayoutProps) => {
  return (
    <LanguageProvider>
      <ChildProvider>
        <ParentDashboardLayoutInner>
          {children}
        </ParentDashboardLayoutInner>
      </ChildProvider>
    </LanguageProvider>
  );
};

export default ParentDashboardLayout;
