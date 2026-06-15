import { describe, it, expect } from 'vitest';
import {
  createPacingState,
  stringToIntTime,
  timeToSeconds,
  secondsToTime,
  recordStim,
  recordMaleIn,
  recordMaleOut,
  recordHop,
  recordEar,
  recordKick,
  recordSqueak,
  recordRoll,
  getLqAvg,
  getPacingLq,
  getPercentExitMount,
  getPercentExitIntro,
  getPercentExitEjac,
  buildPacingCsvHeaderRows,
  buildPacingCsvDataColumnHeader,
} from '../src/pacing/logic.js';

// ─── Time utilities ───────────────────────────────────────────────────────────

describe('stringToIntTime', () => {
  it('converts MM:SS to total seconds', () => {
    expect(stringToIntTime('05:30')).toBe(330);
    expect(stringToIntTime('00:00')).toBe(0);
    expect(stringToIntTime('10:00')).toBe(600);
    expect(stringToIntTime('01:01')).toBe(61);
  });
});

describe('timeToSeconds', () => {
  it('strips colon and parses as integer (raw storage format)', () => {
    expect(timeToSeconds('01:30')).toBe(130);
    expect(timeToSeconds('00:00')).toBe(0);
    expect(timeToSeconds('12:34')).toBe(1234);
    expect(timeToSeconds('05:05')).toBe(505);
  });
});

describe('secondsToTime', () => {
  it('converts raw storage integer back to MM:SS (round-trip with timeToSeconds)', () => {
    expect(secondsToTime(130)).toBe('01:30');
    expect(secondsToTime(0)).toBe('00:00');
    expect(secondsToTime(505)).toBe('05:05');
    expect(secondsToTime(100)).toBe('01:00');
  });

  it('round-trips timeToSeconds → secondsToTime', () => {
    const times = ['01:00', '03:45', '09:09', '15:30'];
    times.forEach(t => expect(secondsToTime(timeToSeconds(t))).toBe(t));
  });
});

// ─── recordStim ──────────────────────────────────────────────────────────────

describe('recordStim — counts', () => {
  it('increments mountCount on mount', () => {
    const state = recordStim(createPacingState(), 'mount', 2, '01:00');
    expect(state.mountCount).toBe(1);
    expect(state.introCount).toBe(0);
    expect(state.ejacCount).toBe(0);
  });

  it('increments introCount on intro', () => {
    const state = recordStim(createPacingState(), 'intro', 1, '01:00');
    expect(state.introCount).toBe(1);
    expect(state.mountCount).toBe(0);
    expect(state.ejacCount).toBe(0);
  });

  it('increments ejacCount on ejac', () => {
    const state = recordStim(createPacingState(), 'ejac', 0, '01:00');
    expect(state.ejacCount).toBe(1);
    expect(state.mountCount).toBe(0);
    expect(state.introCount).toBe(0);
  });

  it('increments stimNumber on every stim type', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 0, '01:00');
    state = recordStim(state, 'intro', 1, '02:00');
    state = recordStim(state, 'ejac', 2, '03:00');
    expect(state.stimNumber).toBe(3);
  });
});

describe('recordStim — LQ tracking', () => {
  it('accumulates lqSum', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 2, '01:00');
    state = recordStim(state, 'intro', 3, '02:00');
    expect(state.lqSum).toBe(5);
  });

  it('counts stims with lq >= 2 in stimLQOverTwo', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 0, '01:00'); // no
    state = recordStim(state, 'mount', 1, '02:00'); // no
    state = recordStim(state, 'intro', 2, '03:00'); // yes
    state = recordStim(state, 'ejac',  3, '04:00'); // yes
    expect(state.stimLQOverTwo).toBe(2);
  });

  it('lq = 2 threshold is inclusive', () => {
    const s1 = recordStim(createPacingState(), 'mount', 2, '01:00');
    const s2 = recordStim(createPacingState(), 'mount', 1, '01:00');
    expect(s1.stimLQOverTwo).toBe(1);
    expect(s2.stimLQOverTwo).toBe(0);
  });
});

