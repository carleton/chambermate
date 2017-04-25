 /*
  * Pacing Data Collection App 
  * @author  Joshua Pitkofsky
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
     document.getElementById("start").disabled = false;
$('#toggle-button').addClass('ui-disabled');
     var x = document.getElementsByClassName('withMale');
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = true;
     }
 }

 function reset() {
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
 }

 function clockRunning() {
     var currentTime = new Date(),
         timeElapsed = new Date(currentTime - timeBegan - stoppedDuration),
         hour = timeElapsed.getUTCHours(),
         min = timeElapsed.getUTCMinutes(),
         sec = timeElapsed.getUTCSeconds(),
         ms = timeElapsed.getUTCMilliseconds();
     document.getElementById("display-area").innerHTML = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
     // document.getElementById("display-area").innerHTML =
     //     (hour > 9 ? hour : "0" + hour) + ":" +
     //     (min > 9 ? min : "0" + min) + ":" +
     //     (sec > 9 ? sec : "0" + sec) + "." +
     //     (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
 }


 function track_beh(stim, opts) {
     if (opts['lq'] != null) {
         lq = opts['lq'];
         time = document.getElementById("display-area").innerHTML;
         secondsTime = document.getElementById("display-area").innerHTML;
         secondsTime = timeToSeconds(secondsTime);

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
         //document.getElementById("results").innerHTML = sexualBehavior.join().toSource();


         for (k = 0; k < sexualBehavior.length - 1; k++) {
             var str = JSON.stringify(sexualBehavior[k]);
             console.log(str);
         }
         document.getElementById("intro_count").innerHTML = introCount;
         document.getElementById("mount_count").innerHTML = mountCount;
         document.getElementById("ejac_count").innerHTML = ejacCount;
     } else {
         time = document.getElementById("display-area").innerHTML;
         //secondsTime = document.getElementById("display-area").innerHTML;
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
     console.log("Minute time " + stringTime)
     var strTime = stringTime.split(":");
     var seconds = ((+strTime[0]) * 60 + (+strTime[1]));
     console.log("string time in seconds " + seconds)
     return seconds;
 }


 function flag() {
     flags.push(time = " " + document.getElementById("display-area").innerHTML);
 }

 function ejac_zero() {
     // introCount++;
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 0
     });
 }

 function ejac_one() {
     // introCount++;
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 1
     });
 }

 function ejac_two() {
     // introCount++;
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 2
     });
 }

 function ejac_three() {
     //  introCount++;
     ejacCount++;
     stimNumber++;
     track_beh("ejac", {
         "lq": 3
     });
 }

 function intro_zero() {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 0
     });
 }

 function intro_one() {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 1
     });
 }

 function intro_two() {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 2
     });
 }

 function intro_three() {
     introCount++;
     stimNumber++;
     introCount_exit_var++;
     track_beh("intro", {
         "lq": 3
     });
 }

 function mount_zero() {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 0
     });
 }

 function mount_one() {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 1
     });
 }

 function mount_two() {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 2
     });
 }

 function mount_three() {
     stimNumber++;
     mountCount++;
     track_beh("mount", {
         "lq": 3
     });
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
     track_beh("kick", {});
 }

 function squeak() {
     rejectionBeh++;
     track_beh("squeak", {});
 }

 function roll() {
     rejectionBeh++;
     track_beh("roll", {});
 }

 function in_enter() {
     maleIns++;
     withMale = true;
     maleStart();
     track_beh("in", {});
     var x = document.getElementsByClassName('withMale');
     for (var i = 0; i < x.length; i++) {
         x[i].disabled = false;
     }
     document.getElementById('in_enter').disabled = true;
 }

 function out() {
     withMale = false;
     maleStop();
     maleOuts++;
     track_beh("out", {});
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

     if (!pacingexecuted) {
         pacingexecuted = true;
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
         //var resultTable = document.getElementById("tableresults");
         var resultTable = document.getElementById("testBody");
         //resultTable.appendChild(document.createElement('tbody'));
         var numberRows = 0;
         var rowsToDelete = [];
         var mostRecentStim_row = 0;
         var row;
         var i = 0;
         var j = 0;
         while (j <= sexualBehavior.length) {
             while (i <= columns.length) {
                 if (i == 10 || numberRows == 0) {
                  //  if(j>1){
                    //    if ((sexualBehavior[j-1]['stim']!='lq')&&(sexualBehavior[j+1]['stim']!='out')){
                         row = resultTable.insertRow(numberRows);
                         row.id = numberRows;
                         numberRows++;
                         i = 0;
                  //   }
                // }
                 }
                 // if(sexualBehavior[j] != undefined){
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

         //var table = document.getElementById("tableresults");



         // var table = document.getElementById("testBody");


         // var l = 0;
         // var i = 0;
         // while (l <= tte.length) {
         //     while (i <= table.rows.length) {
         //         if (i+1 == tte[l]['row']) {

         //                 row = table.rows[i];
         //                 var cell = row.insertCell(9);
         //                 cell.setAttribute('contentEditable', 'true');
         //                 cell.innerHTML = tte[l]['TTE'];
         //                 var cell2 = row.insertCell(10);
         //                 cell2.setAttribute('contentEditable', 'true');
         //                 cell2.innerHTML = crl[l]['CRL'];
         //                 console.log("row number: " + i + " tte number " + l);
         //                var cell = row.insertCell(11);
         //                cell.innerHTML = "<button class=\"recipe-table__del-row-btn ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-icon-notext\"></button>";
         //                cell.className ='recipe-table__cell';
         //                cell.style.width = "5%";

         //                 l++;
         //                 i++;

         //             }

         //          else {
         //                 row = table.rows[i];
         //                 var cell = row.insertCell(9);
         //                 cell.setAttribute('contentEditable', 'true');
         //                 cell.innerHTML = "&nbsp";
         //                 var cell2 = row.insertCell(10);
         //                 cell2.setAttribute('contentEditable', 'true');
         //                 cell2.innerHTML = "&nbsp";
         //                 console.log("row number: " + i + " tte number " + l);
         //                var cell = row.insertCell(11);
         //                cell.innerHTML = "<button class=\"recipe-table__del-row-btn ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-icon-notext\"></button>";
         //                cell.className ='recipe-table__cell';
         //                cell.style.width = "5%";
         //                 i++;
         //         }
         //     }

         // }


     for (var i = 0; i < rowsToDelete.length; i++) {
        console.log(rowsToDelete);
        var row = rowsToDelete[i].rowToDelete;
        console.log(row);
        row.parentNode.removeChild(row);

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
     var filename = document.getElementById("experiment_title").value;
     var time = document.getElementById("display-area").innerHTML;
     var timeWithMale = document.getElementById("time_with_male").innerHTML;
     var crlMountAvg = crlMountTotal / crlTotal;
     var crlIntroAvg = crlIntroTotal / crlTotal;
     var crlEjacAvg = crlEjacTotal / crlTotal;
     var tteMountAvg = tteMountTotal / tteTotal;
     var tteIntroAvg = tteIntroTotal / tteTotal;
     var tteEjacAvg = tteEjacTotal / tteTotal;
     var table = document.getElementById("tableresults");


     /*
     Male Ins
     Male Outs
     Minutes
     Seconds
     Hops IN
     Ears IN
     Hops ALONE
     Ears ALONE
     Rejection Beh

     time with male
     # mounts
     # intros
     # ejacs

     % exit
     mean contact return
     mean time to exit
     pacing lq
     pacing lr

     */
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
         ["Rejection Beh", " ", rejectionBeh],
         ["time with male", " ", timeWithMale],
         ["# mounts", " ", mountCount],
         ["# intros", " ", introCount_exit_var],
         ["# ejacs", " ", ejacCount],
         ["% exit mount", " ", percentExitMount],
         ["% exit intro", " ", percentExitIntro],
         ["% exit ejac", " ", percentExitEjac],
         ["pacing lq", " ", pacingLq],
         ["pacing lr", " ", lqAvg],
         ["Mean Contact Return Mount", " ", crlMountAvg],
         ["Mean Contact Return Intro", " ", crlIntroAvg],
         ["Mean Contact Return Ejac", " ", crlEjacAvg],
         ["Mean Time To Exit Mount", " ", tteMountAvg],
         ["Mean Time To Exit Intro", " ", tteIntroAvg],
         ["Mean Time To Exit Ejac", " ", tteEjacAvg],
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

     var csvContent = "data:text/csv;charset=utf-8,";
  
     // console.log(csvContent);
     //     console.log(csv);

     //  csvContent = csvContent +csv;
     //csvContent = csvContent.concat(table.innerHTML);
     //csvContent = csvContent.concat(csv);
     //var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);




     csvContent += ',Do Not Type On Anything Red!!!!,,,,,,,It will print normally,,,,,,,,,,,,,,,,,,\n,\"When done inputting the data for a rat, SAVE AS whatever you want, and then OPEN this template file again to start over\",,,,,,,,,,,,,,,,,,,,,,,,,\nDate,,,,,Entered by:,,,,,,,,,,,,,,,,,,,,,\nFemale,,1,,,,,,,,,,,,,,,,,,,,,,,,\nStud,,,,,,,,,,,Contact return,,,,,,,,,,,,,,TIME TO EXIT,\n,hops,IN,OUT,Mount,LQ,Intro,LQ,Ejac,LQ,,MOUNT,LQ,INTRO,LQ,EJAC,LQ,,,,,,,,Mount,Intro,Ejac \n';



     // csvContent += ",IN,OUT,Mount,LQ,Intro,LQ,Ejac,LQ \n"

    var k = 0;
     var rows = $("#testBody > tr");
     for (var i = 0; i < rows.length; ++i) {
        k=i+1;;
        csvContent+=k;
        csvContent+=',';
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

         var l = k+6;
         var m = k+7;



        csvContent += ",";
        csvContent +='"=IF(AND(U'+l+'>0,(OR(V'+l+'>U'+l+',W'+l+'>U'+l+'))),""---"",IF(AND(U'+l+'>0,S'+m+'>0),S'+m+'-U'+l+',IF(U'+l+'>0,""---"","""")))","=IF(ISNUMBER(L'+l+'),F'+l+',"""")","=IF(AND(V'+l+'>0,(OR(U'+l+'>V'+l+',W'+l+'>V'+l+'))),""---"",IF(AND(V'+l+'>0,S'+m+'>0),S'+m+'-V'+l+',IF(V'+l+'>0,""---"","""")))","=IF(ISNUMBER(N'+l+'),H'+l+',"""")","=IF(AND(W'+l+'>0,(OR(U'+l+'>W'+l+',V'+l+'>W'+l+'))),""---"",IF(AND(W'+l+'>0,S'+m+'>0),S'+m+'-W'+l+',IF(W'+l+'>0,""---"","""")))","=IF(ISNUMBER(P'+l+'),J'+l+',"""")",,,,,,,,"=IF(AND(U'+l+'>0,(OR(V'+l+'>U'+l+',W'+l+'>U'+l+'))),""---"",IF(AND(U'+l+'>0,T'+l+'>0),T'+l+'-U'+l+',IF(U'+l+'>0,""---"","""")))","=IF(AND(V'+l+'>0,(OR(U'+l+'>V'+l+',W'+l+'>V'+l+'))),""---"",IF(AND(V'+l+'>0,T'+l+'>0),T'+l+'-V'+l+',IF(V'+l+'>0,""---"","""")))","=IF(AND(W'+l+'>0,(OR(U'+l+'>W'+l+',V'+l+'>W'+l+'))),""---"",IF(AND(W'+l+'>0,T'+l+'>0),T'+l+'-W'+l+',IF(W'+l+'>0,""---"","""")))"';
        csvContent += "\n";
     }
        csvContent += "\n";
        csvContent +=',,,,,,,,,,% exit,=COUNT(L7:L'+k+')/COUNT(E7:E'+k+')*100,,=COUNT(N7:N'+k+')/COUNT(G7:G'+k+')*100,,=COUNT(P7:P'+k+')/COUNT(I7:I'+k+')*100,,,,,,,,,,,';
        csvContent += ',,,,,,,,,,mean contact return,=AVERAGE(L7:L'+k+'),,=AVERAGE(N7:N'+k+'),,=AVERAGE(P7:P'+k+'),,,,,,,,,,,\n';
