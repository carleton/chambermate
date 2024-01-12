 /*
  * Pacing Data Collection App 
  * @author  Joshua Pitkofsky
  * @maintained by Malcolm Mitchell
  * @version 1.0, 12/17/16
  */
 //timer code from Andrew Whitaker on http://stackoverflow.com/questions/26329900/how-do-i-display-millisecond-in-my-stopwatch
 var timeBegan = null,
     timeStopped = null,
     stoppedDuration = 0,
     started = null,
     maleTimeBegan = null,
     maleTimeStopped = null,
     maleStoppedDuration = 0,
     maleTimeStarted = null;
 var withMale = false;
 var sexualBehavior = [];
 var proceptive_rejection = [];
 var crl = [];
 var tte = [];
 var crlTotal = 0;
 var crlMountTotal = 0;
 var crlIntroTotal = 0;
 var crlEjacTotal = 0;
 var tteTotal = 0;
 var tteMountTotal = 0;
 var tteIntroTotal = 0;
 var tteEjacTotal = 0;
 var introCount = 0;
 var maleIns = 0;
 var maleOuts = 0;
 var hopsIn = 0;
 var hopsOut = 0;
 var earsIn = 0;
 var earsOut = 0;
 var rejectionBeh = 0;
 var rolls = 0;
 var kicks = 0;
 var squeaks = 0;
 var stimNumber = 0;
 var mostRecentStim = null;
 var mostRecentStimType = null;
 var newStim = false;
 var lqSum = 0;
 var lqAvg = 0;
 var percentExitMount = 0;
 var percentExitIntro = 0;
 var percentExitEjac = 0;
 var numberExits = 0;
 var ejacCount = 0;
 var introCount_exit_var = 0;
 var mountCount = 0;
 var stimLQOverTwo = 0;
 var flags = [];
 var pacingexecuted = false;

 var tmpColDelim = String.fromCharCode(11); // vertical tab character
 var tmpRowDelim = String.fromCharCode(0); // null character

 // actual delimiter characters for CSV format
 var colDelim = '","';
 var rowDelim = '"\r\n"';

 // Grab text from table into CSV formatted string
 var csv = '"';
