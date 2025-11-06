import React, { useState, useEffect } from 'react';

interface ExpertMetadata {
  category: string;
  expertise: string;
}

interface Expert {
  replica_id?: string;
  replica_name?: string;
  metadata?: ExpertMetadata;
  currentStatus?: string;
  status?: string;
  trainingProgress?: number;
}

interface ExpertAdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ExpertAdminPanel({ isVisible, onClose }: ExpertAdminPanelProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      loadExperts();
    }
  }, [isVisible]);

  const loadExperts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tavus/experts?status=true');
      const data = await response.json();
      
      if (response.ok) {
        setExperts(data.experts || []);
        setMessage(`Loaded ${data.totalCount || 0} experts`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error loading experts:', error);
      setMessage('Failed to load experts');
    }
    setIsLoading(false);
  };

  const initializeExperts = async (): Promise<void> => {
    setIsInitializing(true);
    setMessage('Initializing experts...');
    
    try {
      const response = await fetch('/api/tavus/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message} - ${data.successfullyCreated}/${data.totalExperts} experts ready`);
        loadExperts(); // Refresh the list
      } else {
        setMessage(`❌ ${data.message || 'Failed to initialize experts'}`);
      }
    } catch (error) {
      console.error('Error initializing experts:', error);
      setMessage('❌ Failed to initialize experts');
    }
    
    setIsInitializing(false);
  };

  const cleanupOldExperts = async (): Promise<void> => {
    setIsLoading(true);
    setMessage('Cleaning up old experts...');
    
    try {
      const response = await fetch('/api/tavus/experts', {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Cleaned up ${data.deletedCount} old expert replicas`);
        loadExperts(); // Refresh the list
      } else {
        setMessage(`❌ ${data.message || 'Failed to cleanup experts'}`);
      }
    } catch (error) {
      console.error('Error cleaning up experts:', error);
      setMessage('❌ Failed to cleanup experts');
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category?: string): string => {
    switch (category) {
      case 'climate': return '🌍';
      case 'renewable_energy': return '⚡';
      case 'technology': return '💻';
      case 'fact_checking': return '🔍';
      case 'general_news': return '📚';
      default: return '👤';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🎓 Expert Management Panel</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={initializeExperts}
              disabled={isInitializing || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isInitializing ? '⏳ Initializing...' : '🚀 Initialize Experts'}
            </button>
            
            <button
              onClick={loadExperts}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
            
            <button
              onClick={cleanupOldExperts}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🧹 Cleanup Old
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          )}

          {/* Experts List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Expert Replicas ({experts.length})
            </h3>
            
            {experts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No expert replicas found.</p>
                <p className="text-sm mt-2">Click "Initialize Experts" to create them.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experts.map((expert, index) => (
                  <div key={expert.replica_id || index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(expert.metadata?.category)}</span>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {expert.replica_name || expert.metadata?.category || 'Unknown Expert'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {expert.metadata?.expertise || 'Expert'}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(expert.currentStatus || expert.status)}`}>
                        {expert.currentStatus || expert.status || 'unknown'}
                      </span>
                    </div>
                    
                    {expert.trainingProgress && expert.trainingProgress < 100 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Training Progress</span>
                          <span>{expert.trainingProgress}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${expert.trainingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      {expert.replica_id && (
                        <p>ID: {expert.replica_id.substring(0, 8)}...</p>
                      )}
                      <p>Category: {expert.metadata?.category || 'unknown'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            <p>Expert replicas are AI-powered video personas created with Tavus API</p>
            <p>Use this panel to manage expert training and deployment status</p>
          </div>
        </div>
      </div>
    </div>
  );
} 