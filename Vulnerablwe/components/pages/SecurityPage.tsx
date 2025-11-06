import React, { useState, useCallback } from 'react';
import { SecurityComplianceItem } from '../../types';
import { INITIAL_SECURITY_COMPLIANCE_ITEMS } from '../../constants/security.constants';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusIndicator } from '../common/StatusIndicator';
import { LogViewer } from '../common/LogViewer';
import { Modal } from '../common/Modal';

export const SecurityPage: React.FC = () => {
  const [items, setItems] = useState<SecurityComplianceItem[]>(INITIAL_SECURITY_COMPLIANCE_ITEMS);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const handleAction = useCallback((itemId: string, actionName: string) => {
    setIsLoading(prev => ({ ...prev, [itemId]: true }));
    let actionOutcomeStatus: SecurityComplianceItem['status'] | undefined;

    setAuditLogs(prevLogs => [...prevLogs, `Action: '${actionName}' initiated for item '${itemId}' at ${new Date().toLocaleTimeString()}`]);

    setTimeout(() => {
      setItems(prevItems => {
        const newItems = prevItems.map(item => {
          if (item.id === itemId) {
            let newStatus: SecurityComplianceItem['status'] = item.status;
            if (actionName === 'Run Check' || actionName === 'Verify') {
              newStatus = Math.random() > 0.3 ? 'Compliant' : 'Non-Compliant';
            } else if (actionName === 'Activate') {
              newStatus = 'Active';
            } else if (actionName === 'Deactivate') {
              newStatus = 'Inactive';
            } else if (actionName === 'Run Cleanup') {
              newStatus = 'Compliant';
              setAuditLogs(prevInnerLogs => [...prevInnerLogs, `Run Cleanup for item '${itemId}': System state restored.`]);
            }
            actionOutcomeStatus = newStatus;
            return { ...item, status: newStatus, lastCheck: new Date() };
          }
          return item;
        });
        return newItems;
      });

      setAuditLogs(prevLogs => [...prevLogs, `Action: '${actionName}' for item '${itemId}' completed. New status: ${actionOutcomeStatus || 'Unknown'}`]);
      setIsLoading(prev => ({ ...prev, [itemId]: false }));
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-on-surface">Security & Compliance</h2>

      <Card title="Compliance Status Overview">
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-4 bg-gray-700 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <h4 className="text-lg font-semibold text-on-surface">{item.name}</h4>
                  <p className="text-sm text-on-surface-muted">{item.details}</p>
                  {item.lastCheck && (
                    <p className="text-xs text-gray-500">Last check: {item.lastCheck.toLocaleString()}</p>
                  )}
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end space-y-2">
                  <StatusIndicator status={item.status} />
                  {item.id === 'safe_harbor_checker' && (
                    <Button size="sm" onClick={() => handleAction(item.id, 'Run Check')} isLoading={isLoading[item.id]} disabled={isLoading[item.id]}>
                      Run Check
                    </Button>
                  )}
                  {item.id === 'cleanup_routines' && (
                     <Button size="sm" onClick={() => handleAction(item.id, 'Run Cleanup')} isLoading={isLoading[item.id]} disabled={isLoading[item.id]}>
                      Run Cleanup
                    </Button>
                  )}
                   {item.id === 'network_isolation' && (
                     <Button size="sm" variant={item.status === 'Active' ? 'danger' : 'secondary'} onClick={() => handleAction(item.id, item.status === 'Active' ? 'Deactivate' : 'Activate')} isLoading={isLoading[item.id]} disabled={isLoading[item.id]}>
                      {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Audit Logs">
        <Button onClick={() => setIsLogModalOpen(true)} className="mb-4">View Full Audit Logs</Button>
        <LogViewer logs={auditLogs.slice(-5).reverse()} title="Recent Logs (Last 5)" maxHeight="200px" />
      </Card>

      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Full Audit Logs">
        <LogViewer logs={auditLogs} maxHeight="60vh" />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setIsLogModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};
