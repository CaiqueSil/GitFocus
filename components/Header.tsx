'use client';

import React from 'react';
import { GitBranch, Plus, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoalModal: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewGoalModal, totalGoals }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        {/* Zone 1: Marca & Identidade */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10 transition-transform hover:scale-105">
            <GitBranch className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                git<span className="text-indigo-600">focus</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Estudos Tech
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500">
              Organize o que você quer aprender com foco e clareza
            </p>
          </div>
        </div>

        {/* Zone 2: Informação de Contexto */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <BookOpen className="h-4 w-4 text-slate-400" />
          <span>Trilha de Aprendizado</span>
          <span aria-hidden="true">·</span>
          <span>{totalGoals} {totalGoals === 1 ? 'objetivo ativo' : 'objetivos ativos'}</span>
        </div>

        {/* Zone 3: Ação Primária */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
