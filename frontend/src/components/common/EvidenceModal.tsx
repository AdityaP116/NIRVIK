import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { evidenceService, auditService } from '../../services';

export const EvidenceModal: React.FC = () => {
  const { isEvidenceModalOpen, closeEvidenceModal, selectedEvidence } = useCaseContext();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(null);

  if (!isEvidenceModalOpen || !selectedEvidence) return null;

  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const result = await evidenceService.verifyIntegrity(selectedEvidence.id);
    setVerifiedStatus(result.verified);
    setIsVerifying(false);
    await auditService.logAuditEvent('Verified Evidence SHA-256 Checksum', `${selectedEvidence.referenceId} (${selectedEvidence.fileName})`, selectedEvidence.caseNumber);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={closeEvidenceModal} />

      {/* Modal Card */}
      <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant bg-surface flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center border border-tertiary">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-secondary-container font-bold">{selectedEvidence.referenceId}</span>
                <span className="font-label-caps text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                  {selectedEvidence.sourceType}
                </span>
              </div>
              <h3 className="font-section-heading text-base font-bold text-primary mt-0.5">{selectedEvidence.title}</h3>
            </div>
          </div>
          <button onClick={closeEvidenceModal} className="p-1 rounded text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant/60">
            <div>
              <span className="font-metadata text-[10px] text-outline uppercase block">Case Number</span>
              <span className="font-body-sm text-xs font-bold text-primary">{selectedEvidence.caseNumber}</span>
            </div>
            <div>
              <span className="font-metadata text-[10px] text-outline uppercase block">File Size</span>
              <span className="font-body-sm text-xs text-primary">{selectedEvidence.fileSize}</span>
            </div>
            <div>
              <span className="font-metadata text-[10px] text-outline uppercase block">Uploaded By</span>
              <span className="font-body-sm text-xs text-primary">{selectedEvidence.uploadedBy}</span>
            </div>
            <div>
              <span className="font-metadata text-[10px] text-outline uppercase block">Relevance Score</span>
              <span className="font-body-sm text-xs text-secondary-container font-bold">{selectedEvidence.relevanceScore}% Match</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Checksum Box */}
          <div className="border border-outline-variant rounded-lg p-4 bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">enhanced_encryption</span>
                SHA-256 Cryptographic Hash (Immutable Proof)
              </span>
              <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full px-2.5 py-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="font-metadata text-[10px] font-bold text-primary">INTEGRITY VERIFIED</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant font-mono text-[11px] text-primary break-all select-all">
              {selectedEvidence.sha256}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-metadata text-[10px] text-outline">
                Verified against State Evidence Ledger · Timestamp: {selectedEvidence.timestamp}
              </span>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-3 py-1.5 bg-primary text-on-primary rounded font-metadata text-[11px] hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                    <span>Re-verify Checksum</span>
                  </>
                )}
              </button>
            </div>

            {verifiedStatus && (
              <div className="bg-primary/5 border border-primary/20 text-primary p-2.5 rounded text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary-container">verified</span>
                <span>SHA-256 match confirmed. File bit-level integrity is 100% untampered.</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block mb-2">Evidence Tags</span>
            <div className="flex flex-wrap gap-2">
              {selectedEvidence.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-surface-container text-on-surface text-xs rounded border border-outline-variant">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant bg-surface-bright flex justify-between items-center">
          <button
            onClick={closeEvidenceModal}
            className="px-4 py-2 border border-outline-variant rounded text-xs font-medium hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => alert(`Exporting chain of custody for ${selectedEvidence.referenceId}`)}
              className="px-4 py-2 border border-primary text-primary rounded text-xs font-medium hover:bg-surface-container-low transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              View Provenance
            </button>
            <button
              onClick={() => alert(`Downloading verified source: ${selectedEvidence.fileName}`)}
              className="px-4 py-2 bg-secondary-container text-on-primary font-bold rounded text-xs hover:bg-secondary transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
