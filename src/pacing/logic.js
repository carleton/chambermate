// Pure state and CSV logic for the Pacing experiment.
// No DOM access here — all functions take plain values and return plain values.

// Converts "MM:SS" display string to total seconds.
export function stringToIntTime(timeString) {
  const parts = timeString.split(':');
  return (+parts[0]) * 60 + (+parts[1]);
}

// Strips the colon and returns the raw numeric form used for internal storage.
// e.g. "01:30" → 130. Used so backAndSave can round-trip times from table cells.
export function timeToSeconds(timeString) {
  return parseInt(timeString.replace(/:/g, ''), 10);
}

// Inverse of timeToSeconds — converts raw stored form back to "MM:SS".
// e.g. 130 → "01:30"
export function secondsToTime(rawSeconds) {
  const sec = rawSeconds % 100;
  const mins = (rawSeconds - sec) / 100;
  return (mins < 10 ? '0' + mins : String(mins)) + ':' + (sec < 10 ? '0' + sec : String(sec));
}

export function createPacingState() {
  return {
    withMale: false,
    mountCount: 0,
    introCount: 0,
    ejacCount: 0,
    introCountExitVar: 0,
    stimNumber: 0,
    lqSum: 0,
    stimLQOverTwo: 0,
    hopsIn: 0,
    hopsOut: 0,
    earsIn: 0,
    earsOut: 0,
    kicks: 0,
    squeaks: 0,
    rolls: 0,
    rejectionBeh: 0,
    maleIns: 0,
    maleOuts: 0,
    numberExits: 0,
    sexualBehavior: [],
    mostRecentStim: null,
    mostRecentStimType: null,
    newStim: false,
    consecMountCount: 0,
  };
}

// Records a sexual stimulation event (mount, intro, or ejac) with its LQ score.
export function recordStim(state, stimType, lq, time) {
  const storedTime = timeToSeconds(time);
  const base = {
    ...state,
    stimNumber: state.stimNumber + 1,
    lqSum: state.lqSum + lq,
    stimLQOverTwo: lq >= 2 ? state.stimLQOverTwo + 1 : state.stimLQOverTwo,
    mostRecentStim: time,
    mostRecentStimType: stimType,
    newStim: true,
    sexualBehavior: [
      ...state.sexualBehavior,
      { stim: stimType, lq, time: storedTime },
      { stim: 'lq', lq },
    ],
  };

  if (stimType === 'mount') {
    return { ...base, mountCount: state.mountCount + 1, consecMountCount: state.consecMountCount + 1 };
  }
  if (stimType === 'intro') {
    return { ...base, introCount: state.introCount + 1, introCountExitVar: state.introCountExitVar + 1, consecMountCount: 0 };
  }
  if (stimType === 'ejac') {
    return { ...base, ejacCount: state.ejacCount + 1, consecMountCount: 0 };
  }
  return base;
}

export function recordMaleIn(state, time) {
  return {
    ...state,
    withMale: true,
    maleIns: state.maleIns + 1,
    sexualBehavior: [...state.sexualBehavior, { stim: 'in', time: timeToSeconds(time) }],
  };
}

export function recordMaleOut(state, time) {
  return {
    ...state,
    withMale: false,
    maleOuts: state.maleOuts + 1,
    numberExits: state.numberExits + 1,
    newStim: false,
    sexualBehavior: [...state.sexualBehavior, { stim: 'out', time: timeToSeconds(time) }],
  };
}

export function recordHop(state) {
  if (state.withMale) return { ...state, hopsIn: state.hopsIn + 1 };
  return { ...state, hopsOut: state.hopsOut + 1 };
}

export function recordEar(state) {
  if (state.withMale) return { ...state, earsIn: state.earsIn + 1 };
  return { ...state, earsOut: state.earsOut + 1 };
}

export function recordKick(state) {
  return { ...state, kicks: state.kicks + 1, rejectionBeh: state.rejectionBeh + 1 };
}

export function recordSqueak(state) {
  return { ...state, squeaks: state.squeaks + 1, rejectionBeh: state.rejectionBeh + 1 };
}

export function recordRoll(state) {
  return { ...state, rolls: state.rolls + 1, rejectionBeh: state.rejectionBeh + 1 };
}

// Average LQ across all stims.
export function getLqAvg(state) {
  if (state.stimNumber === 0) return 0;
  return state.lqSum / state.stimNumber;
}

// Fraction of stims where LQ >= 2. Called "pacing LQ" in the original code.
export function getPacingLq(state) {
  if (state.stimNumber === 0) return 0;
  return state.stimLQOverTwo / state.stimNumber;
}

