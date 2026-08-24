import React, { createContext, useContext, useState } from 'react';
import { Case, Entity, EvidenceItem } from '../types';
import { mockCases } from '../mock/cases';
import { mockEntities } from '../mock/entities';
import { mockEvidence } from '../mock/evidence';

interface CaseContextType {
  currentCase: Case;
  setCurrentCase: (c: Case) => void;
  selectedEntity: Entity | null;
  setSelectedEntity: (e: Entity | null) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isEvidenceModalOpen: boolean;
  selectedEvidence: EvidenceItem | null;
  openEvidenceModal: (evidence?: EvidenceItem | string) => void;
  closeEvidenceModal: () => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCase, setCurrentCase] = useState<Case>(mockCases[0]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(mockEntities[0]);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const openEvidenceModal = (evidence?: EvidenceItem | string) => {
    if (typeof evidence === 'string') {
      const found = mockEvidence.find(e => e.id === evidence || e.referenceId === evidence);
      setSelectedEvidence(found || mockEvidence[0]);
    } else if (evidence) {
      setSelectedEvidence(evidence);
    } else {
      setSelectedEvidence(mockEvidence[0]);
    }
    setIsEvidenceModalOpen(true);
  };

  const closeEvidenceModal = () => {
    setIsEvidenceModalOpen(false);
  };

  return (
    <CaseContext.Provider
      value={{
        currentCase,
        setCurrentCase,
        selectedEntity,
        setSelectedEntity,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isEvidenceModalOpen,
        selectedEvidence,
        openEvidenceModal,
        closeEvidenceModal,
        isSearchModalOpen,
        setIsSearchModalOpen,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};
