// Pure state and CSV logic for the COP (Choice/Partner Preference) experiment.
// No DOM access here — all functions take plain values and return plain values.

export function createCopState() {
  return {
    zone: 'center', // 'center' | 'objectOne' | 'objectTwo'
    chewOne: 0,
    chewTwo: 0,
    hopOne: 0,
    hopTwo: 0,
    earsOne: 0,
    earsTwo: 0,
    centerHops: 0,
    centerEars: 0,
    behaviors: [], // Array of { stim: 'inOne'|'inTwo'|'center', time: number }
  };
}

export function recordBehavior(state, stim, time) {
  const zone =
    stim === 'inOne' ? 'objectOne' :
    stim === 'inTwo' ? 'objectTwo' :
    'center';
  return {
    ...state,
    zone,
    behaviors: [...state.behaviors, { stim, time }],
  };
}

export function recordChew(state) {
  if (state.zone === 'objectOne') return { ...state, chewOne: state.chewOne + 1 };
  if (state.zone === 'objectTwo') return { ...state, chewTwo: state.chewTwo + 1 };
  return state;
}

export function recordHop(state) {
  if (state.zone === 'objectOne') return { ...state, hopOne: state.hopOne + 1 };
  if (state.zone === 'objectTwo') return { ...state, hopTwo: state.hopTwo + 1 };
  return { ...state, centerHops: state.centerHops + 1 };
}

export function recordEar(state) {
  if (state.zone === 'objectOne') return { ...state, earsOne: state.earsOne + 1 };
  if (state.zone === 'objectTwo') return { ...state, earsTwo: state.earsTwo + 1 };
  return { ...state, centerEars: state.centerEars + 1 };
}

// Converts "MM:SS" display string to total seconds.
export function stringToIntTime(timeString) {
  const parts = timeString.split(':');
  return (+parts[0]) * 60 + (+parts[1]);
}

// Builds the metadata rows for the top section of the COP CSV.
// Returns an array of arrays — each inner array is one CSV row.
export function buildCopCsvMetadata({
  objectOne, objectTwo,
  filename, female, stud, date, name, notes,
  timeWithOne, timeWithTwo,
  state, flags,
}) {
  return [
    ['Experiment', ' ', filename],
    ['Female', ' ', female],
    ['Stud', ' ', stud],
    ['Date', ' ', date],
    ['Name', ' ', name],
    ['Notes', ' ', notes],
    ['Time with ' + objectOne, ' ', stringToIntTime(timeWithOne)],
    ['Time with ' + objectTwo, ' ', stringToIntTime(timeWithTwo)],
    [objectOne + ' Chews', ' ', state.chewOne],
    [objectOne + ' Hops', ' ', state.hopOne],
    [objectOne + ' Ears', ' ', state.earsOne],
    ['Center Hops', ' ', state.centerHops],
    ['Center Ears', ' ', state.centerEars],
    [objectTwo + ' Chews', ' ', state.chewTwo],
    [objectTwo + ' Hops', ' ', state.hopTwo],
    [objectTwo + ' Ears', ' ', state.earsTwo],
    ['Flags: ', flags],
    [],
  ];
}

// Returns the column header line that appears above the behavior data table.
export function buildCopCsvColumnHeader(objectOne, objectTwo) {
  return `,${objectOne},Center,${objectTwo}`;
}
