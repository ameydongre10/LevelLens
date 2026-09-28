import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Download,
  RotateCcw,
  X,
  Clock,
  ShieldCheck,
  Server
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface SyncDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onToggleNetwork: (online: boolean) => void;
  onSyncComplete: () => void;
}

export const SyncDrawerModal: React.FC<SyncDrawerModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  onToggleNetwork,
  onSyncComplete
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [backupCopied, setBackupCopied] = useState(false);

  if (!isOpen) return null;

  const pendingSummary = storageService.getPendingSummary();
  const lastSynced = storageService.getLastSyncedAt();

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const result = await storageService.reconcileAndSync();
      if (result.success) {
        setSyncMessage(`Reconciled and synced ${result.syncedCount} pending records to server.`);
        onSyncComplete();
      } else {
        setSyncMessage(result.error || 'Sync failed. Please check network connection.');
      }
    } catch (e) {
      setSyncMessage('Sync error occurred during network transfer.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levellens-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupCopied(true);
    setTimeout(() => setBackupCopied(false), 2000);
  };

  const handleResetToSeeds = () => {
    if (window.confirm('Reset all classroom data and logs to sample seed records?')) {
      storageService.resetToSampleSeed();
      onSyncComplete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Offline Storage &amp; Sync</h3>
              <p className="text-[11px] text-slate-400">Local Room/SQLite Persistence Layer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Network Mode Toggle Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-emerald-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-amber-600" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Network Status: {isOnline ? 'Online (Connected)' : 'Offline Simulation'}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isOnline ? 'Ready to reconcile payloads' : 'Working fully offline without connection'}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => onToggleNetwork(!isOnline)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isOnline ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isOnline ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Pending Sync Payload Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">
                Pending Local Queue ({pendingSummary.total} record{pendingSummary.total === 1 ? '' : 's'})
              </span>
              {pendingSummary.total > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Needs Reconciliation
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Fully Synced
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px] block">New Students</span>
                <span className="font-extrabold text-slate-900">{pendingSummary.students}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Diagnostics</span>
                <span className="font-extrabold text-slate-900">{pendingSummary.assessments}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Live Tags</span>
                <span className="font-extrabold text-slate-900">{pendingSummary.liveTags}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Activities Done</span>
                <span className="font-extrabold text-slate-900">{pendingSummary.activityLogs}</span>
              </div>
            </div>

            {/* List of pending items */}
            {pendingSummary.items.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-slate-600">Pending Payloads:</span>
                <div className="max-h-32 overflow-y-auto space-y-1 divide-y divide-slate-100 text-xs">
                  {pendingSummary.items.map((item, idx) => (
                    <div key={idx} className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-800 truncate">{item.description}</span>
                      <span className="text-slate-400 font-mono text-[10px] shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sync status messages */}
          {syncMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}

          {/* Last sync info */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Last cloud sync: {lastSynced ? new Date(lastSynced).toLocaleString() : 'Never'}
            </span>
          </div>

          {/* Offline Reassurance Guarantee */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-tight">
              <strong>Offline Guarantee:</strong> All actions are saved immediately to device storage. You can teach without cellular connectivity all day; records will sync automatically when network is available.
            </p>
          </div>

          {/* Data Management Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex-1 py-2 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{backupCopied ? 'Downloaded!' : 'Export JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToSeeds}
              className="py-2 px-2.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              title="Reset to default seed data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            disabled={isSyncing || !isOnline}
            onClick={handleSyncNow}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all ${
              !isOnline
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : isSyncing
                ? 'bg-emerald-700 text-white cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing with Server...' : isOnline ? 'Reconcile & Sync Now' : 'Connect to Sync'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