describe('recordStim — consecMountCount', () => {
  it('increments consecMountCount on consecutive mounts', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 1, '01:00');
    state = recordStim(state, 'mount', 1, '02:00');
    expect(state.consecMountCount).toBe(2);
  });

  it('resets consecMountCount on intro', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 1, '01:00');
    state = recordStim(state, 'mount', 1, '02:00');
    state = recordStim(state, 'intro', 1, '03:00');
    expect(state.consecMountCount).toBe(0);
  });

  it('resets consecMountCount on ejac', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 1, '01:00');
    state = recordStim(state, 'ejac', 1, '02:00');
    expect(state.consecMountCount).toBe(0);
  });
});

describe('recordStim — sexualBehavior array', () => {
  it('appends stim entry then lq entry for each stim', () => {
    const state = recordStim(createPacingState(), 'mount', 2, '01:00');
    expect(state.sexualBehavior).toHaveLength(2);
    expect(state.sexualBehavior[0]).toMatchObject({ stim: 'mount', lq: 2 });
    expect(state.sexualBehavior[1]).toMatchObject({ stim: 'lq', lq: 2 });
  });

  it('stores time using timeToSeconds format', () => {
    const state = recordStim(createPacingState(), 'intro', 1, '03:45');
    expect(state.sexualBehavior[0].time).toBe(345); // timeToSeconds('03:45')
  });

  it('sets newStim true after a stim', () => {
    expect(recordStim(createPacingState(), 'mount', 1, '01:00').newStim).toBe(true);
  });

  it('does not mutate previous state', () => {
    const original = createPacingState();
    recordStim(original, 'mount', 1, '01:00');
    expect(original.mountCount).toBe(0);
    expect(original.sexualBehavior).toHaveLength(0);
  });
});

// ─── recordMaleIn / recordMaleOut ─────────────────────────────────────────────

describe('recordMaleIn', () => {
  it('sets withMale true and increments maleIns', () => {
    const state = recordMaleIn(createPacingState(), '01:00');
    expect(state.withMale).toBe(true);
    expect(state.maleIns).toBe(1);
  });

  it('appends in entry to sexualBehavior with raw time', () => {
    const state = recordMaleIn(createPacingState(), '01:00');
    expect(state.sexualBehavior[0]).toEqual({ stim: 'in', time: 100 });
  });
});

describe('recordMaleOut', () => {
  it('sets withMale false and increments maleOuts and numberExits', () => {
    let state = recordMaleIn(createPacingState(), '01:00');
    state = recordMaleOut(state, '01:30');
    expect(state.withMale).toBe(false);
    expect(state.maleOuts).toBe(1);
    expect(state.numberExits).toBe(1);
  });

  it('sets newStim false on exit', () => {
    let state = recordMaleIn(createPacingState(), '01:00');
    state = recordStim(state, 'mount', 1, '01:10');
    state = recordMaleOut(state, '01:30');
    expect(state.newStim).toBe(false);
  });

  it('appends out entry to sexualBehavior with raw time', () => {
    let state = recordMaleIn(createPacingState(), '01:00');
    state = recordMaleOut(state, '01:30');
    expect(state.sexualBehavior[1]).toEqual({ stim: 'out', time: 130 });
  });
});

// ─── Proceptive behavior counters ─────────────────────────────────────────────

describe('recordHop', () => {
  it('increments hopsIn when withMale is true', () => {
    let state = recordMaleIn(createPacingState(), '01:00');
    state = recordHop(state);
    expect(state.hopsIn).toBe(1);
    expect(state.hopsOut).toBe(0);
  });

  it('increments hopsOut when withMale is false', () => {
    const state = recordHop(createPacingState());
    expect(state.hopsOut).toBe(1);
    expect(state.hopsIn).toBe(0);
  });
});

describe('recordEar', () => {
  it('increments earsIn when withMale is true', () => {
    let state = recordMaleIn(createPacingState(), '01:00');
    state = recordEar(state);
    expect(state.earsIn).toBe(1);
    expect(state.earsOut).toBe(0);
  });

  it('increments earsOut when withMale is false', () => {
    const state = recordEar(createPacingState());
    expect(state.earsOut).toBe(1);
    expect(state.earsIn).toBe(0);
  });
});

