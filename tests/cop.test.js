import { describe, it, expect } from 'vitest';
import {
  createCopState,
  recordBehavior,
  recordChew,
  recordHop,
  recordEar,
  stringToIntTime,
  buildCopCsvMetadata,
  buildCopCsvColumnHeader,
} from '../src/cop/logic.js';

// ─── Time conversion ─────────────────────────────────────────────────────────

describe('stringToIntTime', () => {
  it('converts MM:SS to total seconds', () => {
    expect(stringToIntTime('02:30')).toBe(150);
    expect(stringToIntTime('00:00')).toBe(0);
    expect(stringToIntTime('10:00')).toBe(600);
    expect(stringToIntTime('15:45')).toBe(945);
    expect(stringToIntTime('01:01')).toBe(61);
  });
});

// ─── Zone state machine ───────────────────────────────────────────────────────

describe('COP zone state machine', () => {
  it('starts at center zone', () => {
    expect(createCopState().zone).toBe('center');
  });

  it('inOne transitions zone to objectOne', () => {
    const state = recordBehavior(createCopState(), 'inOne', 100);
    expect(state.zone).toBe('objectOne');
  });

  it('inTwo transitions zone to objectTwo', () => {
    const state = recordBehavior(createCopState(), 'inTwo', 100);
    expect(state.zone).toBe('objectTwo');
  });

  it('center transitions zone back to center', () => {
    let state = createCopState();
    state = recordBehavior(state, 'inOne', 100);
    state = recordBehavior(state, 'center', 130);
    expect(state.zone).toBe('center');
  });

  it('records behaviors in chronological order', () => {
    let state = createCopState();
    state = recordBehavior(state, 'inOne', 100);
    state = recordBehavior(state, 'center', 130);
    state = recordBehavior(state, 'inTwo', 200);
    expect(state.behaviors).toHaveLength(3);
    expect(state.behaviors[0]).toEqual({ stim: 'inOne', time: 100 });
    expect(state.behaviors[1]).toEqual({ stim: 'center', time: 130 });
    expect(state.behaviors[2]).toEqual({ stim: 'inTwo', time: 200 });
  });

  it('does not mutate previous state', () => {
    const original = createCopState();
    recordBehavior(original, 'inOne', 0);
    expect(original.zone).toBe('center');
    expect(original.behaviors).toHaveLength(0);
  });
});

// ─── Chew counter ────────────────────────────────────────────────────────────

describe('recordChew', () => {
  it('increments chewOne only when in objectOne zone', () => {
    let state = recordBehavior(createCopState(), 'inOne', 0);
    state = recordChew(state);
    state = recordChew(state);
    expect(state.chewOne).toBe(2);
    expect(state.chewTwo).toBe(0);
  });

  it('increments chewTwo only when in objectTwo zone', () => {
    let state = recordBehavior(createCopState(), 'inTwo', 0);
    state = recordChew(state);
    expect(state.chewTwo).toBe(1);
    expect(state.chewOne).toBe(0);
  });

  it('does not increment anything in center zone', () => {
    const state = recordChew(createCopState());
    expect(state.chewOne).toBe(0);
    expect(state.chewTwo).toBe(0);
  });
});

// ─── Hop counter ─────────────────────────────────────────────────────────────

describe('recordHop', () => {
  it('increments hopOne in objectOne zone', () => {
    let state = recordBehavior(createCopState(), 'inOne', 0);
    state = recordHop(state);
    expect(state.hopOne).toBe(1);
    expect(state.hopTwo).toBe(0);
    expect(state.centerHops).toBe(0);
  });

  it('increments hopTwo in objectTwo zone', () => {
    let state = recordBehavior(createCopState(), 'inTwo', 0);
    state = recordHop(state);
    expect(state.hopTwo).toBe(1);
    expect(state.hopOne).toBe(0);
    expect(state.centerHops).toBe(0);
  });

  it('increments centerHops in center zone', () => {
    let state = recordHop(createCopState());
    expect(state.centerHops).toBe(1);
    expect(state.hopOne).toBe(0);
    expect(state.hopTwo).toBe(0);
  });

  it('accumulates across multiple presses', () => {
    let state = recordBehavior(createCopState(), 'inOne', 0);
    state = recordHop(state);
    state = recordHop(state);
    state = recordHop(state);
    expect(state.hopOne).toBe(3);
  });
});

// ─── Ear counter ─────────────────────────────────────────────────────────────

describe('recordEar', () => {
  it('increments earsOne in objectOne zone', () => {
    let state = recordBehavior(createCopState(), 'inOne', 0);
    state = recordEar(state);
    state = recordEar(state);
    expect(state.earsOne).toBe(2);
    expect(state.earsTwo).toBe(0);
  });

  it('increments earsTwo in objectTwo zone', () => {
    let state = recordBehavior(createCopState(), 'inTwo', 0);
    state = recordEar(state);
    expect(state.earsTwo).toBe(1);
    expect(state.earsOne).toBe(0);
  });

  it('increments centerEars in center zone', () => {
    const state = recordEar(createCopState());
    expect(state.centerEars).toBe(1);
    expect(state.earsOne).toBe(0);
    expect(state.earsTwo).toBe(0);
  });

  it('earsOne and earsTwo are tracked independently across zones', () => {
    let state = createCopState();
    state = recordBehavior(state, 'inOne', 0);
    state = recordEar(state);
    state = recordEar(state);
    state = recordBehavior(state, 'center', 100);
    state = recordBehavior(state, 'inTwo', 200);
    state = recordEar(state);
    expect(state.earsOne).toBe(2);
    expect(state.earsTwo).toBe(1);
  });
});

