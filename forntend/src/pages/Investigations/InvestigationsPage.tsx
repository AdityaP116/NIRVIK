import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { caseService } from '../../services';
import { Case } from '../../types';

export const InvestigationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCase } = useCaseContext();
  const [filter, setFilter] = useState<'all' | 'active' | 'closed' | 'review'>('all');
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        const res = await caseService.getCases();
        if (isMounted && res) {
          setCases(res);
        }
      } catch (err) {
        console.warn('Failed to load cases:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.jurisdiction.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectCase = (c: Case) => {
    setCurrentCase(c);
    navigate(`/investigations/${c.id}`);
  };

  return (
    <div className="p-margin-page flex flex-col gap-margin-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Investigations Workspace</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Active and cross-referenced case dossiers across state jurisdictions
          </p>
        </div>
        <button
          onClick={() => alert('Initiating new investigation intake protocol...')}
          className="px-4 py-2 bg-secondary-container text-on-primary font-bold text-xs rounded hover:bg-secondary transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add_box</span>
          <span>New Investigation Dossier</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 border-b sm:border-b-0 pb-2 sm:pb-0 w-full sm:w-auto">
          {(['all', 'active', 'closed', 'review'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded font-label-caps text-[10px] uppercase font-bold tracking-wider transition-colors ${
                filter === status
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {status} ({status === 'all' ? cases.length : cases.filter((c) => c.status === status).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, jurisdiction, title..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline-variant rounded text-xs text-primary focus:border-primary focus:ring-0"
          />
        </div>
      </div>

      {/* Cases Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-outline flex items-center justify-center gap-2">
          <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
          <span>Fetching case dossiers from backend...</span>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="p-12 text-center text-xs text-outline border border-dashed border-outline-variant rounded-xl">
          No cases matching criteria found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectCase(c)}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-secondary-container hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">Case {c.caseNumber}</span>
                      <span
                        className={`font-label-caps text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                          c.status === 'active'
                            ? 'bg-secondary-container/10 text-secondary-container border border-secondary-container/30'
                            : 'bg-surface-variant text-on-surface-variant'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-section-heading text-base font-bold text-primary group-hover:text-secondary-container transition-colors mt-1">
                      {c.title}
                    </h3>
                  </div>
                  <span className="font-label-caps text-[9px] uppercase bg-primary text-on-primary px-2 py-0.5 rounded font-bold">
                    {c.priority}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between font-metadata text-[11px] text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <span><b>{c.totalEntities}</b> Entities</span>
                  <span><b>{c.totalSignals}</b> Signals</span>
                  <span><b>{c.totalEvidence}</b> Evidence</span>
                </div>
                <span className="text-secondary-container font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  <span>Open Dossier</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