export function getPercentExitMount(state) {
  if (state.mountCount === 0) return 0;
  return state.numberExits / state.mountCount;
}

export function getPercentExitIntro(state) {
  if (state.introCountExitVar === 0) return 0;
  return state.numberExits / state.introCountExitVar;
}

export function getPercentExitEjac(state) {
  if (state.ejacCount === 0) return 0;
  return state.numberExits / state.ejacCount;
}

// Returns an array of CSV line strings for the metadata header block.
// r = last data row number in the spreadsheet (rows.length + 19 in the original).
export function buildPacingCsvHeaderRows({
  date, experimenterName, female, stud,
  hopsIn, earsIn, hopsOut, earsOut,
  kicks, squeaks, rolls, rejectionBeh,
  condition, flags, r,
}) {
  return [
    `Date,${date},,,Entered by:,,${experimenterName},,,,,,,,,,,,,,,,,,,\n`,
    `Female,${female},,,,,,,,,,,,,,,,,,,,,,,,\n`,
    `Stud,${stud}\n`,
    `,,,,,,,Mount,,Intro,,Ejac\n`,
    `,Male Ins,,=COUNT(B19:B${r}),,% exit,,"=ROUND(COUNT(J19:J${r})/COUNT(D19:D${r})*100,2)",,"=ROUND(COUNT(L19:L${r})/COUNT(F19:F${r})*100,2)",,"=ROUND(COUNT(N19:N${r})/COUNT(H19:H${r})*100,2)",,,,,,,,,,,\n`,
    `,Male Outs,,=COUNT(C19:C${r}),,mean contact return,,"=ROUND(AVERAGE(J19:J${r}),2)",,"=ROUND(AVERAGE(L19:L${r}),2)",,"=ROUND(AVERAGE(N19:N${r}),2)",,,,,,,,,,,\n`,
    `,Seconds,,"=MAX(R19:R${r})",,mean time to exit,,"=ROUND(AVERAGE(W19:W${r}),2)",,"=ROUND(AVERAGE(X19:X${r}),2)",,"=ROUND(AVERAGE(Y19:Y${r}),2)",,,,,,,,,,,\n`,
    `,Hops IN,,${hopsIn},,pacing lq,,"=ROUND((COUNTIF(E19:E${r},"">=2"")+COUNTIF(G19:G${r},"">=2"")+COUNTIF(I19:I${r},"">=2""))/(COUNT(D19:I${r})/2)*100,2)",,,,,,,,,,,,,,,\n`,
    `,Ears IN,,${earsIn},,pacing lr,,"=ROUND((SUM(E19:E${r})+SUM(G19:G${r})+SUM(I19:I${r}))/(COUNT(E19:E${r})+COUNT(G19:G${r})+COUNT(I19:I${r})),2)",,proc in per min,,"=ROUND(SUM(D8:D9)/(D7/60), 2)",,,,,,,,,,,,,\n`,
    `,Hops ALONE,,${hopsOut},,time with male,,=SUM(V19:V${r}),,% twm,,"=ROUND(H10/D7 *100,2)",,,,,,,,,\n`,
    `,Ears ALONE,,${earsOut},,mounts,,=COUNT(D19:D${r}),,,,,,,,,,,,,\n`,
    `,Kicks,,${kicks},,intros,,=COUNT(F19:F${r}),,,,,,,,,,,,,,,\n`,
    `,Squeaks,,${squeaks},,ejacs,,=COUNT(H19:H${r}),,,,,,,,,,,,,,,\n`,
    `,Rolls,,${rolls},,flags,,${flags},,,,,,,,,,,,,,,\n`,
    `,Rejection Beh,,${rejectionBeh},,rej per min,,"=ROUND(D15/(D7/60), 2)",,,,,,,\n`,
    `,Experiment,,${condition},,act per min,,"=ROUND((COUNT(B19:B${r})+COUNT(C19:C${r}))/(D7/60), 2)",,,,,\n`,
    `,,,,,,,,,Contact return,,,,,,,,,,,,,TIME TO EXIT,\n`,
  ];
}

// The column header row that appears directly above the per-stimulation data rows.
// Column positions here determine where Excel formula references (B-Y) land.
export function buildPacingCsvDataColumnHeader() {
  return ',IN,OUT,Mount,LQ,Intro,LQ,Ejac,LQ,MOUNT,LQ,INTRO,LQ,EJAC,LQ,,,,,,,,Mount,Intro,Ejac,Time since last stim \n';
}
