import React from 'react';
import { AlertTriangle, CheckCircle, Target, Clock, TrendingUp } from 'lucide-react';

interface DetectionResultProps {
  result: {
    isNoBall: boolean;
    confidence: number;
    detectionTime: number;
    boundingBoxes: Array<{
      type: string;
      confidence: number;
      coordinates: { x: number; y: number; width: number; height: number };
    }>;
    metrics: {
      frontFootPosition: number;
      bowlerLine: number;
      ballHeight: number;
    };
  };
}

const DetectionResult: React.FC<DetectionResultProps> = ({ result }) => {
  const { isNoBall, confidence, detectionTime, boundingBoxes, metrics } = result;

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className={`p-6 rounded-xl border-2 ${
        isNoBall 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center space-x-3 mb-3">
          {isNoBall ? (
            <AlertTriangle className="h-8 w-8 text-red-600" />
          ) : (
            <CheckCircle className="h-8 w-8 text-green-600" />
          )}
          <div>
            <h3 className={`text-xl font-bold ${
              isNoBall ? 'text-red-800' : 'text-green-800'
            }`}>
              {isNoBall ? 'NO BALL DETECTED' : 'LEGAL DELIVERY'}
            </h3>
            <p className={`text-sm ${
              isNoBall ? 'text-red-600' : 'text-green-600'
            }`}>
              Confidence: {(confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Detection Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Processing Time</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{detectionTime}ms</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Objects Detected</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{boundingBoxes.length}</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Detailed Analysis
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Front Foot Position:</span>
            <span className={`font-medium ${
              metrics.frontFootPosition > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {metrics.frontFootPosition > 0 ? 'Over the line' : 'Behind the line'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bowler Line Alignment:</span>
            <span className="font-medium text-gray-800">{metrics.bowlerLine.toFixed(2)}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ball Height:</span>
            <span className="font-medium text-gray-800">{metrics.ballHeight.toFixed(1)}cm</span>
          </div>
        </div>
      </div>

      {/* Detection Objects */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-800">Detected Objects:</h4>
        {boundingBoxes.map((box, index) => (
          <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
            <span className="font-medium text-gray-700">{box.type}</span>
            <span className="text-sm text-gray-500">{(box.confidence * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectionResult;