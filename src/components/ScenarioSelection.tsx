import React from 'react';
import type { Scenario } from '../types/simulator';
import { SCENARIOS } from '../types/simulator';
import '../styles/ScenarioSelection.css';

interface ScenarioSelectionProps {
  onSelectScenario: (scenario: Scenario) => void;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ onSelectScenario }) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="scenario-selection">
      <header className="scenario-header">
        <h1>🐱 Reinforce the Cat!</h1>
        <p className="subtitle">
          Learn about reinforcement strategies by training a virtual cat.
          Choose a scenario to begin your BCBA training session.
        </p>
      </header>

      <div className="scenarios-grid">
        {SCENARIOS.filter(scenario => scenario.id !== 'sitting').map((scenario) => (
          <div key={scenario.id} className="scenario-card">
            <div className="scenario-icon">{scenario.icon}</div>
            
            <h2 className="scenario-title">{scenario.title}</h2>
            
            <p className="scenario-description">{scenario.description}</p>
            
            <div className="scenario-details">
              <div className="detail-row">
                <span className="detail-label">Goal:</span>
                <span className={`detail-value goal-${scenario.goal}`}>
                  {scenario.goal === 'increase' ? '📈 Increase' : '📉 Reduce'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Target:</span>
                <span className="detail-value">{scenario.targetBehavior}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Alternative:</span>
                <span className="detail-value">{scenario.alternativeBehavior}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Recommended:</span>
                <span className="detail-value intervention-badge">
                  {scenario.recommendedIntervention}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Difficulty:</span>
                <span 
                  className="detail-value difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                >
                  {scenario.difficulty}
                </span>
              </div>
            </div>
            
            <button 
              className="start-button"
              onClick={() => onSelectScenario(scenario)}
            >
              Start Lab
            </button>
          </div>
        ))}
      </div>

      <div className="info-section">
        <h3>💡 How It Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h4>Choose Your Strategy</h4>
            <p>Select interventions (DRA, DRO, DRI, NCR, Extinction) and reinforcement schedules (FR, VR, FI, VI)</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h4>Observe the Results</h4>
            <p>Watch real-time graphs showing how behavior rates change based on your interventions</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🧠</div>
            <h4>Learn & Adapt</h4>
            <p>Understand motivation, satiation, extinction bursts, and schedule effects through interactive feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

