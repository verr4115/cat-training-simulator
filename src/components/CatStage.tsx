import React, { useEffect, useState } from 'react';
import type { Scenario, AnimationState } from '../types/simulator';
import '../styles/CatStage.css';

interface CatStageProps {
  scenario: Scenario;
  animation: AnimationState;
  MO: number;
  SAT: number;
  BURST: number;
  currentTime: number;
}

export const CatStage: React.FC<CatStageProps> = ({ 
  scenario, 
  animation, 
  MO: _MO, 
  SAT, 
  BURST,
  currentTime 
}) => {
  const [idleFrame, setIdleFrame] = useState(1);

  // Cycle between idle frames every 0.5 seconds when idle
  useEffect(() => {
    if (animation.type === 'idle') {
      const interval = setInterval(() => {
        setIdleFrame(prev => prev === 1 ? 2 : 1);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [animation.type, currentTime]);

  const getCatImage = (): string => {
    let imagePath = '';
    
    // Reinforced state - cat getting treat
    if (animation.type === 'reinforcement') {
      imagePath = '/cat-images/reinforced.png';
    }
    // Sleepy/satiated state - use idle frame
    else if (animation.type === 'sleepy' || SAT > 0.7) {
      imagePath = '/cat-images/idle1.png';
    }
    // Extinction burst state - use target behavior or jumping
    else if (animation.type === 'burst' || BURST > 0.5) {
      if (scenario.id === 'meowing') imagePath = '/cat-images/meowing.png';
      else if (scenario.id === 'jumping') imagePath = '/cat-images/jumping.png';
      else imagePath = '/cat-images/jumping.png'; // Default to jumping for burst
    }
    // Target behavior - specific to scenario
    else if (animation.type === 'target_behavior') {
      if (scenario.id === 'meowing') imagePath = '/cat-images/meowing.png';
      else if (scenario.id === 'jumping') imagePath = '/cat-images/jumping.png';
      else imagePath = `/cat-images/idle${idleFrame}.png`; // Fallback for other scenarios
    }
    // Alternative behavior (sitting, being quiet, etc.) - use idle
    else if (animation.type === 'alt_behavior') {
      imagePath = `/cat-images/idle${idleFrame}.png`;
    }
    // Default idle state - cycle between two idle images
    else {
      imagePath = `/cat-images/idle${idleFrame}.png`;
    }
    
    return imagePath;
  };

  // No longer using CSS classes for animations, but keeping for fallback emoji
  // const getCatClass = (): string => {
  //   const classes = ['cat'];
  //   
  //   if (animation.type === 'target_behavior') {
  //     classes.push('cat-target-behavior');
  //     if (scenario.id === 'jumping') classes.push('cat-jumping');
  //     if (scenario.id === 'meowing') classes.push('cat-meowing');
  //     if (scenario.id === 'scratching') classes.push('cat-scratching');
  //   } else if (animation.type === 'alt_behavior') {
  //     classes.push('cat-alt-behavior');
  //   } else if (animation.type === 'reinforcement') {
  //     classes.push('cat-reinforced');
  //   } else if (animation.type === 'burst') {
  //     classes.push('cat-burst');
  //   } else if (animation.type === 'sleepy') {
  //     classes.push('cat-sleepy');
  //   }
  //   
  //   return classes.join(' ');
  // };

  return (
    <div className="cat-stage">
      <div className="stage-area">
        <div className="cat">
          <img 
            src={getCatImage()} 
            alt="Cat" 
            className="cat-image"
            onError={(e) => {
              // Fallback to emoji if image doesn't exist
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'cat-emoji';
              fallback.textContent = '🐱';
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>

      <div className="stage-legend">
        <div className="legend-item">
          <span className="legend-label">Target:</span>
          <span className="legend-text">{scenario.targetBehavior}</span>
        </div>
        <div className="legend-item">
          <span className="legend-label">Alternative:</span>
          <span className="legend-text">{scenario.alternativeBehavior}</span>
        </div>
      </div>
    </div>
  );
};

