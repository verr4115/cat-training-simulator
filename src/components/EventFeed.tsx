import React, { useEffect, useRef } from 'react';
import type { SimulationEvent } from '../types/simulator';
import '../styles/EventFeed.css';

interface EventFeedProps {
  events: SimulationEvent[];
  maxEvents?: number;
  MO?: number;
  SAT?: number;
  BURST?: number;
}

export const EventFeed: React.FC<EventFeedProps> = ({ events, maxEvents = 10, MO = 0, SAT = 0, BURST = 0 }) => {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (event: SimulationEvent): string => {
    switch (event.type) {
      case 'reinforcement':
        return '🐟';
      case 'burst_detected':
        return '🔥';
      case 'satiation':
        return '😴';
      case 'behavior':
        return event.behaviorType === 'target' ? '❗' : '✓';
      case 'session_end':
        return '🏁';
      case 'intervention_change':
        return '🔄';
      default:
        return 'ℹ️';
    }
  };

  const getEventClass = (event: SimulationEvent): string => {
    const classes = ['event-item'];
    
    if (event.type === 'reinforcement') classes.push('event-reinforcement');
    if (event.type === 'burst_detected') classes.push('event-burst');
    if (event.type === 'satiation') classes.push('event-satiation');
    if (event.type === 'behavior' && event.behaviorType === 'target') classes.push('event-target');
    if (event.type === 'behavior' && event.behaviorType === 'alt') classes.push('event-alt');
    if (event.type === 'intervention_change') classes.push('event-change');
    if (event.type === 'session_end') classes.push('event-end');
    
    return classes.join(' ');
  };

  const recentEvents = events.slice(-maxEvents);

  // Show all events since behaviors are less frequent now
  const displayEvents = recentEvents;

  return (
    <div className="event-feed">
      <div className="feed-header">
        <h3>📝 Event Log</h3>
      </div>

      <div className="feed-stats">
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

      <div className="feed-content" ref={feedRef}>
        {displayEvents.length === 0 ? (
          <div className="no-events">No events yet. The session is starting...</div>
        ) : (
          displayEvents.map((event, index) => (
            <div key={`${event.t}-${index}`} className={getEventClass(event)}>
              <span className="event-icon">{getEventIcon(event)}</span>
              <span className="event-time">t={event.t.toFixed(1)}s</span>
              <span className="event-details">{event.details}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

