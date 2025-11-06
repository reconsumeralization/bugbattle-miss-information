import React from 'react';
import { AppendixAVisualizationData, HistogramDataPoint, MonteCarloResult } from '../../types';
import { Card } from './Card';

interface AppendixAVisualizerProps {
  data: AppendixAVisualizationData | null;
  isLoading: boolean;
}

const BarChart: React.FC<{ title: string; data: HistogramDataPoint[] }> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-on-surface-muted">No data available for {title}.</p>;
  }
  const maxValue = Math.max(...data.map(d => d.count), 0);

  return (
    <div className="mb-6 p-3 bg-gray-700/50 rounded-md">
      <h4 className="text-md font-semibold text-on-surface mb-3 text-center">{title}</h4>
      <div className="flex items-end space-x-1 h-40 border-b border-l border-gray-600 pb-1 pl-1 relative">
        {/* Y-axis labels (conceptual) */}
        <div className="absolute -left-5 top-0 bottom-1 flex flex-col justify-between text-xs text-gray-500 bar-chart-y-axis-labels">
            <span>{maxValue > 0 ? maxValue : ''}</span>
            <span>{maxValue > 0 ? Math.round(maxValue / 2) : ''}</span>
            <span>0</span>
        </div>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end" title={`${item.name}: ${item.count}`}>
            <div
              className={`w-full bg-primary-light hover:bg-primary transition-all duration-300 ease-out origin-bottom bar-chart-bar 
                height-${Math.round((item.count / maxValue) * 100)} percent-height 
                animation-delay-${index}`}
            >
              {/* Optional: Display count on bar if space allows and bar is tall enough */}
              {/* {item.count > maxValue * 0.1 && <span className="text-xs text-white relative -top-4 text-center block">{item.count}</span>} */}
            </div>
            <span className="text-xs text-on-surface-muted mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProbabilityTable: React.FC<{ results: MonteCarloResult[] }> = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-sm text-on-surface-muted">No Monte Carlo simulation results available.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-on-surface-muted">
        <thead className="text-xs text-on-surface uppercase bg-gray-700">
          <tr>
            <th scope="col" className="px-4 py-2">Attacker Guess Batch Size</th>
            <th scope="col" className="px-4 py-2">Probability of Hit in Batch</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className={`bg-surface border-b border-gray-700 hover:bg-gray-700/50 probability-table-row animation-delay-${index}`}
            >
              <td className="px-4 py-2 font-mono">{result.batchSize.toLocaleString()}</td>
              <td className="px-4 py-2 font-mono text-primary-light">{result.hitProbability.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const AppendixAVisualizer: React.FC<AppendixAVisualizerProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <Card title="Appendix A: ID Enumerability Insights"><p className="text-on-surface-muted">Loading visualization data...</p></Card>;
  }
  if (!data) {
    return <Card title="Appendix A: ID Enumerability Insights"><p className="text-on-surface-muted">No data available for Appendix A visualization.</p></Card>;
  }

  return (
    <Card title="Appendix A: ID Enumerability Insights (Conceptual Visualization)">
      <p className="text-sm text-on-surface-muted mb-4">{data.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {data.histograms.map((hist, index) => (
          <BarChart key={index} title={hist.title} data={hist.data} />
        ))}
      </div>

      <div>
        <h4 className="text-md font-semibold text-on-surface mb-3 text-center">Monte Carlo Simulation: Hit Probabilities</h4>
        <ProbabilityTable results={data.monteCarloResults} />
      </div>
      <p className="text-xs text-on-surface-muted mt-4 text-center italic">
        Note: "3D Animation" is conceptualized here through 2D animated charts to illustrate data insights.
      </p>
    </Card>
  );
};