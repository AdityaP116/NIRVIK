import { DocumentIntelligenceItem } from '../types';

export const mockDocuments: DocumentIntelligenceItem[] = [
  {
    id: 'doc-fir-01',
    documentId: 'FIR-2026-0142-MUM',
    caseId: 'case-2026-0142',
    caseNumber: '2026-0142',
    title: 'First Information Report — Special Crime Precinct 4',
    scannedDate: '24-AUG-2026 14:32 IST',
    status: 'AI PROCESSED',
    rawText: `ORIGINAL TEXT SCANNED: 24-AUG-2026 14:32 IST

Statement recorded at localized precinct. The complainant states that on 12/08/2026, an altercation occurred at the commercial premises located near XYZ Market.

Witnesses observed two primary suspects, identified primarily as Ramesh and his known associate Suresh, engaging in a heated exchange regarding disputed logistics cargo. The situation escalated rapidly.

Following the disruption, precinct units were dispatched. Prior to arrival, both individuals were seen fleeing the sector in a privately registered vehicle. City CCTV grid captured a white SUV bearing registration MH12AB1234 exiting the market perimeter at high velocity heading northbound toward the highway interchange.

Current directives involve tracking the registered plates through the national transport grid and cross-referencing known operational zones for the identified individuals.`,
    extractedEntities: [
      {
        id: 'ent-ext-01',
        name: 'Ramesh',
        type: 'person',
        role: 'Primary Suspect',
        confidence: 98,
        matchText: 'Ramesh',
      },
      {
        id: 'ent-ext-02',
        name: 'Suresh',
        type: 'person',
        role: 'Associate',
        confidence: 92,
        matchText: 'Suresh',
      },
      {
        id: 'ent-ext-03',
        name: 'XYZ Market',
        type: 'location',
        role: 'Incident Location',
        confidence: 94,
        matchText: 'XYZ Market',
      },
      {
        id: 'ent-ext-04',
        name: 'MH12AB1234',
        type: 'vehicle',
        role: 'Escape Transport',
        confidence: 96,
        matchText: 'MH12AB1234',
      },
    ],
    extractedRelationships: [
      {
        source: 'Ramesh',
        target: 'Suresh',
        relationship: 'Associate / Co-perpetrator',
        confidence: 92,
      },
      {
        source: 'Ramesh',
        target: 'MH12AB1234',
        relationship: 'Vehicle Occupant',
        confidence: 96,
      },
      {
        source: 'MH12AB1234',
        target: 'XYZ Market',
        relationship: 'Fled From Scene',
        confidence: 95,
      },
    ],
  },
];
