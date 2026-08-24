import React, { useState } from 'react';
import { mockDataSources } from '../../mock/analytics';
import { auditService } from '../../services';

type PipelineStep = 'idle' | 'uploading' | 'validating' | 'extracting' | 'resolving' | 'building' | 'complete';

export const DataSourcesPage: React.FC = () => {
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string>('FIR_Case_2026_0142_MUM.pdf');

  const startIngestion = async () => {
    setPipelineStep('uploading');
    setProgress(15);
    await new Promise((r) => setTimeout(r, 600));

    setPipelineStep('validating');
    setProgress(35);
    await new Promise((r) => setTimeout(r, 600));

    setPipelineStep('extracting');
    setProgress(60);
    await new Promise((r) => setTimeout(r, 800));

    setPipelineStep('resolving');
    setProgress(85);
    await new Promise((r) => setTimeout(r, 600));

    setPipelineStep('building');
    setProgress(95);
    await new Promise((r) => setTimeout(r, 500));

    setPipelineStep('complete');
    setProgress(100);
    await auditService.logAuditEvent('Ingested Data Source Pipeline', `File: ${selectedFile} (4 Entities, 3 Relationships Extracted)`, '2026-0142');
  };

  const resetPipeline = () => {
    setPipelineStep('idle');
    setProgress(0);
  };

  return (
    <div className="p-margin-page flex flex-col gap-margin-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Data Sources &amp; Ingestion Pipeline</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Real-time multimodal intake from law enforcement databases, telecom feeds, and financial gateways
          </p>
        </div>
        <button
          onClick={() => alert('Opening API credential key manager...')}
          className="font-metadata text-xs text-secondary-container border border-secondary-container px-3.5 py-1.5 rounded font-bold hover:bg-secondary-container/10 transition-colors self-start sm:self-center"
        >
          Manage API Credentials
        </button>
      </div>

      {/* Active Integrations Grid */}
      <section>
        <h3 className="font-section-heading text-sm font-bold text-primary mb-3">Active Data Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {mockDataSources.map((ds) => (
            <div
              key={ds.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-panel-padding hover:border-secondary-container transition-colors relative overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary-container" />
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">{ds.icon}</span>
                    <h4 className="font-body-md text-xs font-bold text-on-surface">{ds.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 font-label-caps text-[9px] text-primary border border-primary/20 font-bold uppercase">
                    {ds.status}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mb-4">{ds.description}</p>
              </div>

              <div className="flex justify-between items-center text-metadata text-[10px] text-on-surface-variant border-t border-outline-variant/50 pt-2 font-mono">
                <span>Sync: {ds.lastSync}</span>
                <span className="font-bold text-primary">{ds.recordsCount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Upload & Ingestion Pipeline Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Upload Box (Span 1) */}
        <section className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-section-heading text-sm font-bold text-primary mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">cloud_upload</span>
              <span>Manual Dossier Intake</span>
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant mb-4">
              Upload unformatted FIR scans, CDR spreadsheets, or interrogation notes for automated NLP extraction.
            </p>

            <div className="border-2 border-dashed border-outline-variant hover:border-secondary-container p-6 rounded-lg text-center cursor-pointer transition-colors bg-surface-bright space-y-2">
              <span className="material-symbols-outlined text-outline text-[36px]">upload_file</span>
              <div className="font-body-sm text-xs text-primary font-bold">
                Drop FIR / CDR / Interrogation files here
              </div>
              <p className="font-metadata text-[10px] text-outline">Supported: PDF, CSV, TXT, DOCX (Max 100MB)</p>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs bg-surface-container-low p-2 rounded border border-outline-variant/60">
              <span className="font-mono text-[11px] text-primary font-semibold truncate">{selectedFile}</span>
              <span className="font-label-caps text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">Ready</span>
            </div>
          </div>

          <button
            onClick={startIngestion}
            disabled={pipelineStep !== 'idle' && pipelineStep !== 'complete'}
            className="w-full mt-4 py-2.5 bg-secondary-container text-white font-bold text-xs rounded hover:bg-secondary transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            <span>Execute Intelligence Extraction</span>
          </button>
        </section>

        {/* Live Processing Pipeline Stepper (Span 2) */}
        <section className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_tree</span>
                <span>Automated Extraction &amp; Graph Ingestion Pipeline</span>
              </h3>
              <span className="font-metadata text-xs font-mono font-bold text-secondary-container">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-6">
              <div
                className="bg-secondary-container h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps Visualizer */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {[
                { id: 'uploading', label: '1. Ingest', icon: 'file_upload' },
                { id: 'validating', label: '2. Schema Check', icon: 'verified' },
                { id: 'extracting', label: '3. NLP Entity', icon: 'psychology' },
                { id: 'resolving', label: '4. Entity Link', icon: 'merge_type' },
                { id: 'building', label: '5. Graph Update', icon: 'hub' },
              ].map((step, idx) => {
                const isCurrent = pipelineStep === step.id;
                const isPassed =
                  pipelineStep === 'complete' ||
                  (pipelineStep === 'building' && idx < 4) ||
                  (pipelineStep === 'resolving' && idx < 3) ||
                  (pipelineStep === 'extracting' && idx < 2) ||
                  (pipelineStep === 'validating' && idx < 1);

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'border-secondary-container bg-secondary-container/10 shadow-sm'
                        : isPassed
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant bg-surface text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                    <span className="font-label-caps text-[9px] uppercase font-bold">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline Output Log */}
          <div className="mt-4 bg-surface p-4 rounded-lg border border-outline-variant space-y-2">
            <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold block">
              Extraction Telemetry Log
            </span>
            <div className="font-mono text-[11px] text-on-surface-variant space-y-1">
              {pipelineStep === 'idle' && <div>Pipeline idle. Awaiting document ingestion trigger.</div>}
              {pipelineStep !== 'idle' && (
                <>
                  <div className="text-secondary-container">▸ [2026-10-24 14:32:00] Ingesting {selectedFile}...</div>
                  {progress >= 35 && <div className="text-primary">✓ SHA-256 Checksum verified. Bit-level format validated.</div>}
                  {progress >= 60 && <div className="text-secondary font-bold">✓ Identified 4 named entities (Ramesh, Suresh, MH12AB1234, XYZ Market).</div>}
                  {progress >= 85 && <div className="text-primary">✓ Entity resolution: Linked 'Ramesh' to Target UID-8842-A (98% confidence).</div>}
                  {progress >= 100 && (
                    <div className="text-secondary-container font-bold">
                      ✓ Network graph topology updated. Inferred 3 relationship vectors to Case 2026-0142.
                    </div>
                  )}
                </>
              )}
            </div>

            {pipelineStep === 'complete' && (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={resetPipeline}
                  className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-semibold"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
