import { atom } from 'jotai';

export interface ExperimentData {
  experimentTitle: string;
  experimenterName: string;
  femaleNumber: string;
  studNumber: string;
  date: string;
  objectOne: string;
  objectTwo: string;
}

// Initial experiment data
const initialExperimentData: ExperimentData = {
  experimentTitle: '',
  experimenterName: '',
  femaleNumber: '',
  studNumber: '',
  date: '',
  objectOne: '',
  objectTwo: '',
};

// Main experiment data atom
export const experimentDataAtom = atom<ExperimentData>(initialExperimentData);

// Utility atom for updating multiple fields at once
export const updateExperimentDataAtom = atom(
  null,
  (get, set, updates: Partial<ExperimentData>) => {
    set(experimentDataAtom, { ...get(experimentDataAtom), ...updates });
  }
);
