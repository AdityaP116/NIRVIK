import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTimelineEvents } from '../../mock/timeline';
import { useCaseContext } from '../../context/CaseContext';
import { TimelineEventType } from '../../types';

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { openEvidenceModal } = useCaseContext();
  const [selectedTypes, setSelectedTypes] = useState<TimelineEventType[]>([
    'ai_finding',
    'call',
    'transaction',
    'location',
    'report',
  ]);
  const [timeRange, setTimeRange] = useState('Last 90 Days');

  const toggleType = (type: TimelineEventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredEvents = mockTimelineEvents.filter((evt) => selectedTypes.includes(evt.type));

  return (
    <div className="p-margin-page flex flex-col gap-gutter max-w-7xl mx-auto w-full">
      {/* Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-outline-variant gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase tracking-wider font-bold">
              Active Case 2026-0142
            </span>
            <span className="text-on-surface-variant font-metadata text-xs">Last updated: 10 mins ago</span>
          </div>
          <h2 className="font-page-title text-2xl font-bold text-primary">Investigation Timeline: Operation Shadow</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Generating chronology PDF export...')}
            className="border border-primary text-primary px-4 py-2 rounded text-xs font-bold hover:bg-surface-container transition-colors shadow-sm"
          >
            Export Chronology PDF
          </button>
          <button
            onClick={() => alert('Add Manual Field Event modal')}
            className="bg-secondary-container text-white px-4 py-2 rounded text-xs font-bold hover:bg-secondary transition-colors shadow-sm"
          >
            + Add Intelligence Event
          </button>
        </div>
      </div>

      {/* Filters & Timeline Area */}
      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filter Panel (Left) */}
        <aside className="w-full lg:w-64 bg-white border border-outline-variant rounded-xl p-5 h-fit lg:sticky lg:top-4 shadow-sm select-none">
          <h3 className="font-section-heading text-sm font-bold text-primary mb-3 border-b border-outline-variant pb-2">
            Filter Event Channels
          </h3>
          <div className="flex flex-col gap-2.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes('ai_finding')}
                onChange={() => toggleType('ai_finding')}
                className="text-secondary-container border-outline-variant rounded focus:ring-secondary-container"
              />
              <span className="flex items-center gap-2 text-primary font-semibold">
                <span className="material-symbols-outlined text-[16px] text-secondary-container">psychology</span>
                <span>AI Findings &amp; Signals</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes('call')}
                onChange={() => toggleType('call')}
                className="text-primary border-outline-variant rounded focus:ring-primary"
              />
              <span className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Calls (CDR Analysis)</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes('transaction')}
                onChange={() => toggleType('transaction')}
                className="text-primary border-outline-variant rounded focus:ring-primary"
              />
              <span className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                <span>Wire Transactions</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes('location')}
                onChange={() => toggleType('location')}
                className="text-primary border-outline-variant rounded focus:ring-primary"
              />
              <span className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>Geospatial Sightings</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes('report')}
                onChange={() => toggleType('report')}
                className="text-primary border-outline-variant rounded focus:ring-primary"
              />
              <span className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span>FIRs &amp; Official Reports</span>
              </span>
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant">
            <h4 className="font-metadata text-[10px] text-outline uppercase mb-2 font-bold">Time Window</h4>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-2.5 py-1.5 text-xs text-primary focus:border-primary focus:ring-0"
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Full Investigation History</option>
            </select>
          </div>
        </aside>

        {/* Timeline Flow (Right) */}
        <div className="flex-1 bg-white border border-outline-variant rounded-xl p-6 relative shadow-sm">
          {/* Vertical Timeline Axis Line */}
          <div className="absolute left-[36px] top-[28px] bottom-[28px] w-0.5 bg-outline-variant" />

          <div className="flex flex-col gap-6 relative">
            {filteredEvents.map((evt) => {
              const isAi = evt.type === 'ai_finding';
              return (
                <div key={evt.id} className="flex gap-4 relative z-10">
                  {/* Pin Node Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-md mt-1 ${
                      isAi
                        ? 'bg-secondary-container text-white shadow-[0_0_10px_rgba(253,151,78,0.6)]'
                        : 'bg-primary text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {evt.type === 'ai_finding'
                        ? 'psychology'
                        : evt.type === 'call'
                        ? 'call'
                        : evt.type === 'transaction'
                        ? 'payments'
                        : evt.type === 'location'
                        ? 'location_on'
                        : 'description'}
                    </span>
                  </div>

                  {/* Card Container */}
                  <div
                    className={`flex-1 rounded-xl p-4 transition-all ${
                      isAi
                        ? 'bg-surface-container-lowest border-2 border-secondary-container shadow-md'
                        : 'bg-surface-container-lowest border border-outline-variant hover:border-primary'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-caps text-[9px] uppercase font-bold ${
                            isAi ? 'bg-secondary-container text-white' : 'bg-primary text-white'
                          }`}
                        >
                          {evt.badgeLabel}
                        </span>
                        <h4 className="font-section-heading text-sm font-bold text-primary">{evt.title}</h4>
                      </div>
                      <span className="text-on-surface-variant font-metadata text-xs font-mono">{evt.timeStr} · {evt.dateStr}</span>
                    </div>

                    <p className="text-body-sm text-xs text-on-surface leading-relaxed mb-3">
                      {evt.description}
                    </p>

                    {/* Metadata Key-Value pairs */}
                    {evt.details && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/50 text-xs mb-3">
                        {Object.entries(evt.details).map(([k, v]) => (
                          <div key={k}>
                            <span className="font-metadata text-[10px] text-outline block">{k}:</span>
                            <span className="font-bold text-primary">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Action Links */}
                    <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/40">
                      {isAi && (
                        <button
                          onClick={() => navigate('/network-analysis')}
                          className="text-secondary-container text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">hub</span>
                          <span>View Graph Analysis</span>
                        </button>
                      )}
                      {evt.evidenceId && (
                        <button
                          onClick={() => openEvidenceModal(evt.evidenceId)}
                          className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">source</span>
                          <span>Inspect Evidence File</span>
                        </button>
                      )}
                      {evt.entityId && (
                        <button
                          onClick={() => navigate(`/entities/${evt.entityId}`)}
                          className="text-on-surface-variant text-xs font-semibold hover:text-primary flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">person</span>
                          <span>Entity Dossier</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
