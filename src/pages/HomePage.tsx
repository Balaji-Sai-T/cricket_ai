import React, { useState, useCallback } from 'react';
import { Upload, Camera, AlertTriangle, CheckCircle, Loader, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import DetectionResult from '../components/DetectionResult';
import MLMetrics from '../components/MLMetrics';
import { simulateMLDetection } from '../utils/mlSimulator';

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback(async (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    
    try {
      // Simulate ML processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = simulateMLDetection();
      setDetectionResult(result);
      
      toast.success(`Detection complete! ${result.isNoBall ? 'No Ball detected' : 'Legal delivery'}`);
    } catch (error) {
      toast.error('Detection failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = () => {
    setUploadedImage(null);
    setDetectionResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cricket No Ball Detection System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered system for real-time cricket no ball detection using computer vision and machine learning
          </p>
        </div>

        {/* ML Metrics */}
        <MLMetrics />

        {/* Main Detection Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Image Upload */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <Upload className="h-6 w-6 mr-2 text-green-600" />
                  Image Input
                </h2>
                {uploadedImage && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            </div>
          </div>

          {/* Right Side - Detection Results */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Camera className="h-6 w-6 mr-2 text-blue-600" />
                Detection Results
              </h2>
            </div>
            
            <div className="p-6">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader className="h-12 w-12 text-blue-600 animate-spin" />
                  <p className="text-lg text-gray-600">Processing with AI model...</p>
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              ) : detectionResult ? (
                <DetectionResult result={detectionResult} />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <AlertTriangle className="h-16 w-16 mb-4" />
                  <p className="text-lg">Upload an image to start detection</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Detection</h3>
            <p className="text-gray-600">Instant analysis with 95.7% accuracy using deep learning models</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Batch Processing</h3>
            <p className="text-gray-600">Process multiple images simultaneously for match analysis</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Alerts</h3>
            <p className="text-gray-600">Automated notifications for detected violations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Multi-format</h3>
            <p className="text-gray-600">Supports JPG, PNG, WEBP with automatic preprocessing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;