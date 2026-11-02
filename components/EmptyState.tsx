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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Search className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Nenhum objetivo encontrado
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          {searchQuery
            ? `Não encontramos nenhum objetivo correspondente a "${searchQuery}".`
            : 'Nenhum objetivo cadastrado corresponde ao filtro selecionado.'}
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Limpar filtros de busca</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50">
        <Target className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">
        Nenhum objetivo de estudo cadastrado ainda
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
        O <strong className="font-semibold text-indigo-600 font-mono">gitfocus</strong> foi feito para você planejar e acompanhar tudo o que deseja aprender em tecnologia: linguagens, frameworks, algoritmos e boas práticas de engenharia.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewGoal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            type="button"
            onClick={onLoadSamples}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <span>Carregar objetivos de exemplo</span>
          </button>
        )}
      </div>
    </div>
  );
};
