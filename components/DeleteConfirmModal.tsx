'use client';

import React, { useEffect } from 'react';
import { Goal } from '@/types/goal';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onConfirm: (goalId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !goal) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/10 sm:p-7">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Fechar confirmação"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h2 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
            Confirmar Exclusão
          </h2>
          <p id="delete-dialog-description" className="mt-2 text-sm text-slate-600">
            Você tem certeza de que deseja excluir o objetivo de estudo:
          </p>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800">
            &ldquo;{goal.title}&rdquo;
          </div>
          <p className="mt-3 text-xs text-rose-600">
            Esta ação não poderá ser desfeita. Todos os dados associados a este objetivo serão removidos.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(goal.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Sim, excluir objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
