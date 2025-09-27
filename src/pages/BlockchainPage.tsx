import React, { useState } from 'react';
import { Blocks, Shield, Database, ExternalLink, Hash, Clock } from 'lucide-react';

const BlockchainPage = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  const mockTransactions = [
    {
      id: '0x1a2b3c...',
      timestamp: '2025-01-27 14:30:22',
      matchId: 'IND_vs_AUS_2025_001',
      noBalls: 3,
      totalBalls: 300,
      gasUsed: '89,432',
      status: 'Confirmed',
      blockHeight: 18234567
    },
    {
      id: '0x4d5e6f...',
      timestamp: '2025-01-27 11:15:45',
      matchId: 'ENG_vs_PAK_2025_001',
      noBalls: 1,
      totalBalls: 276,
      gasUsed: '67,891',
      status: 'Confirmed',
      blockHeight: 18234521
    },
    {
      id: '0x7g8h9i...',
      timestamp: '2025-01-26 16:45:33',
      matchId: 'SA_vs_NZ_2025_001',
      noBalls: 5,
      totalBalls: 318,
      gasUsed: '92,156',
      status: 'Pending',
      blockHeight: null
    }
  ];

  const smartContractMetrics = {
    totalMatches: 1247,
    totalTransactions: 8956,
    averageGasUsed: '78,234',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4A3A4F2F3F5E6A7',
    networkFees: '0.0234 ETH',
    uptime: '99.97%'
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blockchain Integration</h1>
          <p className="text-gray-600">Immutable match data storage and transparent no ball detection records</p>
        </div>

        {/* Smart Contract Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Blocks className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Smart Contract Details</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Contract Address</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded border flex items-center justify-between">
                  {smartContractMetrics.contractAddress.slice(0, 20)}...
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Network</p>
                <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">Ethereum Mainnet</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Contract Functions</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <code className="text-sm bg-white px-2 py-1 rounded">recordMatchData()</code>
                  <span className="text-xs text-gray-500">Store match results</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <code className="text-sm bg-white px-2 py-1 rounded">verifyDetection()</code>
                  <span className="text-xs text-gray-500">Validate ML results</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <code className="text-sm bg-white px-2 py-1 rounded">getMatchHistory()</code>
                  <span className="text-xs text-gray-500">Retrieve historical data</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Security Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract Audited</span>
                  <span className="text-green-600 font-medium">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Multi-sig Wallet</span>
                  <span className="text-green-600 font-medium">✓ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-green-600 font-medium">{smartContractMetrics.uptime}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Network Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Matches</span>
                  <span className="font-semibold">{smartContractMetrics.totalMatches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions</span>
                  <span className="font-semibold">{smartContractMetrics.totalTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Gas Used</span>
                  <span className="font-semibold">{smartContractMetrics.averageGasUsed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-600 font-medium">Transaction Hash</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Match ID</th>
                  <th className="text-left py-3 text-gray-600 font-medium">No Balls</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Gas Used</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <td className="py-4">
                      <span className="font-mono text-sm text-blue-600">{tx.id}</span>
                    </td>
                    <td className="py-4 font-medium text-gray-800">{tx.matchId}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
                        {tx.noBalls}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">{tx.gasUsed}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        tx.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {tx.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Transaction Details</h3>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Transaction Hash</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedTransaction.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Match ID</p>
                    <p className="font-medium">{selectedTransaction.matchId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Block Height</p>
                    <p className="font-medium">{selectedTransaction.blockHeight || 'Pending'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">No Balls</p>
                    <p className="font-medium text-red-600">{selectedTransaction.noBalls}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Balls</p>
                    <p className="font-medium">{selectedTransaction.totalBalls}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainPage;