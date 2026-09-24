import { useState, useEffect } from 'react';
import { getCaseNetwork } from '../services/api';

export const useNetworkGraph = (caseId?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    getCaseNetwork(caseId)
      .then((res: any) => {
        setGraphData(res);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to load network graph');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [caseId]);

  return { graphData, loading, error };
};
