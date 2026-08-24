import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDocuments } from '../../mock/documents';
import { auditService } from '../../services';

export const DocumentIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [doc] = useState(mockDocuments[0]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-ext-01');
  const [showPersons, setShowPersons] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [isAddedToGraph, setIsAddedToGraph] = useState(false);

  const handleAddToGraph = async () => {
    setIsAddedToGraph(true);
    await auditService.logAuditEvent('Added Extracted Entities to Graph', `Document: ${doc.documentId} (4 Entities, 3 Relationships)`, doc.caseNumber);
    alert(`Successfully integrated 4 entities and 3 inferred links from ${doc.documentId} into Case ${doc.caseNumber} Network Graph.`);
  };

  return (
    <div className="p-margin-page flex flex-col gap-6 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-page-title text-page-title text-primary tracking-tight">Document Intelligence</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            NLP-powered entity &amp; relationship extraction from FIR documents and interrogation logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Exporting raw text and extraction metadata for ${doc.documentId}`)}
            className="px-3.5 py-2 border border-outline-variant rounded text-primary font-metadata text-xs font-semibold bg-surface hover:bg-surface-variant transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Source</span>
          </button>
          <button
            onClick={handleAddToGraph}
            className="px-4 py-2 rounded text-on-primary font-metadata text-xs font-bold bg-secondary-container hover:bg-secondary transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            <span>{isAddedToGraph ? 'Added to Graph ✓' : 'Add to Intelligence Graph'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-gutter min-h-0 items-start overflow-hidden">
        {/* Left Column: Document Viewer (Span 7) */}
        <div className="lg:col-span-7 bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-outline-variant bg-surface flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-outline text-[20px]">description</span>
              <h3 className="font-section-heading text-sm font-bold text-primary">{doc.documentId}</h3>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-label-caps text-[9px] flex items-center gap-1 border border-inverse-primary/30 font-bold">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              {doc.status}
            </span>
          </div>

          {/* Document Toolbar */}
          <div className="px-4 py-2 bg-surface-container-low border-b border-outline-variant flex flex-wrap items-center gap-4 text-xs shrink-0">
            <label className="flex items-center gap-1.5 font-metadata text-on-surface-variant cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={showPersons}
                onChange={() => setShowPersons(!showPersons)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="font-bold">Persons</span>
            </label>
            <label className="flex items-center gap-1.5 font-metadata text-on-surface-variant cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={showLocations}
                onChange={() => setShowLocations(!showLocations)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="font-bold">Locations</span>
            </label>
            <label className="flex items-center gap-1.5 font-metadata text-on-surface-variant cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={showVehicles}
                onChange={() => setShowVehicles(!showVehicles)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="font-bold">Vehicles</span>
            </label>

            <div className="ml-auto flex items-center gap-2">
              <span className="font-metadata text-[11px] text-on-surface-variant">Confidence Threshold:</span>
              <span className="text-secondary-container font-metadata text-xs font-bold">85%</span>
            </div>
          </div>

          {/* Document Content with Interactive Highlights */}
          <div className="flex-1 overflow-y-auto p-6 bg-surface-bright font-body-md text-on-surface leading-relaxed text-sm space-y-4 custom-scrollbar">
            <p className="font-metadata text-xs text-outline mb-4 pb-2 border-b border-outline-variant/50 font-mono">
              {doc.scannedDate} · SPECIAL CRIME BRANCH ARCHIVE
            </p>

            <p>
              Statement recorded at localized precinct. The complainant states that on 12/08/2026, an altercation occurred at
              the commercial premises located near{' '}
              {showLocations ? (
                <span
                  onClick={() => setSelectedEntityId('ent-ext-03')}
                  className="bg-primary-fixed/40 text-on-primary-fixed border border-primary-fixed-dim px-1.5 py-0.5 rounded shadow-sm inline-flex items-center gap-1 cursor-pointer font-semibold hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  XYZ Market
                </span>
              ) : (
                'XYZ Market'
              )}
              .
            </p>

            <p>
              Witnesses observed two primary suspects, identified primarily as{' '}
              {showPersons ? (
                <span
                  onClick={() => setSelectedEntityId('ent-ext-01')}
                  className="bg-error-container/40 text-on-error-container border border-error-container px-1.5 py-0.5 rounded shadow-sm inline-flex items-center gap-1 cursor-pointer font-bold hover:border-error"
                >
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Ramesh
                </span>
              ) : (
                'Ramesh'
              )}{' '}
              and his known associate{' '}
              {showPersons ? (
                <span
                  onClick={() => setSelectedEntityId('ent-ext-02')}
                  className="bg-surface-variant text-on-surface-variant border border-outline-variant px-1.5 py-0.5 rounded shadow-sm inline-flex items-center gap-1 cursor-pointer font-medium hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Suresh
                </span>
              ) : (
                'Suresh'
              )}
              , engaging in a heated exchange regarding disputed logistics cargo. The situation escalated rapidly.
            </p>

            <p>
              Following the disruption, precinct units were dispatched. Prior to arrival, both individuals were seen fleeing
              the sector in a privately registered vehicle. City CCTV grid captured a white SUV bearing registration{' '}
              {showVehicles ? (
                <span
                  onClick={() => setSelectedEntityId('ent-ext-04')}
                  className="bg-tertiary-fixed/60 text-on-tertiary-fixed border border-tertiary-fixed-dim px-1.5 py-0.5 rounded shadow-sm inline-flex items-center gap-1 cursor-pointer font-mono font-bold hover:border-primary"
                >
                  <span className="material-symbols-outlined text-[14px]">directions_car</span>
                  MH12AB1234
                </span>
              ) : (
                'MH12AB1234'
              )}{' '}
              exiting the market perimeter at high velocity heading northbound toward the highway interchange.
            </p>

            <p>
              Current directives involve tracking the registered plates through the national transport grid and
              cross-referencing known operational zones for the identified individuals.
            </p>
          </div>
        </div>

        {/* Right Column: Extracted Entities & Relationships (Span 5) */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4 overflow-hidden">
          {/* Extracted Entities Panel */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-outline-variant bg-surface flex justify-between items-center shrink-0">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">psychology</span>
                <span>Extracted Entities</span>
              </h3>
              <span className="font-metadata text-xs text-outline font-mono font-bold">
                {doc.extractedEntities.length} Identified
              </span>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 custom-scrollbar flex-1">
              {doc.extractedEntities.map((ent) => {
                const isSelected = selectedEntityId === ent.id;
                return (
                  <div
                    key={ent.id}
                    onClick={() => setSelectedEntityId(ent.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-surface-container-lowest border-2 border-secondary-container shadow-sm'
                        : 'bg-surface-container-low border-outline-variant/60 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          ent.type === 'person'
                            ? 'bg-primary text-white'
                            : ent.type === 'location'
                            ? 'bg-surface-variant text-on-surface'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {ent.type === 'person'
                            ? 'person'
                            : ent.type === 'location'
                            ? 'location_on'
                            : 'directions_car'}
                        </span>
                      </div>
                      <div>
                        <div className="font-body-md text-xs font-bold text-primary">{ent.name}</div>
                        <div className="font-metadata text-[10px] text-on-surface-variant">{ent.role}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-metadata text-xs text-secondary-container font-bold">
                        {ent.confidence}% Match
                      </span>
                      <span className="font-label-caps text-[9px] text-outline uppercase">{ent.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inferred Relationships Box */}
          <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm shrink-0 space-y-2">
            <h4 className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold">
              Inferred Relationship Triples
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {doc.extractedRelationships.map((rel, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/40">
                  <div className="flex items-center gap-1 text-primary">
                    <span className="font-bold">{rel.source}</span>
                    <span className="text-secondary-container">--[{rel.relationship}]-&gt;</span>
                    <span className="font-bold">{rel.target}</span>
                  </div>
                  <span className="text-[10px] text-outline font-sans font-bold">{rel.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
