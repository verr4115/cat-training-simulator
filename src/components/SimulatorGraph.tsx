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

    // Use empty arrays if no data yet
    const xData = timePoints.length > 0 ? timePoints : [0];
    const yTargetData = targetRates.length > 0 ? targetRates : [0];
    const yAltData = altRates.length > 0 ? altRates : [0];

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
        rangemode: 'tozero'
      },
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: '#ccc',
        borderwidth: 1
      },
      margin: {
        l: 60,
        r: 30,
        t: 50,
        b: 50
      },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#fafafa',
      hovermode: 'x unified'
    } as any;

    const config = {
      responsive: true,
      displayModeBar: false
    } as any;

    Plotly.react(graphRef.current, [targetTrace, altTrace], layout, config);
  }, [timePoints, targetRates, altRates, targetBehavior, altBehavior]);

  return (
    <div className="simulator-graph">
      <div ref={graphRef} className="graph-container" />
    </div>
  );
};

