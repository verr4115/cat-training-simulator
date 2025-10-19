import React, { useState } from 'react';
import type { SimulationState, InterventionType, ScheduleType, ReinforcerType, Scenario } from '../types/simulator';
import '../styles/SimulatorControls.css';

interface SimulatorControlsProps {
  state: SimulationState;
  scenario: Scenario;
  onInterventionChange: (intervention: InterventionType) => void;
  onScheduleChange: (scheduleType: 'target' | 'alt', schedule: ScheduleType, param?: number) => void;
  onReinforcerChange: (type: ReinforcerType, magnitude: 1 | 2 | 3) => void;
  onManualReinforce: (behaviorType: 'target' | 'alt') => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  state,
  scenario: _scenario,
  onInterventionChange,
  onScheduleChange,
  onReinforcerChange,
  onManualReinforce
}) => {
  const [altScheduleParam, setAltScheduleParam] = useState<number>(
    state.scheduleAlt.param || 5
  );
  const [showPunishmentWarning, setShowPunishmentWarning] = useState(false);

  const interventions: InterventionType[] = ['DRA', 'DRO', 'DRI', 'NCR', 'Extinction', 'Punishment'];
  const schedules: ScheduleType[] = ['CRF', 'FR', 'VR', 'FI', 'VI', 'EXT'];
  const reinforcers: ReinforcerType[] = ['treat', 'clicker', 'praise'];

  const handleInterventionClick = (intervention: InterventionType) => {
    if (intervention === 'Punishment') {
      setShowPunishmentWarning(true);
    } else {
      onInterventionChange(intervention);
    }
  };

  const confirmPunishment = () => {
    onInterventionChange('Punishment');
    setShowPunishmentWarning(false);
  };

  const getInterventionDescription = (intervention: InterventionType): string => {
    switch (intervention) {
      case 'DRA':
        return 'Differential Reinforcement of Alternative behavior - Reinforce a different, appropriate behavior';
      case 'DRO':
        return 'Differential Reinforcement of Other behavior - Reinforce absence of target behavior for a time period';
      case 'DRI':
        return 'Differential Reinforcement of Incompatible behavior - Reinforce behavior that cannot occur with target';
      case 'NCR':
        return 'Non-Contingent Reinforcement - Deliver reinforcement on a time-based schedule, regardless of behavior';
      case 'Extinction':
        return 'Withhold all reinforcement - may cause temporary increase (burst) in target behavior';
      case 'Punishment':
        return 'Apply aversive consequence to reduce behavior - use with caution, may have side effects';
      default:
        return '';
    }
  };

  const getScheduleDescription = (schedule: ScheduleType): string => {
    switch (schedule) {
      case 'CRF':
        return 'Continuous Reinforcement - Every response is reinforced';
      case 'FR':
        return 'Fixed Ratio - Reinforce after a fixed number of responses';
      case 'VR':
        return 'Variable Ratio - Reinforce after varying number of responses (average)';
      case 'FI':
        return 'Fixed Interval - Reinforce first response after fixed time';
      case 'VI':
        return 'Variable Interval - Reinforce first response after varying time (average)';
      case 'EXT':
        return 'Extinction - No reinforcement';
      default:
        return '';
    }
  };

  const needsParam = (schedule: ScheduleType): boolean => {
    return ['FR', 'VR', 'FI', 'VI'].includes(schedule);
  };

  const getParamLabel = (schedule: ScheduleType): string => {
    if (schedule === 'FR' || schedule === 'VR') return 'Responses:';
    if (schedule === 'FI' || schedule === 'VI') return 'Seconds:';
    return 'Param:';
  };

  return (
    <div className="simulator-controls">
      <div className="controls-section">
        <h3>📋 Intervention Strategy</h3>
        <div className="intervention-grid">
          {interventions.map((intervention) => (
            <button
              key={intervention}
              className={`intervention-button ${state.intervention === intervention ? 'active' : ''} ${intervention === 'Punishment' ? 'warning' : ''}`}
              onClick={() => handleInterventionClick(intervention)}
              disabled={state.isPaused === false && state.isComplete === false}
              title={getInterventionDescription(intervention)}
            >
              {intervention}
            </button>
          ))}
        </div>
        <div className="intervention-description">
          <small>{getInterventionDescription(state.intervention)}</small>
        </div>
      </div>

      <div className="controls-section">
        <h3>📅 Reinforcement Schedule (Alternative Behavior)</h3>
        <div className="schedule-selector">
          <select
            value={state.scheduleAlt.type}
            onChange={(e) => {
              const scheduleType = e.target.value as ScheduleType;
              onScheduleChange('alt', scheduleType, needsParam(scheduleType) ? altScheduleParam : undefined);
            }}
            disabled={state.isPaused === false && state.isComplete === false}
          >
            {schedules.map((schedule) => (
              <option key={schedule} value={schedule}>
                {schedule}
              </option>
            ))}
          </select>

          {needsParam(state.scheduleAlt.type) && (
            <div className="schedule-param">
              <label>{getParamLabel(state.scheduleAlt.type)}</label>
              <input
                type="number"
                min="1"
                max={state.scheduleAlt.type.includes('I') ? 60 : 20}
                value={altScheduleParam}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setAltScheduleParam(value);
                  onScheduleChange('alt', state.scheduleAlt.type, value);
                }}
                disabled={state.isPaused === false && state.isComplete === false}
              />
            </div>
          )}
        </div>
        <div className="schedule-description">
          <small>{getScheduleDescription(state.scheduleAlt.type)}</small>
        </div>
      </div>

      <div className="controls-section">
        <h3>🎁 Reinforcer Type & Magnitude</h3>
        <div className="reinforcer-controls">
          <div className="reinforcer-type">
            {reinforcers.map((type) => (
              <button
                key={type}
                className={`reinforcer-button ${state.reinforcer.type === type ? 'active' : ''}`}
                onClick={() => onReinforcerChange(type, state.reinforcer.magnitude)}
              >
                {type === 'treat' && '🦴'}
                {type === 'clicker' && '🔔'}
                {type === 'praise' && '👏'}
                <span>{type}</span>
              </button>
            ))}
          </div>
          
          <div className="reinforcer-magnitude">
            <label>Magnitude:</label>
            <div className="magnitude-selector">
              {[1, 2, 3].map((mag) => (
                <button
                  key={mag}
                  className={`magnitude-button ${state.reinforcer.magnitude === mag ? 'active' : ''}`}
                  onClick={() => onReinforcerChange(state.reinforcer.type, mag as 1 | 2 | 3)}
                >
                  {mag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <h3>⚡ Manual Actions</h3>
        <div className="manual-actions">
          <button
            className="action-button reinforce-alt"
            onClick={() => onManualReinforce('alt')}
            disabled={state.isComplete}
          >
            Reinforce Alternative Now
          </button>
          
          <button
            className="action-button reinforce-target warning"
            onClick={() => onManualReinforce('target')}
            disabled={state.isComplete}
            title="Caution: This will strengthen the target behavior!"
          >
            ⚠️ Reinforce Target (Not Recommended)
          </button>
        </div>
      </div>

      <div className="controls-section stats-section">
        <h3>📊 Session Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Target Behaviors</div>
            <div className="stat-value">{state.targetBehaviorCount}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Alt Behaviors</div>
            <div className="stat-value">{state.altBehaviorCount}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Reinforcers</div>
            <div className="stat-value">{state.reinforcersDelivered}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Time Elapsed</div>
            <div className="stat-value">{Math.floor(state.t)}s</div>
          </div>
        </div>
      </div>

      <div className="controls-section tips-section">
        <h3>💡 Quick Tips</h3>
        <div className="tips-content">
          {state.intervention === 'DRA' && (
            <p>Try VI schedules for steady, consistent responding without predictable patterns.</p>
          )}
          {state.intervention === 'DRO' && (
            <p>Set the interval short enough to be achievable, but long enough to be meaningful.</p>
          )}
          {state.intervention === 'Extinction' && (
            <p>Watch for extinction burst - behavior may temporarily increase before decreasing!</p>
          )}
          {state.SAT > 0.6 && (
            <p>⚠️ Satiation is high - consider taking a break or reducing reinforcer magnitude.</p>
          )}
          {state.BURST > 0.5 && (
            <p>🔥 Extinction burst occurring - stay consistent, this is temporary!</p>
          )}
          {state.MO < 0.3 && (
            <p>📉 Low motivation - consider increasing MO or taking a break to reset.</p>
          )}
        </div>
      </div>

      {showPunishmentWarning && (
        <div className="modal-overlay" onClick={() => setShowPunishmentWarning(false)}>
          <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Punishment Warning</h3>
            <p>
              Using punishment can have unintended side effects including:
            </p>
            <ul>
              <li>Emotional responses (fear, anxiety)</li>
              <li>Escape/avoidance behaviors</li>
              <li>Potential harm to the learner-caregiver relationship</li>
              <li>Temporary suppression without teaching alternatives</li>
            </ul>
            <p>
              <strong>Consider using reinforcement-based strategies first!</strong>
            </p>
            <div className="modal-actions">
              <button 
                className="button-secondary" 
                onClick={() => setShowPunishmentWarning(false)}
              >
                Cancel
              </button>
              <button 
                className="button-warning" 
                onClick={confirmPunishment}
              >
                I Understand, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

