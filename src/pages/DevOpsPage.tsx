import React, { useState } from 'react';
import { GitBranch, Server, CheckCircle, XCircle, Clock, PlayCircle, AlertTriangle } from 'lucide-react';

const DevOpsPage = () => {
  const [selectedPipeline, setSelectedPipeline] = useState('main');
  
  const pipelines = [
    {
      id: 'main',
      name: 'Main Pipeline',
      status: 'success',
      lastRun: '2 minutes ago',
      duration: '4m 32s',
      commits: 12,
      branch: 'main'
    },
    {
      id: 'develop',
      name: 'Development Pipeline',
      status: 'running',
      lastRun: 'Running',
      duration: '2m 15s',
      commits: 8,
      branch: 'develop'
    },
    {
      id: 'staging',
      name: 'Staging Pipeline',
      status: 'failed',
      lastRun: '1 hour ago',
      duration: '3m 45s',
      commits: 5,
      branch: 'staging'
    }
  ];

  const buildSteps = [
    { name: 'Code Checkout', status: 'success', duration: '12s' },
    { name: 'Install Dependencies', status: 'success', duration: '1m 23s' },
    { name: 'Run Tests', status: 'success', duration: '45s' },
    { name: 'Build ML Model', status: 'success', duration: '2m 8s' },
    { name: 'Docker Build', status: 'running', duration: '1m 30s' },
    { name: 'Deploy to Staging', status: 'pending', duration: '-' },
    { name: 'Integration Tests', status: 'pending', duration: '-' }
  ];

  const deploymentEnvironments = [
    {
      name: 'Production',
      status: 'healthy',
      version: 'v2.1.3',
      lastDeployed: '2 hours ago',
      uptime: '99.9%',
      requests: '1.2M/day'
    },
    {
      name: 'Staging',
      status: 'healthy',
      version: 'v2.1.4-rc1',
      lastDeployed: '15 minutes ago',
      uptime: '99.7%',
      requests: '50K/day'
    },
    {
      name: 'Development',
      status: 'warning',
      version: 'v2.2.0-dev',
      lastDeployed: '5 minutes ago',
      uptime: '98.2%',
      requests: '5K/day'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">DevOps Dashboard</h1>
          <p className="text-gray-600">CI/CD Pipeline monitoring and deployment management</p>
        </div>

        {/* Pipeline Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pipelines.map((pipeline) => (
            <div 
              key={pipeline.id}
              className={`bg-white rounded-xl p-6 shadow-lg border cursor-pointer transition-all ${
                selectedPipeline === pipeline.id ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'
              }`}
              onClick={() => setSelectedPipeline(pipeline.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{pipeline.name}</h3>
                {getStatusIcon(pipeline.status)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Branch:</span>
                  <span className="font-medium">{pipeline.branch}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Run:</span>
                  <span className="font-medium">{pipeline.lastRun}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{pipeline.duration}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                  {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Build Steps */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Build Pipeline - {selectedPipeline}</h2>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlayCircle className="h-4 w-4" />
              <span>Trigger Build</span>
            </button>
          </div>

          <div className="space-y-4">
            {buildSteps.map((step, index) => (
              <div key={step.name} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{step.name}</h4>
                  <p className="text-sm text-gray-600">Duration: {step.duration}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Environments */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Server className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Deployment Environments</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {deploymentEnvironments.map((env) => (
              <div key={env.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{env.name}</h3>
                  {getStatusIcon(env.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{env.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Deployed:</span>
                    <span className="font-medium">{env.lastDeployed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium text-green-600">{env.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Requests:</span>
                    <span className="font-medium">{env.requests}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm font-medium">
                    View Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CI/CD Configuration Files */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">GitHub Actions</h4>
              <code className="text-sm text-gray-600 block">.github/workflows/ci.yml</code>
              <p className="text-sm text-gray-500 mt-1">Main CI/CD pipeline configuration</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Docker</h4>
              <code className="text-sm text-gray-600 block">Dockerfile</code>
              <p className="text-sm text-gray-500 mt-1">Container build configuration</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Kubernetes</h4>
              <code className="text-sm text-gray-600 block">k8s/deployment.yaml</code>
              <p className="text-sm text-gray-500 mt-1">Kubernetes deployment specs</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Terraform</h4>
              <code className="text-sm text-gray-600 block">infrastructure/main.tf</code>
              <p className="text-sm text-gray-500 mt-1">Infrastructure as Code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsPage;