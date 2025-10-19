// Types for the BCBA Cat Training Simulator

export type InterventionType = 'DRA' | 'DRO' | 'DRI' | 'NCR' | 'Extinction' | 'Punishment';
export type ScheduleType = 'FR' | 'VR' | 'FI' | 'VI' | 'CRF' | 'EXT';
export type ReinforcerType = 'clicker' | 'treat' | 'praise';
export type BehaviorGoal = 'increase' | 'reduce';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  targetBehavior: string;
  alternativeBehavior: string;
  goal: BehaviorGoal;
  recommendedIntervention: InterventionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  defaultParams: {
    intervention: InterventionType;
    scheduleTarget: ScheduleConfig;
    scheduleAlt: ScheduleConfig;
    reinforcer: ReinforcerConfig;
    sessionDuration: number; // seconds
  };
}

export interface ScheduleConfig {
  type: ScheduleType;
  param?: number; // FR:5, FI:10 (seconds), mean for VR/VI
}

export interface ReinforcerConfig {
  type: ReinforcerType;
  magnitude: 1 | 2 | 3;
}

export interface SimulationState {
  t: number; // current time in seconds
  dt: number; // time step
  sessionNumber: number;
  
  // Motivation and state variables
  MO: number; // Motivation Operation (0-1)
  SAT: number; // Satiation (0-1)
  BURST: number; // Extinction burst intensity (0-1)
  
  // Recent reinforcement history (decaying)
  recentReinfTarget: number;
  recentReinfAlt: number;
  
  // Schedule state
  scheduleTargetState: ScheduleState;
  scheduleAltState: ScheduleState;
  
  // DRO specific
  droTimer: number;
  droInterval: number; // seconds
  
  // NCR specific
  ncrTimer: number;
  ncrInterval: number; // seconds
  
  // Current configuration
  intervention: InterventionType;
  scheduleTarget: ScheduleConfig;
  scheduleAlt: ScheduleConfig;
  reinforcer: ReinforcerConfig;
  
  // Behavior tracking
  targetBehaviorCount: number;
  altBehaviorCount: number;
  reinforcersDelivered: number;
  
  // Cumulative for graphs
  timePoints: number[];
  targetRates: number[]; // per minute
  altRates: number[]; // per minute
  
  // Recent behavior for rate calculation (sliding window)
  recentTargetBehaviors: number[];
  recentAltBehaviors: number[];
  windowSize: number; // seconds for rate calculation
  
  // Events log
  events: SimulationEvent[];
  
  // Animation state
  currentAnimation: AnimationState;
  
  // Control state
  isPaused: boolean;
  isComplete: boolean;
  sessionDuration: number; // total duration in seconds
}

export interface ScheduleState {
  responsesThisInterval: number;
  lastReinforcementTime: number;
  nextReinforcementRequirement?: number; // for VR/VI
}

export interface SimulationEvent {
  t: number;
  type: 'reinforcement' | 'burst_detected' | 'satiation' | 'behavior' | 'session_end' | 'intervention_change';
  details: string;
  behaviorType?: 'target' | 'alt';
}

export interface AnimationState {
  type: 'idle' | 'target_behavior' | 'alt_behavior' | 'reinforcement' | 'burst' | 'sleepy';
  startTime: number;
  duration: number;
  icon?: string;
}

export interface SessionSummary {
  scenario: string;
  sessionNumber: number;
  intervention: InterventionType;
  scheduleAlt: ScheduleConfig;
  scheduleTarget: ScheduleConfig;
  reinforcer: ReinforcerConfig;
  duration: number;
  kpis: {
    targetRateChangePct: number;
    altRateChangePct: number;
    reinforcersDelivered: number;
    avgIRTTarget: number; // average inter-response time
    avgIRTAlt: number;
    burstDetected: boolean;
    finalMO: number;
    finalSAT: number;
  };
  events: SimulationEvent[];
}

// Predefined scenarios
export const SCENARIOS: Scenario[] = [
  {
    id: 'jumping',
    title: 'Jumping on Counter',
    description: 'Reduce the cat jumping on the kitchen counter by reinforcing sitting on the floor.',
    targetBehavior: 'Jumping on counter',
    alternativeBehavior: 'Sitting on floor',
    goal: 'reduce',
    recommendedIntervention: 'DRA',
    difficulty: 'Easy',
    icon: '🐱⬆️',
    defaultParams: {
      intervention: 'DRA',
      scheduleTarget: { type: 'EXT' },
      scheduleAlt: { type: 'VI', param: 8 },
      reinforcer: { type: 'treat', magnitude: 2 },
      sessionDuration: 120
    }
  },
  {
    id: 'meowing',
    title: 'Constant Meowing',
    description: 'Reduce excessive meowing by reinforcing quiet periods.',
    targetBehavior: 'Meowing loudly',
    alternativeBehavior: 'Quiet behavior',
    goal: 'reduce',
    recommendedIntervention: 'DRO',
    difficulty: 'Medium',
    icon: '😿🔊',
    defaultParams: {
      intervention: 'DRO',
      scheduleTarget: { type: 'EXT' },
      scheduleAlt: { type: 'FI', param: 10 },
      reinforcer: { type: 'praise', magnitude: 1 },
      sessionDuration: 120
    }
  },
  {
    id: 'sitting',
    title: 'Sitting Calmly',
    description: 'Increase calm sitting behavior for grooming or vet visits.',
    targetBehavior: 'Running around',
    alternativeBehavior: 'Sitting calmly',
    goal: 'increase',
    recommendedIntervention: 'DRA',
    difficulty: 'Easy',
    icon: '😺✨',
    defaultParams: {
      intervention: 'DRA',
      scheduleTarget: { type: 'EXT' },
      scheduleAlt: { type: 'VR', param: 3 },
      reinforcer: { type: 'treat', magnitude: 3 },
      sessionDuration: 90
    }
  },
  {
    id: 'scratching',
    title: 'Scratching Couch',
    description: 'Reduce couch scratching by reinforcing scratching post use.',
    targetBehavior: 'Scratching couch',
    alternativeBehavior: 'Using scratching post',
    goal: 'reduce',
    recommendedIntervention: 'DRI',
    difficulty: 'Hard',
    icon: '🛋️💔',
    defaultParams: {
      intervention: 'DRI',
      scheduleTarget: { type: 'EXT' },
      scheduleAlt: { type: 'FR', param: 2 },
      reinforcer: { type: 'clicker', magnitude: 2 },
      sessionDuration: 150
    }
  }
];

