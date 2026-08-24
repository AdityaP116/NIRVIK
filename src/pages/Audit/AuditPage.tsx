import React, { useState } from 'react';
import { mockAuditEvents } from '../../mock/audit';
import { AuditEvent } from '../../types';

export const AuditPage: React.FC = () => {
  const [events] = useState<AuditEvent[]>(mockAuditEvents);
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.officer.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.resource.toLowerCase().includes(q) ||
      e.hash.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-margin-page flex flex-col gap-margin-page">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Immutable Audit Trail</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Cryptographic, tamper-evident logging of every query, evidence verification, and graph inspection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting cryptographic chain audit ledger...')}
            className="px-4 py-2 border border-outline-variant bg-white rounded text-xs font-bold hover:bg-surface-container transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Row (Bento Grid Top) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-panel-padding flex flex-col gap-1 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase">
              TOTAL AUDIT EVENTS
            </span>
            <span className="material-symbols-outlined text-outline-variant text-[20px]">database</span>
          </div>
          <span className="font-section-heading text-2xl font-bold text-primary">24,892</span>
          <span className="font-metadata text-[10px] text-outline">Across all active police precincts</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-panel-padding flex flex-col gap-1 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase">
              SYSTEM INTEGRITY
            </span>
            <span className="material-symbols-outlined text-secondary-container text-[20px]">enhanced_encryption</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-section-heading text-2xl font-bold text-primary">100%</span>
            <span className="font-metadata text-xs text-secondary-container font-bold">Tamper-Evident</span>
          </div>
          <span className="font-metadata text-[10px] text-outline">Cryptographic block anchors verified</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-panel-padding flex flex-col gap-1 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase">
              LAST VERIFICATION CYCLE
            </span>
            <span className="material-symbols-outlined text-outline-variant text-[20px]">update</span>
          </div>
          <span className="font-section-heading text-2xl font-bold text-primary">2 min ago</span>
          <span className="font-metadata text-[10px] text-outline">Automatic background ledger heartbeat</span>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-outline-variant bg-surface-container-low/70 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="font-section-heading text-sm font-bold text-primary">Recent Immutable Events</h3>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit actions, hashes..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-outline-variant rounded text-xs text-primary focus:border-primary focus:ring-0"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant bg-surface font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                <th className="px-4 py-3 font-bold">TIMESTAMP (IST)</th>
                <th className="px-4 py-3 font-bold">OFFICER / AGENT</th>
                <th className="px-4 py-3 font-bold">ACTION</th>
                <th className="px-4 py-3 font-bold">RESOURCE / TARGET</th>
                <th className="px-4 py-3 font-bold text-right">INTEGRITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 font-body-sm text-xs">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-primary">{evt.timestamp}</td>
                  <td className="px-4 py-3 font-bold text-primary">{evt.officer}</td>
                  <td className="px-4 py-3 text-on-surface-variant font-medium">{evt.action}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-primary truncate max-w-xs">{evt.resource}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1 bg-surface border border-outline-variant rounded-full px-2.5 py-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-secondary-container text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span className="font-metadata text-[10px] font-bold text-primary">{evt.integrity}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
