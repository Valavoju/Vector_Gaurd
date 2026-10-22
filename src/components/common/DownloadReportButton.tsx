import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle2, Download } from 'lucide-react';
import { HotspotRecord, TaskRecord } from '../../types';
import { useApp } from '../../context/AppContext';

interface DownloadReportButtonProps {
  hotspot: HotspotRecord;
  task?: TaskRecord | null;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact' | 'dark';
  className?: string;
  buttonId?: string;
  label?: string;
}

export const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({
  hotspot,
  task,
  variant = 'primary',
  className = '',
  buttonId,
  label = 'Download Verification Report'
}) => {
  const { tasks, citizenSubmissions, addNotification } = useApp();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Resolve associated task from context if not provided
  const associatedTask = task || tasks.find(t => t.hotspot_id === hotspot.hotspot_id);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setIsDone(false);
      setStatusMessage('Generating verification report...');

      // jsPDF is large; load it only when a report is actually requested.
      const { generateVerificationSummaryPDF } = await import('../../utils/pdfGenerator');
      const filename = await generateVerificationSummaryPDF(
        hotspot,
        associatedTask,
        citizenSubmissions,
        (msg) => setStatusMessage(msg)
      );

      setIsDone(true);
      setStatusMessage('PDF successfully generated.');

      addNotification({
        type: 'success',
        title: 'Report Downloaded',
        message: `Successfully generated ${filename}`
      });

      setTimeout(() => {
        setIsGenerating(false);
        setIsDone(false);
        setStatusMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsGenerating(false);
      setIsDone(false);
      setStatusMessage(null);

      addNotification({
        type: 'error',
        title: 'Report Generation Error',
        message: 'Could not render PDF. Please try again.'
      });
    }
  };

  // Base styling per variant
  let variantClasses = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs';
  if (variant === 'secondary') {
    variantClasses = 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700';
  } else if (variant === 'outline') {
    variantClasses = 'bg-card hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs';
  } else if (variant === 'dark') {
    variantClasses = 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 shadow-xs';
  } else if (variant === 'compact') {
    variantClasses = 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] py-1 px-2.5';
  }

  return (
    <button
      id={buttonId || `download-report-btn-${hotspot.hotspot_id}`}
      onClick={handleDownload}
      disabled={isGenerating}
      title={`Download Verification Summary Report for ${hotspot.hotspot_id} (PDF)`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-wait whitespace-nowrap ${variantClasses} ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-indigo-300" />
          <span>{statusMessage || 'Generating verification report...'}</span>
        </>
      ) : isDone ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-emerald-300">PDF successfully generated.</span>
        </>
      ) : (
        <>
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>{label}</span>
          <Download className="w-3 h-3 opacity-70 shrink-0 ml-0.5" />
        </>
      )}
    </button>
  );
};
