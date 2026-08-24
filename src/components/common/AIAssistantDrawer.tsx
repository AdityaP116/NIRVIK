import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { aiService, auditService } from '../../services';
import { AIQueryResponse } from '../../types';
import { useNavigate } from 'react-router-dom';

export const AIAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, currentCase, openEvidenceModal } = useCaseContext();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AIQueryResponse[]>([
    {
      id: 'init-01',
      query: 'Show connections between Ramesh Kumar and Case 2025-0891',
      answer:
        'Ramesh Kumar acts as a structural bridge between active Case 2026-0142 and closed Hawala Case 2025-0891. Communication logs confirm high-frequency burst messaging with secondary broker Vikram R. and corporate financial transfers through Front Corp Ltd. to offshore account #8843.',
      confidence: 94,
      summary: 'Cross-case intermediary link verified with 94% pattern correlation.',
      relatedEntities: [
        { id: 'entity-ramesh-kumar', name: 'Ramesh Kumar', type: 'person' },
        { id: 'entity-front-corp', name: 'Front Corp Ltd.', type: 'organization' },
      ],
      relatedCases: [
        { id: 'case-2026-0142', caseNumber: '2026-0142', title: 'Organized Financial Network' },
        { id: 'case-2025-0891', caseNumber: '2025-0891', title: 'Operation Golden Gateway' },
      ],
      evidenceCitations: [
        { id: 'ev-fir-01', referenceId: 'FIR-MH-24-091', title: 'FIR Document XYZ Market' },
        { id: 'ev-stmt-01', referenceId: 'STMT-HDFC-889', title: 'Bank Statement Front Corp' },
      ],
    },
  ]);
  const navigate = useNavigate();

  const suggestedQueries = [
    'Which entities connect the largest communities?',
    'Show unusual wire transfer activity in the last 48 hours.',
    'Find cases connected through the same phone number.',
    'Explain why Ramesh Kumar is flagged as high flight risk.',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const response = await aiService.queryAssistant(q, currentCase.id);
      setHistory((prev) => [response, ...prev]);
      await auditService.logAuditEvent('Executed AI Investigation Query', `Query: "${q}"`, currentCase.caseNumber);
      setQuery('');
    } finally {
      setLoading(false);
    }
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAiDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-surface border-l border-outline-variant shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <div>
              <h2 className="font-section-heading text-sm font-bold text-on-primary">NIRVIK AI Assistant</h2>
              <p className="font-metadata text-[10px] text-on-primary/70">Investigation Decision Support &amp; Explainability</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1 rounded text-on-primary/70 hover:text-on-primary hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="p-3 bg-surface-container-low border-b border-outline-variant">
          <span className="font-metadata text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
            Suggested Intelligence Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestQueries(suggestedQueries, (prompt) => handleSend(prompt))}
          </div>
        </div>

        {/* Chat / Query History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {loading && (
            <div className="bg-surface-container-lowest border border-secondary-container/30 rounded-lg p-4 shadow-sm animate-pulse flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container animate-spin text-[20px]">
                progress_activity
              </span>
              <span className="font-body-sm text-xs text-primary font-medium">
                Synthesizing network topology and evidence linkages...
              </span>
            </div>
          )}

          {history.map((item) => (
            <div key={item.id} className="space-y-3">
              {/* User Query Bubble */}
              <div className="flex justify-end">
                <div className="bg-primary text-on-primary px-3.5 py-2 rounded-xl rounded-tr-none text-xs max-w-[85%] shadow-sm">
                  {item.query}
                </div>
              </div>

              {/* AI Response Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
                  <div className="flex items-center gap-1.5 text-secondary-container font-bold text-xs">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      psychology
                    </span>
                    <span>Analytical Finding</span>
                  </div>
                  <span className="font-label-caps text-[10px] bg-secondary-container/10 text-secondary-container border border-secondary-container/20 px-2 py-0.5 rounded-full font-bold">
                    Confidence: {item.confidence}%
                  </span>
                </div>

                <p className="font-body-sm text-xs text-primary leading-relaxed">
                  {item.answer}
                </p>

                {/* Related Entities */}
                {item.relatedEntities && item.relatedEntities.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="font-label-caps text-[9px] text-outline uppercase tracking-wider block">
                      Related Entities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.relatedEntities.map((ent) => (
                        <button
                          key={ent.id}
                          onClick={() => {
                            setIsAiDrawerOpen(false);
                            navigate(`/entities/${ent.id}`);
                          }}
                          className="px-2 py-0.5 rounded bg-surface-container hover:bg-secondary-container hover:text-white transition-colors text-[11px] font-medium border border-outline-variant flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[12px]">person</span>
                          {ent.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence Citations */}
                {item.evidenceCitations && item.evidenceCitations.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-outline-variant/40">
                    <span className="font-label-caps text-[9px] text-outline uppercase tracking-wider block">
                      Supporting Evidence:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.evidenceCitations.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => openEvidenceModal(ev.id)}
                          className="px-2 py-0.5 rounded bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors text-[10px] font-mono border border-primary/10 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[11px]">source</span>
                          {ev.referenceId}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-outline-variant bg-surface-bright">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask NIRVIK about this investigation..."
              className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 text-xs text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-3.5 py-2 bg-secondary-container text-on-primary font-bold text-xs rounded hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
          <p className="font-metadata text-[10px] text-outline mt-1.5 text-center">
            NIRVIK provides explainable analytical decision support. Decisions require human review.
          </p>
        </div>
      </div>
    </div>
  );
};

function suggestQueries(queries: string[], onSelect: (q: string) => void) {
  return queries.map((q, i) => (
    <button
      key={i}
      onClick={() => onSelect(q)}
      className="text-left text-[11px] bg-surface-container-lowest hover:border-secondary-container hover:text-secondary border border-outline-variant px-2 py-1 rounded text-on-surface-variant transition-colors"
    >
      {q}
    </button>
  ));
}
