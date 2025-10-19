import React from 'react';
import type { SessionSummary, Scenario } from '../types/simulator';
import '../styles/SessionSummaryModal.css';

interface SessionSummaryModalProps {
  summary: SessionSummary;
  scenario: Scenario;
  onClose: () => void;
  onNextSession: () => void;
  onRestart: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  summary,
  scenario,
  onClose,
  onNextSession,
  onRestart
}) => {
  const getPerformanceRating = (): { rating: string; color: string; message: string } => {
    const { targetRateChangePct, altRateChangePct } = summary.kpis;
    
    if (scenario.goal === 'reduce') {
      // For reduction goals, we want target to decrease and alt to increase
      if (targetRateChangePct < -30 && altRateChangePct > 30) {
        return { 
          rating: 'Excellent', 
          color: '#4CAF50', 
          message: 'Great job! Target behavior reduced significantly and alternative behavior increased!' 
        };
      } else if (targetRateChangePct < -15) {
        return { 
          rating: 'Good', 
          color: '#8BC34A', 
          message: 'Good progress. Target behavior is decreasing.' 
        };
      } else if (targetRateChangePct < 0) {
        return { 
          rating: 'Fair', 
          color: '#FFC107', 
          message: 'Some progress. Consider adjusting your strategy.' 
        };
      } else {
        return { 
          rating: 'Needs Improvement', 
          color: '#FF5722', 
          message: 'Target behavior increased. Review your intervention strategy.' 
        };
      }
    } else {
      // For increase goals, we want alt behavior to increase
      if (altRateChangePct > 50) {
        return { 
          rating: 'Excellent', 
          color: '#4CAF50', 
          message: 'Excellent work! Alternative behavior increased significantly!' 
        };
      } else if (altRateChangePct > 25) {
        return { 
          rating: 'Good', 
          color: '#8BC34A', 
          message: 'Good progress on increasing the target behavior.' 
        };
      } else if (altRateChangePct > 0) {
        return { 
          rating: 'Fair', 
          color: '#FFC107', 
          message: 'Slight improvement. Consider strengthening reinforcement.' 
        };
      } else {
        return { 
          rating: 'Needs Improvement', 
          color: '#FF5722', 
          message: 'Behavior did not increase. Review your approach.' 
        };
      }
    }
  };

  const performance = getPerformanceRating();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎯 Session Complete!</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="performance-badge" style={{ backgroundColor: performance.color }}>
          <div className="performance-rating">{performance.rating}</div>
          <div className="performance-message">{performance.message}</div>
        </div>

        <div className="summary-content">
          <div className="summary-section">
            <h3>📊 Behavior Changes</h3>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Target Behavior Rate Change</div>
                <div className={`kpi-value ${summary.kpis.targetRateChangePct < 0 ? 'positive' : 'negative'}`}>
                  {summary.kpis.targetRateChangePct > 0 ? '+' : ''}
                  {summary.kpis.targetRateChangePct.toFixed(1)}%
                </div>
                <div className="kpi-description">
                  {summary.kpis.targetRateChangePct < 0 ? '📉 Decreased' : '📈 Increased'}
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Alternative Behavior Rate Change</div>
                <div className={`kpi-value ${summary.kpis.altRateChangePct > 0 ? 'positive' : 'negative'}`}>
                  {summary.kpis.altRateChangePct > 0 ? '+' : ''}
                  {summary.kpis.altRateChangePct.toFixed(1)}%
                </div>
                <div className="kpi-description">
                  {summary.kpis.altRateChangePct > 0 ? '📈 Increased' : '📉 Decreased'}
                </div>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <h3>📈 Session Statistics</h3>
            <div className="stats-table">
              <div className="stat-row">
                <span className="stat-label">Reinforcers Delivered:</span>
                <span className="stat-value">{summary.kpis.reinforcersDelivered}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Avg. Target IRT:</span>
                <span className="stat-value">
                  {summary.kpis.avgIRTTarget > 0 ? `${summary.kpis.avgIRTTarget.toFixed(1)}s` : 'N/A'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Avg. Alternative IRT:</span>
                <span className="stat-value">
                  {summary.kpis.avgIRTAlt > 0 ? `${summary.kpis.avgIRTAlt.toFixed(1)}s` : 'N/A'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Extinction Burst:</span>
                <span className="stat-value">
                  {summary.kpis.burstDetected ? '🔥 Yes' : '✓ No'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Final Motivation:</span>
                <span className="stat-value">{Math.round(summary.kpis.finalMO * 100)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Final Satiation:</span>
                <span className="stat-value">{Math.round(summary.kpis.finalSAT * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <h3>⚙️ Strategy Used</h3>
            <div className="strategy-info">
              <div className="strategy-item">
                <span className="strategy-label">Intervention:</span>
                <span className="strategy-value">{summary.intervention}</span>
              </div>
              <div className="strategy-item">
                <span className="strategy-label">Schedule (Alt):</span>
                <span className="strategy-value">
                  {summary.scheduleAlt.type}
                  {summary.scheduleAlt.param ? ` (${summary.scheduleAlt.param})` : ''}
                </span>
              </div>
              <div className="strategy-item">
                <span className="strategy-label">Reinforcer:</span>
                <span className="strategy-value">
                  {summary.reinforcer.type} (magnitude: {summary.reinforcer.magnitude})
                </span>
              </div>
            </div>
          </div>

          {summary.kpis.burstDetected && (
            <div className="summary-section warning-section">
              <h4>⚠️ Extinction Burst Detected</h4>
              <p>
                An extinction burst occurred during this session. This is a normal response when 
                reinforcement is withheld. The behavior temporarily increased before decreasing.
              </p>
            </div>
          )}

          <div className="summary-section insights-section">
            <h3>💡 Insights & Recommendations</h3>
            <ul className="insights-list">
              {summary.kpis.reinforcersDelivered < 5 && (
                <li>Consider increasing reinforcement frequency to strengthen alternative behavior.</li>
              )}
              {summary.kpis.finalSAT > 0.7 && (
                <li>High satiation at end - consider shorter sessions or varied reinforcers.</li>
              )}
              {summary.kpis.finalMO < 0.3 && (
                <li>Low motivation at end - ensure establishing operations are in place.</li>
              )}
              {summary.kpis.targetRateChangePct > 0 && scenario.goal === 'reduce' && (
                <li>Target behavior increased - review if reinforcement is maintaining the problem behavior.</li>
              )}
              {summary.kpis.altRateChangePct < 10 && (
                <li>Alternative behavior didn't increase much - consider richer reinforcement or teaching the skill.</li>
              )}
              {summary.intervention === 'Extinction' && !summary.kpis.burstDetected && (
                <li>Good consistency! No extinction burst observed.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button-secondary" onClick={onRestart}>
            🔄 Retry Session
          </button>
          <button className="button-primary" onClick={onNextSession}>
            Next Session ({summary.sessionNumber + 1}) →
          </button>
        </div>
      </div>
    </div>
  );
};

