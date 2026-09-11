import { useState, useEffect, useCallback } from 'react';
import type { Habitation, SafeSite, HazardUpdate } from '@/types';
import { HABITATIONS, SAFE_SITES } from '@/data/habitations';
import { generateSimulatedHazardUpdate } from '@/lib/riskEngine';
import { hazardFeed } from '@/lib/hazardFeed';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar, type PageKey } from '@/components/layout/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { RiskMapPage } from '@/pages/RiskMapPage';
import { HabitationRankingPage } from '@/pages/HabitationRankingPage';
import { SafeSitesPage } from '@/pages/SafeSitesPage';
import { CarryingCapacityPage } from '@/pages/CarryingCapacityPage';
import { RelocationPlanningPage } from '@/pages/RelocationPlanningPage';
import { ScenarioAnalysisPage } from '@/pages/ScenarioAnalysisPage';
import { IssueReportingPage } from '@/pages/IssueReportingPage';
import { DataSourcesPage } from '@/pages/DataSourcesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { HabitationDetail } from '@/components/panels/HabitationDetail';
import { SafeSiteDetail } from '@/components/panels/SafeSiteDetail';
import { Menu, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [habitations, setHabitations] = useState<Habitation[]>(HABITATIONS);
  const [safeSites] = useState<SafeSite[]>(SAFE_SITES);
  const [hazardUpdate, setHazardUpdate] = useState<HazardUpdate>(() => generateSimulatedHazardUpdate());
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [liveFeedActive, setLiveFeedActive] = useState(false);
  const [selectedHabitation, setSelectedHabitation] = useState<Habitation | null>(null);
  const [selectedSafeSite, setSelectedSafeSite] = useState<SafeSite | null>(null);

  // Live feed effect
  useEffect(() => {
    if (!liveFeedActive) return;

    const interval = setInterval(() => {
      const result = hazardFeed.ingest(habitations);
      setHazardUpdate(result.hazardUpdate);
      setHabitations(result.updatedHabitations);
      setLastUpdated(result.timestamp);
    }, 15000);

    return () => clearInterval(interval);
  }, [liveFeedActive, habitations]);

  const handleRefresh = useCallback(() => {
    const result = hazardFeed.ingest(habitations);
    setHazardUpdate(result.hazardUpdate);
    setHabitations(result.updatedHabitations);
    setLastUpdated(result.timestamp);
  }, [habitations]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageKey);
  };

  const handleFindSafeSites = () => {
    setSelectedHabitation(null);
    setCurrentPage('safe-sites');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <Header lastUpdated={lastUpdated} liveFeedActive={liveFeedActive} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-2 top-16 z-50 rounded-lg border border-slate-700/50 bg-slate-800/90 p-1.5 text-slate-400 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Sidebar
          active={currentPage}
          onNavigate={setCurrentPage}
          collapsed={sidebarCollapsed}
          profile={profile}
          onSignOut={signOut}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {currentPage === 'dashboard' && (
            <Dashboard
              habitations={habitations}
              hazardUpdate={hazardUpdate}
              lastUpdated={lastUpdated}
              onRefresh={handleRefresh}
              isRefreshing={false}
              onHabitationClick={setSelectedHabitation}
              onSafeSiteClick={setSelectedSafeSite}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'risk-map' && (
            <RiskMapPage
              habitations={habitations}
              safeSites={safeSites}
              onHabitationClick={setSelectedHabitation}
              onSafeSiteClick={setSelectedSafeSite}
            />
          )}
          {currentPage === 'habitation-ranking' && (
            <HabitationRankingPage
              habitations={habitations}
              onHabitationClick={setSelectedHabitation}
            />
          )}
          {currentPage === 'safe-sites' && (
            <SafeSitesPage
              safeSites={safeSites}
              onSafeSiteClick={setSelectedSafeSite}
            />
          )}
          {currentPage === 'carrying-capacity' && (
            <CarryingCapacityPage
              safeSites={safeSites}
              onSafeSiteClick={setSelectedSafeSite}
            />
          )}
          {currentPage === 'relocation-planning' && (
            <RelocationPlanningPage
              habitations={habitations}
              safeSites={safeSites}
              onHabitationClick={setSelectedHabitation}
              onSafeSiteClick={setSelectedSafeSite}
            />
          )}
          {currentPage === 'scenario-analysis' && (
            <ScenarioAnalysisPage habitations={habitations} />
          )}
          {currentPage === 'issue-reporting' && <IssueReportingPage />}
          {currentPage === 'data-sources' && <DataSourcesPage />}
          {currentPage === 'reports' && (
            <ReportsPage
              habitations={habitations}
              safeSites={safeSites}
              hazardUpdate={hazardUpdate}
              lastUpdated={lastUpdated}
              profile={profile}
            />
          )}
          {currentPage === 'settings' && (
            <SettingsPage
              liveFeedActive={liveFeedActive}
              onToggleLiveFeed={() => setLiveFeedActive(!liveFeedActive)}
              profile={profile}
            />
          )}
        </main>
      </div>

      {/* Detail Panels */}
      {selectedHabitation && (
        <HabitationDetail
          habitation={selectedHabitation}
          safeSites={safeSites}
          onClose={() => setSelectedHabitation(null)}
          onFindSafeSites={handleFindSafeSites}
        />
      )}
      {selectedSafeSite && (
        <SafeSiteDetail
          site={selectedSafeSite}
          onClose={() => setSelectedSafeSite(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
