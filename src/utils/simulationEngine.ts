// Behavioral Simulation Engine for Cat Training

import type {
  SimulationState,
  ScheduleConfig,
  ScheduleState,
  AnimationState,
  SessionSummary,
  Scenario
} from '../types/simulator';

// Helper functions
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
const randomNormal = (mean: number, std: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * std;
};

// Initialize simulation state
export function initializeSimulation(scenario: Scenario, sessionNumber: number = 1): SimulationState {
  return {
    t: 0,
    dt: 0.1,
    sessionNumber,
    MO: 0.6,
    SAT: 0.2,
    BURST: 0,
    recentReinfTarget: 0,
    recentReinfAlt: 0,
    scheduleTargetState: {
      responsesThisInterval: 0,
      lastReinforcementTime: 0,
      nextReinforcementRequirement: undefined
    },
    scheduleAltState: {
      responsesThisInterval: 0,
      lastReinforcementTime: 0,
      nextReinforcementRequirement: undefined
    },
    droTimer: 0,
    droInterval: scenario.defaultParams.scheduleAlt.param || 10,
    ncrTimer: 0,
    ncrInterval: 15,
    intervention: scenario.defaultParams.intervention,
    scheduleTarget: scenario.defaultParams.scheduleTarget,
    scheduleAlt: scenario.defaultParams.scheduleAlt,
    reinforcer: scenario.defaultParams.reinforcer,
    targetBehaviorCount: 0,
    altBehaviorCount: 0,
    reinforcersDelivered: 0,
    timePoints: [],
    targetRates: [],
    altRates: [],
    recentTargetBehaviors: [],
    recentAltBehaviors: [],
    windowSize: 10, // 10 second window for rate calculation
    events: [],
    currentAnimation: {
      type: 'idle',
      startTime: 0,
      duration: 1
    },
    isPaused: false,
    isComplete: false,
    sessionDuration: scenario.defaultParams.sessionDuration
  };
}

// Check if schedule requirements are met for reinforcement
function scheduleEligible(
  config: ScheduleConfig,
  state: ScheduleState,
  currentTime: number
): boolean {
  switch (config.type) {
    case 'CRF':
      return true;
    
    case 'EXT':
      return false;
    
    case 'FR': {
      const requirement = config.param || 1;
      return state.responsesThisInterval >= requirement;
    }
    
    case 'VR': {
      if (!state.nextReinforcementRequirement) {
        const mean = config.param || 5;
        state.nextReinforcementRequirement = Math.max(1, Math.round(randomNormal(mean, mean * 0.3)));
      }
      return state.responsesThisInterval >= state.nextReinforcementRequirement;
    }
    
    case 'FI': {
      const interval = config.param || 10;
      return currentTime - state.lastReinforcementTime >= interval;
    }
    
    case 'VI': {
      if (!state.nextReinforcementRequirement) {
        const mean = config.param || 10;
        state.nextReinforcementRequirement = Math.max(1, randomNormal(mean, mean * 0.3));
      }
      return currentTime - state.lastReinforcementTime >= state.nextReinforcementRequirement;
    }
    
    default:
      return false;
  }
}

// Reset schedule state after reinforcement
function resetSchedule(config: ScheduleConfig, state: ScheduleState, currentTime: number): void {
  state.responsesThisInterval = 0;
  state.lastReinforcementTime = currentTime;
  
  if (config.type === 'VR') {
    const mean = config.param || 5;
    state.nextReinforcementRequirement = Math.max(1, Math.round(randomNormal(mean, mean * 0.3)));
  } else if (config.type === 'VI') {
    const mean = config.param || 10;
    state.nextReinforcementRequirement = Math.max(1, randomNormal(mean, mean * 0.3));
  } else {
    state.nextReinforcementRequirement = undefined;
  }
}

// Mark a response (increment counter)
function markResponse(scheduleState: ScheduleState): void {
  scheduleState.responsesThisInterval++;
}

