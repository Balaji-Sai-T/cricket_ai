import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { BarChart, LineChart, PieChart, TrendingUp, Target, Activity } from 'lucide-react';
import { generateMatchAnalytics } from '../utils/mlSimulator';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [matchData, setMatchData] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    setMatchData(generateMatchAnalytics());
  }, []);

  const barChartData = {
    labels: matchData.map(match => `${match.team1} vs ${match.team2}`).slice(0, 6),
    datasets: [
      {
        label: 'No Balls Detected',
        data: matchData.slice(0, 6).map(match => match.noBalls),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const lineChartData = {
    labels: matchData.map(match => new Date(match.date).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: 'Detection Accuracy (%)',
        data: matchData.map(match => (match.accuracy * 100).toFixed(1)).reverse(),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const doughnutData = {
    labels: ['Legal Deliveries', 'No Balls', 'Wide Balls'],
    datasets: [
      {
        data: [85, 12, 3],
        backgroundColor: ['#22C55E', '#EF4444', '#F59E0B'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  const totalNoBalls = matchData.reduce((sum, match) => sum + match.noBalls, 0);
  const totalBalls = matchData.reduce((sum, match) => sum + match.totalBalls, 0);
  const avgAccuracy = matchData.reduce((sum, match) => sum + match.accuracy, 0) / matchData.length;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of cricket no ball detection performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total No Balls Detected</p>
                <p className="text-3xl font-bold text-red-600">{totalNoBalls}</p>
                <p className="text-sm text-gray-500">Last 10 matches</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Target className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Accuracy</p>
                <p className="text-3xl font-bold text-green-600">{(avgAccuracy * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Across all matches</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Balls Analyzed</p>
                <p className="text-3xl font-bold text-blue-600">{totalBalls.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Processing complete</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* No Balls by Match */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">No Balls by Match</h3>
            </div>
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Accuracy Trend */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <LineChart className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Detection Accuracy Trend</h3>
            </div>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ball Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Ball Type Distribution</h3>
            </div>
            <div className="h-64">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Matches Table */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Match Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600">Match</th>
                    <th className="text-left py-2 text-gray-600">No Balls</th>
                    <th className="text-left py-2 text-gray-600">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.slice(0, 5).map((match) => (
                    <tr key={match.id} className="border-b border-gray-100">
                      <td className="py-2">
                        <div className="text-sm font-medium text-gray-800">
                          {match.team1} vs {match.team2}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-2 text-red-600 font-medium">{match.noBalls}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                          {(match.accuracy * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;