document.getElementById("in_enter").disabled = true;
$('#toggle-button').addClass('ui-disabled');

 function validate() {
     var input = document.getElementById("experiment_title").value;
     if (input.indexOf('#') > -1) {
        alert('Experiment Title contains #');
     }
     else {
         document.getElementById("experimentHeader").innerHTML = document.getElementById("experiment_title").value;
         $(location).attr('href', '#pagetwo');
     }
 }

 function maleStart() {
     if (maleTimeBegan === null) {
         maleTimeBegan = new Date();
     }
     if (maleTimeStopped !== null) {
         maleStoppedDuration += (new Date() - maleTimeStopped);
     }
     maleTimeStarted = setInterval(maleClockRunning, 10);
 }

 function maleStop() {
     maleTimeStopped = new Date();
     clearInterval(maleTimeStarted);
 }

 function maleReset() {
     clearInterval(maleTimeStarted);
     maleStoppedDuration = 0;
     maleTimeBegan = null;
     maleTimeStopped = null;
     document.getElementById("time_with_male").innerHTML = "00:00:00.000";
 }

 function maleClockRunning() {
     var currentTime = new Date(),
         timeElapsed = new Date(currentTime - maleTimeBegan - maleStoppedDuration),
         hour = timeElapsed.getUTCHours(),
         min = timeElapsed.getUTCMinutes(),
         sec = timeElapsed.getUTCSeconds(),
         ms = timeElapsed.getUTCMilliseconds();
     // document.getElementById("time_with_male").innerHTML =
     //     (hour > 9 ? hour : "0" + hour) + ":" +
     //     (min > 9 ? min : "0" + min) + ":" +
     //     (sec > 9 ? sec : "0" + sec) + "." +
     //     (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
     document.getElementById("time_with_male").innerHTML = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
 }

 function start() {
     console.log("Start Called");
$('#toggle-button').removeClass('ui-disabled');
     $('#finish-test').addClass('ui-disabled');
    document.getElementById("in_enter").disabled = false;

     document.getElementById("download-csv").disabled = true;
     if (timeBegan === null) {
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
         // e.g. "13 Nov 2016 11:00pm";
         var srtDate = myDate.getDate() + " " + month[myDate.getMonth()] + " " + myDate.getFullYear() + " " + strTime;
         document.getElementById("date").value = srtDate;
         timeBegan = new Date();
     }
     if (timeStopped !== null) {
         stoppedDuration += (new Date() - timeStopped);
     }
     started = setInterval(clockRunning, 10);
     document.getElementById("start").disabled = true;

     if(withMale){
             var x = document.getElementsByClassName('withMale');
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = false;
     }
     }
 }

 function stop() {
     timeStopped = new Date();
     maleStop();
     clearInterval(started);
     $('#finish-test').removeClass('ui-disabled');
    document.getElementById('in_enter').disabled = true;

     document.getElementById("start").disabled = false;
$('#toggle-button').addClass('ui-disabled');
     var x = document.getElementsByClassName('withMale');
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = true;
     }
 }

 /* function reset() {
     clearInterval(started);
     maleReset();
     stoppedDuration = 0;
     timeBegan = null;
     timeStopped = null;
     introCount = 0;
     withMale = false;
     sexualBehavior = [];
     proceptive_rejection = [];
     crl_tte = [];
     introCount = 0;
     maleIns = 0;
     maleOuts = 0;
     hopsIn = 0;
     hopsOut = 0;
     earsIn = 0;
     earsOut = 0;
     rejectionBeh = 0;
     stimNumber = 0;
     lqSum = 0;
     lqAvg = 0;
     percentExitMount = 0;
     percentExitIntro = 0;
     percentExitEjac = 0;
     numberExits = 0;
     ejacCount = 0;
     introCount_exit_var = 0;
     mountCount = 0;
     stimLQOverTwo = 0;
     document.getElementById("pacingLq").innerHTML = "Pacing lq";
     document.getElementById("percentExitMount").innerHTML = "Percent Exit Mount";
     document.getElementById("percentExitIntro").innerHTML = "Percent Exit Intro";
     document.getElementById("percentExitEjac").innerHTML = "Percent Exit Ejac";
     document.getElementById("display-area").innerHTML = "00:00:00.000";
     document.getElementById("results").innerHTML = "";
     document.getElementById("lqAvg").innerHTML = "lqAvg";
     document.getElementById("male_ins").innerHTML = "Male Ins: " + maleIns;
     document.getElementById("male_outs").innerHTML = "Male Outs: " + maleOuts;
     document.getElementById("hops_in").innerHTML = "Hops In: " + hopsIn;
     document.getElementById("hops_out").innerHTML = "Hops Out: " + hopsOut;
     document.getElementById("ears_in").innerHTML = "Ears In: " + earsIn;
     document.getElementById("ears_out").innerHTML = "Ears Out: " + earsOut;
     document.getElementById("rejection_beh").innerHTML = "Rejections Beh: " + rejectionBeh;
 } */

 function clockRunning() {
     var currentTime = new Date(),
         timeElapsed = new Date(currentTime - timeBegan - stoppedDuration),
         hour = timeElapsed.getUTCHours(),
         min = timeElapsed.getUTCMinutes(),
         sec = timeElapsed.getUTCSeconds(),
         ms = timeElapsed.getUTCMilliseconds();
     document.getElementById("display-area").innerHTML = (min > 9 ? hour*60 + min : hour > 0 ? hour*60 + min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
 }
 

 function track_beh(stim, opts, time) {
     if (opts['lq'] != null) {
         lq = opts['lq'];
         secondsTime = timeToSeconds(time);

         mostRecentStim = time;
         mostRecentStimType = stim;
         newStim = true;
         lqSum += lq;
         if (lq >= 2) {
             stimLQOverTwo++;
         }
         lqAvg = lqSum / stimNumber;
         pacingLq = stimLQOverTwo / stimNumber;

         sexualBehavior.push({
             "stim": stim,
             "lq": lq,
             "time": secondsTime
         });
         sexualBehavior.push({
             "stim": "lq",
             "lq": lq
         });
         document.getElementById("pacingLq").innerHTML = "pacing lq is " + pacingLq;
         document.getElementById("lqAvg").innerHTML = "lqAvg is " + lqAvg;


         for (k = 0; k < sexualBehavior.length - 1; k++) {
             var str = JSON.stringify(sexualBehavior[k]);
             console.log(str);
         }
         document.getElementById("intro_count").innerHTML = introCount;
         document.getElementById("mount_count").innerHTML = mountCount;
         document.getElementById("ejac_count").innerHTML = ejacCount;
         switch (mostRecentStimType) {
             case "mount":
                 document.getElementById("mostRecentMount").innerHTML = mostRecentStim;
                 document.getElementById("mostRecentIntro").innerHTML = "";
                 document.getElementById("mostRecentEjac").innerHTML = "";
                 break;
             case "intro":
                 document.getElementById("mostRecentMount").innerHTML = "";
                 document.getElementById("mostRecentIntro").innerHTML = mostRecentStim;
                 document.getElementById("mostRecentEjac").innerHTML = "";
                 break;
             case "ejac":
                 document.getElementById("mostRecentMount").innerHTML = "";
                 document.getElementById("mostRecentIntro").innerHTML = "";
                 document.getElementById("mostRecentEjac").innerHTML = mostRecentStim;
                 break;
             default: 
                 break;
         }
     } else {
         secondsTime = timeToSeconds(time);
         proceptive_rejection.push(stim + " at " + time);
         if (stim == 'out') {
             numberExits++;
             percentExitMount = numberExits / mountCount;
             percentExitIntro = numberExits / introCount_exit_var;
             percentExitEjac = numberExits / ejacCount;
             sexualBehavior.push({
                 "stim": "out",
                 "time": secondsTime
             });
             if (newStim == true) {
                 // console.log(Integer.valueOf(time));
                 timeToExit = stringToIntTime(time) - stringToIntTime(mostRecentStim);
                 tte.push({
                     "stimNumber": stimNumber,
                     "TTE": timeToExit,
                     "row": stimNumber + maleOuts - 1
                 });
                 tteTotal += timeToExit;
                 switch (mostRecentStimType) {
                     case "mount":
                         tteMountTotal += timeToExit;
                         console.log("tteMountTotal: " + tteMountTotal);
                     case "intro":
                         tteIntroTotal += timeToExit;
                     case "ejac":
                         tteEjacTotal += timeToExit;
                 }
             }
             document.getElementById("percentExitMount").innerHTML = "percentExitMount: " + percentExitMount;
             document.getElementById("percentExitIntro").innerHTML = "percentExitIntro: " + percentExitIntro;
             document.getElementById("percentExitEjac").innerHTML = "percentExitEjac: " + percentExitEjac;
         }
         if (stim == 'in') {
             sexualBehavior.push({
                 "stim": "in",
                 "time": secondsTime
             });
             if (newStim == true) {
                 contactReturnLatency = stringToIntTime(time) - stringToIntTime(mostRecentStim);
                 crl.push({
                     "stimNumber": stimNumber,
                     "CRL": contactReturnLatency,
                     "row": stimNumber + maleOuts - 1
                 });
                 crlTotal += contactReturnLatency;
                 switch (mostRecentStimType) {
                     case "mount":
                         crlMountTotal += timeToExit;
                         console.log("crlMountTotal: " + crlMountTotal);
                     case "intro":
                         crlIntroTotal += timeToExit;
                         console.log("crlIntroTotal: " + crlIntroTotal);
                     case "ejac":
                         crlEjacTotal += timeToExit;
                 }
                 newStim = false;
                 // var ul = document.getElementById("CRL");
                 // for (var i = 0; i < crl_tte.length; i++) {
                 //     var li = document.createElement('li'),
                 //         content = document.createTextNode(crl_tte[i]);
                 //     li.appendChild(content); // append the created textnode above to the li element
                 //     ul.appendChild(li); // append the created li element above to the ul element 
                 // }
             }
         }
         for (k = 0; k < sexualBehavior.join().length; k++) {
             var str = JSON.stringify(sexualBehavior[k]);
             //console.log(str);
         }
         document.getElementById("male_ins").innerHTML = "Male Ins: " + maleIns;
         document.getElementById("male_outs").innerHTML = "Male Outs: " + maleOuts;
         document.getElementById("hops_in").innerHTML = "Hops In: " + hopsIn;
         document.getElementById("hops_out").innerHTML = "Hops Out: " + hopsOut;
         document.getElementById("ears_in").innerHTML = "Ears In: " + earsIn;
         document.getElementById("ears_out").innerHTML = "Ears Out: " + earsOut;
         document.getElementById("rejection_beh").innerHTML = "Rejections Beh: " + rejectionBeh;
     }
 }




 function timeToSeconds(stringTimePassed) {
     //strip out colon
     timeNoColon = stringTimePassed.replace(/:/g, '');
     //strip out leading 0s
     timesec = parseInt(timeNoColon, 10);
     // time=time.replace(/^[0]+/g,'');
     return timesec;
 }

 function stringToIntTime(stringTime) {
     console.log("Minute time " + stringTime);
     var strTime = stringTime.split(":");
     var seconds = ((+strTime[0]) * 60 + (+strTime[1]));
     console.log("string time in seconds " + seconds);
     return seconds;
 }
 
 function secondsToTime(seconds) {
     sec = seconds%100;
     mins = (seconds-sec)/100;
     sec = sec < 10 ? '0' + sec : sec;
     mins = mins <10 ? '0' + mins : mins;
     result = mins + ":" + sec;
     //var date = new Date(null);
     //date.setSeconds(seconds);
     //var result = date.toISOString().substr(11, 8);
     return result;
 }

 function flag() {
     flags.push(time = " " + document.getElementById("display-area").innerHTML);
 }

 function ejac_zero(aTime = document.getElementById("display-area").innerHTML) {
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 0
     }, aTime);
 }

 function ejac_one(aTime = document.getElementById("display-area").innerHTML) {
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 1
     }, aTime);
 }

 function ejac_two(aTime = document.getElementById("display-area").innerHTML) {
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 2
     }, aTime);
 }

 function ejac_three(aTime = document.getElementById("display-area").innerHTML) {
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 3
     }, aTime);
 }

 function intro_zero(aTime = document.getElementById("display-area").innerHTML) {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 0
     }, aTime);
 }

 function intro_one(aTime = document.getElementById("display-area").innerHTML) {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 1
     }, aTime);
 }

 function intro_two(aTime = document.getElementById("display-area").innerHTML) {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 2
     }, aTime);
 }

 function intro_three(aTime = document.getElementById("display-area").innerHTML) {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 3
     }, aTime);
 }

 function mount_zero(aTime = document.getElementById("display-area").innerHTML) {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 0
     }, aTime);
 }

 function mount_one(aTime = document.getElementById("display-area").innerHTML) {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 1
     }, aTime);
 }

 function mount_two(aTime = document.getElementById("display-area").innerHTML) {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 2
     }, aTime);
 }

 function mount_three(aTime = document.getElementById("display-area").innerHTML) {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 3
     }, aTime);
 }

 function ears() {
     if (withMale) {
         earsIn++;
     } else {
         earsOut++
     }
     track_beh("ears", {});
 }

 function hop() {
     if (withMale) {
         hopsIn++;
     } else {
         hopsOut++;
     }
     track_beh("hop", {});
 }

 function kick() {
     rejectionBeh++;
     kicks++;
     track_beh("kick", {});
 }

 function squeak() {
     rejectionBeh++;
     squeaks++;
     track_beh("squeak", {});
 }

 function roll() {
     rejectionBeh++;
     rolls++;
     track_beh("roll", {});
 }

 function in_enter(aTime = document.getElementById("display-area").innerHTML) {
     maleIns++;
     withMale = true;
     maleStart();
     track_beh("in", {}, aTime);
     var x = document.getElementsByClassName('withMale');
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = false;
     }
     document.getElementById('in_enter').disabled = true;
 }

 function out(aTime = document.getElementById("display-area").innerHTML) {
     withMale = false;
     maleStop();
     maleOuts++;
     track_beh("out", {}, aTime);
     var x = document.getElementsByClassName('withMale');
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = true;
     }
     document.getElementById('in_enter').disabled = false;
 }
 var x = document.getElementsByClassName('withMale');
 if (!withMale) {
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = true;
     }
 }

 var testDate = new Date();
 //http://stackoverflow.com/questions/9532664/how-to-display-a-date-object-in-a-specific-format-using-javascript
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
 var hours = testDate.getHours();
 var minutes = testDate.getMinutes();
 var ampm = hours >= 12 ? 'pm' : 'am';
 hours = hours % 12;
 hours = hours ? hours : 12;
 minutes = minutes < 10 ? '0' + minutes : minutes;
 var strTime = hours + ':' + minutes + ampm;
 // e.g. "13 Nov 2016 11:00pm";
 var srtDate = testDate.getDate() + " " + month[testDate.getMonth()] + " " + testDate.getFullYear() + " " + strTime;
 document.getElementById("date").value = srtDate;
 var csvData = [];

 function finishTest() {
         document.getElementById("download-csv").disabled = false;

         $("#testBody tr").remove();
         document.getElementById("paragraphFlags").innerHTML = flags;
         document.getElementById("resultsHeader").innerHTML = document.getElementById("experiment_title").value + " Results";
         console.log(crl);
         console.log(tte);
         var date = "null";
         var female = "null";
         var stud = "null";
         var date = document.getElementById("date").innerHTML;
         var female = document.getElementById("female").innerHTML;
         var stud = document.getElementById("stud").innerHTML;
         var columns = ["drag", "in", "out", "mount", "lq", "intro", "lq", "ejac", "lq", "del"];
         var resultTable = document.getElementById("testBody");
         var numberRows = 0;
         var rowsToDelete = [];
         var mostRecentStim_row = 0;
         var row;
         var i = 0;
         var j = 0;
         while (j <= sexualBehavior.length) {
             while (i <= columns.length) {
                 if (i == 10 || numberRows == 0) {
                         row = resultTable.insertRow(numberRows);
                         row.id = numberRows;
                         numberRows++;
                         i = 0;
                 }
                 if (columns[i] == sexualBehavior[j]['stim']) {
                    console.log("stim:", sexualBehavior[j]['stim']);
                     var cell = row.insertCell(i);
                     cell.setAttribute('contentEditable', 'true');
                     cell.className = 'recipe-table__cell';

                     if (sexualBehavior[j]['stim'] == "out") {
                         if (sexualBehavior[j - 1]['stim'] == "in") {
                             cell.innerHTML = sexualBehavior[j]['time'];
                             i++;
                             j++;
                         }
                         else{
                         var cell_out = resultTable.rows[mostRecentStim_row-1].cells[2];
                         cell_out.innerHTML = sexualBehavior[j]['time'];
                         rowsToDelete.push({
                             "rowToDelete": row
                         });
                         i++;
                         j++;
                     }
                     }

                     else if (sexualBehavior[j]['stim'] == "lq") {
                         cell.innerHTML = sexualBehavior[j]['lq'];
                         mostRecentStim_row = numberRows;
                         i++;
                         j++;
                     }

                     else {
                         cell.innerHTML = sexualBehavior[j]['time'];
                         i++;
                         j++;
                     }
                 } else if (columns[i] == 'drag') {
                     var cell = row.insertCell(i);
                     cell.innerHTML = "";
                     cell.className = 'drag-handler';
                     i++;

                 } else if (columns[i] == 'del') {
                     var cell = row.insertCell(i);
                     cell.innerHTML = "<button class=\"recipe-table__del-row-btn ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-icon-notext\"></button>";
                     cell.className = 'recipe-table__cell';
                     cell.style.width = "5%";
                     i++;
                 } else {
                     var cell = row.insertCell(i);
                     cell.setAttribute('contentEditable', 'true');
                     cell.className = 'recipe-table__cell';
                     cell.innerHTML = "&nbsp";
                     i++;
                 }
                 
                 if (j == sexualBehavior.length) {
                     break;
                 }
             }
             if (j == sexualBehavior.length) {
                 break;
             }

         }


     for (var i = 0; i < rowsToDelete.length; i++) {
        console.log(rowsToDelete);
        var row = rowsToDelete[i].rowToDelete;
        console.log(row);
        row.parentNode.removeChild(row);

     }

 }

