var copTimeBegan = null,
copTimeStopped = null,
copStoppedDuration = 0,
copStarted = null,
copBehavior = [],
obj_one_TimeBegan = null,
obj_one_TimeStopped = null,
obj_one_StoppedDuration = 0,
obj_one_TimeStarted = null,
obj_two_TimeBegan = null,
obj_two_TimeStopped = null,
obj_two_StoppedDuration = 0,
obj_two_TimeStarted = null,
copBehavior_two = [];
var objectOne = "";
var objectTwo = "";
var withOne = false;
var withTwo = false;
var chewOne = 0;
var chewTwo = 0;
var hopOne = 0;
var hopTwo = 0;
var earsOne = 0;
var earsTwo = 0;
var centerEars = 0;
var centerHops = 0;
var executed = false;
var flagscop = [];

$('#toggle-cop-button').addClass('ui-disabled');

//On clicking Partner Preference/COP input information will be validates
function copValidate() {
    var input = document.getElementById("experiment_title").value;
    if (input.indexOf('#') > -1) {
        alert('Experiment Title contains #');
    }
}

//Take information entered from that start page and initialize three variables with it.
//objectOne → leftIn
//objectTwo → rightIn
//Title → title of experiment + COP
//Then modify index.html to have those 3 values
function setUpCop() {
    if ((document.getElementById("obj_one").value=='') || (document.getElementById("obj_two").value=='')){
        return alert("Reload and make sure to enter objects!");
    }
    objectOne = document.getElementById("obj_one").value;
    objectTwo = document.getElementById("obj_two").value;
    title = document.getElementById("experiment_title").value;
    document.getElementById("in_obj_1").innerHTML = objectOne;
    document.getElementById("in_obj_2").innerHTML = objectTwo;
    document.getElementById("cop_header").innerHTML = title + " COP";
    $(location).attr('href', '#cop');
}

//keeps track of user input/ which buttons they press
function track_beh_cop(stim) {
time = document.getElementById("clock-area").innerHTML;
//strip out colon
time = time.replace(/:/g, '');
//strip out leading 0s
time = parseInt(time, 10);


if (stim == 'center') {
    copBehavior.push({
        "stim": "center",
        "time": time
    });
}
if (stim == 'inOne') {
    copBehavior.push({
        "stim": "inOne",
        "time": time
    });
}
if (stim == 'inTwo') {
    copBehavior.push({
        "stim": "inTwo",
        "time": time
    });
}
for (k = 0; k < copBehavior.join().length; k++) {
    var str = JSON.stringify(copBehavior[k]);
}

for (k = 0; k < copBehavior.length; k++) {
    var str = JSON.stringify(copBehavior[k]);
    console.log("copBehavior" + str);
}
}

//starts the clock whenever Object One (left in) is pressed
function obj_one_Start() {
if (obj_one_TimeBegan === null) {
    obj_one_TimeBegan = new Date();
}
if (obj_one_TimeStopped !== null) {
    obj_one_StoppedDuration += (new Date() - obj_one_TimeStopped);
}
obj_one_TimeStarted = setInterval(obj_one_ClockRunning, 10);
}

//stops the clock whenever Object One (left in) is pressed
function obj_one_Stop() {
obj_one_TimeStopped = new Date();
clearInterval(obj_one_TimeStarted);
}

//resets the clock for object One
function obj_one_Reset() {
clearInterval(obj_one_TimeStarted);
obj_one_StoppedDuration = 0;
obj_one_TimeBegan = null;
obj_one_TimeStopped = null;
document.getElementById("time_with_obj_one").innerHTML = "00:00:00.000";
}

//increments the clock or time in Object One
function obj_one_ClockRunning() {
var currentTime = new Date(),
    timeElapsed = new Date(currentTime - obj_one_TimeBegan - obj_one_StoppedDuration),
    hour = timeElapsed.getUTCHours(),
    min = timeElapsed.getUTCMinutes(),
    sec = timeElapsed.getUTCSeconds(),
    ms = timeElapsed.getUTCMilliseconds();
document.getElementById("time_with_obj_one").innerHTML = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
}

//starts the clock whenever Object Two (right in) is pressed
function obj_two_Start() {
if (obj_two_TimeBegan === null) {
    obj_two_TimeBegan = new Date();
}
if (obj_two_TimeStopped !== null) {
    obj_two_StoppedDuration += (new Date() - obj_two_TimeStopped);
}
obj_two_TimeStarted = setInterval(obj_two_ClockRunning, 10);
}

//stops the clock whenever Object Two (right in) is pressed
function obj_two_Stop() {
obj_two_TimeStopped = new Date();
clearInterval(obj_two_TimeStarted);
}

