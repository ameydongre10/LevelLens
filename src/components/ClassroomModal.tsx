import React, { useState } from 'react';
import { School, Plus, Check, X, Users } from 'lucide-react';
import { Classroom, Student } from '../types';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  classrooms: Classroom[];
  activeClassroomId: string;
  onSelectClassroom: (id: string) => void;
  onAddClassroom: (name: string, gradeInfo: string) => void;
  students: Student[];
}

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  isOpen,
  onClose,
  classrooms,
  activeClassroomId,
  onSelectClassroom,
  onAddClassroom,
  students
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newGradeInfo, setNewGradeInfo] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    onAddClassroom(newClassName.trim(), newGradeInfo.trim() || 'Foundational Primary');
    setNewClassName('');
    setNewGradeInfo('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold">Classroom Management</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <span className="text-xs font-bold text-slate-700">Select Active Class:</span>

          <div className="space-y-2">
            {classrooms.map((c) => {
              const count = students.filter((s) => s.classroomId === c.id).length;
              const isSelected = c.id === activeClassroomId;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectClassroom(c.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{c.gradeInfo}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{count} students</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 ml-1" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Class Form */}
          {isCreating ? (
            <form onSubmit={handleCreate} className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-900">New Class Details</span>
              <input
                type="text"
                required
                placeholder="Class Name (e.g. Grade 4B / Multi-Grade 1-3)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              <input
                type="text"
                placeholder="Grade Level / Description"
                value={newGradeInfo}
                onChange={(e) => setNewGradeInfo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save Class
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full py-2 border border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Class</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
