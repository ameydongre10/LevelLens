import React, { useState } from 'react';
import { UserPlus, ShieldAlert, X, Check } from 'lucide-react';
import { Classroom } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
  onAddStudent: (firstName: string, rollNumberOrAlias: string) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  classroom,
  onAddStudent
}) => {
  const [firstName, setFirstName] = useState('');
  const [rollNumberOrAlias, setRollNumberOrAlias] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Please enter the student’s first name.');
      return;
    }
    if (!rollNumberOrAlias.trim()) {
      setError('Please enter a roll number or desk alias (e.g. Roll 26 or Desk A3).');
      return;
    }

    onAddStudent(firstName.trim(), rollNumberOrAlias.trim());
    setFirstName('');
    setRollNumberOrAlias('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold">Add Student to {classroom.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Minimization Policy Warning */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-950 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium leading-tight">
            <strong>Data Minimization Principle:</strong> Strictly record only First Name and Roll No/Alias. Never enter birthdates, phone numbers, addresses, or photos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student First Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav, Priya, Rohan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Roll Number or Classroom Alias *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Roll 26, Desk 4B, Blue Badge"
              value={rollNumberOrAlias}
              onChange={(e) => setRollNumberOrAlias(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
