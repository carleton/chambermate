// DOM layer for the COP (Choice/Partner Preference) experiment.
// All pure logic lives in ./logic.js — this file only touches the DOM and timers.

import {
  createCopState,
  recordBehavior,
  recordChew,
  recordHop,
  recordEar,
  buildCopCsvMetadata,
  buildCopCsvColumnHeader,
} from './logic.js';

// ─── Module state ─────────────────────────────────────────────────────────────

let copState = createCopState();
let objectOne = '';
let objectTwo = '';
let flagsCop = [];

// Main experiment timer
let copTimeBegan = null;
let copTimeStopped = null;
let copStoppedDuration = 0;
let copStarted = null;

// Per-object timers
let objOneTimeBegan = null;
let objOneTimeStopped = null;
let objOneStoppedDuration = 0;
let objOneTimeStarted = null;

let objTwoTimeBegan = null;
let objTwoTimeStopped = null;
let objTwoStoppedDuration = 0;
let objTwoTimeStarted = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clockDisplayToInt() {
  return parseInt(document.getElementById('clock-area').innerHTML.replace(/:/g, ''), 10);
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

function setDisabled(ids, value) {
  ids.forEach(id => { document.getElementById(id).disabled = value; });
}

// ─── Form validation and navigation ──────────────────────────────────────────

function copValidate() {
  const title = document.getElementById('experiment_title').value;
  if (title.indexOf('#') > -1) {
    alert('Experiment Title contains #');
    return false;
  }
  if (
    title === '' ||
    document.getElementById('experimenter_name').value === '' ||
    document.getElementById('female').value === '' ||
    document.getElementById('obj_one').value === '' ||
    document.getElementById('obj_two').value === ''
  ) {
    alert('Reload and make sure to enter objects!');
    return false;
  }
  return true;
}

function setUpCOP() {
  if (copValidate()) {
    objectOne = document.getElementById('obj_one').value;
    objectTwo = document.getElementById('obj_two').value;
    const title = document.getElementById('experiment_title').value;
    document.getElementById('in_obj_1').innerHTML = objectOne;
    document.getElementById('in_obj_2').innerHTML = objectTwo;
    document.getElementById('cop_header').innerHTML = title + ' COP';
    $(location).attr('href', '#cop');
  }
}

// ─── Object One timer ─────────────────────────────────────────────────────────

function objOneStart() {
  if (objOneTimeBegan === null) objOneTimeBegan = new Date();
  if (objOneTimeStopped !== null) objOneStoppedDuration += new Date() - objOneTimeStopped;
  objOneTimeStarted = setInterval(objOneClockRunning, 10);
}

function objOneStop() {
  objOneTimeStopped = new Date();
  clearInterval(objOneTimeStarted);
}

function objOneClockRunning() {
  const elapsed = new Date(new Date() - objOneTimeBegan - objOneStoppedDuration);
  const min = elapsed.getUTCMinutes();
  const sec = elapsed.getUTCSeconds();
  document.getElementById('time_with_obj_one').innerHTML =
    (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
}

// ─── Object Two timer ─────────────────────────────────────────────────────────

function objTwoStart() {
  if (objTwoTimeBegan === null) objTwoTimeBegan = new Date();
  if (objTwoTimeStopped !== null) objTwoStoppedDuration += new Date() - objTwoTimeStopped;
  objTwoTimeStarted = setInterval(objTwoClockRunning, 10);
}

function objTwoStop() {
  objTwoTimeStopped = new Date();
  clearInterval(objTwoTimeStarted);
}

function objTwoClockRunning() {
  const elapsed = new Date(new Date() - objTwoTimeBegan - objTwoStoppedDuration);
  const min = elapsed.getUTCMinutes();
  const sec = elapsed.getUTCSeconds();
  document.getElementById('time_with_obj_two').innerHTML =
    (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
}

// ─── Main experiment timer ────────────────────────────────────────────────────

function startCop() {
  $('#toggle-cop-button').removeClass('ui-disabled');
  objOneStoppedDuration = 0;
  objTwoStoppedDuration = 0;

  const inZone = copState.zone !== 'center';
  if (inZone) {
    setDisabled(['in_1', 'in_2'], true);
    document.getElementById('btncenter').disabled = false;
  } else {
    setDisabled(['in_1', 'in_2'], false);
    document.getElementById('btncenter').disabled = true;
  }

  document.getElementById('download-csv-cop').disabled = true;
  if (copTimeBegan === null) {
    document.getElementById('date').value = formatDate(new Date());
    copTimeBegan = new Date();
  }
  if (copTimeStopped !== null) {
    copStoppedDuration += new Date() - copTimeStopped;
  }
  copStoppedDuration += objOneStoppedDuration + objTwoStoppedDuration;
  copStarted = setInterval(clockRunningCop, 10);
  document.getElementById('startCop').disabled = true;
  $('#finish-test-cop').addClass('ui-disabled');
}

function clockRunningCop() {
  const elapsed = new Date(new Date() - copTimeBegan - copStoppedDuration);
  const min = elapsed.getUTCMinutes();
  const sec = elapsed.getUTCSeconds();
  document.getElementById('clock-area').innerHTML =
    (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);

  const totalSec = 60 * min + sec;
  const nearEnd = (totalSec >= 590 && totalSec <= 600) || (totalSec >= 890 && totalSec <= 900);
  document.getElementById('clock-area').classList.toggle('blinking-timer', nearEnd);
  document.getElementById('clock-area').style.color = nearEnd ? 'red' : '';
}

function stopCop() {
  objOneStop();
  objTwoStop();
  copTimeStopped = new Date();
  clearInterval(copStarted);
  $('#finish-test-cop').removeClass('ui-disabled');
  $('#toggle-cop-button').addClass('ui-disabled');
  document.getElementById('startCop').disabled = false;
  setDisabled(['in_1','hops_in_1','ears_in_1','in_2','hops_in_2','ears_in_2','btncenter','hops_center','ears_center'], true);
}

// ─── Zone handlers ────────────────────────────────────────────────────────────

function inObjectOne() {
  copState = recordBehavior(copState, 'inOne', clockDisplayToInt());
  objOneStart();
  setDisabled(['in_1','in_2','hops_in_2','ears_in_2','hops_center','ears_center'], true);
  setDisabled(['hops_in_1','ears_in_1','btncenter'], false);
  document.getElementById('in_obj_1').style.color = 'magenta';
  document.getElementById('center_purple').style.color = 'white';
}

function inObjectTwo() {
  copState = recordBehavior(copState, 'inTwo', clockDisplayToInt());
  objTwoStart();
  setDisabled(['in_1','hops_in_1','ears_in_1','in_2','hops_center','ears_center'], true);
  setDisabled(['hops_in_2','ears_in_2','btncenter'], false);
  document.getElementById('in_obj_2').style.color = 'magenta';
  document.getElementById('center_purple').style.color = 'white';
}

function centerOne() {
  if (copState.zone === 'objectOne') objOneStop();
  else if (copState.zone === 'objectTwo') objTwoStop();
  copState = recordBehavior(copState, 'center', clockDisplayToInt());
  setDisabled(['btncenter','hops_in_1','ears_in_1','hops_in_2','ears_in_2'], true);
  setDisabled(['in_1','in_2','hops_center','ears_center'], false);
  document.getElementById('in_obj_1').style.color = 'white';
  document.getElementById('in_obj_2').style.color = 'white';
  document.getElementById('center_purple').style.color = 'magenta';
}

// ─── Counter handlers ─────────────────────────────────────────────────────────

function copChew()  { copState = recordChew(copState); }
function copHops()  { copState = recordHop(copState); }
function copEars()  { copState = recordEar(copState); }
function flagCop()  { flagsCop.push(' ' + document.getElementById('clock-area').innerHTML); }

// ─── Results table ────────────────────────────────────────────────────────────

function finishTestCop() {
  document.getElementById('download-csv-cop').disabled = false;
  $('#copTestBody tr').remove();
  document.getElementById('copParagraphFlags').innerHTML = flagsCop;
  document.getElementById('copResultsHeader').innerHTML =
    document.getElementById('experiment_title').value + ' Results';
  document.getElementById('inOne').innerHTML = objectOne;
  document.getElementById('inTwo').innerHTML = objectTwo;

  const behaviors = copState.behaviors;
  const columns = ['drag', 'inOne', 'center', 'inTwo', 'delete'];
  const resultTable = document.getElementById('copTestBody');
  let numberRows = 0;
  let mostRecentInRow = 0;
  let row, i = 0, j = 0, twoPerLine = 0;

  while (j <= behaviors.length) {
    while (i <= columns.length) {
      if (i === 5 || numberRows === 0) {
        row = resultTable.insertRow(numberRows++);
        i = 0;
        twoPerLine = 0;
      }
      if (columns[i] === behaviors[j].stim) {
        if (behaviors[j].stim === 'inTwo') mostRecentInRow = numberRows;
        if (behaviors[j].stim === 'center' && behaviors[j - 1].stim === 'inTwo') {
          const cellOut = resultTable.rows[mostRecentInRow - 1].cells[2];
          cellOut.innerHTML = behaviors[j].time;
          cellOut.setAttribute('contentEditable', 'true');
          cellOut.className = 'recipe-table__cell';
          i = 2; j++;
        } else {
          const cell = row.insertCell(i);
          cell.setAttribute('contentEditable', 'true');
          cell.innerHTML = behaviors[j].time;
          cell.className = 'recipe-table__cell';
          if (behaviors[j].stim === 'inOne' || behaviors[j].stim === 'center') twoPerLine++;
          i++; j++;
          if (twoPerLine === 2) {
            const filler = row.insertCell(i++);
            filler.className = 'recipe-table__cell';
            filler.setAttribute('contentEditable', 'true');
            filler.innerHTML = '&nbsp';
          }
        }
      } else if (columns[i] === 'drag') {
        const cell = row.insertCell(i++);
        cell.innerHTML = '';
        cell.className = 'drag-handler';
      } else if (columns[i] === 'delete') {
        const cell = row.insertCell(i++);
        cell.innerHTML = '<button class="recipe-table__del-row-btn ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-icon-notext"></button>';
        cell.className = 'recipe-table__cell';
        cell.style.width = '5%';
      } else {
        const cell = row.insertCell(i++);
        cell.setAttribute('contentEditable', 'true');
        cell.innerHTML = '&nbsp';
        cell.className = 'recipe-table__cell';
      }
      if (j === behaviors.length) break;
    }
    if (j === behaviors.length) break;
  }

  const rows = $(resultTable).find('> tr');
  for (let r = 0; r < rows.length; r++) {
    if (emptyCellsOnly(rows[r])) rows[r].parentNode.removeChild(rows[r]);
  }
}

function emptyCellsOnly(row) {
  for (let j = 1; j < 4; j++) {
    if (row.cells[j].innerHTML !== '&nbsp;') return false;
  }
  return true;
}

// ─── CSV download ─────────────────────────────────────────────────────────────

function copDownloadCSV() {
  const filename = document.getElementById('experiment_title').value;
  const flags = document.getElementById('copParagraphFlags').innerHTML;

  const metadata = buildCopCsvMetadata({
    objectOne,
    objectTwo,
    filename,
    female: document.getElementById('female').value,
    stud: document.getElementById('stud').value,
    date: document.getElementById('date').value,
    name: document.getElementById('experimenter_name').value,
    notes: document.getElementById('copnotes').value,
    timeWithOne: document.getElementById('time_with_obj_one').innerHTML,
    timeWithTwo: document.getElementById('time_with_obj_two').innerHTML,
    state: copState,
    flags,
  });

  let csvContent = 'data:text/csv;charset=utf-8,';
  metadata.forEach((row, index) => {
    csvContent += index < metadata.length ? row.join(',') + '\n' : row.join(',');
  });
  csvContent += buildCopCsvColumnHeader(objectOne, objectTwo) + '\n';

  $('#copTestBody > tr').each(function () {
    $(this).find('> td').each(function (j) {
      if (j !== 0) csvContent += ',';
      let str = this.innerHTML;
      if (str.charAt(0) === '<') {
        str = str.substr(str.indexOf('</b>') + 4);
        if (str.charAt(0) === 't') str = '';
        if (str.charAt(0) === '&') str = str.substr(6);
        str = str.replace(/\&nbsp;/g, '');
      }
      if (str.includes('del')) str = '';
      csvContent += str;
    });
    csvContent += '\n';
  });

  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', filename + '_data.csv');
  document.body.appendChild(link);
  link.click();
}

// ─── DOM initialization ───────────────────────────────────────────────────────

$('#toggle-cop-button').addClass('ui-disabled');
setDisabled(['in_1','hops_in_1','ears_in_1','btncenter','hops_center','ears_center','in_2','hops_in_2','ears_in_2'], true);

$(document).ready(function () {
  $(document).on('click', '.recipe-table__add-row-btn', function () {
    $('#copTestBody').append($('#rowTemplate').html());
    return false;
  });
  $(document).on('click', '.recipe-table__del-row-btn', function (e) {
    $(e.currentTarget).closest('tr').remove();
    return false;
  });
});

// ─── Expose functions to HTML inline onclick handlers ─────────────────────────

Object.assign(window, {
  COPValidate: copValidate,
  setUpCOP,
  startCop,
  stopCop,
  in_Object_One: inObjectOne,
  in_Object_Two: inObjectTwo,
  centerOne,
  cop_chew: copChew,
  cop_hops: copHops,
  cop_ears: copEars,
  flagCop,
  finishTestCop,
  copDownloadCSV,
});
