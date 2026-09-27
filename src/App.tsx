import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Habitation, SafeSite, HazardUpdate, RelocationPlan } from '@/types';
import { generateSimulatedHazardUpdate } from '@/lib/riskEngine';
import { hazardFeed } from '@/lib/hazardFeed';
import type { AppState } from '@/lib/supabaseClient';
import { getStateData, getDefaultDistrictForState, type MapStateConfig } from '@/data/states';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar, type PageKey } from '@/components/layout/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { RiskMapPage } from '@/pages/RiskMapPage';
import { HabitationRankingPage } from '@/pages/HabitationRankingPage';
import { SafeSitesPage } from '@/pages/SafeSitesPage';
import { RelocationPlanningPage } from '@/pages/RelocationPlanningPage';
import { ScenarioAnalysisPage } from '@/pages/ScenarioAnalysisPage';
import { FieldValidationPage } from '@/pages/FieldValidationPage';
import { DataSourcesPage } from '@/pages/DataSourcesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { HabitationDetail } from '@/components/panels/HabitationDetail';
import { SafeSiteDetail } from '@/components/panels/SafeSiteDetail';
import { Menu, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeState, setActiveState] = useState<AppState>('kerala');
  const [hazardUpdate, setHazardUpdate] = useState<HazardUpdate>(() => generateSimulatedHazardUpdate());
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [liveFeedActive, setLiveFeedActive] = useState(false);
  const [selectedHabitation, setSelectedHabitation] = useState<Habitation | null>(null);
  const [selectedSafeSite, setSelectedSafeSite] = useState<SafeSite | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Get all state-specific data
  const stateData = useMemo(() => getStateData(activeState), [activeState]);

  // Habitations are in state so live feed can update them
  const [habitations, setHabitations] = useState<Habitation[]>(stateData.habitations);

  // When state changes, reset habitations to the new state's data
  useEffect(() => {
    setHabitations(stateData.habitations);
    setSelectedDistrict(getDefaultDistrictForState(activeState));
    // Reset hazard data for the new state
    setHazardUpdate(generateSimulatedHazardUpdate());
    setLastUpdated(new Date().toISOString());
  }, [activeState, stateData]);

  const safeSites = stateData.safeSites;
  const relocationPlans = stateData.relocationPlans;

  // Build map config from state data
  const mapStateConfig: MapStateConfig = useMemo(() => ({
    center: stateData.center,
    zoom: stateData.zoom,
    outline: stateData.outline,
    label: stateData.label,
    districts: stateData.districts,
    districtBoundaries: stateData.districtBoundaries,
    riskZones: stateData.riskZones,
    roads: stateData.roads,
    hospitals: stateData.hospitals,
    schools: stateData.schools,
    waterBodies: stateData.waterBodies,
  }), [stateData]);

  // Initialize active state from profile
  useEffect(() => {
    if (profile?.state) {
      setActiveState(profile.state);
    }
  }, [profile]);

  // Live feed effect — operates on current state's habitations
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

  const handleUseForRelocation = (site: SafeSite) => {
    setSelectedSafeSite(null);
    setCurrentPage('relocation-planning');
  };

  // Role-based default landing page
  useEffect(() => {
    if (!profile) return;

    const authorityOnlyPages: PageKey[] = ['dashboard', 'habitation-ranking', 'relocation-planning', 'scenario-analysis', 'data-sources'];
    const isFieldOfficer = profile.role === 'field_officer';

    if (isFieldOfficer && authorityOnlyPages.includes(currentPage)) {
      setCurrentPage('field-validation');
    }
  }, [profile, currentPage]);

  // Filter habitations and safe sites by selected district for map display
  const districtHabitations = useMemo(() => {
    if (!selectedDistrict) return habitations;
    return habitations.filter(h => h.districtId === selectedDistrict);
  }, [habitations, selectedDistrict]);

  const districtSafeSites = useMemo(() => {
    if (!selectedDistrict) return safeSites;
    return safeSites.filter(s => s.districtId === selectedDistrict);
  }, [safeSites, selectedDistrict]);

  // Focused location for map zoom-to-district
  const focusedLocation = useMemo(() => {
    if (!selectedDistrict) return null;
    const district = stateData.districts.find(d => d.id === selectedDistrict);
    if (!district) return null;
    return { lat: district.centroid[0], lng: district.centroid[1], zoom: 10 };
  }, [selectedDistrict, stateData.districts]);

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
      <Header
        lastUpdated={lastUpdated}
        liveFeedActive={liveFeedActive}
        profile={profile}
        activeState={activeState}
        onStateChange={setActiveState}
      />

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
              safeSites={safeSites}
              hazardUpdate={hazardUpdate}
              lastUpdated={lastUpdated}
              onRefresh={handleRefresh}
              isRefreshing={false}
              onHabitationClick={setSelectedHabitation}
              onSafeSiteClick={setSelectedSafeSite}
              onNavigate={handleNavigate}
              stateConfig={mapStateConfig}
              stateLabel={stateData.label}
              dataSourceLabel={stateData.dataSourceLabel}
            />
          )}
          {currentPage === 'risk-map' && (
            <RiskMapPage
              habitations={habitations}
              safeSites={safeSites}
              onHabitationClick={setSelectedHabitation}
              onSafeSiteClick={setSelectedSafeSite}
              stateConfig={mapStateConfig}
              stateLabel={stateData.label}
              districts={stateData.districts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
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
              onUseForRelocation={handleUseForRelocation}
            />
          )}
          {currentPage === 'relocation-planning' && (
            <RelocationPlanningPage
              habitations={habitations}
              safeSites={safeSites}
              relocationPlans={relocationPlans}
              onHabitationClick={setSelectedHabitation}
              onSafeSiteClick={setSelectedSafeSite}
            />
          )}
          {currentPage === 'scenario-analysis' && (
            <ScenarioAnalysisPage habitations={habitations} stateLabel={stateData.label} />
          )}
          {currentPage === 'field-validation' && (
            <FieldValidationPage
              activeState={activeState}
              safeSites={safeSites}
              onSafeSiteClick={() => {}}
            />
          )}
          {currentPage === 'data-sources' && <DataSourcesPage stateLabel={stateData.label} />}
          {currentPage === 'reports' && (
            <ReportsPage
              habitations={habitations}
              safeSites={safeSites}
              hazardUpdate={hazardUpdate}
              lastUpdated={lastUpdated}
              profile={profile}
              stateLabel={stateData.label}
              dataSourceLabel={stateData.dataSourceLabel}
              districtCount={stateData.districts.length}
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
