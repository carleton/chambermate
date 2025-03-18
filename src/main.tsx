import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<ChamberMate />);

function ChamberMate() {
  // Page state (simulate multiple pages)
  const [currentPage, setCurrentPage] = useState('pageone'); // 'pageone', 'cop', 'copResults'

  // Form fields (from index.html)
  const [experimentTitle, setExperimentTitle] = useState('');
  const [experimenterName, setExperimenterName] = useState('');
  const [female, setFemale] = useState('');
  const [stud, setStud] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [objOne, setObjOne] = useState('');
  const [objTwo, setObjTwo] = useState('');

  // Timer states for COP clock
  const [copTimeBegan, setCopTimeBegan] = useState(null);
  const [copTimeStopped, setCopTimeStopped] = useState(null);
  const [copStoppedDuration, setCopStoppedDuration] = useState(0);
  const [clockTime, setClockTime] = useState("00:00");

  // Timer states for Object One
  const [objOneTimeBegan, setObjOneTimeBegan] = useState(null);
  const [objOneTimeStopped, setObjOneTimeStopped] = useState(null);
  const [objOneStoppedDuration, setObjOneStoppedDuration] = useState(0);
  const [timeWithObjOne, setTimeWithObjOne] = useState("00:00");

  // Timer states for Object Two
  const [objTwoTimeBegan, setObjTwoTimeBegan] = useState(null);
  const [objTwoTimeStopped, setObjTwoTimeStopped] = useState(null);
  const [objTwoStoppedDuration, setObjTwoStoppedDuration] = useState(0);
  const [timeWithObjTwo, setTimeWithObjTwo] = useState("00:00");

  // Behavior tracking arrays and counters
  const [copBehavior, setCopBehavior] = useState([]);
  const [flagscop, setFlagscop] = useState([]);
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

  // Validate the experiment form (similar to COPValidate)
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

  // Called when the user clicks the COP button on pageone
  const setUpCOP = () => {
    if (COPValidate()) {
      // In the original code the objects’ names and title are set in the header.
      // Here we simply move to the COP page.
      setCurrentPage('cop');
    }
  };

  // -----------------------
  // COP Timer Effects
  // -----------------------

  // Update the main COP clock while it is running.
  useEffect(() => {
    let timerId;
    if (copTimeBegan) {
      timerId = setInterval(() => {
        const now = new Date();
        const elapsed = new Date(now.getTime() - copTimeBegan.getTime() - copStoppedDuration);
        const min = elapsed.getUTCMinutes();
        const sec = elapsed.getUTCSeconds();
        setClockTime(
          `${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`
        );
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
      setObjOneStoppedDuration(prev => prev + (new Date().getTime() - objOneTimeStopped));
    }
    const id = setInterval(() => {
      const now = new Date();
      const elapsed = new Date(now.getTime() - objOneTimeBegan - objOneStoppedDuration);
      const min = elapsed.getUTCMinutes();
      const sec = elapsed.getUTCSeconds();
      setTimeWithObjOne(`${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`);
    }, 10);
    return id;
  };

  const stopObjOne = (intervalId) => {
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
      setObjTwoStoppedDuration(prev => prev + (new Date().getTime() - objTwoTimeStopped));
    }
    const id = setInterval(() => {
      const now = new Date();
      const elapsed = new Date(now.getTime() - objTwoTimeBegan - objTwoStoppedDuration);
      const min = elapsed.getUTCMinutes();
      const sec = elapsed.getUTCSeconds();
      setTimeWithObjTwo(`${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`);
    }, 10);
    return id;
  };

  const stopObjTwo = (intervalId) => {
    setObjTwoTimeStopped(new Date());
    clearInterval(intervalId);
  };

  // -----------------------
  // Behavior tracking
  // -----------------------
  const trackBehCop = (stim) => {
    // Remove colon and convert to number (as in your original code)
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
    // For a full implementation you might want to store the interval ID to stop it later.
    // In this example, we assume the timer is stopped when Center is pressed.
  };

  const handleInObjectTwo = () => {
    const timerId = startObjTwo();
    trackBehCop("inTwo");
    setWithTwo(true);
    setWithOne(false);
  };

  const handleCenter = () => {
    // Stop whichever object is active
    if (withOne) {
      // (Assume you stored and clear the timer if needed)
    } else if (withTwo) {
      // (Assume you stored and clear the timer if needed)
    }
    trackBehCop("center");
    setWithOne(false);
    setWithTwo(false);
  };

  // Start the COP experiment (starts the main clock)
  const startCop = () => {
    if (!copTimeBegan) {
      setDateValue(new Date().toLocaleString());
      setCopTimeBegan(new Date());
    }
    if (copTimeStopped) {
      setCopStoppedDuration(prev => prev + (new Date().getTime() - copTimeStopped));
    }
  };

  // Stop the COP experiment (stops timers)
  const stopCop = () => {
    // In a complete implementation you would also stop object one and two timers.
    setCopTimeStopped(new Date());
  };

  // Flag current time
  const flagCop = () => {
    setFlagscop(prev => [...prev, clockTime]);
  };

  // Finish test: here we simply navigate to the results “page”
  const finishTestCop = () => {
    setCurrentPage('copResults');
  };

  // -----------------------
  // Render functions for different pages
  // -----------------------

  const renderPageOne = () => (
    <div>
      <h1>ChamberMate</h1>
      <img src="img/logo.png" alt="Logo" style={{ float: 'left' }} />
      <form style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Experiment Title"
          value={experimentTitle}
          onChange={e => setExperimentTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Experimenter Name"
          value={experimenterName}
          onChange={e => setExperimenterName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Female Number"
          value={female}
          onChange={e => setFemale(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Stud Number"
          value={stud}
          onChange={e => setStud(e.target.value)}
        />
        <input
          type="text"
          placeholder="Date and Time"
          value={dateValue}
          readOnly
        />
        <input
          type="text"
          placeholder="Object One"
          value={objOne}
          onChange={e => setObjOne(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Object Two"
          value={objTwo}
          onChange={e => setObjTwo(e.target.value)}
          required
        />
        <div>
          <button type="button" onClick={setUpCOP}>
            Partner Preference / COP
          </button>
          {/* You could add a Pacing button here if needed */}
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
      <h1>{experimentTitle} Results</h1>
      <div>
        <p>Flags: {flagscop.join(', ')}</p>
        <p>
          COP Behavior: {copBehavior.map((event, idx) => (
            <span key={idx}>
              {event.stim}({event.time}){' '}
            </span>
          ))}
        </p>
        {/* Additional results rendering can be added here */}
      </div>
      <button onClick={() => setCurrentPage('cop')}>Back</button>
    </div>
  );

  // -----------------------
  // Main Render
  // -----------------------
  return (
    <div>
      {currentPage === 'pageone' && renderPageOne()}
      {currentPage === 'cop' && renderCopPage()}
      {currentPage === 'copResults' && renderCopResults()}
    </div>
  );
}

export default ChamberMate;