//resets the clock for object One
function obj_two_Reset() {
clearInterval(obj_two_TimeStarted);
obj_two_StoppedDuration = 0;
obj_two_TimeBegan = null;
obj_two_TimeStopped = null;
document.getElementById("time_with_obj_two").innerHTML = "00:00:00.000";
}


//increments the clock or time in Object Two
function obj_two_ClockRunning() {
var currentTime = new Date(),
    timeElapsed = new Date(currentTime - obj_two_TimeBegan - obj_two_StoppedDuration),
    hour = timeElapsed.getUTCHours(),
    min = timeElapsed.getUTCMinutes(),
    sec = timeElapsed.getUTCSeconds(),
    ms = timeElapsed.getUTCMilliseconds();
document.getElementById("time_with_obj_two").innerHTML = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
}

//starts the experiemnt
function startCop() {
$('#toggle-cop-button').removeClass('ui-disabled');


if (withTwo || withOne) {
    document.getElementById('in_1').disabled = true;
    document.getElementById('in_2').disabled = true;
    document.getElementById('btncenter').disabled = false;
} else {
    document.getElementById('in_1').disabled = false;
    document.getElementById('btncenter').disabled = true;
    document.getElementById('in_2').disabled = false;
}
console.log("Start Called");

//keeps track of the amount of time the experiment is running
document.getElementById("download-csv-cop").disabled = true;
if (copTimeBegan === null) {
    var myDate = new Date();
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    var srtDate = myDate.getDate() + " " + month[myDate.getMonth()] + " " + myDate.getFullYear() + " " + strTime;
    document.getElementById("date").value = srtDate;
    copTimeBegan = new Date();
}
if (copTimeStopped !== null) {
    copStoppedDuration += (new Date() - copTimeStopped);
}
copStarted = setInterval(clockRunningCop, 10);
document.getElementById("startCop").disabled = true;
$('#finish-test-cop').addClass('ui-disabled');
}

function clockRunningCop() {
var currentTime = new Date(),
    timeElapsed = new Date(currentTime - copTimeBegan - copStoppedDuration),
    hour = timeElapsed.getUTCHours(),
    min = timeElapsed.getUTCMinutes(),
    sec = timeElapsed.getUTCSeconds(),
    ms = timeElapsed.getUTCMilliseconds();
document.getElementById("clock-area").innerHTML = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
}


//stops the experiment and disables all buttons except for the start button
function stopCop() {
obj_one_Stop();
obj_two_Stop();
copTimeStopped = new Date();
clearInterval(copStarted);
$('#finish-test-cop').removeClass('ui-disabled');
$('#toggle-cop-button').addClass('ui-disabled');
document.getElementById("startCop").disabled = false;
document.getElementById('in_1').disabled = true;
document.getElementById('hops_in_1').disabled = true;
document.getElementById('ears_in_1').disabled = true;
document.getElementById('in_2').disabled = true;
document.getElementById('hops_in_2').disabled = true;
document.getElementById('ears_in_2').disabled = true;
document.getElementById('btncenter').disabled = true;
document.getElementById('hops_center').disabled = true;
document.getElementById('ears_center').disabled = true;

}
//all buttons are disabled once we finish the experiment
document.getElementById('in_1').disabled = true;
document.getElementById('hops_in_1').disabled = true;
document.getElementById('ears_in_1').disabled = true;
document.getElementById('btncenter').disabled = true;
document.getElementById('hops_center').disabled = true;
document.getElementById('ears_center').disabled = true;
document.getElementById('in_2').disabled = true;
document.getElementById('hops_in_2').disabled = true;
document.getElementById('ears_in_2').disabled = true;

//disables and enables buttons if we are in object One
function in_Object_One() {
obj_one_Start();
track_beh_cop("inOne");
document.getElementById('in_1').disabled = true;
document.getElementById('hops_in_1').disabled = false;
document.getElementById('ears_in_1').disabled = false;
document.getElementById('in_2').disabled = true;
document.getElementById('hops_in_2').disabled = true;
document.getElementById('ears_in_2').disabled = true;
document.getElementById('btncenter').disabled = false;
document.getElementById('hops_center').disabled = true;
document.getElementById('ears_center').disabled = true;
document.getElementById('in_obj_1').style.color = "magenta";
document.getElementById('center_purple').style.color = "white";
withOne = true;
}

//disables and enables buttons if we are in object Two
function in_Object_Two() {
obj_two_Start();
track_beh_cop("inTwo");
document.getElementById('in_1').disabled = true;
document.getElementById('hops_in_1').disabled = true;
document.getElementById('ears_in_1').disabled = true;
document.getElementById('in_2').disabled = true;
document.getElementById('hops_in_2').disabled = false;
document.getElementById('ears_in_2').disabled = false;
document.getElementById('btncenter').disabled = false;
document.getElementById('hops_center').disabled = true;
document.getElementById('ears_center').disabled = true;
document.getElementById('in_obj_2').style.color = "magenta";
document.getElementById('center_purple').style.color = "white";
withTwo = true;
}

