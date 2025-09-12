import { useAtom } from 'jotai';
import { experimentDataAtom } from '../store/atoms';

const COPTest = () => {
  const [experimentData] = useAtom(experimentDataAtom);
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="bg-primary text-white p-4 mb-4">
        <h1 className="text-2xl font-bold">Partner Preference/COP Test</h1>
        <p className="text-sm mt-2">
          Experiment: {experimentData.experimentTitle}
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-xl mb-4">COP Test Interface</h2>
        <p className="mb-4">This is where the COP test will be implemented.</p>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg mb-2">Experiment Details:</h3>
          <p>Title: {experimentData.experimentTitle}</p>
          <p>Experimenter: {experimentData.experimenterName}</p>
          <p>Female Number: {experimentData.femaleNumber}</p>
          <p>Date: {experimentData.date}</p>
          <p>Object One: {experimentData.objectOne}</p>
          <p>Object Two: {experimentData.objectTwo}</p>
        </div>
      </div>
    </div>
  );
};

export default COPTest;