// Calculate behavior rates (responses per minute)
function calculateRate(behaviors: number[], _windowSize: number, dt: number): number {
  if (behaviors.length === 0) return 0;
  const count = behaviors.reduce((sum, val) => sum + val, 0);
  const timeInMinutes = (behaviors.length * dt) / 60;
  return timeInMinutes > 0 ? count / timeInMinutes : 0;
}

// Main simulation tick
export function tick(state: SimulationState): void {
  if (state.isPaused || state.isComplete) return;
  
  // 1) Decay dynamics
  state.recentReinfTarget *= 0.98;
  state.recentReinfAlt *= 0.98;
  state.SAT *= 0.999;
  state.MO = clamp01(0.2 + 0.8 * (1 - state.SAT));
  state.BURST *= 0.95;
  
  // 2) Compute propensities for each behavior
  const noise = () => (Math.random() - 0.5) * 0.2;
  
  // Target behavior propensity (problem behavior)
  const pTargetRaw = sigmoid(
    -0.5 + // baseline (adjusted for more consistent frequency)
    1.5 * state.MO + // motivated = more behavior
    1.5 * state.recentReinfTarget - // if reinforced recently, more likely
    1.5 * state.SAT + // satiated = less behavior (reduced impact)
    3.0 * state.BURST + // burst = much more behavior
    noise()
  );
  
  // Alternative behavior propensity (replacement behavior)
  const competitionEffect = state.recentReinfTarget > 0 ? 0.3 : 0;
  const pAltRaw = sigmoid(
    -1.0 + // baseline (adjusted for more consistent frequency)
    2.5 * state.recentReinfAlt - // if reinforced, more likely
    competitionEffect + // target behavior competes (reduced)
    0.8 * state.MO + // motivation effect (increased)
    noise()
  );
  
  // Apply minimum probabilities to ensure some behavior happens
  const pTarget = Math.max(pTargetRaw, 0.35);
  const pAlt = Math.max(pAltRaw, 0.25);
  
  // 3) Sample emissions (behaviors are incompatible)
  // Multiplier adjusted to 1.8 to make behaviors happen every 2-3 seconds
  const emitAlt = Math.random() < pAlt * state.dt * 1.8;
  const emitTarget = !emitAlt && Math.random() < pTarget * state.dt * 1.8;
  
  // 4) Handle schedules and intervention logic
  let delivered: 'target' | 'alt' | 'time' | null = null;
  let animationType: AnimationState['type'] = 'idle';
  
  // Track behaviors
  if (emitTarget) {
    state.targetBehaviorCount++;
    markResponse(state.scheduleTargetState);
    animationType = 'target_behavior';
    
    state.events.push({
      t: state.t,
      type: 'behavior',
      details: 'Target behavior occurred',
      behaviorType: 'target'
    });
  }
  
  if (emitAlt) {
    state.altBehaviorCount++;
    markResponse(state.scheduleAltState);
    animationType = 'alt_behavior';
    
    state.events.push({
      t: state.t,
      type: 'behavior',
      details: 'Alternative behavior occurred',
      behaviorType: 'alt'
    });
  }
  
  // DRO timer logic
  if (!emitTarget) {
    state.droTimer += state.dt;
  } else {
    state.droTimer = 0;
  }
  
  // NCR timer logic
  state.ncrTimer += state.dt;
  
  // Determine reinforcement based on intervention
  const targetEligible = scheduleEligible(state.scheduleTarget, state.scheduleTargetState, state.t);
  const altEligible = scheduleEligible(state.scheduleAlt, state.scheduleAltState, state.t);
  
  switch (state.intervention) {
    case 'DRA': // Differential Reinforcement of Alternative behavior
      if (emitAlt && altEligible) {
        delivered = 'alt';
      }
      break;
    
    case 'DRI': // Differential Reinforcement of Incompatible behavior
      if (emitAlt && altEligible) {
        delivered = 'alt';
      }
      break;
    
    case 'DRO': // Differential Reinforcement of Other behavior (no target for interval)
      if (state.droTimer >= state.droInterval) {
        delivered = 'time';
        state.droTimer = 0;
      }
      break;
    
    case 'NCR': // Non-Contingent Reinforcement
      if (state.ncrTimer >= state.ncrInterval) {
        delivered = 'time';
        state.ncrTimer = 0;
      }
      break;
    
    case 'Extinction':
      // No reinforcement for any behavior
      delivered = null;
      
      // Check for extinction burst
      if (emitTarget && state.recentReinfTarget < 0.1 && state.BURST < 0.5) {
        state.BURST = 1.0;
        state.events.push({
          t: state.t,
          type: 'burst_detected',
          details: 'Extinction burst detected!'
        });
      }
      break;
    
    case 'Punishment':
      // Punishment reduces future probability (handled below)
      if (emitTarget && targetEligible) {
        state.recentReinfTarget -= 0.3; // suppress behavior
        state.events.push({
          t: state.t,
          type: 'reinforcement',
          details: 'Punisher delivered',
          behaviorType: 'target'
        });
      }
      break;
  }
  
  // 5) Apply reinforcement consequences
  if (delivered) {
    const magnitude = state.reinforcer.magnitude * 0.2;
    
    if (delivered === 'alt') {
      state.recentReinfAlt += magnitude;
      resetSchedule(state.scheduleAlt, state.scheduleAltState, state.t);
    } else if (delivered === 'time') {
      // DRO or NCR - reinforce current state
      if (emitAlt) {
        state.recentReinfAlt += magnitude;
      }
    }
    
    state.SAT = clamp01(state.SAT + magnitude * 0.05);
    state.reinforcersDelivered++;
    
    animationType = 'reinforcement';
    
    state.events.push({
      t: state.t,
      type: 'reinforcement',
      details: `Reinforced: ${delivered} behavior (${state.reinforcer.type})`,
      behaviorType: delivered === 'time' ? undefined : delivered
    });
    
    // Check for satiation
    if (state.SAT > 0.7) {
      state.events.push({
        t: state.t,
        type: 'satiation',
        details: 'Cat is getting satiated'
      });
      animationType = 'sleepy';
    }
  }
  
  // Update animation state
  if (animationType !== 'idle') {
    state.currentAnimation = {
      type: animationType,
      startTime: state.t,
      duration: animationType === 'reinforcement' ? 1.5 : 1.0
    };
  } else if (state.t - state.currentAnimation.startTime > state.currentAnimation.duration) {
    state.currentAnimation = {
      type: state.BURST > 0.5 ? 'burst' : state.SAT > 0.7 ? 'sleepy' : 'idle',
      startTime: state.t,
      duration: 2.0
    };
  }
  
  // 6) Update behavior tracking for rate calculation
  state.recentTargetBehaviors.push(emitTarget ? 1 : 0);
  state.recentAltBehaviors.push(emitAlt ? 1 : 0);
  
  // Keep window at fixed size
  const windowSteps = Math.floor(state.windowSize / state.dt);
  if (state.recentTargetBehaviors.length > windowSteps) {
    state.recentTargetBehaviors.shift();
    state.recentAltBehaviors.shift();
  }
  
  // 7) Update graphs every second
  if (Math.floor(state.t / 1) > Math.floor((state.t - state.dt) / 1)) {
    state.timePoints.push(state.t);
    state.targetRates.push(calculateRate(state.recentTargetBehaviors, state.windowSize, state.dt));
    state.altRates.push(calculateRate(state.recentAltBehaviors, state.windowSize, state.dt));
  }
  
  // 8) Advance time
  state.t += state.dt;
  
  // 9) Check for session end
  if (state.t >= state.sessionDuration) {
    state.isComplete = true;
    
    // Add final data point to graph
    state.timePoints.push(state.t);
    state.targetRates.push(calculateRate(state.recentTargetBehaviors, state.windowSize, state.dt));
    state.altRates.push(calculateRate(state.recentAltBehaviors, state.windowSize, state.dt));
    
    state.events.push({
      t: state.t,
      type: 'session_end',
      details: 'Session completed'
    });
  }
}

