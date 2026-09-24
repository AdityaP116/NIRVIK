import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopAppBar } from './TopAppBar';
import { AIAssistantDrawer } from '../common/AIAssistantDrawer';
import { EvidenceModal } from '../common/EvidenceModal';
import { SearchModal } from '../common/SearchModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Side Navigation Bar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-sidebar-width flex flex-col min-h-screen min-w-0 bg-surface-container">
        {/* Top Header */}
        <TopAppBar />

        {/* Page View Canvas */}
        <main className="flex-1 flex flex-col min-h-0 relative overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <AIAssistantDrawer />
      <EvidenceModal />
      <SearchModal />
    </div>
  );
};
