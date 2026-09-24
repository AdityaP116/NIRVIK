import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { entityService, caseService } from '../../services';
import { Entity, Case } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen } = useCaseContext();
  const [query, setQuery] = useState('');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setEntities([]);
      setCases([]);
      return;
    }
    entityService.searchEntities(query).then(setEntities);
    caseService.getCases().then((list) => {
      const q = query.toLowerCase();
      setCases(list.filter((c) => c.caseNumber.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)));
    });
  }, [query]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-w-xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="p-4 border-b border-outline-variant flex items-center gap-3">
          <span className="material-symbols-outlined text-outline text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entities, cases, phone numbers, accounts..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-primary placeholder:text-outline"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-[11px] bg-surface-container px-2 py-1 rounded text-outline font-mono"
          >
            ESC
          </button>
        </div>

        {/* Quick Links / Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {!query.trim() ? (
            <div className="p-2 space-y-2">
              <span className="font-metadata text-[10px] text-outline uppercase tracking-wider block font-bold">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    navigate('/network-analysis');
                  }}
                  className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-left flex items-center gap-2 text-primary"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">hub</span>
                  <span>Network Analysis</span>
                </button>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    navigate('/entities/entity-ramesh-kumar');
                  }}
                  className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-left flex items-center gap-2 text-primary"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">person</span>
                  <span>Ramesh Kumar (Target)</span>
                </button>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    navigate('/document-intelligence');
                  }}
                  className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-left flex items-center gap-2 text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>Document Intelligence</span>
                </button>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    navigate('/alerts');
                  }}
                  className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-left flex items-center gap-2 text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                  <span>Alerts Center</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Entities Section */}
              {entities.length > 0 && (
                <div>
                  <span className="font-metadata text-[10px] text-outline uppercase tracking-wider block mb-1 font-bold">
                    Entities ({entities.length})
                  </span>
                  <div className="space-y-1">
                    {entities.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          navigate(`/entities/${e.id}`);
                        }}
                        className="flex items-center justify-between p-2 rounded hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-outline text-[18px]">
                            {e.type === 'person'
                              ? 'person'
                              : e.type === 'organization'
                              ? 'account_balance'
                              : e.type === 'phone'
                              ? 'phone_iphone'
                              : 'directions_car'}
                          </span>
                          <div>
                            <div className="font-body-sm text-xs font-bold text-primary">{e.name}</div>
                            <div className="font-metadata text-[10px] text-outline">{e.roleDescription}</div>
                          </div>
                        </div>
                        <span className="font-label-caps text-[9px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded font-bold">
                          {e.aiConfidence}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cases Section */}
              {cases.length > 0 && (
                <div>
                  <span className="font-metadata text-[10px] text-outline uppercase tracking-wider block mb-1 font-bold">
                    Cases ({cases.length})
                  </span>
                  <div className="space-y-1">
                    {cases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          navigate(`/investigations/${c.id}`);
                        }}
                        className="flex items-center justify-between p-2 rounded hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-outline text-[18px]">work</span>
                          <div>
                            <div className="font-body-sm text-xs font-bold text-primary">Case {c.caseNumber}</div>
                            <div className="font-metadata text-[10px] text-outline">{c.title}</div>
                          </div>
                        </div>
                        <span className="font-label-caps text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entities.length === 0 && cases.length === 0 && (
                <div className="py-8 text-center text-outline font-body-sm text-xs">
                  No direct matches found for "{query}". Press Enter to perform full NLP deep scan.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-outline-variant bg-surface-bright flex justify-between items-center text-[11px] text-outline">
          <span>Search index updated live across all active investigations</span>
          <button
            onClick={() => {
              setIsSearchModalOpen(false);
              navigate(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="text-secondary-container font-bold hover:underline"
          >
            Open Full Search Page →
          </button>
        </div>
      </div>
    </div>
  );
};
