import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import '../styles/SimulatorGraph.css';

interface SimulatorGraphProps {
  timePoints: number[];
  targetRates: number[];
  altRates: number[];
  targetBehavior: string;
  altBehavior: string;
}

export const SimulatorGraph: React.FC<SimulatorGraphProps> = ({
  timePoints,
  targetRates,
  altRates,
  targetBehavior,
  altBehavior
}) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current) return;

    // Don't render if we don't have actual data yet
    if (timePoints.length === 0) {
      // Show empty state with same styling as actual graph
      const emptyLayout = {
        title: 'Behavior Rates Over Time',
        annotations: [{
          text: 'Press Play to start collecting data...',
          xref: 'paper',
          yref: 'paper',
          x: 0.5,
          y: 0.5,
          showarrow: false,
          font: { size: 16, color: '#999' }
        }],
        xaxis: { 
          title: 'Time (seconds)', 
          range: [0, 60],
          showgrid: true,
          gridcolor: '#e0e0e0'
        },
        yaxis: { 
          title: 'Rate (responses/minute)', 
          range: [0, 5],
          showgrid: true,
          gridcolor: '#e0e0e0'
        },
        margin: {
          l: 50,
          r: 20,
          t: 40,
          b: 50
        },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#fafafa'
      } as any;
      Plotly.react(graphRef.current, [], emptyLayout, { responsive: true, displayModeBar: false });
      return;
    }

    const xData = timePoints;
    const yTargetData = targetRates;
    const yAltData = altRates;

    const targetTrace = {
      x: xData,
      y: yTargetData,
      type: 'scatter',
      mode: 'lines',
      name: targetBehavior,
      line: {
        color: '#F44336',
        width: 2
      }
    } as any;

    const altTrace = {
      x: xData,
      y: yAltData,
      type: 'scatter',
      mode: 'lines',
      name: altBehavior,
      line: {
        color: '#4CAF50',
        width: 2
      }
    } as any;

    // Calculate max value for better y-axis scaling
    const maxRate = Math.max(...yTargetData, ...yAltData, 1);
    
    const layout = {
      title: 'Behavior Rates Over Time',
      xaxis: {
        title: 'Time (seconds)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      yaxis: {
        title: 'Rate (responses/minute)',
        showgrid: true,
        gridcolor: '#e0e0e0',
        rangemode: 'tozero',
        range: [0, Math.max(maxRate * 1.2, 5)] // Ensure minimum range of 5
      },
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#ccc',
        borderwidth: 1
      },
      margin: {
        l: 50,
        r: 20,
        t: 40,
        b: 50
      },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#fafafa',
      hovermode: 'x unified'
    } as any;

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
      displaylogo: false,
      modeBarButtonsToAdd: []
    } as any;

    Plotly.react(graphRef.current, [targetTrace, altTrace], layout, config);
  }, [timePoints, targetRates, altRates, targetBehavior, altBehavior]);

  // Handle window resize
  useEffect(() => {
    if (!graphRef.current) return;
    
    const handleResize = () => {
      if (graphRef.current) {
        Plotly.Plots.resize(graphRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="simulator-graph">
      <div ref={graphRef} className="graph-container" />
    </div>
  );
};