//disables and enables buttons if we are in the center
function centerOne() {
if(withOne){
   obj_one_Stop();
}
else if(withTwo){
obj_two_Stop();
}
track_beh_cop("center");
document.getElementById('in_2').disabled = false;
document.getElementById('hops_in_2').disabled = true;
document.getElementById('ears_in_2').disabled = true;
document.getElementById('btncenter').disabled = true;
document.getElementById('hops_center').disabled = false;
document.getElementById('ears_center').disabled = false;
document.getElementById('in_1').disabled = false;
document.getElementById('hops_in_1').disabled = true;
document.getElementById('ears_in_1').disabled = true;
document.getElementById('in_obj_2').style.color = "white";
document.getElementById('in_obj_1').style.color = "white";
document.getElementById('center_purple').style.color = "magenta";


withOne = false;
withTwo = false;
}

//increments the chew count for either object One or object Two
function chew() {
if (withOne) {
    chewOne++;
} else if (withTwo) {
    chewTwo++;
}
}
//increments the hops count for either object One or object Two
function hops() {
if (withOne) {
    hopOne++;
} else if (withTwo) {
    hopTwo++;
} else {
    centerHops++;
}
//increments the ear movement count for either object One or object Two
}
function ears() {
    if (withOne) {
        earsOne++;
    } else if (withTwo) {
        earsTwo++;
    } else {
        centerEars++;
    }
    }




//gets the time the user pressed the flag button
function flagCop() {
flagscop.push(time = " " + document.getElementById("clock-area").innerHTML);
}

//finishes the experiment and initializes a result table with the experiments data
function finishTestCop() {
    document.getElementById("download-csv-cop").disabled = false;
    $("#copTestBody tr").remove();

    document.getElementById("copParagraphFlags").innerHTML = flagscop;
    document.getElementById("copResultsHeader").innerHTML = document.getElementById("experiment_title").value + " Results";
    document.getElementById("inOne").innerHTML = objectOne;
    document.getElementById("inTwo").innerHTML = objectTwo;
    var date = "null";
    var female = "null";
    var stud = "null";
    var date = document.getElementById("date").innerHTML;
    var female = document.getElementById("female").innerHTML;
    var stud = document.getElementById("stud").innerHTML;
    var columns = ["drag", "inOne", "center", "inTwo", "delete"];
    var resultTable = document.getElementById("copTestBody");
    var numberRows = 0;
    var mostRecentIn_row = 0
    var rowsToDelete_cop = [];
    var row;
    var i = 0;
    var j = 0;
    var twoPerLine = 0;
    while (j <= copBehavior.length) {
        while (i <= columns.length) {
            if (i == 5 || numberRows == 0) {
                row = resultTable.insertRow(numberRows);
                numberRows++;
                i = 0;
                twoPerLine = 0;
            }
            if (columns[i] == copBehavior[j]['stim']) {
                if (copBehavior[j]['stim'] == "inTwo") {
                    mostRecentIn_row = numberRows;
                }
                if (copBehavior[j]['stim'] == "center" && copBehavior[j - 1]['stim'] == "inTwo") {
                    var cell_out = resultTable.rows[mostRecentIn_row - 1].cells[2];
                    cell_out.innerHTML = copBehavior[j]['time'];
                    cell_out.setAttribute('contentEditable', 'true');
                    cell_out.className = 'recipe-table__cell';
                    console.log(i);
                    i = 2;
                    j++;

                } else {
                    var cell = row.insertCell(i);
                    cell.setAttribute('contentEditable', 'true');
                    cell.innerHTML = copBehavior[j]['time'];
                    cell.className = 'recipe-table__cell';
                    if (copBehavior[j]['stim'] == 'inOne' || copBehavior[j]['stim'] == 'center') {
                        twoPerLine++;
                    }
                    i++;
                    console.log("i", i);
                    j++;

                    if (twoPerLine == 2) {
                        var cell = row.insertCell(i);
                        cell.className = 'recipe-table__cell';
                        cell.setAttribute('contentEditable', 'true');
                        cell.innerHTML = "&nbsp";
                        i++;
                    }

                }
            } else if (columns[i] == 'drag') {
                var cell = row.insertCell(i);
                cell.innerHTML = "";
                cell.className = 'drag-handler';
                i++;

            } else if (columns[i] == 'delete') {
                var cell = row.insertCell(i);
                cell.innerHTML = "<button class=\"recipe-table__del-row-btn ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-icon-notext\"></button>";
                cell.className = 'recipe-table__cell';
                cell.style.width = "5%";
                i++;

            } else {
                var cell = row.insertCell(i);
                cell.setAttribute('contentEditable', 'true');
                cell.innerHTML = "&nbsp";
                cell.className = 'recipe-table__cell';
                i++;
            }


            if (j == copBehavior.length) {
                break;
            }
        }
        if (j == copBehavior.length) {
            break;
        }

    }

    var rows = $(resultTable).find(' > tr');
    for (var i = 0; i < rows.length; i++) {
        if (emptyCellsOnly(rows[i])) {
           console.log(rows[i].parentNode);
           rows[i].parentNode.removeChild(rows[i]);

        }
    }

}

