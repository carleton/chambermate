 var copTimeBegan = null,
     copTimeStopped = null,
     copStoppedDuration = 0,
     copStarted = null,
	copBehavior = [],
    copBehavior_two = [];
var objectOne = "";
var objectTwo = "";
var withOne = false;
var withTwo = false;
var chewOne = 0;
var chewTwo = 0;
var executed = false;

function setUpCop() {
 objectOne = document.getElementById("obj_one").value;
 objectTwo = document.getElementById("obj_two").value;
 title = document.getElementById("experiment_title").value;
document.getElementById("in_obj_1").innerHTML=objectOne;
document.getElementById("in_obj_2").innerHTML=objectTwo;
document.getElementById("cop_header").innerHTML=title+" COP";
 }

 function track_beh_cop(stim) {
         time = document.getElementById("clock-area").innerHTML;
         //strip out colon
         time = time.replace(/:/g,'');
         //strip out leading 0s
         time = parseInt(time,10);
        // time=time.replace(/^[0]+/g,'');

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
             console.log("copBehavior"+str);
         }
     }



 function startCop() {
document.getElementById('in_1').disabled = false;
document.getElementById('btncenter').disabled = true;
document.getElementById('in_2').disabled = false;
    console.log("Start Called");
     //document.getElementById("finish-test").disabled = true;
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


  function stopCop() {
     copTimeStopped = new Date();
     clearInterval(copStarted);
    $('#finish-test-cop').removeClass('ui-disabled');
      document.getElementById("download-csv-cop").disabled = false;
     document.getElementById("startCop").disabled = false;

 }

document.getElementById('in_1').disabled = true;
document.getElementById('btncenter').disabled = true;
document.getElementById('in_2').disabled = true;

  function in_Object_One() {
     track_beh_cop("inOne");
    document.getElementById('in_1').disabled = true;
    document.getElementById('in_2').disabled = true;
    document.getElementById('btncenter').disabled = false;
    withOne = true;
}

  function in_Object_Two() {
     track_beh_cop("inTwo");
     document.getElementById('in_1').disabled = true;
     document.getElementById('in_2').disabled = true;
     document.getElementById('btncenter').disabled = false;
     withTwo = true;
}

 function centerOne() {
     track_beh_cop("center");
    document.getElementById('in_2').disabled = false;
    document.getElementById('btncenter').disabled = true;
    document.getElementById('in_1').disabled = false;
    withOne = false;
    withTwo = false;
}

 function chew() {
    if(withOne){
        chewOne++;
    }
    else if(withTwo){
        chewTwo++;
    }
}


 function finishTestCop() {
    if(!executed){
        executed = true;
    document.getElementById("copParagraphFlags").innerHTML = flags;
    document.getElementById("copResultsHeader").innerHTML=document.getElementById("experiment_title").value+" Results";
    document.getElementById("inOne").innerHTML=objectOne;
    document.getElementById("inTwo").innerHTML=objectTwo;
     var date = "null";
     var female = "null";
     var stud = "null";
     var date = document.getElementById("date").innerHTML;
     var female = document.getElementById("female").innerHTML;
     var stud = document.getElementById("stud").innerHTML;
     var columns = ["inOne", "center", "inTwo"];
     var resultTable = document.getElementById("copTestBody");
     var numberRows = 0;
     var row;
     var i = 0;
     var j = 0;
     var twoPerLine = 0;
     while (j <= copBehavior.length) {
         while (i <= columns.length) {
             if (i == 3 || numberRows == 0) {
                 row = resultTable.insertRow(numberRows);
                 numberRows++;
                 i = 0;
                 twoPerLine=0;
             }
             if (columns[i] == copBehavior[j]['stim']) {
                 var cell = row.insertCell(i);
                 cell.setAttribute('contentEditable', 'true');
                     cell.innerHTML = copBehavior[j]['time'];
                     if(copBehavior[j]['stim']=='inOne' || copBehavior[j]['stim']=='center'){
                        twoPerLine++;
                     }
                     i++;
                     j++;
                     
                     if(twoPerLine==2){
                        var cell = row.insertCell(i);
                        cell.setAttribute('contentEditable', 'true');
                        cell.innerHTML = "&nbsp";
                        i++;
                     }
                 
             } else {
                 var cell = row.insertCell(i);
                 cell.setAttribute('contentEditable', 'true');
                 cell.innerHTML = "&nbsp";
                 i++;
             }

             console.log("j is" + j + " copBehavior length is " + copBehavior.length);
             console.log("I am working on "+ copBehavior[j]['stim'] + "Which happened at "+copBehavior[j]['time']);

             if (j == copBehavior.length) {
                 break;
             }
         }
         if (j == copBehavior.length) {
             break;
         }

     }
 }

}

 // function resetTable(){
 //    $("#copTestBody > tr").remove();
 // }

 function copDownloadCSV() {
     var date = document.getElementById("date").value;
     var female = document.getElementById("female").value;
     var filename = document.getElementById("experiment_title").value;
     var notes = document.getElementById("copnotes").value;
     var name = document.getElementById("experimenter_name").value;
     var time = document.getElementById("display-area").innerHTML;
     var table = document.getElementById("coptableresults");
     var data = [
     ["Experiment", " ", filename],
         ["Female", " ", female],
         ["Date", " ", date],
        ["Name", " ", name],
        ["Notes", " ", notes],
        [objectOne+" Chews", " ", chewOne],
        [objectTwo+" Chews", " ", chewTwo],
         []
     ];

     var csvContent = "data:text/csv;charset=utf-8,";
     data.forEach(function(infoArray, index) {
         dataString = infoArray.join(",");
         csvContent += index < data.length ? dataString + "\n" : dataString;
     });

csvContent+=objectOne+",";
csvContent+="Center,";
csvContent+=objectTwo +"\n";

     // csvContent+="Left,Center,Out, \n"
    var rows = $("#copTestBody > tr");

    for (var i = 0; i < rows.length; ++i) {
        var cells = $(rows[i]).find("> td");
        for (var j = 0; j < cells.length; ++j) {
            if (j != 0) csvContent += ",";
  
            var str = cells[j].innerHTML;
            // var str = cells[j].value;
            // console.log("value: "+str);
            // console.log("STR: "+str);
            // console.log("STR indexOf: "+(str.indexOf("</b>")+4));
            console.log("STR in its entirefy"+str);

            if(str.charAt(0)=="<"){

            str = str.substr(str.indexOf("</b>")+4);
            console.log("STR not number"+str);

                if (str.charAt(0) == "&"){
                    str = str.substr(6);
                    console.log("STR 6: "+(str));

                        }
                        str=str.replace(/\&nbsp;/g, '');
            }
            csvContent += str;
        }
        csvContent += "\n";
    }
    
     var encodedUri = encodeURI(csvContent);
     var link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", filename + "_data.csv");
     document.body.appendChild(link); // Required for FF
     link.click();

 
}

  