function backAndSave() {
    sexualBehavior = [];
    proceptive_rejection = [];
    crl = [];
    tte = [];
    crlTotal = 0;
    crlMountTotal = 0;
    crlIntroTotal = 0;
    crlEjacTotal = 0;
    timeToExit = 0;
    tteTotal = 0;
    tteMountTotal = 0;
    tteIntroTotal = 0;
    tteEjacTotal = 0;
    introCount = 0;
    maleIns = 0;
    maleOuts = 0;
    stimNumber = 0;
    mostRecentStim = null;
    mostRecentStimType = null;
    newStim = false;
    lqSum = 0;
    lqAvg = 0;
    percentExitMount = 0;
    percentExitIntro = 0;
    percentExitEjac = 0;
    numberExits = 0;
    ejacCount = 0;
    introCount_exit_var = 0;
    mountCount = 0;
    stimLQOverTwo = 0;
    pacingexecuted = false;
    contactReturnLatency = 0;
    pacinglq = 0;
    
    var resultTable = document.getElementById("testBody");
    var rows = resultTable.rows;
    var columns = ["drag", "in", "out", "mount", "lq", "intro", "lq", "ejac", "lq", "del"];
    
    for (var j=0; j<=rows.length; j++){
        var cells = rows[j].cells;
        var secondsIn = cells[1].innerHTML.replace(/[^0-9]/g, '');
        var secondsMount = cells[3].innerHTML.replace(/[^0-9]/g, '');
        var lqMount = cells[4].innerHTML.replace(/[^0-9]/g, '');
        var secondsIntro = cells[5].innerHTML.replace(/[^0-9]/g, '');
        var lqIntro = cells[6].innerHTML.replace(/[^0-9]/g, '');
        var secondsEjac = cells[7].innerHTML.replace(/[^0-9]/g, '');
        var lqEjac = cells[8].innerHTML.replace(/[^0-9]/g, '');
        var secondsOut = cells[2].innerHTML.replace(/[^0-9]/g, '');
        
        if (secondsIn != "") {
            in_enter(secondsToTime(parseInt(secondsIn)));
        }
        if (secondsMount != "") {
            switch (lqMount) {
                case "0":
                    mount_zero(secondsToTime(parseInt(secondsMount)));
                    break;
                case "1":
                    mount_one(secondsToTime(parseInt(secondsMount)));
                    break;
                case "2":
                    mount_two(secondsToTime(parseInt(secondsMount)));
                    break;
                case "3":
                    mount_three(secondsToTime(parseInt(secondsMount)));
                    break;
                default:
                    break;
            }
        }
        if (secondsIntro != "") {
            switch (lqIntro) {
                case "0":
                    intro_zero(secondsToTime(parseInt(secondsIntro)));
                    break;
                case "1":
                    intro_one(secondsToTime(parseInt(secondsIntro)));
                    break;
                case "2":
                    intro_two(secondsToTime(parseInt(secondsIntro)));
                    break;
                case "3":
                    intro_three(secondsToTime(parseInt(secondsIntro)));
                    break;
                default:
                    break;
            }
        }
        if (secondsEjac != "") {
            switch (lqEjac) {
                case "0":
                    ejac_zero(secondsToTime(parseInt(secondsEjac)));
                    break;
                case "1":
                    ejac_one(secondsToTime(parseInt(secondsEjac)));
                    break;
                case "2":
                    ejac_two(secondsToTime(parseInt(secondsEjac)));
                    break;
                case "3":
                    ejac_three(secondsToTime(parseInt(secondsEjac)));
                    break;
                default:
                    break;
            }
        }
        if (secondsOut != "") {
            out(secondsToTime(parseInt(secondsOut)));
        }
    }
}

 /*    for (var j = 0; j < sexualBehavior.length; j++) {
         for (var i = 0; i <= columns.length; i++) {
             console.log(columns.length);
             console.log(i);
             if (i == 8 || numberRows == 0) {
                 numberRows++;
                 row = resultTable.insertRow(numberRows);
             }
             if (columns[i] == sexualBehavior[j]['stim']) {
                 var cell = row.insertCell(i);
                 cell.innerHTML = sexualBehavior[j]["hi"];
                 if(sexualBehavior[j]['stim']=="lq"){
                     cell.innerHTML = sexualBehavior[j]["lq"];
                 }
                 else{
                     cell.innerHTML = sexualBehavior[j]["time"];
             }
         }
             else {
                 console.log("i is "+i+"number rows "+numberRows);
                  var cell = row.insertCell(i);
                   cell.innerHTML = "row "+numberRows+"col "+i;
                 // csvData.push(",");
                 //document.write(csvData);
             }
         }
     } */

 //iterate through sexual behavior
 //fill out a table, for each column, if the next key has that type put it there, 
 //otherwise go to the next column (Add a comma and move on)
 //don't forget she wants this for each stim to see over time
 //Contact Return Latency = time of return - time of stim
 //Time to exit = time of exit - time of stimulation
 //% exit = #exits/# of that stim
 //pacing LQ = #stim>=2/total#stim
 //LR = avg lq or is it most common lq???
 //crl store time of stim when stim is clicked
 //store time of next in and subtract time of stim
 //create int as stim id in object and append crl to object
 //does she want it stored with the previous or most recent stim <-- XXX
 //time to return after that stim or time to return to next enter?
 //A: it took 40 secs to re-enter after this stim
 //B: the current entry occured 40 seconds after the last stim
 //Time to Exit: Do you want it pegged to stim or to Out? stim or in?
 //if they go in and out without a stim, CRL is nothing so pegged to stim
 //make global time of most recent stim variable, if in and out with no stim don't do it
 //when exit, do exit - recent (if newStim == true)
 //when enter do enter - recent (if newStim == true)
 //newStim is true while an in and out happened with a stim
 //newStim is false if female went in and out without a stim
 //set newStim false when in is clicked, and true when stim
 //push crl and tte only on last stim - use stim id



 function downloadCSV() {
     var date = document.getElementById("date").value;
     var female = document.getElementById("female").value;
     var stud = document.getElementById("stud").value;
     var experimenter_name = document.getElementById("experimenter_name").value;
     var filename = document.getElementById("experiment_title").value;
     var seconds = (parseInt(document.getElementById("display-area").innerHTML.split(':')[0])*60 + parseInt(document.getElementById("display-area").innerHTML.split(':')[1])).toString();
     var time = document.getElementById("display-area").innerHTML;
     var timeWithMale = document.getElementById("time_with_male").innerHTML;
     var crlMountAvg = crlMountTotal / crlTotal;
     var crlIntroAvg = crlIntroTotal / crlTotal;
     var crlEjacAvg = crlEjacTotal / crlTotal;
     var tteMountAvg = tteMountTotal / tteTotal;
     var tteIntroAvg = tteIntroTotal / tteTotal;
     var tteEjacAvg = tteEjacTotal / tteTotal;
     var table = document.getElementById("tableresults");


     var data = [
         [],
         ["Date", " ", date],
         ["Female", " ", female],
         ["Stud", " ", stud],
         ["Male Ins", " ", maleIns],
         ["Male Outs", " ", maleOuts],
         ["Time", " ", time],
         ["Hops IN", " ", hopsIn],
         ["Ears IN", " ", earsIn],
         ["Hops ALONE", " ", hopsOut],
         ["Ears ALONE", " ", earsOut],
         ["Kicks", " ", kicks],
         ["Squeaks", " ", squeaks],
         ["Rolls", " ", rolls],
         ["Rejection Beh", " ", rejectionBeh],
         // ["time with male", " ", timeWithMale],
         // ["# mounts", " ", mountCount],
         // ["# intros", " ", introCount_exit_var],
         // ["# ejacs", " ", ejacCount],
         // ["% exit mount", " ", percentExitMount],
         // ["% exit intro", " ", percentExitIntro],
         // ["% exit ejac", " ", percentExitEjac],
         // ["pacing lq", " ", pacingLq],
         // ["pacing lr", " ", lqAvg],
         // ["Mean Contact Return Mount", " ", crlMountAvg],
         // ["Mean Contact Return Intro", " ", crlIntroAvg],
         // ["Mean Contact Return Ejac", " ", crlEjacAvg],
         // ["Mean Time To Exit Mount", " ", tteMountAvg],
         // ["Mean Time To Exit Intro", " ", tteIntroAvg],
         // ["Mean Time To Exit Ejac", " ", tteEjacAvg],
         []
     ];


     //                var $headers = $('#resultstable').find('tr:has(th)')
     //                     ,$rows = $('#resultstable').find('tr:has(td input[value!=""])');

     //                     // Temporary delimiter characters unlikely to be typed by keyboard
     //                     // This is to avoid accidentally splitting the actual contents
     //                     csv += formatRows($headers.map(grabRow));
     //                     csv += rowDelim;
     //                     csv += formatRows($rows.map(grabRow)) + '"';

     // console.log(csv);

     // Data URI

     //var table = $("#tableresults").html();

     var csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
  
     // console.log(csvContent);
     //     console.log(csv);

     //  csvContent = csvContent +csv;
     //csvContent = csvContent.concat(table.innerHTML);
     //csvContent = csvContent.concat(csv);
     //var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
     var rows = $("#testBody > tr");
     var r = rows.length +19;
     
     csvContent += ',Date,'+date+',,,';
     csvContent += 'Entered by:,,'+experimenter_name+',,,,,,,,,,,,,,,,,,,\n';
     csvContent += 'Female,'+female+',,,,,,,,,,,,,,,,,,,,,,,,\n';
     csvContent += 'Stud,'+stud+'\n';

     csvContent +=',,,,,,,Mount,,Intro,,Ejac\n'
     csvContent +=',Male Ins,,'+maleIns+',,% exit,,"=ROUND(COUNT(J19:J'+r+')/COUNT(D19:D'+r+')*100,2)",,"=ROUND(COUNT(L19:L'+r+')/COUNT(F19:F'+r+')*100,2)",,"=ROUND(COUNT(N19:N'+r+')/COUNT(H19:H'+r+')*100,2)",,,,,,,,,,,\n';
     csvContent += ',Male Outs,,'+maleOuts+',,mean contact return,,"=ROUND(AVERAGE(J19:J'+r+'),2)",,"=ROUND(AVERAGE(L19:L'+r+'),2)",,"=ROUND(AVERAGE(N19:N'+r+'),2)",,,,,,,,,,,\n';
     csvContent += ',Seconds,,'+seconds+',,mean time to exit,,"=ROUND(AVERAGE(W19:W'+r+'),2)",,"=ROUND(AVERAGE(X19:X'+r+'),2)",,"=ROUND(AVERAGE(Y19:Y'+r+'),2)",,,,,,,,,,,\n';
     csvContent += ',Hops IN,,'+hopsIn+',,pacing lq,,"=ROUND((COUNTIF(E19:E'+r+',"">=2"")+COUNTIF(G19:G'+r+',"">=2"")+COUNTIF(I19:I'+r+',"">=2""))/(COUNT(D19:I'+r+')/2)*100,2)",,,,,,,,,,,,,,,\n';
     csvContent += ',Ears IN,,'+earsIn+',,pacing lr,,"=ROUND((SUM(E19:E'+r+')+SUM(G19:G'+r+')+SUM(I19:I'+r+'))/(COUNT(E19:E'+r+')+COUNT(G19:G'+r+')+COUNT(I19:I'+r+')),2)",,,,,,,,,,,,,,,\n';
     csvContent += ',Hops ALONE,,'+hopsOut+',,time with male,,=SUM(V19:V'+r+'),,,,,,,,,,,,,,,\n';
     csvContent += ',Ears ALONE,,'+earsOut+',,mounts,,=COUNT(D19:D'+r+'),,,,,,,,,,,,,,,\n';
     csvContent += ',Kicks,,'+kicks+',,intros,,=COUNT(F19:F'+r+'),,,,,,,,,,,,,,,\n';
     csvContent += ',Squeaks,,'+squeaks+',,ejacs,,=COUNT(H19:H'+r+'),,,,,,,,,,,,,,,\n';
     csvContent += ',Rolls,,'+rolls+'\n';
     csvContent += ',Rejection Beh,,'+rejectionBeh+'\n';
     csvContent += ',Experiment,,1,\n';
     


    // data.forEach(function(infoArray, index) {
    //      dataString = infoArray.join(",");
    //     csvContent += index < data.length ? dataString + "\n" : dataString;
    // });
    csvContent += ',,,,,,,,,Contact return,,,,,,,,,,,,,TIME TO EXIT,\n';
    csvContent += ',IN,OUT,Mount,LQ,Intro,LQ,Ejac,LQ,MOUNT,LQ,INTRO,LQ,EJAC,LQ,,,,,,,,Mount,Intro,Ejac \n';
     


     // csvContent += ",IN,OUT,Mount,LQ,Intro,LQ,Ejac,LQ \n"

    var k = 0;
     for (var i = 0; i < rows.length; ++i) {
        k=i+1;;
        csvContent+=k;
         var cells = $(rows[i]).find("> td");
         for (var j = 0; j < cells.length; ++j) {
            console.log("length",cells.length);
             if (j != 0) csvContent += ",";
             var str = cells[j].innerHTML;
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

            if(j == cells.length-1 && cells.length<10){
                for(var u = cells.length; u<10; ++u){
                    csvContent += ",";
                }
             }
         }

         var l = k+18;
         var m = k+19;




        //csvContent += ",";
        csvContent += '"=IF(AND(S'+l+'>0,(OR(T'+l+'>S'+l+',U'+l+'>S'+l+'))),""---"",IF(AND(S'+l+'>0,Q'+m+'>0),Q'+m+'-S'+l+',IF(S'+l+'>0,""---"","""")))","=IF(ISNUMBER(J'+l+'),E'+l+',"""")","=IF(AND(T'+l+'>0,(OR(S'+l+'>T'+l+',U'+l+'>T'+l+'))),""---"",IF(AND(T'+l+'>0,Q'+m+'>0),Q'+m+'-T'+l+',IF(T'+l+'>0,""---"","""")))","=IF(ISNUMBER(L'+l+'),G'+l+',"""")","=IF(AND(U'+l+'>0,(OR(S'+l+'>U'+l+',T'+l+'>U'+l+'))),""---"",IF(AND(U'+l+'>0,Q'+m+'>0),Q'+m+'-U'+l+',IF(U'+l+'>0,""---"","""")))","=IF(ISNUMBER(N'+l+'),I'+l+',"""")",,"=ROUNDDOWN(B'+l+',-2)/100*60+B'+l+'-ROUNDDOWN(B'+l+',-2)","=ROUNDDOWN(C'+l+',-2)/100*60+C'+l+'-ROUNDDOWN(C'+l+',-2)","=ROUNDDOWN(D'+l+',-2)/100*60+D'+l+'-ROUNDDOWN(D'+l+',-2)","=ROUNDDOWN(F'+l+',-2)/100*60+F'+l+'-ROUNDDOWN(F'+l+',-2)","=ROUNDDOWN(H'+l+',-2)/100*60+H'+l+'-ROUNDDOWN(H'+l+',-2)",=(R'+l+'-Q'+l+'),"=IF(AND(S'+l+'>0,(OR(T'+l+'>S'+l+',U'+l+'>S'+l+'))),""---"",IF(AND(S'+l+'>0,R'+l+'>0),R'+l+'-S'+l+',IF(S'+l+'>0,""---"","""")))","=IF(AND(T'+l+'>0,(OR(S'+l+'>T'+l+',U'+l+'>T'+l+'))),""---"",IF(AND(T'+l+'>0,R'+l+'>0),R'+l+'-T'+l+',IF(T'+l+'>0,""---"","""")))","=IF(AND(U'+l+'>0,(OR(S'+l+'>U'+l+',T'+l+'>U'+l+'))),""---"",IF(AND(U'+l+'>0,R'+l+'>0),R'+l+'-U'+l+',IF(U'+l+'>0,""---"","""")))"';

        //csvContent +='"=IF(AND(U'+l+'>0,(OR(V'+l+'>U'+l+',W'+l+'>U'+l+'))),""---"",IF(AND(U'+l+'>0,S'+m+'>0),S'+m+'-U'+l+',IF(U'+l+'>0,""---"","""")))","=IF(ISNUMBER(L'+l+'),F'+l+',"""")","=IF(AND(V'+l+'>0,(OR(U'+l+'>V'+l+',W'+l+'>V'+l+'))),""---"",IF(AND(V'+l+'>0,S'+m+'>0),S'+m+'-V'+l+',IF(V'+l+'>0,""---"","""")))","=IF(ISNUMBER(N'+l+'),H'+l+',"""")","=IF(AND(W'+l+'>0,(OR(U'+l+'>W'+l+',V'+l+'>W'+l+'))),""---"",IF(AND(W'+l+'>0,S'+m+'>0),S'+m+'-W'+l+',IF(W'+l+'>0,""---"","""")))","=IF(ISNUMBER(P'+l+'),J'+l+',"""")",,,,,,,,"=IF(AND(U'+l+'>0,(OR(V'+l+'>U'+l+',W'+l+'>U'+l+'))),""---"",IF(AND(U'+l+'>0,T'+l+'>0),T'+l+'-U'+l+',IF(U'+l+'>0,""---"","""")))","=IF(AND(V'+l+'>0,(OR(U'+l+'>V'+l+',W'+l+'>V'+l+'))),""---"",IF(AND(V'+l+'>0,T'+l+'>0),T'+l+'-V'+l+',IF(V'+l+'>0,""---"","""")))","=IF(AND(W'+l+'>0,(OR(U'+l+'>W'+l+',V'+l+'>W'+l+'))),""---"",IF(AND(W'+l+'>0,T'+l+'>0),T'+l+'-W'+l+',IF(W'+l+'>0,""---"","""")))"';
        csvContent += "\n";



     }
        csvContent += "\n";

        

     //         if(str.charAt(0)=="<"){

     //         str = str.substr(str.indexOf("</b>")+4);
     //         console.log("STR not number"+str);

     //             if (str.charAt(0) == "&"){
     //                 str = str.substr(6);
     //                 console.log("STR 6: "+(str));

     //                     }
     //                     str=str.replace(/\&nbsp;/g, '');
     //         }
     //         csvContent += str;
     //     }
     //     csvContent += "\n";
     // }


     var encodedUri = encodeURI(csvContent);
     var link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", filename + "_data.csv");
     document.body.appendChild(link); // Required for FF
     link.click();
     //      $( "form" ).validate({
     //     messages: {
     //         experiment_title: "Name is required.",
     //         experiment_name: {
     //             required: "Email is required.",
     //             email: "You must provide a valid email address."
     //         }
     //     },
     //     focusInvalid: false
     // });
     //debug TTE and CRL
     //
 }


 $(document).ready(function() {
     $(document).on('click', '.pacing-table__add-row-btn', function(e) {
         var $el = $(e.currentTarget);
         var $tableBody = $('#testBody');
         var htmlString = $('#pacingRowTemplate').html();
         $tableBody.append(htmlString);
         return false;
     });

     $(document).on('click', '.recipe-table__del-row-btn', function(e) {
         var $el = $(e.currentTarget);
         var $row = $el.closest('tr');
         $row.remove();
         return false;
     });
     Sortable.create(
         $('#testBody')[0], {
             animation: 150,
             scroll: true,
             handle: '.drag-handler'
         }
     );
 });