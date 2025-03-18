import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './main.css';

function getFormattedDate() {
  const now = new Date();
  const day = now.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  let hour = now.getHours();
  const minute = now.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12 || 12;

  const minuteStr = minute < 10 ? '0' + minute : minute;

  return `${day} ${month} ${year} ${hour}:${minuteStr}${ampm}`;
}

function ChamberMate() {
  // Pages: "pageone" (main form), "cop" (COP test), "pagetwo" (Pacing/Experiment),
  // "pagethree" (Pacing Results), "copResults" (COP Results)
  const [currentPage, setCurrentPage] = useState("pageone");

  // Form fields
  const [experimentTitle, setExperimentTitle] = useState('');
  const [experimenterName, setExperimenterName] = useState('');
  const [female, setFemale] = useState('');
  const [stud, setStud] = useState('');
  const [dateValue, setDateValue] = useState(getFormattedDate());
  const [objOne, setObjOne] = useState('');
  const [objTwo, setObjTwo] = useState('');

  // COP Timer states
  const [copTimeBegan, setCopTimeBegan] = useState<Date | null>(null);
  const [copTimeStopped, setCopTimeStopped] = useState<Date | null>(null);
  const [copStoppedDuration, setCopStoppedDuration] = useState(0);
  const [clockTime, setClockTime] = useState("00:00");

  // Object One Timer states
  const [objOneTimeBegan, setObjOneTimeBegan] = useState<Date | null>(null);
  const [objOneTimeStopped, setObjOneTimeStopped] = useState<Date | null>(null);
  const [objOneStoppedDuration, setObjOneStoppedDuration] = useState(0);
  const [timeWithObjOne, setTimeWithObjOne] = useState("00:00");

  // Object Two Timer states
  const [objTwoTimeBegan, setObjTwoTimeBegan] = useState<Date | null>(null);
  const [objTwoTimeStopped, setObjTwoTimeStopped] = useState<Date | null>(null);
  const [objTwoStoppedDuration, setObjTwoStoppedDuration] = useState(0);
  const [timeWithObjTwo, setTimeWithObjTwo] = useState("00:00");

  // COP behavior tracking
  const [copBehavior, setCopBehavior] = useState<{ stim: string; time: number }[]>([]);
  const [flagscop, setFlagscop] = useState<string[]>([]);
  const [withOne, setWithOne] = useState(false);
  const [withTwo, setWithTwo] = useState(false);
  const [chewOne, setChewOne] = useState(0);
  const [chewTwo, setChewTwo] = useState(0);
  const [hopOne, setHopOne] = useState(0);
  const [hopTwo, setHopTwo] = useState(0);
  const [earsOne, setEarsOne] = useState(0);
  const [earsTwo, setEarsTwo] = useState(0);
  const [centerHops, setCenterHops] = useState(0);
  const [centerEars, setCenterEars] = useState(0);

  // -----------------------
  // Dummy functions for pacing actions (stubs)
  const hop = () => { console.log("hop"); };
  const ears = () => { console.log("ears"); };
  const mount_zero = () => { console.log("mount 0"); };
  const intro_zero = () => { console.log("intro 0"); };
  const ejac_zero = () => { console.log("ejac 0"); };
  const roll = () => { console.log("roll"); };
  const mount_one = () => { console.log("mount 1"); };
  const intro_one = () => { console.log("intro 1"); };
  const ejac_one = () => { console.log("ejac 1"); };
  const squeak = () => { console.log("squeak"); };
  const mount_two = () => { console.log("mount 2"); };
  const intro_two = () => { console.log("intro 2"); };
  const ejac_two = () => { console.log("ejac 2"); };
  const kick = () => { console.log("kick"); };
  const mount_three = () => { console.log("mount 3"); };
  const intro_three = () => { console.log("intro 3"); };
  const ejac_three = () => { console.log("ejac 3"); };
  const in_enter = () => { console.log("in_enter"); };
  const out = () => { console.log("out"); };
  const backAndSave = () => { 
    console.log("back and save pacing data"); 
    setCurrentPage("pagetwo"); 
  };

  // -----------------------
  // COP Timer Effect
  // -----------------------
  useEffect(() => {
    let timerId: number;
    if (copTimeBegan) {
      timerId = window.setInterval(() => {
        const now = new Date();
        if (copTimeBegan) {
          const elapsed = new Date(now.getTime() - copTimeBegan.getTime() - copStoppedDuration);
          const min = elapsed.getUTCMinutes();
          const sec = elapsed.getUTCSeconds();
          setClockTime(`${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`);
        }
      }, 10);
      return () => window.clearInterval(timerId);
    }
  }, [copTimeBegan, copStoppedDuration]);

  // -----------------------
  // Object One Timer Functions
  // -----------------------
  const startObjOne = () => {
    if (!objOneTimeBegan) {
      setObjOneTimeBegan(new Date());
    }
    if (objOneTimeStopped) {
      setObjOneStoppedDuration(prev => prev + (new Date().getTime() - objOneTimeStopped.getTime()));
    }
    const id = window.setInterval(() => {
      if (objOneTimeBegan) {
        const now = new Date();
        const elapsed = new Date(now.getTime() - objOneTimeBegan.getTime() - objOneStoppedDuration);
        const min = elapsed.getUTCMinutes();
        const sec = elapsed.getUTCSeconds();
        setTimeWithObjOne(`${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`);
      }
    }, 10);
    return id;
  };

  const stopObjOne = (intervalId: number) => {
    setObjOneTimeStopped(new Date());
    window.clearInterval(intervalId);
  };

  // -----------------------
  // Object Two Timer Functions
  // -----------------------
  const startObjTwo = () => {
    if (!objTwoTimeBegan) {
      setObjTwoTimeBegan(new Date());
    }
    if (objTwoTimeStopped) {
      setObjTwoStoppedDuration(prev => prev + (new Date().getTime() - objTwoTimeStopped.getTime()));
    }
    const id = window.setInterval(() => {
      if (objTwoTimeBegan) {
        const now = new Date();
        const elapsed = new Date(now.getTime() - objTwoTimeBegan.getTime() - objTwoStoppedDuration);
        const min = elapsed.getUTCMinutes();
        const sec = elapsed.getUTCSeconds();
        setTimeWithObjTwo(`${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`);
      }
    }, 10);
    return id;
  };

  const stopObjTwo = (intervalId: number) => {
    setObjTwoTimeStopped(new Date());
    window.clearInterval(intervalId);
  };

  // -----------------------
  // Behavior Tracking for COP
  // -----------------------
  const trackBehCop = (stim: string) => {
    const timeNumeric = parseInt(clockTime.replace(":", ""), 10);
    const newEvent = { stim, time: timeNumeric };
    setCopBehavior(prev => [...prev, newEvent]);
    console.log("Tracked event:", newEvent);
  };

  // -----------------------
  // COP Event Handlers
  // -----------------------
  const handleInObjectOne = () => {
    const timerId = startObjOne();
    trackBehCop("inOne");
    setWithOne(true);
    setWithTwo(false);
    // Optionally store timerId if needed
  };

  const handleInObjectTwo = () => {
    const timerId = startObjTwo();
    trackBehCop("inTwo");
    setWithTwo(true);
    setWithOne(false);
  };

  const handleCenter = () => {
    trackBehCop("center");
    setWithOne(false);
    setWithTwo(false);
  };

  const startCop = () => {
    if (!copTimeBegan) {
      setDateValue(getFormattedDate());
      setCopTimeBegan(new Date());
    }
    if (copTimeStopped) {
      setCopStoppedDuration(prev => prev + (new Date().getTime() - copTimeStopped.getTime()));
    }
  };

  const stopCop = () => {
    setCopTimeStopped(new Date());
  };

  const flagCop = () => {
    setFlagscop(prev => [...prev, clockTime]);
  };

  const finishTestCop = () => {
    setCurrentPage("copResults");
  };

//   // Validate form similar to original COPValidate
//   const COPValidateForm = () => {
//     if (experimentTitle.indexOf('#') > -1) {
//       alert('Experiment Title contains #');
//       return false;
//     }
//     if (!experimentTitle || !experimenterName || !female || !objOne || !objTwo) {
//       alert("Please fill in all required fields (and make sure objects are entered)!");
//       return false;
//     }
//     return true;
//   };

  const COPValidateForm = () => {
    console.log("Validating form", { experimentTitle, experimenterName, female, objOne, objTwo });
    if (experimentTitle.indexOf('#') > -1) {
      alert('Experiment Title contains #');
      return false;
    }
    if (!experimentTitle || !experimenterName || !female || !objOne || !objTwo) {
      alert("Please fill in all required fields (and make sure objects are entered)!");
      return false;
    }
    return true;
  };
  

  // -----------------------
  // Render Functions for Each Page
  // -----------------------

  // Main Form Page (pageone)
  const renderPageOne = () => (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Josh Pitkofsky" />
        <title>ChamberMate</title>
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" type="image/png" href="img/favicon.ico" />
        <link rel="stylesheet" href="css/normalize.css" />
      </Helmet>
      <h1>ChamberMate</h1>
      <img src="img/logo.png" alt="Logo" style={{ float: 'left' }} />
      <form style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Experiment Title"
          value={experimentTitle}
          onChange={e => setExperimentTitle(e.target.value)}
          required
          className="fullWidthInput"
        />
        <input
          type="text"
          placeholder="Experimenter Name"
          value={experimenterName}
          onChange={e => setExperimenterName(e.target.value)}
          required
          className="fullWidthInput"
        />
        <input
          type="number"
          placeholder="Female Number"
          value={female}
          onChange={e => setFemale(e.target.value)}
          required
          className="fullWidthInput"
        />
        <input
          type="text"
          placeholder="Stud Number"
          value={stud}
          onChange={e => setStud(e.target.value)}
          required
          className="fullWidthInput"
        />
        <input
          type="text"
          placeholder="Date and Time"
          value={dateValue}
          onChange={e => setDateValue(e.target.value)}
          required
          className="fullWidthInput"
        />
        <input
          type="text"
          placeholder="Object One"
          value={objOne}
          onChange={e => setObjOne(e.target.value)}
          required
          className="fullWidthInput"
        />
        <input
          type="text"
          placeholder="Object Two"
          value={objTwo}
          onChange={e => setObjTwo(e.target.value)}
          required
          className="fullWidthInput"
        />
        <div>
          <button type="button" onClick={() => { if(COPValidateForm()) renderCopPage(); }}>
            Partner Preference / COP
          </button>
          <button type="button" onClick={() => setCurrentPage("pagetwo")}>
            Pacing
          </button>
        </div>
      </form>
      <div style={{ textAlign: 'center', marginTop: '10%' }}>
        <a
          href="https://apps.carleton.edu/curricular/psyc/meertslab/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="img/meertslogo.png" alt="Meerts Lab" id="meertslogo" />
        </a>
      </div>
    </div>
  );

  // COP Test Page (cop)
  const renderCopPage = () => (
    <div>
      <Helmet>
        <title>{experimentTitle} COP</title>
      </Helmet>
      <h1>{experimentTitle} COP</h1>
      <div>
        <div style={{ marginBottom: '10px' }}>
          <span id="in_obj_1" style={{ color: withOne ? 'magenta' : 'black', marginRight: '20px' }}>
            {objOne}
          </span>
          <span id="center_purple" style={{ marginRight: '20px' }}>Center</span>
          <span id="in_obj_2" style={{ color: withTwo ? 'magenta' : 'black' }}>
            {objTwo}
          </span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleInObjectOne}>In (Object One)</button>
          <button onClick={handleInObjectTwo}>In (Object Two)</button>
          <button onClick={handleCenter}>Center</button>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={startCop}>Start COP</button>
          <button onClick={stopCop}>Stop COP</button>
          <button onClick={flagCop}>Flag</button>
          <button onClick={finishTestCop}>Finish Test</button>
        </div>
        <div>
          <h2>Timer: {clockTime}</h2>
          <h3>Time with {objOne}: {timeWithObjOne}</h3>
          <h3>Time with {objTwo}: {timeWithObjTwo}</h3>
        </div>
      </div>
    </div>
  );

  // Pacing / Experiment Page (pagetwo)
  const renderPacingPage = () => (
    <div>
      <Helmet>
        <title>{experimentTitle} Experiment</title>
      </Helmet>
      <h1 id="experimentHeader">Experiment</h1>
      <div className="ui-content">
        <div className="row-container">
          <button onClick={() => setCurrentPage("pageone")} className="ui-btn ui-icon-carat-l ui-btn-icon-left back-btn">
            Back
          </button>
          <div className="total-container">
            <div className="total-text" id="total_text">Total Intro + Ejac Count: </div>
            <div className="total-count" id="total_count">0</div>
          </div>
        </div>
        <table id="live_data" className="ui-responsive">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Test Time</th>
              <th style={{ width: "25%" }}>Mount Count</th>
              <th style={{ width: "25%" }}>Intro Count</th>
              <th style={{ width: "25%" }}>Ejac Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>
                <output id="display-area">00:00</output>
              </td>
              <td style={{ textAlign: "center" }} id="mount_count">0</td>
              <td style={{ textAlign: "center" }} id="intro_count">0</td>
              <td style={{ textAlign: "center" }} id="ejac_count">0</td>
            </tr>
            <tr>
              <td></td>
              <td style={{ textAlign: "center", height: "25px" }} id="mostRecentMount"></td>
              <td style={{ textAlign: "center", height: "25px" }} id="mostRecentIntro"></td>
              <td style={{ textAlign: "center", height: "25px" }} id="mostRecentEjac"></td>
            </tr>
          </tbody>
        </table>
        <table id="test_buttons" className="ui-responsive">
          <thead>
            <tr>
              <th></th>
              <th style={{ textAlign: "center" }}>Mount</th>
              <th style={{ textAlign: "center" }}>Intro</th>
              <th style={{ textAlign: "center" }}>Ejac</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><button type="button" onClick={hop}>Hops</button></td>
              <td><button className="withMale" type="button" onClick={mount_zero}>0</button></td>
              <td><button className="withMale" type="button" onClick={intro_zero}>0</button></td>
              <td><button className="withMale" type="button" onClick={ejac_zero}>0</button></td>
              <td><button type="button" onClick={roll}>Roll</button></td>
            </tr>
            <tr>
              <td><button type="button" onClick={ears}>Ears</button></td>
              <td><button className="withMale" type="button" onClick={mount_one}>1</button></td>
              <td><button className="withMale" type="button" onClick={intro_one}>1</button></td>
              <td><button className="withMale" type="button" onClick={ejac_one}>1</button></td>
              <td><button type="button" onClick={squeak}>Squeak</button></td>
            </tr>
            <tr>
              <td></td>
              <td><button className="withMale" style={{ fontSize: "40px" }} type="button" onClick={mount_two}>2</button></td>
              <td><button className="withMale" style={{ fontSize: "40px" }} type="button" onClick={intro_two}>2</button></td>
              <td><button className="withMale" style={{ fontSize: "40px" }} type="button" onClick={ejac_two}>2</button></td>
              <td><button className="withMale" type="button" onClick={kick}>Kick</button></td>
            </tr>
            <tr>
              <td><button id="in_enter" type="button" style={{ fontSize: "30px" }} onClick={in_enter}>In</button></td>
              <td><button className="withMale" type="button" onClick={mount_three}>3</button></td>
              <td><button className="withMale" type="button" onClick={intro_three}>3</button></td>
              <td><button className="withMale" type="button" onClick={ejac_three}>3</button></td>
              <td><button className="withMale" type="button" style={{ fontSize: "30px" }} onClick={out}>Out</button></td>
            </tr>
            <tr>
              <td align="center"><button id="start" onClick={() => console.log("start pacing")}>Start</button></td>
              <td align="center">
                <button id="toggle-button" className="ui-btn ui-icon-delete ui-btn-icon-right" onClick={() => console.log("stop pacing")}>
                  Stop
                </button>
              </td>
              <td>
                <button id="flag" onClick={() => console.log("flag pacing")} className="ui-btn ui-icon-tag ui-btn-icon-right" type="button">Flag</button>
              </td>
              <td align="center">
                <a href="#" className="ui-btn" id="finish-test" onClick={() => { return false; }}>
                  Finish Test
                </a>
              </td>
              <td align="center">
                <button id="download-csv" className="ui-btn ui-icon-action ui-btn-icon-right" onClick={() => console.log("download CSV")}>CSV</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="ui-footer">
        <h1></h1>
      </div>
      {/* Hidden elements for pacing data */}
      <div id="hidden" hidden>
        <p id="male_ins">male ins</p>
        <p id="male_outs">male outs</p>
        <p id="hops_in">Hops In</p>
        <p id="hops_out">Hops Out</p>
        <p id="ears_in">Ears In</p>
        <p id="ears_out">Ears Out</p>
        <p id="rejection_beh">Rejection Beh</p>
        <p id="time_with_male">Time with male</p>
        <p id="time_with_obj_one">Time with obj 1</p>
        <p id="time_with_obj_two">Time with obj 2</p>
        <p id="lqAvg">lrAvg</p>
        <p id="percentExitMount">percent exit mount</p>
        <p id="percentExitIntro">percent exit intro</p>
        <p id="percentExitEjac">percent exit ejac</p>
        <p id="pacingLq">pacing lq</p>
        <ul id="CRL">CRL_TTE</ul>
      </div>
      <div className="ui-footer">
        <h1></h1>
      </div>
    </div>
  );

  // Pacing Results Page (pagethree)
  const renderPacingResultsPage = () => (
    <div>
      <Helmet>
        <title>{experimentTitle} Pacing Results</title>
      </Helmet>
      <h1 id="resultsHeader">Results</h1>
      <div className="ui-content">
        <table id="tableresults" className="ui-responsive">
          <thead>
            <tr>
              <th></th>
              <th>IN</th>
              <th>OUT</th>
              <th>Mount</th>
              <th>LQ</th>
              <th>Intro</th>
              <th>LQ</th>
              <th>Ejac</th>
              <th>LQ</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="testBody">
            {/* Rows can be dynamically generated */}
          </tbody>
        </table>
        <div className="pacing-table__add-row">
          <span className="pacing-table__add-row-btn">+</span>
        </div>
        <div className="ui-collapsible" style={{ paddingTop: '25px' }}>
          <h3>Flags</h3>
          <p id="paragraphFlags"></p>
        </div>
        <button onClick={backAndSave} className="ui-btn ui-icon-carat-l ui-btn-icon-left">
          Back
        </button>
        <div id="hidden" hidden>
          <p id="male_ins">male ins</p>
          <p id="male_outs">male outs</p>
          <p id="hops_in">Hops In</p>
          <p id="hops_out">Hops Out</p>
          <p id="ears_in">Ears In</p>
          <p id="ears_out">Ears Out</p>
          <p id="rejection_beh">Rejection Beh</p>
          <p id="time_with_male">Time with male</p>
          <p id="time_with_obj_one">Time with obj 1</p>
          <p id="time_with_obj_two">Time with obj 2</p>
          <p id="lqAvg">lrAvg</p>
          <p id="percentExitMount">percent exit mount</p>
          <p id="percentExitIntro">percent exit intro</p>
          <p id="percentExitEjac">percent exit ejac</p>
          <p id="pacingLq">pacing lq</p>
          <ul id="CRL">CRL_TTE</ul>
        </div>
        <div className="ui-footer">
          <h1></h1>
        </div>
      </div>
    </div>
  );

  // COP Results Page
  const renderCopResults = () => (
    <div>
      <Helmet>
        <title>{experimentTitle} COP Results</title>
      </Helmet>
      <h1>{experimentTitle} COP Results</h1>
      <div>
        <p>Flags: {flagscop.join(', ')}</p>
        <p>
          COP Behavior:{" "}
          {copBehavior.map((event, idx) => (
            <span key={idx}>
              {event.stim}({event.time}){" "}
            </span>
          ))}
        </p>
      </div>
      <button onClick={() => setCurrentPage("cop")}>Back</button>
    </div>
  );

  return (
    <div>
      {currentPage === "pageone" && renderPageOne()}
      {currentPage === "cop" && renderCopPage()}
      {currentPage === "pagetwo" && renderPacingPage()}
      {currentPage === "pagethree" && renderPacingResultsPage()}
      {currentPage === "copResults" && renderCopResults()}
    </div>
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <HelmetProvider>
    <ChamberMate />
  </HelmetProvider>
);

export default ChamberMate;