describe('rejection behaviors', () => {
  it('recordKick increments kicks and rejectionBeh', () => {
    const state = recordKick(createPacingState());
    expect(state.kicks).toBe(1);
    expect(state.rejectionBeh).toBe(1);
  });

  it('recordSqueak increments squeaks and rejectionBeh', () => {
    const state = recordSqueak(createPacingState());
    expect(state.squeaks).toBe(1);
    expect(state.rejectionBeh).toBe(1);
  });

  it('recordRoll increments rolls and rejectionBeh', () => {
    const state = recordRoll(createPacingState());
    expect(state.rolls).toBe(1);
    expect(state.rejectionBeh).toBe(1);
  });

  it('rejectionBeh accumulates across mixed rejection types', () => {
    let state = createPacingState();
    state = recordKick(state);
    state = recordSqueak(state);
    state = recordRoll(state);
    state = recordKick(state);
    expect(state.rejectionBeh).toBe(4);
    expect(state.kicks).toBe(2);
    expect(state.squeaks).toBe(1);
    expect(state.rolls).toBe(1);
  });
});

// ─── Derived calculations ─────────────────────────────────────────────────────

describe('getLqAvg', () => {
  it('returns 0 with no stims', () => {
    expect(getLqAvg(createPacingState())).toBe(0);
  });

  it('calculates mean LQ across all stim types', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 0, '01:00');
    state = recordStim(state, 'intro', 2, '02:00');
    state = recordStim(state, 'ejac',  4, '03:00');
    expect(getLqAvg(state)).toBeCloseTo(2.0);
  });
});

describe('getPacingLq', () => {
  it('returns 0 with no stims', () => {
    expect(getPacingLq(createPacingState())).toBe(0);
  });

  it('is stimLQOverTwo / stimNumber', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 0, '01:00'); // lq < 2
    state = recordStim(state, 'mount', 1, '02:00'); // lq < 2
    state = recordStim(state, 'intro', 2, '03:00'); // lq >= 2
    state = recordStim(state, 'ejac',  3, '04:00'); // lq >= 2
    expect(getPacingLq(state)).toBeCloseTo(0.5);    // 2/4
  });

  it('is 1.0 when all stims have lq >= 2', () => {
    let state = createPacingState();
    state = recordStim(state, 'mount', 2, '01:00');
    state = recordStim(state, 'intro', 3, '02:00');
    expect(getPacingLq(state)).toBeCloseTo(1.0);
  });
});

describe('getPercentExitMount', () => {
  it('returns 0 with no mounts', () => {
    expect(getPercentExitMount(createPacingState())).toBe(0);
  });

  it('calculates numberExits / mountCount', () => {
    let state = createPacingState();
    state = recordMaleIn(state, '01:00');
    state = recordStim(state, 'mount', 1, '01:10');
    state = recordMaleOut(state, '01:20');
    state = recordMaleIn(state, '02:00');
    state = recordStim(state, 'mount', 2, '02:10');
    state = recordMaleOut(state, '02:20');
    expect(getPercentExitMount(state)).toBeCloseTo(1.0); // 2 exits / 2 mounts
  });
});

describe('getPercentExitIntro', () => {
  it('returns 0 with no intros', () => {
    expect(getPercentExitIntro(createPacingState())).toBe(0);
  });

  it('calculates numberExits / introCount', () => {
    let state = createPacingState();
    state = recordMaleIn(state, '01:00');
    state = recordStim(state, 'intro', 1, '01:10');
    state = recordMaleOut(state, '01:20');
    expect(getPercentExitIntro(state)).toBeCloseTo(1.0);
  });
});

describe('getPercentExitEjac', () => {
  it('returns 0 with no ejacs', () => {
    expect(getPercentExitEjac(createPacingState())).toBe(0);
  });

  it('calculates numberExits / ejacCount', () => {
    let state = createPacingState();
    state = recordMaleIn(state, '01:00');
    state = recordStim(state, 'ejac', 0, '01:10');
    state = recordMaleOut(state, '01:20');
    expect(getPercentExitEjac(state)).toBeCloseTo(1.0);
  });
});

// ─── CSV header rows ──────────────────────────────────────────────────────────

const baseHeaderParams = {
  date: '14 Jun 2026 10:00am',
  experimenterName: 'John Win',
  female: '42',
  stud: '7',
  hopsIn: 3,
  earsIn: 2,
  hopsOut: 5,
  earsOut: 4,
  kicks: 1,
  squeaks: 0,
  rolls: 2,
  rejectionBeh: 3,
  condition: 1,
  flags: '03:00',
  r: 37,
};

