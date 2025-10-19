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
  MO, 
  SAT, 
  BURST,
  currentTime 
}) => {
  const [showIcon, setShowIcon] = useState(false);
  const [iconType, setIconType] = useState<'target' | 'alt' | 'reinforce'>('target');
  const [idleFrame, setIdleFrame] = useState(1);

  // Cycle between idle frames every 2 seconds when idle
  useEffect(() => {
    if (animation.type === 'idle') {
      const interval = setInterval(() => {
        setIdleFrame(prev => prev === 1 ? 2 : 1);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [animation.type, currentTime]);

  // Handle animation changes
  useEffect(() => {
    if (animation.type === 'target_behavior' || animation.type === 'alt_behavior') {
      setIconType(animation.type === 'target_behavior' ? 'target' : 'alt');
      setShowIcon(true);
      
      const timer = setTimeout(() => {
        setShowIcon(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else if (animation.type === 'reinforcement') {
      setIconType('reinforce');
      setShowIcon(true);
      
      const timer = setTimeout(() => {
        setShowIcon(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [animation.startTime, animation.type]);

  const getCatImage = (): string => {
    let imagePath = '';
    
    // Reinforced state - cat getting treat
    if (animation.type === 'reinforcement') {
      imagePath = '/cat-images/reinforced.png';
    }
    // Sleepy/satiated state
    else if (animation.type === 'sleepy' || SAT > 0.7) {
      imagePath = '/cat-images/sleepy.png';
    }
    // Extinction burst state
    else if (animation.type === 'burst' || BURST > 0.5) {
      imagePath = '/cat-images/burst.png';
    }
    // Target behavior - specific to scenario
    else if (animation.type === 'target_behavior') {
      if (scenario.id === 'meowing') imagePath = '/cat-images/meowing.png';
      else if (scenario.id === 'jumping') imagePath = '/cat-images/jumping.png';
      else if (scenario.id === 'scratching') imagePath = '/cat-images/scratching.png';
      else imagePath = `/cat-images/idle${idleFrame}.png`;
    }
    // Alternative behavior (sitting, being quiet, etc.) - use idle
    else if (animation.type === 'alt_behavior') {
      imagePath = `/cat-images/idle${idleFrame}.png`;
    }
    // Default idle state - cycle between two idle images
    else {
      imagePath = `/cat-images/idle${idleFrame}.png`;
    }
    
    console.log('[CatStage] Loading image:', imagePath, 'Animation:', animation.type, 'Scenario:', scenario.id);
    return imagePath;
  };

  const getCatClass = (): string => {
    const classes = ['cat'];
    
    if (animation.type === 'target_behavior') {
      classes.push('cat-target-behavior');
      if (scenario.id === 'jumping') classes.push('cat-jumping');
      if (scenario.id === 'meowing') classes.push('cat-meowing');
      if (scenario.id === 'scratching') classes.push('cat-scratching');
    } else if (animation.type === 'alt_behavior') {
      classes.push('cat-alt-behavior');
    } else if (animation.type === 'reinforcement') {
      classes.push('cat-reinforced');
    } else if (animation.type === 'burst') {
      classes.push('cat-burst');
    } else if (animation.type === 'sleepy') {
      classes.push('cat-sleepy');
    }
    
    return classes.join(' ');
  };

  const getTargetIcon = (): string => {
    switch (scenario.id) {
      case 'jumping': return '⬆️';
      case 'meowing': return '🔊';
      case 'sitting': return '🏃';
      case 'scratching': return '🪃';
      default: return '❗';
    }
  };

  const getAltIcon = (): string => {
    switch (scenario.id) {
      case 'jumping': return '🪑';
      case 'meowing': return '🤫';
      case 'sitting': return '🧘';
      case 'scratching': return '🎯';
      default: return '✓';
    }
  };

  return (
    <div className="cat-stage">
      <div className="stage-header">
        <h3>Cat Behavior Stage</h3>
        <div className="stage-stats">
          <div className="stat-item">
            <span className="stat-label">Motivation:</span>
            <div className="stat-bar">
              <div 
                className="stat-fill motivation" 
                style={{ width: `${MO * 100}%` }}
              />
            </div>
            <span className="stat-value">{Math.round(MO * 100)}%</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Satiation:</span>
            <div className="stat-bar">
              <div 
                className="stat-fill satiation" 
                style={{ width: `${SAT * 100}%` }}
              />
            </div>
            <span className="stat-value">{Math.round(SAT * 100)}%</span>
          </div>
          
          {BURST > 0.1 && (
            <div className="stat-item">
              <span className="stat-label">Burst:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill burst" 
                  style={{ width: `${BURST * 100}%` }}
                />
              </div>
              <span className="stat-value">{Math.round(BURST * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="stage-area">
        <div className={getCatClass()}>
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

        {showIcon && iconType === 'target' && (
          <div className="behavior-icon target-icon">
            {getTargetIcon()}
          </div>
        )}

        {showIcon && iconType === 'alt' && (
          <div className="behavior-icon alt-icon">
            {getAltIcon()}
          </div>
        )}

        {showIcon && iconType === 'reinforce' && (
          <div className="reinforcement-effect">
            <div className="treat-pop">🦴</div>
            <div className="sparkle sparkle-1">✨</div>
            <div className="sparkle sparkle-2">✨</div>
            <div className="sparkle sparkle-3">✨</div>
          </div>
        )}
      </div>

      <div className="stage-legend">
        <div className="legend-item">
          <span className="legend-icon target">{getTargetIcon()}</span>
          <span className="legend-text">{scenario.targetBehavior}</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon alt">{getAltIcon()}</span>
          <span className="legend-text">{scenario.alternativeBehavior}</span>
        </div>
      </div>
    </div>
  );
};

