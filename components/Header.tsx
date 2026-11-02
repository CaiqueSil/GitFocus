'use client';

import React from 'react';
import { GitBranch, Plus, Sparkles, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoalModal: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewGoalModal, totalGoals }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#29292E] bg-[#121214]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Marca & Identidade Estilo GitHub / Jira */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1A1E] text-white border border-[#29292E] shadow-inner transition-transform hover:scale-105">
            <GitBranch className="h-4 w-4 text-[#64B5F6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#EDEDEF] font-mono">
                git<span className="text-[#64B5F6]">focus</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#1A1A1E] px-2 py-0.5 text-[11px] font-mono text-[#8D8D99] border border-[#29292E]">
                <Sparkles className="h-3 w-3 text-[#FFB74D]" />
                Sprint Tech
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#71717A]">
              Foco e clareza para longas jornadas de estudo em tecnologia
            </p>
          </div>
        </div>

        {/* Informação de Contexto */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#8D8D99] font-mono">
          <LayoutGrid className="h-3.5 w-3.5 text-[#71717A]" />
          <span>Workspace</span>
          <span aria-hidden="true" className="text-[#3E3E47]">/</span>
          <span className="text-[#C4C4CC]">{totalGoals} {totalGoals === 1 ? 'meta ativa' : 'metas ativas'}</span>
        </div>

        {/* Ação Primária */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#64B5F6] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#121214] shadow-sm transition-all hover:bg-[#85c6f8] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64B5F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214] whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