describe('buildPacingCsvHeaderRows — row count', () => {
  it('produces exactly 17 rows', () => {
    expect(buildPacingCsvHeaderRows(baseHeaderParams)).toHaveLength(17);
  });
});

describe('buildPacingCsvHeaderRows — row content', () => {
  const rows = buildPacingCsvHeaderRows(baseHeaderParams);

  it('row 0: contains date and experimenter name', () => {
    expect(rows[0]).toContain('14 Jun 2026 10:00am');
    expect(rows[0]).toContain('John Win');
  });

  it('row 1: contains female number', () => {
    expect(rows[1]).toContain('42');
  });

  it('row 2: contains stud number', () => {
    expect(rows[2]).toContain('7');
  });

  it('row 3: Mount / Intro / Ejac column group headers', () => {
    expect(rows[3]).toContain('Mount');
    expect(rows[3]).toContain('Intro');
    expect(rows[3]).toContain('Ejac');
  });

  it('row 4: Male Ins label', () => {
    expect(rows[4]).toContain('Male Ins');
  });

  it('row 5: Male Outs label', () => {
    expect(rows[5]).toContain('Male Outs');
  });

  it('row 6: Seconds label', () => {
    expect(rows[6]).toContain('Seconds');
  });

  it('row 7: hopsIn value', () => {
    expect(rows[7]).toContain('3'); // hopsIn = 3
  });

  it('row 8: earsIn value', () => {
    expect(rows[8]).toContain('2'); // earsIn = 2
  });

  it('row 9: hopsOut value', () => {
    expect(rows[9]).toContain('5'); // hopsOut = 5
  });

  it('row 10: earsOut value', () => {
    expect(rows[10]).toContain('4'); // earsOut = 4
  });

  it('row 11: kicks value', () => {
    expect(rows[11]).toContain('1'); // kicks = 1
  });

  it('row 12: squeaks value', () => {
    expect(rows[12]).toContain('0'); // squeaks = 0
  });

  it('row 13: rolls value', () => {
    expect(rows[13]).toContain('2'); // rolls = 2
  });

  it('row 14: Rejection Beh label', () => {
    expect(rows[14]).toContain('Rejection Beh');
  });

  it('row 15: Experiment label', () => {
    expect(rows[15]).toContain('Experiment');
  });

  it('row 16: Contact return and TIME TO EXIT labels', () => {
    expect(rows[16]).toContain('Contact return');
    expect(rows[16]).toContain('TIME TO EXIT');
  });
});

describe('buildPacingCsvHeaderRows — Excel formula cell ranges', () => {
  it('formulas reference correct last row when r = 37', () => {
    const rows = buildPacingCsvHeaderRows(baseHeaderParams);
    expect(rows[4]).toContain('B19:B37'); // Male Ins row uses column B
    expect(rows[5]).toContain('C19:C37'); // Male Outs row uses column C
  });

  it('formulas update when r changes', () => {
    const rows = buildPacingCsvHeaderRows({ ...baseHeaderParams, r: 50 });
    expect(rows[4]).toContain('B19:B50');
    expect(rows[5]).toContain('C19:C50');
    expect(rows[6]).toContain('R19:R50');
  });
});

// ─── CSV data column header ───────────────────────────────────────────────────

describe('buildPacingCsvDataColumnHeader — column positions', () => {
  const cols = buildPacingCsvDataColumnHeader().split(',');

  it('col 1 (B): IN', () => { expect(cols[1]).toBe('IN'); });
  it('col 2 (C): OUT', () => { expect(cols[2]).toBe('OUT'); });
  it('col 3 (D): Mount', () => { expect(cols[3]).toBe('Mount'); });
  it('col 4 (E): LQ', () => { expect(cols[4]).toBe('LQ'); });
  it('col 5 (F): Intro', () => { expect(cols[5]).toBe('Intro'); });
  it('col 6 (G): LQ', () => { expect(cols[6]).toBe('LQ'); });
  it('col 7 (H): Ejac', () => { expect(cols[7]).toBe('Ejac'); });
  it('col 8 (I): LQ', () => { expect(cols[8]).toBe('LQ'); });
  it('col 9 (J): MOUNT (contact return)', () => { expect(cols[9]).toBe('MOUNT'); });
  it('col 11 (L): INTRO', () => { expect(cols[11]).toBe('INTRO'); });
  it('col 13 (N): EJAC', () => { expect(cols[13]).toBe('EJAC'); });
});
