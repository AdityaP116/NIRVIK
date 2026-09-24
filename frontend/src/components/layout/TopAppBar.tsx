import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';

export const TopAppBar: React.FC = () => {
  const location = useLocation();
  const { currentCase, setIsAiDrawerOpen, setIsSearchModalOpen, openEvidenceModal } = useCaseContext();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes('/network-analysis')) {
      return (
        <>
          <Link to="/network-analysis" className="hover:text-secondary-container transition-colors">
            Network Analysis
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Case {currentCase.caseNumber}</span>
          <span className="ml-2 font-metadata text-[10px] bg-surface-variant text-on-surface px-2 py-0.5 rounded uppercase tracking-wide hidden md:inline-block">
            {currentCase.tags[0] || 'Organized Financial Network'}
          </span>
        </>
      );
    }
    if (path.includes('/investigations')) {
      return (
        <>
          <Link to="/investigations" className="hover:text-secondary-container transition-colors">
            Investigations
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Case {currentCase.caseNumber}</span>
        </>
      );
    }
    if (path.includes('/entities')) {
      return (
        <>
          <Link to="/network-analysis" className="hover:text-secondary-container transition-colors">
            Network Analysis
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Entity Intelligence Profile</span>
        </>
      );
    }
    if (path.includes('/search')) {
      return <span className="text-primary font-bold">Intelligence Search & NLP</span>;
    }
    if (path.includes('/alerts')) {
      return <span className="text-primary font-bold">Alerts & Anomalies</span>;
    }
    if (path.includes('/data-sources')) {
      return <span className="text-primary font-bold">Data Sources & Ingestion Pipeline</span>;
    }
    if (path.includes('/document-intelligence')) {
      return (
        <>
          <Link to="/investigations" className="hover:text-secondary-container transition-colors">
            Case {currentCase.caseNumber}
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Document Intelligence (FIR Extraction)</span>
        </>
      );
    }
    if (path.includes('/timeline')) {
      return (
        <>
          <Link to="/investigations" className="hover:text-secondary-container transition-colors">
            Case {currentCase.caseNumber}
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Investigation Timeline</span>
        </>
      );
    }
    if (path.includes('/reports')) {
      return <span className="text-primary font-bold">Investigation Dossier & Reports</span>;
    }
    if (path.includes('/audit')) {
      return <span className="text-primary font-bold">Immutable Audit Trail</span>;
    }
    if (path.includes('/command-overview')) {
      return <span className="text-primary font-bold">Command Intelligence Overview</span>;
    }
    if (path.includes('/women-safety')) {
      return <span className="text-primary font-bold">Women Safety Intelligence</span>;
    }
    return <span className="text-primary font-bold">Intelligence Dashboard</span>;
  };

  return (
    <header className="h-16 px-margin-page bg-surface dark:bg-surface-container sticky top-0 border-b border-outline-variant flex justify-between items-center z-40 backdrop-blur-md bg-surface/90">
      {/* Left: Breadcrumbs / Context */}
      <div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
        <Link to="/dashboard" className="font-section-heading text-section-heading text-primary font-bold hover:text-secondary-container transition-colors">
          NIRVIK
        </Link>
        <span className="text-outline-variant">/</span>
        {getBreadcrumbs()}
      </div>

      {/* Right: Search & Global Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="relative hidden md:flex items-center w-64 bg-surface-container-lowest border border-outline-variant rounded-md pl-9 pr-3 py-1.5 font-body-sm text-body-sm text-on-surface-variant hover:border-primary transition-all text-left shadow-sm"
        >
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <span>Search Intelligence (⌘K)</span>
          <kbd className="ml-auto text-[10px] bg-surface-container px-1.5 py-0.5 rounded font-mono text-outline">
            /
          </kbd>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* AI Assistant Trigger */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            title="Ask NIRVIK AI Assistant"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Evidence Drawer Button */}
          <button
            onClick={() => openEvidenceModal()}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors relative"
            title="Evidence Vault"
          >
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
          </button>

          {/* Notifications / Alerts Link */}
          <Link
            to="/alerts"
            className="p-2 text-on-surface-variant hover:text-secondary-container hover:bg-surface-container rounded-full transition-colors relative"
            title="Intelligence Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-container rounded-full ring-2 ring-surface"></span>
          </Link>

          {/* System Security / Tamper Evident Indicator */}
          <Link
            to="/audit"
            className="p-2 text-primary hover:text-secondary-container hover:bg-surface-container rounded-full transition-colors"
            title="Cryptographic Integrity: Verified"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
