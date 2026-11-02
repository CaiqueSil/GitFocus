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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121214]/80 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1A1A1E] border border-[#29292E] p-6 shadow-2xl shadow-black/60 sm:p-7">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
            aria-label="Fechar confirmação"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h2 id="delete-dialog-title" className="text-lg font-bold text-[#EDEDEF]">
            Confirmar Exclusão
          </h2>
          <p id="delete-dialog-description" className="mt-2 text-sm text-[#A1A1AA]">
            Você tem certeza de que deseja excluir o objetivo de estudo:
          </p>
          <div className="mt-3 rounded-lg border border-[#29292E] bg-[#121214] p-3 text-sm font-semibold text-[#EDEDEF] font-mono">
            &ldquo;{goal.title}&rdquo;
          </div>
          <p className="mt-3 text-xs text-rose-400">
            Esta ação não poderá ser desfeita. Todos os dados deste objetivo serão removidos.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#29292E]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(goal.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Sim, excluir objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