//checks if a cell is empty or not
function emptyCellsOnly(row) {
var cells = row.cells;
for (var j = 1; j < 4; j++) {
   console.log("innerHTML",cells[j].innerHTML);
    if (cells[j].innerHTML !== '&nbsp;') {
        return false;
    }
}
return true;
}


//downloads the CSV file to local computer
function copDownloadCSV() {
var date = document.getElementById("date").value;
var timeWithOne = document.getElementById("time_with_obj_one").innerHTML;
var timeWithTwo = document.getElementById("time_with_obj_two").innerHTML;

var female = document.getElementById("female").value;
var stud = documnet.getElementById("stud").value;
var filename = document.getElementById("experiment_title").value;
var notes = document.getElementById("copnotes").value;
var name = document.getElementById("experimenter_name").value;
var time = document.getElementById("display-area").innerHTML;
var table = document.getElementById("coptableresults");
var flags = document.getElementById("copParagraphFlags").innerHTML;
//First table in CSV file
var data = [
    ["Experiment", " ", filename],
    ["Female", " ", female],
    ["Stud", " ", stud],
    ["Date", " ", date],
    ["Name", " ", name],
    ["Notes", " ", notes],
    ["Time with " + objectOne, " ", stringToIntTime(timeWithOne)],
    ["Time with " + objectTwo, " ", stringToIntTime(timeWithTwo)],
    [objectOne + " Chews", " ", chewOne],
    [objectOne + " Hops", " ", hopOne ],
    [objectOne + " Ears", " ", earsTwo],
    ["Center" + " Hops", " ", centerHops],
    ["Center" + " Ears", " ", centerEars],
    [objectTwo + " Chews", " ", chewTwo],
    [objectTwo + " Hops", " ", hopTwo],
    [objectTwo + " Ears", " ", earsTwo],
    ["Flags: ", flags],
    []
];

//Second table in CSV file which contains the cop results table (the webpage after you finish the experiment)
var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(function(infoArray, index) {
    dataString = infoArray.join(",");
    csvContent += index < data.length ? dataString + "\n" : dataString;
});

csvContent += "," + objectOne + ",";
csvContent += "Center,";
csvContent += objectTwo + "\n";


var rows = $("#copTestBody > tr");

for (var i = 0; i < rows.length; ++i) {
    var cells = $(rows[i]).find("> td");
    for (var j = 0; j < cells.length; ++j) {
        if (j != 0) csvContent += ",";

        var str = cells[j].innerHTML;
        console.log("STR in its entirefy" + str);
        console.log("PRESTR at 0" + str.charAt(0));

        if (str.charAt(0) == "<") {
            str = str.substr(str.indexOf("</b>") + 4);
            if (str.charAt(0) == "t") {
                str = "";
            }
            if (str.charAt(0) == "&") {
                str = str.substr(6);
            }
            str = str.replace(/\&nbsp;/g, '');
        }
        if (str.includes("del")) {
            str = "";
        }
        csvContent += str;
    }
    csvContent += "\n";


}

//create CSV file link and downloads to computer
var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", filename + "_data.csv");
document.body.appendChild(link); // Required for FF
link.click();


}
//-------------
//functionality to add a row in the results table
$(document).ready(function() {
$(document).on('click', '.recipe-table__add-row-btn', function(e) {
    var $el = $(e.currentTarget);
    var $tableBody = $('#copTestBody');
    var htmlString = $('#rowTemplate').html();
    $tableBody.append(htmlString);
    return false;
});
//functionality to delete a row in the results table
$(document).on('click', '.recipe-table__del-row-btn', function(e) {
    var $el = $(e.currentTarget);
    var $row = $el.closest('tr');
    $row.remove();
    return false;
});
//adds table dragginf functionality
Sortable.create(
    $('#copTestBody')[0], {
        animation: 150,
        scroll: true,
        handle: '.drag-handler'
    }
);
});
