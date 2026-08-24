import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { InvestigationsPage } from './pages/Investigations/InvestigationsPage';
import { CaseDetailPage } from './pages/Investigations/CaseDetailPage';
import { NetworkAnalysisPage } from './pages/NetworkAnalysis/NetworkAnalysisPage';
import { EntityProfilePage } from './pages/EntityProfile/EntityProfilePage';
import { IntelligenceSearchPage } from './pages/Search/IntelligenceSearchPage';
import { AlertsPage } from './pages/Alerts/AlertsPage';
import { DataSourcesPage } from './pages/DataSources/DataSourcesPage';
import { DocumentIntelligencePage } from './pages/DocumentIntelligence/DocumentIntelligencePage';
import { TimelinePage } from './pages/Timeline/TimelinePage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { AuditPage } from './pages/Audit/AuditPage';
import { CommandOverviewPage } from './pages/CommandOverview/CommandOverviewPage';
import { WomenSafetyPage } from './pages/WomenSafety/WomenSafetyPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CaseProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Workspace Shell */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/investigations" element={<InvestigationsPage />} />
              <Route path="/investigations/:caseId" element={<CaseDetailPage />} />
              <Route path="/network-analysis" element={<NetworkAnalysisPage />} />
              <Route path="/network-analysis/:caseId" element={<NetworkAnalysisPage />} />
              <Route path="/entities/:entityId" element={<EntityProfilePage />} />
              <Route path="/search" element={<IntelligenceSearchPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/data-sources" element={<DataSourcesPage />} />
              <Route path="/document-intelligence" element={<DocumentIntelligencePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/command-overview" element={<CommandOverviewPage />} />
              <Route path="/women-safety" element={<WomenSafetyPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </CaseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
