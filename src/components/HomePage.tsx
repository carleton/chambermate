import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { experimentDataAtom } from '../store/atoms';
import { Field, Form, Formik } from 'formik';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HomePage = () => {
  const navigate = useNavigate();
  const [experimentData, setExperimentData] = useAtom(experimentDataAtom);

  // Form field configuration
  const formFields = [
    { name: 'experimentTitle', placeholder: 'Experiment Title', type: 'text', required: true },
    { name: 'experimenterName', placeholder: 'Experimenter Name', type: 'text', required: true   },
    { name: 'femaleNumber', placeholder: 'Female Number', type: 'number', required: true },
    { name: 'studNumber', placeholder: 'Stud Number', type: 'text', required: false },
    { name: 'date', placeholder: 'Date and Time', type: 'text', required: true },
    { name: 'objectOne', placeholder: 'Stim (♀) or Stud (♂) or Object (L)', type: 'text', required: false },
    { name: 'objectTwo', placeholder: 'Stim (♀) or Stud (♂) or Object (R)', type: 'text', required: false },
  ];

  // Base input class
  const inputClassName = "form-input w-full px-3 py-2 mb-4 rounded-md bg-[#252525] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  useEffect(() => {
    // Set current date and time when component mounts
    const now = new Date();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    const strTime = hours + ':' + minutesStr + ampm;

    const dateStr =
      now.getDate() +
      ' ' +
      months[now.getMonth()] +
      ' ' +
      now.getFullYear() +
      ' ' +
      strTime;

    setExperimentData(prev => ({ ...prev, date: dateStr }));
  }, [setExperimentData]);

  const validateForm = (testCase: 'cop' | 'pacing', formValues: any): boolean => {
    if (formValues.experimentTitle?.includes('#')) {
      alert('Experiment Title contains #');
      return false;
    }

    // Define required fields for each test type
    const requiredFields = {
      cop: ['experimentTitle', 'experimenterName', 'femaleNumber', 'objectOne', 'objectTwo'],
      pacing: ['experimentTitle', 'experimenterName', 'femaleNumber', 'studNumber']
    };

    // Check required fields for the specific test case
    const missingFields = requiredFields[testCase].filter(fieldName => {
      const value = formValues[fieldName];
      return !value || value.toString().trim() === '';
    });

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields for ${testCase}: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleCOPClick = (formValues: any) => {
    if (validateForm('cop', formValues)) {
      // Update Jotai atom with current form values before navigation
      setExperimentData(formValues);
      navigate('/cop');
    }
  };

  const handlePacingClick = (formValues: any) => {
    if (validateForm('pacing', formValues)) {
      // Update Jotai atom with current form values before navigation
      setExperimentData(formValues);
      navigate('/pacing');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="p-4 relative">
        <img src="/logo.png" alt="Logo" className="absolute top-4 left-4" />
        <div className="flex justify-center">
          <h1 className="text-white font-bold">ChamberMate</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w mx-auto">
        <Formik 
          initialValues={experimentData} 
          enableReinitialize={true}
          onSubmit={() => {}}
        >
          {({ values }) => (
          <Form>
            {formFields.map((field, index) => (
              <Field
                key={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className={`${inputClassName} ${index === formFields.length - 1 ? 'mb-6' : ''}`}
              />
            ))}

            <div className="flex flex-row gap-4">
              <button
                type="button"
                onClick={() => handleCOPClick(values)}
                className="w-full bg-[#333] hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
              Partner Preference/COP
              <AccessTimeIcon />
            </button>

              <button
                type="button"
                onClick={() => handlePacingClick(values)}
                className="w-full bg-[#333] hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Pacing 
                <FavoriteIcon />
              </button>
            </div>
           
          </Form>
          )}
        </Formik>
      </div>

      {/* Footer */}
      <div className="text-center">
        <a
          href="https://apps.carleton.edu/curricular/psyc/meertslab/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <img
            src="/meertslogo.png"
            alt="Meerts Lab"
            id="meertslogo"
            className="mx-auto w-[30%] m-5"
          />
        </a>
      </div>
    </div>
  );
};

export default HomePage;
