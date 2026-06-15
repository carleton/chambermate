// DOM layer for the Pacing experiment.
// All pure logic lives in ./logic.js — this file only touches the DOM and timers.

import {
  createPacingState,
  secondsToTime,
  recordStim,
  recordMaleIn,
  recordMaleOut,
  recordHop,
  recordEar,
  recordKick,
  recordSqueak,
  recordRoll,
  buildPacingCsvHeaderRows,
  buildPacingCsvDataColumnHeader,
} from './logic.js';

// ─── Module state ─────────────────────────────────────────────────────────────

let pacingState = createPacingState();
let flags = [];

// Main experiment timer
let timeBegan = null;
let timeStopped = null;
let stoppedDuration = 0;
let started = null;

// Male-presence timer
let maleTimeBegan = null;
let maleTimeStopped = null;
let maleStoppedDuration = 0;
let maleTimeStarted = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayTime() {
  return document.getElementById('display-area').innerHTML;
}

function formatDate(date) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return (
    date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() +
    ' ' + hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ampm
  );
}

function updateLiveCounts() {
  document.getElementById('intro_count').innerHTML = pacingState.introCount;
  document.getElementById('mount_count').innerHTML = pacingState.mountCount;
  document.getElementById('ejac_count').innerHTML = pacingState.ejacCount;
  document.getElementById('total_count').innerHTML = pacingState.introCount + pacingState.ejacCount;
  document.getElementById('male_ins').innerHTML = 'Male Ins: ' + pacingState.maleIns;
  document.getElementById('male_outs').innerHTML = 'Male Outs: ' + pacingState.maleOuts;
  document.getElementById('hops_in').innerHTML = 'Hops In: ' + pacingState.hopsIn;
  document.getElementById('hops_out').innerHTML = 'Hops Out: ' + pacingState.hopsOut;
  document.getElementById('ears_in').innerHTML = 'Ears In: ' + pacingState.earsIn;
  document.getElementById('ears_out').innerHTML = 'Ears Out: ' + pacingState.earsOut;
  document.getElementById('rejection_beh').innerHTML = 'Rejections Beh: ' + pacingState.rejectionBeh;
  if ((pacingState.introCount + pacingState.ejacCount) >= 15) {
    document.getElementById('total_text').style.backgroundColor = 'green';
    document.getElementById('total_count').style.backgroundColor = 'green';
  }
}

function updateStimDisplays(stimType, time) {
  const lqAvg = pacingState.stimNumber > 0 ? pacingState.lqSum / pacingState.stimNumber : 0;
  const pacingLq = pacingState.stimNumber > 0 ? pacingState.stimLQOverTwo / pacingState.stimNumber : 0;
  document.getElementById('pacingLq').innerHTML = 'pacing lq is ' + pacingLq;
  document.getElementById('lqAvg').innerHTML = 'lqAvg is ' + lqAvg;
  document.getElementById('intro_count').innerHTML = pacingState.introCount;
  document.getElementById('mount_count').innerHTML = pacingState.mountCount;
  document.getElementById('ejac_count').innerHTML = pacingState.ejacCount;
  document.getElementById('total_count').innerHTML = pacingState.introCount + pacingState.ejacCount;

  if (stimType === 'mount') {
    document.getElementById('mostRecentMount').innerHTML = time;
    document.getElementById('mount_count').style.backgroundColor =
      pacingState.consecMountCount >= 10 ? 'green' : '';
  } else if (stimType === 'intro') {
    document.getElementById('mostRecentIntro').innerHTML = time;
    document.getElementById('mount_count').style.backgroundColor = '';
  } else if (stimType === 'ejac') {
    document.getElementById('mostRecentEjac').innerHTML = time;
    document.getElementById('mount_count').style.backgroundColor = '';
  }

  if ((pacingState.introCount + pacingState.ejacCount) >= 15) {
    document.getElementById('total_text').style.backgroundColor = 'green';
    document.getElementById('total_count').style.backgroundColor = 'green';
  }
}

// ─── Form validation and navigation ──────────────────────────────────────────

