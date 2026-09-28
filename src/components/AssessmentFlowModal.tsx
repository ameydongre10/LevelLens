import React, { useState, useEffect } from 'react';
import {
  Student,
  Subject,
  SkillTier,
  AssessmentTemplate,
  AssessmentStep
} from '../types';
import { calculateDerivedTier } from '../services/groupingEngine';
import {
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  ArrowRight
} from 'lucide-react';

interface AssessmentFlowModalProps {
  students: Student[];
  initialStudentId?: string;
  activeSubject: Subject;
  templates: AssessmentTemplate[];
  isOpen: boolean;
  onClose: () => void;
  onSaveAssessment: (
    studentId: string,
    templateId: string,
    stepScores: Record<string, number>,
    derivedTier: SkillTier,
    notes?: string
  ) => void;
}

export const AssessmentFlowModal: React.FC<AssessmentFlowModalProps> = ({
  students,
  initialStudentId,
  activeSubject,
  templates,
  isOpen,
  onClose,
  onSaveAssessment
}) => {
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [stepScores, setStepScores] = useState<Record<string, number>>({});
  const [teacherNotes, setTeacherNotes] = useState('');
  const [activeStepTab, setActiveStepTab] = useState(0);

  const template = templates.find((t) => t.subject === activeSubject) ?? templates[0];

  useEffect(() => {
    if (initialStudentId) {
      const idx = students.findIndex((s) => s.id === initialStudentId);
      if (idx !== -1) setSelectedStudentIndex(idx);
    }
  }, [initialStudentId, students]);

  // Reset scores when student or subject changes
  const resetScoresForStep = (tmpl: AssessmentTemplate) => {
    const initial: Record<string, number> = {};
    tmpl.steps.forEach((step) => {
      // Default to 0 so teacher can tap
      initial[step.id] = 0;
    });
    setStepScores(initial);
    setTeacherNotes('');
    setActiveStepTab(0);
  };

  useEffect(() => {
    if (template) {
      resetScoresForStep(template);
    }
  }, [selectedStudentIndex, activeSubject]);

  if (!isOpen || !template) return null;

  const currentStudent = students[selectedStudentIndex];
  const steps = template.steps;
  const currentStep = steps[activeStepTab] || steps[0];

  const derived = calculateDerivedTier(activeSubject, stepScores, steps);

  const handleScoreSelect = (stepId: string, score: number) => {
    setStepScores((prev) => ({ ...prev, [stepId]: score }));
  };

  const handleSaveAndNext = () => {
    if (!currentStudent) return;
    onSaveAssessment(
      currentStudent.id,
      template.id,
      stepScores,
      derived.tier,
      teacherNotes || derived.summaryReason
    );

    // If more students remain in list, advance to next student!
    if (selectedStudentIndex < students.length - 1) {
      setSelectedStudentIndex(selectedStudentIndex + 1);
    } else {
      // Completed all students
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">5-Min Skill Diagnostic</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300">
                  {activeSubject}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{template.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selector Carousel Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={selectedStudentIndex <= 0}
            onClick={() => setSelectedStudentIndex((prev) => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center min-w-0 flex-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm font-black text-slate-900 truncate">
                {currentStudent?.firstName ?? 'Select student'}
              </span>
              <span className="font-mono text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                {currentStudent?.rollNumberOrAlias}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Student {selectedStudentIndex + 1} of {students.length}
            </p>
          </div>

          <button
            type="button"
            disabled={selectedStudentIndex >= students.length - 1}
            onClick={() => setSelectedStudentIndex((prev) => Math.min(students.length - 1, prev + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-4 pt-2.5 pb-1 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {steps.map((step, idx) => {
            const score = stepScores[step.id] ?? 0;
            const isPassed = score >= step.thresholdPass;
            const isActive = activeStepTab === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepTab(idx)}
                className={`flex-1 min-w-[100px] py-1.5 px-2 rounded-lg text-left border transition-all text-xs ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-600">Step {idx + 1}</span>
                  {score > 0 && (
                    <span
                      className={`text-[10px] font-black px-1 rounded ${
                        isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {score}/{step.maxScore}
                    </span>
                  )}
                </div>
                <div className="truncate text-[11px] font-semibold mt-0.5">{step.title.split(':')[1] || step.title}</div>
              </button>
            );
          })}
        </div>

        {/* Step Content & Touch Scoring Pad */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {/* Scripted Teacher Prompt Box */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
              Teacher Oral Script:
            </span>
            <p className="text-xs font-semibold text-amber-950 mt-1 italic">
              "{currentStep.instructionPrompt}"
            </p>
          </div>

          {/* Test Items Checklist Display */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700">Checklist Items:</span>
            <div className="grid grid-cols-1 gap-1">
              {currentStep.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Touch Score Selector (Sub-5-second rapid tap) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">
                Correct Answers: ({stepScores[currentStep.id] ?? 0} of {currentStep.maxScore})
              </span>
              <span className="text-[11px] font-semibold text-slate-700">
                Pass Threshold: ≥ {currentStep.thresholdPass}
              </span>
            </div>

            {/* Tap buttons for 0 to maxScore */}
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: currentStep.maxScore + 1 }).map((_, val) => {
                const isSelected = (stepScores[currentStep.id] ?? 0) === val;
                const isPass = val >= currentStep.thresholdPass;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleScoreSelect(currentStep.id, val)}
                    className={`h-12 rounded-xl text-base font-extrabold transition-all border shadow-xs active:scale-95 ${
                      isSelected
                        ? isPass
                          ? 'bg-emerald-600 text-white border-emerald-700 scale-105 ring-2 ring-emerald-300'
                          : 'bg-rose-600 text-white border-rose-700 scale-105 ring-2 ring-rose-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Deterministic Calculated Tier Preview */}
          <div className="pt-2">
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                derived.tier === 'RED'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : derived.tier === 'YELLOW'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="mt-0.5">
                {derived.tier === 'GREEN' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider">Calculated Level:</span>
                  <span
                    className={`text-xs font-black px-2 py-0.2 rounded ${
                      derived.tier === 'RED'
                        ? 'bg-rose-200 text-rose-900'
                        : derived.tier === 'YELLOW'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {derived.tier === 'RED' && '🔴 Intensive Support'}
                    {derived.tier === 'YELLOW' && '🟡 Emerging'}
                    {derived.tier === 'GREEN' && '🟢 On Track'}
                  </span>
                </div>
                <p className="text-[11px] font-semibold mt-1 leading-snug">{derived.summaryReason}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {activeStepTab < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStepTab((prev) => prev + 1)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Next Step: Step {activeStepTab + 2}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndNext}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Save &amp; {selectedStudentIndex < students.length - 1 ? 'Assess Next Student' : 'Finish'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
