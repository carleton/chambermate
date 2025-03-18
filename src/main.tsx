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
  hour = hour % 12 || 12; // Convert '0' to '12'
  
  const minuteStr = minute < 10 ? '0' + minute : minute;
  
  return `${day} ${month} ${year} ${hour}:${minuteStr}${ampm}`;
}

function ChamberMate() {
  // Page state (simulate multiple pages)
  const [currentPage, setCurrentPage] = useState('pageone'); // 'pageone', 'cop', 'copResults'

  // Form fields
  const [experimentTitle, setExperimentTitle] = useState('');
  const [experimenterName, setExperimenterName] = useState('');
  const [female, setFemale] = useState('');
  const [stud, setStud] = useState('');
  const [dateValue, setDateValue] = useState(getFormattedDate());
  const [objOne, setObjOne] = useState('');
  const [objTwo, setObjTwo] = useState('');

  // Timer states for COP clock
  const [copTimeBegan, setCopTimeBegan] = useState<Date | null>(null);
  const [copTimeStopped, setCopTimeStopped] = useState<Date | null>(null);
  const [copStoppedDuration, setCopStoppedDuration] = useState(0);
  const [clockTime, setClockTime] = useState("00:00");

  // Timer states for Object One
  const [objOneTimeBegan, setObjOneTimeBegan] = useState<Date | null>(null);
  const [objOneTimeStopped, setObjOneTimeStopped] = useState<Date | null>(null);
  const [objOneStoppedDuration, setObjOneStoppedDuration] = useState(0);
  const [timeWithObjOne, setTimeWithObjOne] = useState("00:00");

  // Timer states for Object Two
  const [objTwoTimeBegan, setObjTwoTimeBegan] = useState<Date | null>(null);
  const [objTwoTimeStopped, setObjTwoTimeStopped] = useState<Date | null>(null);
  const [objTwoStoppedDuration, setObjTwoStoppedDuration] = useState(0);
  const [timeWithObjTwo, setTimeWithObjTwo] = useState("00:00");

  // Behavior tracking arrays and counters
  const [copBehavior, setCopBehavior] = useState<{stim: string, time: number}[]>([]);
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
  // Helper functions
  // -----------------------
  const COPValidate = () => {
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

  const setUpCOP = () => {
    if (COPValidate()) {
      setCurrentPage('cop');
    }
  };

  // -----------------------
  // COP Timer Effects
  // -----------------------
  useEffect(() => {
    let timerId: number;
    if (copTimeBegan) {
      timerId = setInterval(() => {
        const now = new Date();
        if (copTimeBegan) {
          const elapsed = new Date(now.getTime() - copTimeBegan.getTime() - copStoppedDuration);
          const min = elapsed.getUTCMinutes();
          const sec = elapsed.getUTCSeconds();
          setClockTime(`${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`);
        }
      }, 10);
    }
    return () => clearInterval(timerId);
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
    const id = setInterval(() => {
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
    clearInterval(intervalId);
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
    const id = setInterval(() => {
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
    clearInterval(intervalId);
  };

  // -----------------------
  // Behavior tracking
  // -----------------------
  const trackBehCop = (stim: string) => {
    const timeNumeric = parseInt(clockTime.replace(":", ""), 10);
    const newEvent = { stim, time: timeNumeric };
    setCopBehavior(prev => [...prev, newEvent]);
    console.log("Tracked event:", newEvent);
  };

  // -----------------------
  // Event Handlers for COP interactions
  // -----------------------
  const handleInObjectOne = () => {
    const timerId = startObjOne();
    trackBehCop("inOne");
    setWithOne(true);
    setWithTwo(false);
    // (Optional: store timerId if you need to clear it later)
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
    setCurrentPage('copResults');
  };

  // -----------------------
  // Render functions for different pages
  // -----------------------
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
          <button type="button" onClick={setUpCOP}>
            Partner Preference / COP
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

  const renderCopResults = () => (
    <div>
      <Helmet>
        <title>{experimentTitle} Results</title>
      </Helmet>
      <h1>{experimentTitle} Results</h1>
      <div>
        <p>Flags: {flagscop.join(', ')}</p>
        <p>
          COP Behavior:{' '}
          {copBehavior.map((event, idx) => (
            <span key={idx}>
              {event.stim}({event.time}){' '}
            </span>
          ))}
        </p>
      </div>
      <button onClick={() => setCurrentPage('cop')}>Back</button>
    </div>
  );

  return (
    <div>
      {currentPage === 'pageone' && renderPageOne()}
      {currentPage === 'cop' && renderCopPage()}
      {currentPage === 'copResults' && renderCopResults()}
    </div>
  );
}

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
    <HelmetProvider>
      <ChamberMate />
    </HelmetProvider>
  );

export default ChamberMate;