csvContent += ',,,,,,,,,,mean time to exit,=AVERAGE(Y7:Y'+k+'),,=AVERAGE(Z7:Z'+k+'),,=AVERAGE(AA7:AA'+k+'),,,,,,,,,,,\n';
csvContent += ',,,,,,,,,,pacing lq,"=(COUNTIF(F7:F'+k+',"">=2"")+COUNTIF(H7:H'+k+',"">=2"")+COUNTIF(J7:J'+k+',"">=2""))/(COUNT(E7:J'+k+')/2)*100",,,,,,,,,,,,,,,\n';
csvContent += ',,,,,,,,,,pacing lr,=(SUM(F7:F'+k+')+SUM(H7:H'+k+')+SUM(J7:J'+k+'))/(COUNT(F7:F'+k+')+COUNT(H7:H'+k+')+COUNT(J7:J'+k+')),,,,,,,,,,,,,,,\n';
csvContent += ',,,,,,,,time with male,,,=SUM(X7:X'+k+'),,,,,,,,,,,,,,,\n';
csvContent += ',,,,,,,,# mounts,,,=COUNT(E7:E'+k+'),,,,,,,,,,,,,,,\n';
csvContent += ',,,,,,,,# intros,,,=COUNT(G7:G'+k+'),,,,,,,,,,,,,,,\n';
csvContent += ',,Enter by hand,,,,,,# ejacs,,,=COUNT(I7:I'+k+'),,,,,,,,,,,,,,,\n';
csvContent += ',Male Ins,,"=COUNTIF(C7:C'+k+',"">0"")",,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Male Outs,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Minutes,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Seconds,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Hops IN,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Ears IN,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Hops ALONE,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Ears ALONE,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Rejection Beh,,,,,,,,,,,,,,,,,,,,,,,,,\n';
csvContent += ',Experiment ,,1,,,,,,,,,,,,,,,,,,,,,,,';


   data.forEach(function(infoArray, index) {
         dataString = infoArray.join(",");
         csvContent += index < data.length ? dataString + "\n" : dataString;
     });

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