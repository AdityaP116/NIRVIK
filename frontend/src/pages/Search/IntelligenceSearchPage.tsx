import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { entityService } from '../../services';
import { Entity } from '../../types';

export const IntelligenceSearchPage: React.FC = () => {
  const [query, setQuery] = useState('Ramesh Kumar');
  const [activeCategory, setActiveCategory] = useState<'all' | 'people' | 'phones' | 'cases' | 'locations' | 'orgs'>('all');
  const [selectedResultId, setSelectedResultId] = useState<string>('');
  const [results, setResults] = useState<Entity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { openEvidenceModal, setIsAiDrawerOpen } = useCaseContext();

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      if (!query.trim()) {
        if (isMounted) {
          setResults([]);
          setSelectedResultId('');
        }
        return;
      }
      setIsSearching(true);
      try {
        const res = await entityService.searchEntities(query);
        if (isMounted) {
          setResults(res);
          if (res.length > 0 && !res.find(r => r.id === selectedResultId)) {
            setSelectedResultId(res[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to search entities', err);
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };
    const debounceTimer = setTimeout(fetchResults, 300);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [query, selectedResultId]);

  const mapCategory = (type: string) => {
    switch (type) {
      case 'person': return 'people';
      case 'phone': return 'phones';
      case 'case': return 'cases';
      case 'location': return 'locations';
      case 'organization': return 'orgs';
      default: return 'all';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'person': return 'person';
      case 'phone': return 'smartphone';
      case 'location': return 'location_on';
      case 'organization': return 'business';
      case 'case': return 'folder_open';
      default: return 'help_outline';
    }
  };

  const filteredResults = results.filter((r) => {
    if (activeCategory !== 'all' && mapCategory(r.type) !== activeCategory) return false;
    return true;
  });

  const selectedResult = results.find((r) => r.id === selectedResultId) || results[0];

  return (
    <div className="p-margin-page flex flex-col gap-6 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Search Bar Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden shrink-0">
        {/* Search Input Area */}
        <div className="p-4 border-b border-outline-variant flex items-center gap-4 relative bg-surface-bright">
          <span className="material-symbols-outlined text-[28px] text-primary">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entities, phone numbers, or enter natural language queries..."
            className="flex-1 bg-transparent border-none outline-none font-section-heading text-lg text-primary placeholder:text-outline focus:ring-0 px-0 font-semibold"
          />
          {/* AI Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded border border-primary/10">
            <span className="material-symbols-outlined text-[14px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="font-label-caps text-[10px] text-primary uppercase font-bold">NLP Active</span>
          </div>
        </div>

        {/* Query Examples & Filters */}
        <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto">
            <span className="font-metadata text-[10px] text-on-surface-variant uppercase whitespace-nowrap font-bold">
              Examples:
            </span>
            <button
              onClick={() => handleExampleClick('Ramesh')}
              className="px-3 py-1 rounded-full border border-outline-variant bg-surface-container-lowest font-body-sm text-xs text-on-surface hover:border-primary transition-colors whitespace-nowrap"
            >
              Ramesh
            </button>
            <button
              onClick={() => handleExampleClick('Front Corp')}
              className="px-3 py-1 rounded-full border border-outline-variant bg-surface-container-lowest font-body-sm text-xs text-on-surface hover:border-primary transition-colors whitespace-nowrap"
            >
              Front Corp
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors font-body-sm text-xs font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-container">auto_awesome</span>
              <span>Ask AI Query</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results Layout (Split Pane) */}
      <section className="flex-1 flex gap-gutter min-h-0 overflow-hidden">
        {/* Left Column: Results List */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {/* Result Categories/Tabs */}
          <div className="flex items-center gap-1 border-b border-outline-variant shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: `All (${results.length})` },
              { id: 'people', label: `People (${results.filter(r => mapCategory(r.type) === 'people').length})` },
              { id: 'phones', label: `Phones (${results.filter(r => mapCategory(r.type) === 'phones').length})` },
              { id: 'cases', label: `Cases (${results.filter(r => mapCategory(r.type) === 'cases').length})` },
              { id: 'locations', label: `Locations (${results.filter(r => mapCategory(r.type) === 'locations').length})` },
              { id: 'orgs', label: `Orgs (${results.filter(r => mapCategory(r.type) === 'orgs').length})` },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 font-metadata text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'border-b-2 border-secondary-container text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Scrollable Area */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar relative">
            {isSearching && (
              <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center">
                 <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
              </div>
            )}
            
            {filteredResults.length === 0 && !isSearching && (
              <div className="flex-1 flex items-center justify-center text-outline text-sm">
                No results found for "{query}".
              </div>
            )}
            
            {filteredResults.map((item) => {
              const isSelected = selectedResultId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedResultId(item.id)}
                  className={`bg-surface-container-lowest rounded-lg p-4 cursor-pointer flex gap-4 transition-all ${
                    isSelected
                      ? 'border-2 border-secondary-container shadow-[0px_4px_12px_rgba(38,56,69,0.08)]'
                      : 'border border-outline-variant hover:bg-surface-container-low hover:border-outline'
                  }`}
                >
                  <div className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[24px]">{getIcon(item.type)}</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-section-heading text-sm font-bold text-primary">{item.name}</h3>
                        <p className="font-body-sm text-xs text-on-surface-variant">{item.roleDescription || item.type}</p>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-secondary-container text-white font-label-caps text-[10px] uppercase flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span>{item.aiConfidence}% Match</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 font-metadata text-[11px] text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">source</span>
                        <span>{item.evidenceSourcesCount} Sources</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">work</span>
                        <span>{item.activeCasesLinked} Cases</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">update</span>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Result Inspector */}
        {selectedResult && (
          <div className="w-[360px] bg-white border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-outline-variant/60 pb-4">
                <div>
                  <span className="font-label-caps text-[9px] text-secondary-container uppercase tracking-wider font-bold">
                    Intelligence Dossier
                  </span>
                  <h3 className="font-section-heading text-base font-bold text-primary mt-0.5">
                    {selectedResult.name}
                  </h3>
                  <p className="font-metadata text-[11px] text-outline">{selectedResult.roleDescription || selectedResult.type}</p>
                </div>
                <span className="font-label-caps text-[10px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded-full font-bold">
                  {selectedResult.aiConfidence}% Reliability
                </span>
              </div>

              <div>
                <h4 className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold mb-1">
                  Summary
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {selectedResult.synopsis}
                </p>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-outline">Linked Cases:</span>
                  <span className="font-bold text-primary">{selectedResult.activeCasesLinked} Active</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-outline">Verified Sources:</span>
                  <span className="font-bold text-primary">{selectedResult.evidenceSourcesCount} Files</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-outline">Status:</span>
                  <span className="font-bold text-secondary-container">Under Monitoring</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/60 space-y-2">
              <button
                onClick={() => navigate(`/entities/${selectedResult.id}`)}
                className="w-full py-2 bg-secondary-container text-white font-bold text-xs rounded hover:bg-secondary transition-colors shadow-sm"
              >
                Open Full Entity Profile
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/network-analysis')}
                  className="py-1.5 border border-primary text-primary font-medium text-xs rounded hover:bg-surface-container transition-colors"
                >
                  View in Graph
                </button>
                <button
                  onClick={() => openEvidenceModal()}
                  className="py-1.5 border border-outline-variant text-on-surface-variant font-medium text-xs rounded hover:bg-surface-container transition-colors"
                >
                  View Evidence
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