// Generate session summary
export function generateSummary(state: SimulationState, scenario: Scenario): SessionSummary {
  // Calculate rate changes
  const initialWindow = Math.min(20, Math.floor(state.targetRates.length / 4));
  const finalWindow = Math.min(20, Math.floor(state.targetRates.length / 4));
  
  const initialTargetRate = state.targetRates.length > initialWindow
    ? state.targetRates.slice(0, initialWindow).reduce((sum, r) => sum + r, 0) / initialWindow
    : 0;
  
  const finalTargetRate = state.targetRates.length > finalWindow
    ? state.targetRates.slice(-finalWindow).reduce((sum, r) => sum + r, 0) / finalWindow
    : 0;
  
  const initialAltRate = state.altRates.length > initialWindow
    ? state.altRates.slice(0, initialWindow).reduce((sum, r) => sum + r, 0) / initialWindow
    : 0;
  
  const finalAltRate = state.altRates.length > finalWindow
    ? state.altRates.slice(-finalWindow).reduce((sum, r) => sum + r, 0) / finalWindow
    : 0;
  
  const targetRateChangePct = initialTargetRate > 0
    ? ((finalTargetRate - initialTargetRate) / initialTargetRate) * 100
    : 0;
  
  const altRateChangePct = initialAltRate > 0
    ? ((finalAltRate - initialAltRate) / initialAltRate) * 100
    : finalAltRate > 0 ? 100 : 0;
  
  // Calculate average IRTs
  const targetBehaviorEvents = state.events.filter(e => e.behaviorType === 'target');
  const altBehaviorEvents = state.events.filter(e => e.behaviorType === 'alt');
  
  const avgIRTTarget = targetBehaviorEvents.length > 1
    ? targetBehaviorEvents.slice(1).reduce((sum, e, i) => sum + (e.t - targetBehaviorEvents[i].t), 0) / (targetBehaviorEvents.length - 1)
    : 0;
  
  const avgIRTAlt = altBehaviorEvents.length > 1
    ? altBehaviorEvents.slice(1).reduce((sum, e, i) => sum + (e.t - altBehaviorEvents[i].t), 0) / (altBehaviorEvents.length - 1)
    : 0;
  
  const burstDetected = state.events.some(e => e.type === 'burst_detected');
  
  return {
    scenario: scenario.title,
    sessionNumber: state.sessionNumber,
    intervention: state.intervention,
    scheduleAlt: state.scheduleAlt,
    scheduleTarget: state.scheduleTarget,
    reinforcer: state.reinforcer,
    duration: state.t,
    kpis: {
      targetRateChangePct,
      altRateChangePct,
      reinforcersDelivered: state.reinforcersDelivered,
      avgIRTTarget,
      avgIRTAlt,
      burstDetected,
      finalMO: state.MO,
      finalSAT: state.SAT
    },
    events: state.events
  };
}

// Manual reinforcement trigger (for "Reinforce Now" button)
export function deliverManualReinforcement(state: SimulationState, behaviorType: 'target' | 'alt'): void {
  const magnitude = state.reinforcer.magnitude * 0.2;
  
  if (behaviorType === 'alt') {
    state.recentReinfAlt += magnitude;
  } else if (behaviorType === 'target') {
    state.recentReinfTarget += magnitude;
  }
  
  state.SAT = clamp01(state.SAT + magnitude * 0.05);
  state.reinforcersDelivered++;
  
  state.events.push({
    t: state.t,
    type: 'reinforcement',
    details: `Manual reinforcement: ${behaviorType} behavior`,
    behaviorType
  });
  
  state.currentAnimation = {
    type: 'reinforcement',
    startTime: state.t,
    duration: 1.0
  };
}

