import React, { useEffect, useRef, useState } from 'react';
import type { Scenario, SimulationState, InterventionType, ScheduleType, ReinforcerType, SessionSummary } from '../types/simulator';
import { initializeSimulation, tick, generateSummary, deliverManualReinforcement } from '../utils/simulationEngine';
import { CatStage } from './CatStage';
import { SimulatorControls } from './SimulatorControls';
import { SimulatorGraph } from './SimulatorGraph';
import { EventFeed } from './EventFeed';
import { SessionSummaryModal } from './SessionSummaryModal';
import '../styles/SimulatorLab.css';

interface SimulatorLabProps {
  scenario: Scenario;
  onBack: () => void;
}

export const SimulatorLab: React.FC<SimulatorLabProps> = ({ scenario, onBack }) => {
  const [state, setState] = useState<SimulationState>(() => {
    const initialState = initializeSimulation(scenario);
    initialState.isPaused = true; // Start paused by default
    return initialState;
  });
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x speed by default
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Main simulation loop
  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const elapsed = (now - lastTickTimeRef.current) / 1000;

      // Run multiple ticks if needed to catch up (adjusted by speed multiplier)
      setState(prevState => {
        if (elapsed >= prevState.dt && !prevState.isPaused && !prevState.isComplete) {
          const adjustedElapsed = elapsed * speedMultiplier;
          const ticksToRun = Math.floor(adjustedElapsed / prevState.dt);
          const newState = { ...prevState };
          for (let i = 0; i < Math.min(ticksToRun, 10); i++) { // Cap at 10 ticks per frame
            tick(newState);
          }
          lastTickTimeRef.current = now;
          return newState;
        }
        return prevState;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [speedMultiplier]);

  // Handle session completion
  useEffect(() => {
    if (state.isComplete && !summary) {
      const sessionSummary = generateSummary(state, scenario);
      setSummary(sessionSummary);
    }
  }, [state.isComplete, scenario, summary, state]);

  const handleRestart = () => {
    setState(initializeSimulation(scenario, state.sessionNumber));
    setShowSummary(false);
    setSummary(null);
    lastTickTimeRef.current = Date.now();
  };

  const handleNextSession = () => {
    setState(initializeSimulation(scenario, state.sessionNumber + 1));
    setShowSummary(false);
    setSummary(null);
    lastTickTimeRef.current = Date.now();
  };

  const handlePauseToggle = () => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    if (state.isPaused) {
      lastTickTimeRef.current = Date.now();
    }
  };

  const handleInterventionChange = (intervention: InterventionType) => {
    setState(prev => {
      const newState = { ...prev, intervention };
      newState.events.push({
        t: prev.t,
        type: 'intervention_change',
        details: `Changed intervention to ${intervention}`
      });
      return newState;
    });
  };

  const handleScheduleChange = (scheduleType: 'target' | 'alt', schedule: ScheduleType, param?: number) => {
    setState(prev => {
      const newState = { ...prev };
      if (scheduleType === 'target') {
        newState.scheduleTarget = { type: schedule, param };
        newState.scheduleTargetState.responsesThisInterval = 0;
        newState.scheduleTargetState.nextReinforcementRequirement = undefined;
      } else {
        newState.scheduleAlt = { type: schedule, param };
        newState.scheduleAltState.responsesThisInterval = 0;
        newState.scheduleAltState.nextReinforcementRequirement = undefined;
      }
      return newState;
    });
  };

  const handleReinforcerChange = (type: ReinforcerType, magnitude: 1 | 2 | 3) => {
    setState(prev => ({
      ...prev,
      reinforcer: { type, magnitude }
    }));
  };

  const handleMOChange = (value: number) => {
    setState(prev => ({ ...prev, MO: value }));
  };

  const handleManualReinforce = (behaviorType: 'target' | 'alt') => {
    setState(prev => {
      const newState = { ...prev };
      deliverManualReinforcement(newState, behaviorType);
      return newState;
    });
  };

  const progressPercent = (state.t / state.sessionDuration) * 100;

  return (
    <div className="simulator-lab">
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="info-group">
            <button className="back-button" onClick={onBack}>← Back</button>
            <h2 className="scenario-title">{scenario.title}</h2>
            <span className="session-badge">Session #{state.sessionNumber}</span>
          </div>

          <div className="button-group-left">
            <button 
              className="control-button help" 
              onClick={() => setShowHelp(true)}
              title="How to use the simulator"
            >
              ❓ Help
            </button>

            <button 
              className={`control-button ${state.isPaused ? 'play' : 'pause'}`}
              onClick={handlePauseToggle}
              disabled={state.isComplete}
            >
              {state.isPaused ? '▶ Play' : '⏸ Pause'}
            </button>

            <button className="control-button restart" onClick={handleRestart}>
              🔄 Restart
            </button>
          </div>
        </div>

        <div className="top-bar-center">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="time-display">
              {Math.floor(state.t)}s / {state.sessionDuration}s
            </span>
          </div>
        </div>

        <div className="top-bar-right">
          <div className="slider-group">
            <div className="mo-control">
              <div className="control-label-row">
                <label>Speed</label>
                <span>{speedMultiplier}x</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.25"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
              />
            </div>

            <div className="mo-control">
              <div className="control-label-row">
                <label>Motivation (MO)</label>
                <span>{Math.round(state.MO * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.MO}
                onChange={(e) => handleMOChange(parseFloat(e.target.value))}
                disabled={!state.isPaused}
              />
            </div>

            <button 
              className="control-button next" 
              onClick={handleNextSession}
              disabled={!state.isComplete}
            >
              Next Session →
            </button>
          </div>
        </div>
      </div>

      <div className="lab-content">
        <div className="controls-container">
          <SimulatorControls
            state={state}
            scenario={scenario}
            onInterventionChange={handleInterventionChange}
            onScheduleChange={handleScheduleChange}
            onReinforcerChange={handleReinforcerChange}
            onManualReinforce={handleManualReinforce}
          />
        </div>

        <div className="right-content-scrollable">
          {state.isPaused && !state.isComplete && (
            <div className="quick-tip-banner">
              <div className="quick-tip-content">
                <span className="tip-icon">💡</span>
                <div className="tip-text">
                  <strong>Ready to start?</strong> Configure your intervention on the left, then press the <strong>Play button</strong> to begin!
                </div>
              </div>
            </div>
          )}

          <div className="cat-and-events-row">
            <div className="cat-container">
              <div className="cat-stage-wrapper">
                <CatStage 
                  scenario={scenario}
                  animation={state.currentAnimation}
                  MO={state.MO}
                  SAT={state.SAT}
                  BURST={state.BURST}
                  currentTime={state.t}
                />
                
                {state.isPaused && !state.isComplete && (
                  <div className="play-overlay">
                    <button 
                      className="play-overlay-button"
                      onClick={handlePauseToggle}
                    >
                      <span className="play-icon">▶</span>
                      <span className="play-text">Play</span>
                    </button>
                  </div>
                )}
              </div>
              
              {state.isComplete && (
                <button 
                  className="view-summary-button" 
                  onClick={() => setShowSummary(true)}
                >
                  📊 View Summary
                </button>
              )}
            </div>

            <div className="events-container">
              <EventFeed 
                events={state.events}
                maxEvents={20}
                MO={state.MO}
                SAT={state.SAT}
                BURST={state.BURST}
              />
            </div>
          </div>

          <div className="graphs-container">
            <SimulatorGraph 
              timePoints={state.timePoints}
              targetRates={state.targetRates}
              altRates={state.altRates}
              targetBehavior={scenario.targetBehavior}
              altBehavior={scenario.alternativeBehavior}
            />
          </div>
        </div>
      </div>

      {showSummary && summary && (
        <SessionSummaryModal
          summary={summary}
          scenario={scenario}
          onClose={() => setShowSummary(false)}
          onNextSession={handleNextSession}
          onRestart={handleRestart}
        />
      )}

      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <h2>🐱 How to Use the Cat Training Simulator</h2>
              <button className="close-button" onClick={() => setShowHelp(false)}>×</button>
            </div>
            
            <div className="help-content">
              <section className="help-section">
                <h3>🎯 Your Goal</h3>
                <p>
                  Reduce the <strong>target behavior</strong> (problem behavior) by reinforcing the 
                  <strong> alternative behavior</strong> (desired behavior).
                </p>
              </section>

              <section className="help-section">
                <h3>📋 Step-by-Step Instructions</h3>
                <ol>
                  <li>
                    <strong>Before pressing Play:</strong> Configure your intervention strategy in the right panel:
                    <ul>
                      <li><strong>Intervention Type:</strong> Choose DRA, DRO, DRI, NCR, Extinction, or Punishment</li>
                      <li><strong>Schedule:</strong> Set when reinforcement is delivered (FR, VR, FI, VI)</li>
                      <li><strong>Reinforcer:</strong> Pick the type and magnitude</li>
                    </ul>
                  </li>
                  <li><strong>Press Play (▶):</strong> The simulation starts and the cat begins exhibiting behaviors</li>
                  <li>
                    <strong>Watch the graphs:</strong>
                    <ul>
                      <li><span style={{ color: '#F44336' }}>Red line</span> = Target behavior (you want this to GO DOWN)</li>
                      <li><span style={{ color: '#4CAF50' }}>Green line</span> = Alternative behavior (you want this to GO UP)</li>
                    </ul>
                  </li>
                  <li><strong>Adjust speed:</strong> Use the Speed slider if things are too fast or slow</li>
                  <li><strong>Try different strategies:</strong> Pause and change interventions/schedules to see what works best</li>
                  <li><strong>Complete the session:</strong> Review your performance summary and try again!</li>
                </ol>
              </section>

              <section className="help-section">
                <h3>💡 Understanding the Interface</h3>
                <ul>
                  <li><strong>Cat Stage:</strong> Shows animations when behaviors occur and reinforcement is delivered</li>
                  <li><strong>Motivation (MO):</strong> Higher motivation = more frequent behaviors</li>
                  <li><strong>Satiation bars:</strong> Track how "full" the cat is getting from reinforcement</li>
                  <li><strong>Event Log:</strong> Chronicles every behavior and reinforcement delivery</li>
                  <li><strong>Manual Actions:</strong> You can manually reinforce behaviors</li>
                </ul>
              </section>

              <section className="help-section">
                <h3>🎓 Quick Tips</h3>
                <ul>
                  <li><strong>Start simple:</strong> Try DRA with a VI-8 schedule first</li>
                  <li><strong>Watch for extinction bursts:</strong> Temporary increases in behavior when reinforcement stops</li>
                  <li><strong>Mind satiation:</strong> Too much reinforcement makes it less effective</li>
                  <li><strong>Variable schedules (VR/VI):</strong> Create steady, consistent responding</li>
                  <li><strong>Run multiple sessions:</strong> See long-term effects of your interventions</li>
                </ul>
              </section>

              <section className="help-section">
                <h3>❓ Common Questions</h3>
                <ul>
                  <li><strong>Why is nothing happening?</strong> Press the Play button (▶) to start the simulation</li>
                  <li><strong>Too fast?</strong> Lower the Speed slider to 0.5x or 0.25x</li>
                  <li><strong>Not working?</strong> Make sure your schedule allows reinforcement (not EXT for alternative behavior)</li>
                  <li><strong>Want to try again?</strong> Click Restart to reset the current session</li>
                </ul>
              </section>
            </div>

            <div className="help-footer">
              <button className="button-primary" onClick={() => setShowHelp(false)}>
                Got it! Let's train!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