function pacingValidate() {
  const title = document.getElementById('experiment_title').value;
  if (title.indexOf('#') > -1) {
    alert('Experiment Title contains #');
    return false;
  }
  if (
    title === '' ||
    document.getElementById('experimenter_name').value === '' ||
    document.getElementById('female').value === '' ||
    document.getElementById('stud').value === ''
  ) {
    alert('Reload and make sure to enter objects!');
    return false;
  }
  return true;
}

function setUpPacing() {
  if (pacingValidate()) {
    document.getElementById('experimentHeader').innerHTML =
      document.getElementById('experiment_title').value;
    $(location).attr('href', '#pagetwo');
  }
}

// ─── Male-presence timer ──────────────────────────────────────────────────────

function maleStart() {
  if (maleTimeBegan === null) maleTimeBegan = new Date();
  if (maleTimeStopped !== null) maleStoppedDuration += new Date() - maleTimeStopped;
  maleTimeStarted = setInterval(maleClockRunning, 10);
}

function maleStop() {
  maleTimeStopped = new Date();
  clearInterval(maleTimeStarted);
}

function maleClockRunning() {
  const elapsed = new Date(new Date() - maleTimeBegan - maleStoppedDuration);
  const min = elapsed.getUTCMinutes();
  const sec = elapsed.getUTCSeconds();
  document.getElementById('time_with_male').innerHTML =
    (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
}

// ─── Main experiment timer ────────────────────────────────────────────────────

function start() {
  $('#toggle-button').removeClass('ui-disabled');
  $('#finish-test').addClass('ui-disabled');
  document.getElementById('in_enter').disabled = false;
  document.getElementById('download-csv').disabled = true;

  if (timeBegan === null) {
    document.getElementById('date').value = formatDate(new Date());
    timeBegan = new Date();
  }
  if (timeStopped !== null) stoppedDuration += new Date() - timeStopped;
  started = setInterval(clockRunning, 10);
  document.getElementById('start').disabled = true;

  if (pacingState.withMale) {
    document.querySelectorAll('.withMale').forEach(el => { el.disabled = false; });
  }
}

function stop() {
  timeStopped = new Date();
  maleStop();
  clearInterval(started);
  $('#finish-test').removeClass('ui-disabled');
  document.getElementById('in_enter').disabled = true;
  document.getElementById('start').disabled = false;
  $('#toggle-button').addClass('ui-disabled');
  document.querySelectorAll('.withMale').forEach(el => { el.disabled = true; });
}

function clockRunning() {
  const elapsed = new Date(new Date() - timeBegan - stoppedDuration);
  const hour = elapsed.getUTCHours();
  const min = elapsed.getUTCMinutes();
  const sec = elapsed.getUTCSeconds();
  document.getElementById('display-area').innerHTML =
    (min > 9 ? hour * 60 + min : hour > 0 ? hour * 60 + min : '0' + min) +
    ':' + (sec > 9 ? sec : '0' + sec);
}

// ─── Male in / out ────────────────────────────────────────────────────────────

function inEnter(aTime = displayTime()) {
  pacingState = recordMaleIn(pacingState, aTime);
  maleStart();
  document.querySelectorAll('.withMale').forEach(el => { el.disabled = false; });
  document.getElementById('in_enter').disabled = true;
  updateLiveCounts();
}

function out(aTime = displayTime()) {
  pacingState = recordMaleOut(pacingState, aTime);
  maleStop();
  document.querySelectorAll('.withMale').forEach(el => { el.disabled = true; });
  document.getElementById('in_enter').disabled = false;
  const s = pacingState;
  document.getElementById('percentExitMount').innerHTML =
    'percentExitMount: ' + (s.mountCount > 0 ? s.numberExits / s.mountCount : 0);
  document.getElementById('percentExitIntro').innerHTML =
    'percentExitIntro: ' + (s.introCountExitVar > 0 ? s.numberExits / s.introCountExitVar : 0);
  document.getElementById('percentExitEjac').innerHTML =
    'percentExitEjac: ' + (s.ejacCount > 0 ? s.numberExits / s.ejacCount : 0);
  updateLiveCounts();
}

// ─── Stim handlers ────────────────────────────────────────────────────────────

function ejacZero(t = displayTime())  { pacingState = recordStim(pacingState, 'ejac', 0, t); updateStimDisplays('ejac', t); }
function ejacOne(t = displayTime())   { pacingState = recordStim(pacingState, 'ejac', 1, t); updateStimDisplays('ejac', t); }
function ejacTwo(t = displayTime())   { pacingState = recordStim(pacingState, 'ejac', 2, t); updateStimDisplays('ejac', t); }
function ejacThree(t = displayTime()) { pacingState = recordStim(pacingState, 'ejac', 3, t); updateStimDisplays('ejac', t); }

function introZero(t = displayTime())  { pacingState = recordStim(pacingState, 'intro', 0, t); updateStimDisplays('intro', t); }
function introOne(t = displayTime())   { pacingState = recordStim(pacingState, 'intro', 1, t); updateStimDisplays('intro', t); }
function introTwo(t = displayTime())   { pacingState = recordStim(pacingState, 'intro', 2, t); updateStimDisplays('intro', t); }
function introThree(t = displayTime()) { pacingState = recordStim(pacingState, 'intro', 3, t); updateStimDisplays('intro', t); }

function mountZero(t = displayTime())  { pacingState = recordStim(pacingState, 'mount', 0, t); updateStimDisplays('mount', t); }
function mountOne(t = displayTime())   { pacingState = recordStim(pacingState, 'mount', 1, t); updateStimDisplays('mount', t); }
function mountTwo(t = displayTime())   { pacingState = recordStim(pacingState, 'mount', 2, t); updateStimDisplays('mount', t); }
function mountThree(t = displayTime()) { pacingState = recordStim(pacingState, 'mount', 3, t); updateStimDisplays('mount', t); }

// ─── Proceptive / rejection behavior handlers ─────────────────────────────────

function hop() {
  pacingState = recordHop(pacingState);
  updateLiveCounts();
}

function ears() {
  pacingState = recordEar(pacingState);
  updateLiveCounts();
}

function kick() {
  pacingState = recordKick(pacingState);
  updateLiveCounts();
}

function squeak() {
  pacingState = recordSqueak(pacingState);
  updateLiveCounts();
}

function roll() {
  pacingState = recordRoll(pacingState);
  updateLiveCounts();
}

function flagPacing() {
  flags.push(' ' + displayTime());
}

// ─── Results table ────────────────────────────────────────────────────────────

function finishTest() {
  document.getElementById('download-csv').disabled = false;
  $('#testBody tr').remove();
  document.getElementById('paragraphFlags').innerHTML = flags;
  document.getElementById('resultsHeader').innerHTML =
    document.getElementById('experiment_title').value + ' Results';

  const behavior = pacingState.sexualBehavior;
  const columns = ['drag', 'in', 'out', 'mount', 'lq', 'intro', 'lq', 'ejac', 'lq', 'del'];
  const resultTable = document.getElementById('testBody');
  let numberRows = 0;
  let mostRecentStimRow = 0;
  const rowsToDelete = [];
  let row, i = 0, j = 0;

  while (j <= behavior.length) {
    while (i <= columns.length) {
      if (i === 10 || numberRows === 0) {
        row = resultTable.insertRow(numberRows);
        row.id = numberRows;
        numberRows++;
        i = 0;
      }
      if (columns[i] === behavior[j].stim) {
        const cell = row.insertCell(i);
        cell.setAttribute('contentEditable', 'true');
        cell.className = 'recipe-table__cell';

        if (behavior[j].stim === 'out') {
          if (behavior[j - 1].stim === 'in') {
            cell.innerHTML = behavior[j].time;
            i++; j++;
          } else {
            const cellOut = resultTable.rows[mostRecentStimRow - 1].cells[2];
            cellOut.innerHTML = behavior[j].time;
            rowsToDelete.push({ rowToDelete: row });
            i++; j++;
          }
        } else if (behavior[j].stim === 'lq') {
          cell.innerHTML = behavior[j].lq;
          mostRecentStimRow = numberRows;
          i++; j++;
        } else {
          cell.innerHTML = behavior[j].time;
          i++; j++;
        }
      } else if (columns[i] === 'drag') {
        const cell = row.insertCell(i++);
        cell.innerHTML = '';
        cell.className = 'drag-handler';
      } else if (columns[i] === 'del') {
        const cell = row.insertCell(i++);
        cell.innerHTML = '<button class="recipe-table__del-row-btn ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-icon-notext"></button>';
        cell.className = 'recipe-table__cell';
        cell.style.width = '5%';
      } else {
        const cell = row.insertCell(i++);
        cell.setAttribute('contentEditable', 'true');
        cell.className = 'recipe-table__cell';
        cell.innerHTML = '&nbsp';
      }
      if (j === behavior.length) break;
    }
    if (j === behavior.length) break;
  }

  rowsToDelete.forEach(({ rowToDelete }) => rowToDelete.parentNode.removeChild(rowToDelete));
}

// ─── Back and re-process ──────────────────────────────────────────────────────

// Resets state and replays the behavior sequence from the (possibly hand-edited)
// results table. This lets researchers correct entries before downloading CSV.
function backAndSave() {
  pacingState = createPacingState();
  flags = [];

  const resultTable = document.getElementById('testBody');
  const rows = resultTable.rows;

  for (let j = 0; j < rows.length; j++) {
    const cells = rows[j].cells;
    const rawIn    = cells[1].innerHTML.replace(/[^0-9]/g, '');
    const rawMount = cells[3].innerHTML.replace(/[^0-9]/g, '');
    const lqMount  = cells[4].innerHTML.replace(/[^0-9]/g, '');
    const rawIntro = cells[5].innerHTML.replace(/[^0-9]/g, '');
    const lqIntro  = cells[6].innerHTML.replace(/[^0-9]/g, '');
    const rawEjac  = cells[7].innerHTML.replace(/[^0-9]/g, '');
    const lqEjac   = cells[8].innerHTML.replace(/[^0-9]/g, '');
    const rawOut   = cells[2].innerHTML.replace(/[^0-9]/g, '');

    if (rawIn    !== '') inEnter(secondsToTime(parseInt(rawIn)));
    if (rawMount !== '') {
      const fn = [mountZero, mountOne, mountTwo, mountThree][parseInt(lqMount)];
      if (fn) fn(secondsToTime(parseInt(rawMount)));
    }
    if (rawIntro !== '') {
      const fn = [introZero, introOne, introTwo, introThree][parseInt(lqIntro)];
      if (fn) fn(secondsToTime(parseInt(rawIntro)));
    }
    if (rawEjac  !== '') {
      const fn = [ejacZero, ejacOne, ejacTwo, ejacThree][parseInt(lqEjac)];
      if (fn) fn(secondsToTime(parseInt(rawEjac)));
    }
    if (rawOut   !== '') out(secondsToTime(parseInt(rawOut)));
  }
}

// ─── CSV download ─────────────────────────────────────────────────────────────

function downloadCSV() {
  const filename = document.getElementById('experiment_title').value;
  const date = document.getElementById('date').value;
  const female = document.getElementById('female').value;
  const stud = document.getElementById('stud').value;
  const experimenterName = document.getElementById('experimenter_name').value;
  const conditionRaw = document.getElementById('condition').value;
  const condition = conditionRaw !== '' ? conditionRaw : 0;
  const s = pacingState;

  const rows = document.querySelectorAll('#testBody > tr');
  const r = rows.length + 19;

  let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF';
  buildPacingCsvHeaderRows({
    date,
    experimenterName,
    female,
    stud,
    hopsIn: s.hopsIn,
    earsIn: s.earsIn,
    hopsOut: s.hopsOut,
    earsOut: s.earsOut,
    kicks: s.kicks,
    squeaks: s.squeaks,
    rolls: s.rolls,
    rejectionBeh: s.rejectionBeh,
    condition,
    flags,
    r,
  }).forEach(line => { csvContent += line; });

  csvContent += buildPacingCsvDataColumnHeader();

  let k = 0;
  rows.forEach(tr => {
    k++;
    csvContent += k;
    const cells = tr.querySelectorAll('td');
    cells.forEach((td, j) => {
      if (j !== 0) csvContent += ',';
      let str = td.innerHTML;
      if (str.charAt(0) === '<') {
        str = str.substr(str.indexOf('</b>') + 4);
        if (str.charAt(0) === 't') str = '';
        if (str.charAt(0) === '&') str = str.substr(6);
        str = str.replace(/\&nbsp;/g, '');
      }
      if (str.includes('del')) str = '';
      csvContent += str;

      if (j === cells.length - 1 && cells.length < 10) {
        for (let u = cells.length; u < 10; u++) csvContent += ',';
      }
    });

    const l = k + 18;
    const m = k + 19;
    csvContent += `"=IF(AND(S${l}>0,(OR(T${l}>S${l},U${l}>S${l}))),""---"",IF(AND(S${l}>0,Q${m}>0),Q${m}-S${l},IF(S${l}>0,""---"","""")))","=IF(ISNUMBER(J${l}),E${l},"""")","=IF(AND(T${l}>0,(OR(S${l}>T${l},U${l}>T${l}))),""---"",IF(AND(T${l}>0,Q${m}>0),Q${m}-T${l},IF(T${l}>0,""---"","""")))","=IF(ISNUMBER(L${l}),G${l},"""")","=IF(AND(U${l}>0,(OR(S${l}>U${l},T${l}>U${l}))),""---"",IF(AND(U${l}>0,Q${m}>0),Q${m}-U${l},IF(U${l}>0,""---"","""")))","=IF(ISNUMBER(N${l}),I${l},"""")",,"=ROUNDDOWN(B${l},-2)/100*60+B${l}-ROUNDDOWN(B${l},-2)","=ROUNDDOWN(C${l},-2)/100*60+C${l}-ROUNDDOWN(C${l},-2)","=ROUNDDOWN(D${l},-2)/100*60+D${l}-ROUNDDOWN(D${l},-2)","=ROUNDDOWN(F${l},-2)/100*60+F${l}-ROUNDDOWN(F${l},-2)","=ROUNDDOWN(H${l},-2)/100*60+H${l}-ROUNDDOWN(H${l},-2)",=(R${l}-Q${l}),"=IF(AND(S${l}>0,(OR(T${l}>S${l},U${l}>S${l}))),""---"",IF(AND(S${l}>0,R${l}>0),R${l}-S${l},IF(S${l}>0,""---"","""")))","=IF(AND(T${l}>0,(OR(S${l}>T${l},U${l}>T${l}))),""---"",IF(AND(T${l}>0,R${l}>0),R${l}-T${l},IF(T${l}>0,""---"","""")))","=IF(AND(U${l}>0,(OR(S${l}>U${l},T${l}>U${l}))),""---"",IF(AND(U${l}>0,R${l}>0),R${l}-U${l},IF(U${l}>0,""---"","""")))"\n`;
  });

  csvContent += '\n';
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', filename + '_data.csv');
  document.body.appendChild(link);
  link.click();
}

// ─── DOM initialization ───────────────────────────────────────────────────────

document.getElementById('in_enter').disabled = true;
$('#toggle-button').addClass('ui-disabled');
document.querySelectorAll('.withMale').forEach(el => { el.disabled = true; });

// Set initial date display
const now = new Date();
document.getElementById('date').value = formatDate(now);

$(document).ready(function () {
  $(document).on('click', '.pacing-table__add-row-btn', function () {
    $('#testBody').append($('#pacingRowTemplate').html());
    return false;
  });
  $(document).on('click', '.recipe-table__del-row-btn', function (e) {
    $(e.currentTarget).closest('tr').remove();
    return false;
  });
});

// ─── Expose functions to HTML inline onclick handlers ─────────────────────────

Object.assign(window, {
  pacingValidate,
  setUpPacing,
  start,
  stop,
  in_enter: inEnter,
  out,
  ejac_zero: ejacZero,
  ejac_one: ejacOne,
  ejac_two: ejacTwo,
  ejac_three: ejacThree,
  intro_zero: introZero,
  intro_one: introOne,
  intro_two: introTwo,
  intro_three: introThree,
  mount_zero: mountZero,
  mount_one: mountOne,
  mount_two: mountTwo,
  mount_three: mountThree,
  hop,
  ears,
  kick,
  squeak,
  roll,
  flag: flagPacing,
  finishTest,
  backAndSave,
  downloadCSV,
});
