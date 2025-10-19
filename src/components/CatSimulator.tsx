import React, { useState } from 'react';
import type { Scenario } from '../types/simulator';
import { ScenarioSelection } from './ScenarioSelection';
import { SimulatorLab } from './SimulatorLab';

export const CatSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const handleBack = () => {
    setSelectedScenario(null);
  };

  return (
    <div className="cat-simulator">
      {selectedScenario ? (
        <SimulatorLab scenario={selectedScenario} onBack={handleBack} />
      ) : (
        <ScenarioSelection onSelectScenario={handleSelectScenario} />
      )}
    </div>
  );
};

