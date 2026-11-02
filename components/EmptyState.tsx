'use client';

import React from 'react';
import { Target, Search, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no_goals' | 'no_results';
  searchQuery?: string;
  onNewGoal: () => void;
  onClearFilters?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onNewGoal,
  onClearFilters,
  onLoadSamples,
}) => {
  if (type === 'no_results') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#29292E] bg-[#1A1A1E]/30 px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A1A1E] text-[#71717A] border border-[#29292E]">
          <Search className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#EDEDEF]">
          Nenhum objetivo encontrado
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-[#8D8D99]">
          {searchQuery
            ? `Não encontramos nenhum objetivo correspondente a "${searchQuery}".`
            : 'Nenhum objetivo cadastrado corresponde ao filtro selecionado.'}
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#29292E] bg-[#1A1A1E] px-4 py-2 text-xs font-semibold text-[#C4C4CC] shadow-xs hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Limpar filtros de busca</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#29292E] bg-[#1A1A1E] px-6 py-16 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#121214] text-[#64B5F6] border border-[#29292E]">
        <Target className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#EDEDEF]">
        Nenhum objetivo de estudo cadastrado ainda
      </h3>
      <p className="mt-2 max-w-md text-sm text-[#8D8D99] leading-relaxed">
        O <strong className="font-semibold text-[#64B5F6] font-mono">gitfocus</strong> foi projetado no estilo Jira/GitHub para organizar tudo o que você precisa aprender com conforto visual para longas horas de estudo.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewGoal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#64B5F6] px-4 py-2.5 text-sm font-semibold text-[#121214] shadow-sm hover:bg-[#85c6f8] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            type="button"
            onClick={onLoadSamples}
            className="inline-flex items-center gap-2 rounded-lg border border-[#29292E] bg-[#121214] px-4 py-2.5 text-sm font-semibold text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-[#71717A]" />
            <span>Carregar exemplos prontos</span>
          </button>
        )}
      </div>
    </div>
  );
};
