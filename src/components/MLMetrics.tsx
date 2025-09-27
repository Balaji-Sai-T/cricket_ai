import React from 'react';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';

const MLMetrics = () => {
  const metrics = [
    {
      icon: Brain,
      label: 'Model Accuracy',
      value: '95.7%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Zap,
      label: 'Inference Speed',
      value: '47ms',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Target,
      label: 'Precision',
      value: '93.2%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TrendingUp,
      label: 'Recall',
      value: '94.8%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map(({ icon: Icon, label, value, color, bgColor }) => (
        <div key={label} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MLMetrics;