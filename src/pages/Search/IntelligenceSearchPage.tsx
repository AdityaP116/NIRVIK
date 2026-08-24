import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { mockEntities } from '../../mock/entities';

export const IntelligenceSearchPage: React.FC = () => {
  const [query, setQuery] = useState('Ramesh Kumar');
  const [activeCategory, setActiveCategory] = useState<'all' | 'people' | 'phones' | 'cases' | 'locations' | 'orgs'>('all');
  const [selectedResultId, setSelectedResultId] = useState<string>('entity-ramesh-kumar');
  const navigate = useNavigate();
  const { openEvidenceModal, setIsAiDrawerOpen } = useCaseContext();

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  const results = [
    {
      id: 'entity-ramesh-kumar',
      name: 'Ramesh Kumar',
      category: 'people',
      type: 'person',
      subtitle: 'Primary Target · AKA "RK"',
      confidence: 98,
      sourcesCount: 12,
      caseLink: 'Case 2025-0891',
      lastActive: 'Active Today',
      icon: 'person',
      isFlagged: true,
      description: 'Primary structural node orchestrating asset transfers between Front Corp Ltd. and offshore accounts.',
    },
    {
      id: 'entity-phone-primary',
      name: '+91 98765 43210',
      category: 'phones',
      type: 'phone',
      subtitle: 'Prepaid Mobile · Linked to Target',
      confidence: 75,
      sourcesCount: 4,
      caseLink: 'Multiple Cases',
      lastActive: '2 days ago',
      icon: 'smartphone',
      isFlagged: false,
      description: 'Prepaid SIM active on handset IMEI 358941094821092 pinged across Pune logistics sector.',
    },
    {
      id: 'entity-loc-xyz',
      name: 'Warehouse 42, Port District',
      category: 'locations',
      type: 'location',
      subtitle: 'Commercial Property · Suspected Safehouse',
      confidence: 60,
      sourcesCount: 2,
      caseLink: 'Case 2025-0891',
      lastActive: '1 week ago',
      icon: 'location_on',
      isFlagged: false,
      description: 'Storage facility under surveillance for illicit cargo transfer.',
    },
    {
      id: 'entity-front-corp',
      name: 'Global Logistics Pvt Ltd',
      category: 'orgs',
      type: 'organization',
      subtitle: 'Shell Company · Front Corp Affiliate',
      confidence: 88,
      sourcesCount: 8,
      caseLink: 'Case 2026-0142',
      lastActive: '3 days ago',
      icon: 'business',
      isFlagged: true,
      description: 'Import/export trading front with zero physical retail footprint.',
    },
  ];

  const filteredResults = results.filter((r) => {
    if (activeCategory !== 'all' && r.category !== activeCategory) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
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
              onClick={() => handleExampleClick('Show connections between Ramesh Kumar and Case 2025-0891')}
              className="px-3 py-1 rounded-full border border-outline-variant bg-surface-container-lowest font-body-sm text-xs text-on-surface hover:border-primary transition-colors whitespace-nowrap"
            >
              Show connections between Ramesh Kumar and Case 2025-0891
            </button>
            <button
              onClick={() => handleExampleClick('Find all active phones linked to target syndicate')}
              className="px-3 py-1 rounded-full border border-outline-variant bg-surface-container-lowest font-body-sm text-xs text-on-surface hover:border-primary transition-colors whitespace-nowrap"
            >
              Find all active phones linked to target syndicate
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
          <div className="flex items-center gap-1 border-b border-outline-variant shrink-0">
            {[
              { id: 'all', label: 'All (142)' },
              { id: 'people', label: 'People (24)' },
              { id: 'phones', label: 'Phones (58)' },
              { id: 'cases', label: 'Cases (12)' },
              { id: 'locations', label: 'Locations (45)' },
              { id: 'orgs', label: 'Orgs (3)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 font-metadata text-xs uppercase tracking-wider font-bold transition-colors ${
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
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar">
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
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-section-heading text-sm font-bold text-primary">{item.name}</h3>
                        <p className="font-body-sm text-xs text-on-surface-variant">{item.subtitle}</p>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-secondary-container text-white font-label-caps text-[10px] uppercase flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span>{item.confidence}% Match</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 font-metadata text-[11px] text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">source</span>
                        <span>{item.sourcesCount} Sources</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">work</span>
                        <span>{item.caseLink}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">update</span>
                        <span>{item.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Result Inspector */}
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
                <p className="font-metadata text-[11px] text-outline">{selectedResult.subtitle}</p>
              </div>
              <span className="font-label-caps text-[10px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded-full font-bold">
                {selectedResult.confidence}% Reliability
              </span>
            </div>

            <div>
              <h4 className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold mb-1">
                Summary
              </h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                {selectedResult.description}
              </p>
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-outline">Linked Case:</span>
                <span className="font-bold text-primary">{selectedResult.caseLink}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-outline">Verified Sources:</span>
                <span className="font-bold text-primary">{selectedResult.sourcesCount} Files</span>
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
      </section>
    </div>
  );
};
