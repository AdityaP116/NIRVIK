import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-01',
    badgeId: 'RAJ-4482',
    name: 'Rajiv Kumar',
    rank: 'Lead Intelligence Analyst',
    station: 'State Cyber & Special Crime Branch',
    jurisdiction: 'Maharashtra',
    role: 'Senior Investigator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-02',
    badgeId: 'LEE-8921',
    name: 'S. Lee',
    rank: 'Forensic Intelligence Officer',
    station: 'Financial Intelligence Unit',
    jurisdiction: 'Central Operations',
    role: 'Financial Analyst',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

export const currentOfficer: User = mockUsers[0];
