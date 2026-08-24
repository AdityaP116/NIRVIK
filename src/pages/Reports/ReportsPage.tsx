import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { auditService } from '../../services';

export const ReportsPage: React.FC = () => {
  const { currentCase } = useCaseContext();
  const [sections, setSections] = useState({
    overview: true,
    graph: true,
    entities: true,
    findings: true,
    evidence: true,
    timeline: true,
    relatedCases: true,
    auditTrail: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsGenerating(false);
    setIsExported(true);
    await auditService.logAuditEvent('Exported Official Case Intelligence Dossier', `Case ${currentCase.caseNumber} (PDF Format)`, currentCase.caseNumber);
    alert(`Intelligence Dossier for Case ${currentCase.caseNumber} exported successfully. Cryptographic hash recorded in audit log.`);
  };

  return (
    <div className="p-margin-page flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Intelligence Dossier &amp; Reports</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Generate court-ready, evidence-backed intelligence summaries for authorized judicial submission
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="px-4 py-2 bg-secondary-container text-white font-bold text-xs rounded hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
          <span>{isGenerating ? 'Rendering PDF Dossier...' : 'Export Court Dossier (PDF)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Report Section Configurator (Span 4) */}
        <aside className="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h3 className="font-section-heading text-sm font-bold text-primary mb-1">Dossier Builder</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">Select intelligence components to compile</p>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'overview', label: '1. Executive Case Overview' },
              { id: 'graph', label: '2. Network Topology & Graph Centrality' },
              { id: 'entities', label: '3. Key Target & Entity Profiles' },
              { id: 'findings', label: '4. AI Anomaly & Explainability Findings' },
              { id: 'evidence', label: '5. Verified Evidence Vault & Hashes' },
              { id: 'timeline', label: '6. Chronological Incident Timeline' },
              { id: 'relatedCases', label: '7. Cross-Jurisdictional Case Links' },
              { id: 'auditTrail', label: '8. Immutable Chain of Custody Audit' },
            ].map((sec) => {
              const key = sec.id as keyof typeof sections;
              return (
                <label
                  key={sec.id}
                  className="flex items-center gap-3 p-2 rounded bg-surface hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/40"
                >
                  <input
                    type="checkbox"
                    checked={sections[key]}
                    onChange={() => toggleSection(key)}
                    className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                  />
                  <span className="font-body-sm text-primary font-medium">{sec.label}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('Dossier preview updated.')}
              className="w-full py-2 bg-primary text-on-primary font-bold text-xs rounded hover:bg-primary-container transition-colors shadow-sm"
            >
              Rebuild Preview
            </button>
          </div>
        </aside>

        {/* Right Column: Live Dossier Document Preview (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-outline-variant rounded-xl shadow-lg p-8 space-y-6">
          {/* Formal Dossier Header */}
          <div className="border-b-2 border-primary pb-4 flex justify-between items-start">
            <div>
              <div className="font-label-caps text-[10px] text-error font-bold uppercase tracking-widest mb-1">
                CONFIDENTIAL // LAW ENFORCEMENT RESTRICTED
              </div>
              <h1 className="font-page-title text-xl font-bold text-primary">
                CRIMINAL NETWORK INTELLIGENCE DOSSIER
              </h1>
              <p className="font-metadata text-xs text-on-surface-variant mt-1">
                STATE SPECIAL CRIME &amp; CYBER BRANCH · CASE REF: <b>{currentCase.caseNumber}</b>
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-primary font-bold block">CASE-2026-0142-EXP</span>
              <span className="font-metadata text-[10px] text-outline">Date: 24 Oct 2026</span>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          {sections.overview && (
            <div className="space-y-2">
              <h3 className="font-section-heading text-xs font-bold text-primary uppercase tracking-wider border-b border-outline-variant/60 pb-1">
                1. Executive Case Summary
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Investigation into an organized financial syndicate operating primarily out of Maharashtra. The network
                utilizes electronics front businesses and layered bank accounts to funnel illicit capital. Cross-case
                telemetry links active operations to closed Hawala Case 2025-0891.
              </p>
            </div>
          )}

          {/* Section 2: Key Targets & Bridge Nodes */}
          {sections.entities && (
            <div className="space-y-2">
              <h3 className="font-section-heading text-xs font-bold text-primary uppercase tracking-wider border-b border-outline-variant/60 pb-1">
                2. Key Bridge Entity — Ramesh Kumar (UID-8842-A)
              </h3>
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/60 text-xs space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="font-metadata text-[10px] text-outline uppercase block">Network Role:</span>
                    <span className="font-bold text-primary">Structural Bridge / Signatory</span>
                  </div>
                  <div>
                    <span className="font-metadata text-[10px] text-outline uppercase block">Betweenness Score:</span>
                    <span className="font-bold text-secondary-container">0.84 (High Influence)</span>
                  </div>
                  <div>
                    <span className="font-metadata text-[10px] text-outline uppercase block">Degree Centrality:</span>
                    <span className="font-bold text-primary">24 Direct Connections</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed pt-1">
                  <b>AI Finding:</b> Entity acts as the sole active bridge between isolated operational clusters in Mumbai and
                  Pune. Demonstrates anomalous high-frequency wire transactions of ₹4.2 Cr to offshore accounts.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Evidence & Cryptographic Verification */}
          {sections.evidence && (
            <div className="space-y-2">
              <h3 className="font-section-heading text-xs font-bold text-primary uppercase tracking-wider border-b border-outline-variant/60 pb-1">
                3. Verified Evidence Provenance Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-outline-variant font-label-caps text-[9px] text-on-surface-variant uppercase">
                      <th className="p-2 font-bold">Ref ID</th>
                      <th className="p-2 font-bold">Source</th>
                      <th className="p-2 font-bold">SHA-256 Checksum</th>
                      <th className="p-2 font-bold text-right">Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 font-bold text-primary">FIR-MH-24-091</td>
                      <td className="p-2 font-sans text-on-surface-variant">FIR Incident Report</td>
                      <td className="p-2 text-outline">8f72a4...bcde</td>
                      <td className="p-2 text-right font-sans font-bold text-secondary-container">✓ Verified</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-primary">STMT-HDFC-889</td>
                      <td className="p-2 font-sans text-on-surface-variant">Corporate Statement</td>
                      <td className="p-2 text-outline">910283...9384</td>
                      <td className="p-2 text-right font-sans font-bold text-secondary-container">✓ Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Verification Stamp & Sign-off */}
          <div className="pt-6 border-t-2 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded border-2 border-primary flex items-center justify-center text-primary font-bold text-xs">
                SEAL
              </div>
              <div className="text-xs">
                <span className="font-bold text-primary block">Lead Intelligence Analyst: Rajiv Kumar</span>
                <span className="font-metadata text-[10px] text-outline">State Cyber &amp; Special Crime Division</span>
              </div>
            </div>

            <div className="bg-primary/5 p-2.5 rounded border border-primary/10 text-right">
              <span className="font-label-caps text-[9px] text-secondary font-bold uppercase block">
                IMMUTABLE CHAIN OF CUSTODY
              </span>
              <span className="font-mono text-[10px] text-primary">BLOCK-ANCHOR: #44921-NIRVIK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