// ─── CSV metadata structure ───────────────────────────────────────────────────

const baseState = {
  chewOne: 3, chewTwo: 1,
  hopOne: 5, hopTwo: 2,
  earsOne: 4, earsTwo: 6,
  centerHops: 7, centerEars: 8,
};

const baseParams = {
  objectOne: 'Stim',
  objectTwo: 'Stud',
  filename: 'Test01',
  female: '42',
  stud: '7',
  date: '14 Jun 2026 10:00am',
  name: 'John Win',
  notes: 'none',
  timeWithOne: '02:30',
  timeWithTwo: '01:15',
  flags: '',
  state: baseState,
};

describe('buildCopCsvMetadata — row count', () => {
  it('produces exactly 18 rows', () => {
    expect(buildCopCsvMetadata(baseParams)).toHaveLength(18);
  });
});

describe('buildCopCsvMetadata — row labels and positions', () => {
  const rows = buildCopCsvMetadata(baseParams);

  it('row 0: Experiment', () => {
    expect(rows[0][0]).toBe('Experiment');
    expect(rows[0][2]).toBe('Test01');
  });

  it('row 1: Female', () => {
    expect(rows[1][0]).toBe('Female');
    expect(rows[1][2]).toBe('42');
  });

  it('row 2: Stud', () => {
    expect(rows[2][0]).toBe('Stud');
    expect(rows[2][2]).toBe('7');
  });

  it('row 3: Date', () => {
    expect(rows[3][0]).toBe('Date');
    expect(rows[3][2]).toBe('14 Jun 2026 10:00am');
  });

  it('row 4: Name', () => {
    expect(rows[4][0]).toBe('Name');
    expect(rows[4][2]).toBe('John Win');
  });

  it('row 5: Notes', () => {
    expect(rows[5][0]).toBe('Notes');
    expect(rows[5][2]).toBe('none');
  });

  it('row 6: time with objectOne in seconds', () => {
    expect(rows[6][0]).toBe('Time with Stim');
    expect(rows[6][2]).toBe(150); // 2:30 = 150s
  });

  it('row 7: time with objectTwo in seconds', () => {
    expect(rows[7][0]).toBe('Time with Stud');
    expect(rows[7][2]).toBe(75); // 1:15 = 75s
  });

  it('row 8: objectOne chews', () => {
    expect(rows[8][0]).toBe('Stim Chews');
    expect(rows[8][2]).toBe(3);
  });

  it('row 9: objectOne hops', () => {
    expect(rows[9][0]).toBe('Stim Hops');
    expect(rows[9][2]).toBe(5);
  });

  it('row 10: objectOne ears — uses earsOne not earsTwo', () => {
    expect(rows[10][0]).toBe('Stim Ears');
    expect(rows[10][2]).toBe(4); // earsOne=4, earsTwo=6 — must be 4
  });

  it('row 11: center hops', () => {
    expect(rows[11][0]).toBe('Center Hops');
    expect(rows[11][2]).toBe(7);
  });

  it('row 12: center ears', () => {
    expect(rows[12][0]).toBe('Center Ears');
    expect(rows[12][2]).toBe(8);
  });

  it('row 13: objectTwo chews', () => {
    expect(rows[13][0]).toBe('Stud Chews');
    expect(rows[13][2]).toBe(1);
  });

  it('row 14: objectTwo hops', () => {
    expect(rows[14][0]).toBe('Stud Hops');
    expect(rows[14][2]).toBe(2);
  });

  it('row 15: objectTwo ears — uses earsTwo', () => {
    expect(rows[15][0]).toBe('Stud Ears');
    expect(rows[15][2]).toBe(6); // earsTwo=6
  });

  it('row 16: Flags', () => {
    expect(rows[16][0]).toBe('Flags: ');
  });

  it('row 17: empty terminator row', () => {
    expect(rows[17]).toEqual([]);
  });
});

describe('buildCopCsvMetadata — earsOne/earsTwo independence', () => {
  it('objectOne ears and objectTwo ears are never the same value when counts differ', () => {
    const rows = buildCopCsvMetadata({
      ...baseParams,
      state: { ...baseState, earsOne: 10, earsTwo: 3 },
    });
    expect(rows[10][2]).toBe(10); // objectOne ears
    expect(rows[15][2]).toBe(3);  // objectTwo ears
    expect(rows[10][2]).not.toBe(rows[15][2]);
  });
});

// ─── CSV column header ────────────────────────────────────────────────────────

describe('buildCopCsvColumnHeader', () => {
  it('format: comma, objectOne, Center, objectTwo', () => {
    expect(buildCopCsvColumnHeader('Stim', 'Stud')).toBe(',Stim,Center,Stud');
  });

  it('uses the provided object names verbatim', () => {
    expect(buildCopCsvColumnHeader('FemaleRat', 'MaleRat')).toBe(',FemaleRat,Center,MaleRat');
  });

  it('objectOne appears before objectTwo', () => {
    const header = buildCopCsvColumnHeader('A', 'B');
    const cols = header.split(',');
    expect(cols.indexOf('A')).toBeLessThan(cols.indexOf('B'));
  });
});
