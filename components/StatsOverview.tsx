'use client';

import React from 'react';
import { Goal } from '@/types/goal';
import { Target, Clock, CheckCircle2, Flame } from 'lucide-react';

interface StatsOverviewProps {
  goals: Goal[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ goals }) => {
  const total = goals.length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;
  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Resumo do progresso" className="w-full">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Card 1: Total */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total</span>
            <Target className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {total}
          </p>
          <span className="mt-1 block text-xs text-slate-500">
            {total === 1 ? 'meta na fila' : 'metas na fila'}
          </span>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-xs transition-all hover:border-indigo-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-700">Em andamento</span>
            <Flame className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-900 tabular-nums">
            {emAndamento}
          </p>
          <span className="mt-1 block text-xs text-indigo-600/80">
            Foco ativo agora
          </span>
        </div>

        {/* Card 3: A Iniciar */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 shadow-xs transition-all hover:border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">Não iniciados</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-950 tabular-nums">
            {naoIniciados}
          </p>
          <span className="mt-1 block text-xs text-amber-700/80">
            Próximos passos
          </span>
        </div>

        {/* Card 4: Concluídos */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">Concluídos</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-950 tabular-nums">
            {concluidos}
          </p>
          <span className="mt-1 block text-xs text-emerald-700/80">
            {percentConcluido}% concluído
          </span>
        </div>
      </div>

      {/* Barra de Progresso Acolhedora */}
      {total > 0 && (
        <div className="mt-3 rounded-lg border border-slate-200/70 bg-white px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">
              Progresso geral da sua trilha
            </span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {concluidos} de {total} objetivos ({percentConcluido}%)
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${percentConcluido}%` }}
              role="progressbar"
              aria-valuenow={percentConcluido}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}
    </section>
  );
};
